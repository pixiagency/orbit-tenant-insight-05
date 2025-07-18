
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar';
import { EventModal } from '@/components/calendar/EventModal';
import { IntegrationSettings } from '@/components/calendar/IntegrationSettings';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  Phone, 
  FileText,
  Settings,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {},
});

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'task' | 'call' | 'meeting' | 'appointment' | 'follow-up';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  client?: string;
  assignee: string;
  team: string;
  description?: string;
  location?: string;
  zoomLink?: string;
  reminders: number[];
  color: string;
  createdBy: string;
  canEdit: boolean;
  isAutomated: boolean;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({
    eventType: '',
    team: '',
    status: '',
    client: '',
  });
  const [showSettings, setShowSettings] = useState(false);

  // Mock data
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Client Discovery Call - TechCorp',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'call',
        status: 'scheduled',
        client: 'TechCorp Inc.',
        assignee: 'John Doe',
        team: 'Sales',
        description: 'Initial discovery call to understand requirements',
        reminders: [15, 60],
        color: '#3b82f6',
        createdBy: 'admin',
        canEdit: true,
        isAutomated: false,
      },
      {
        id: '2',
        title: 'Product Demo - Enterprise Solutions',
        start: new Date(2024, 0, 16, 14, 0),
        end: new Date(2024, 0, 16, 15, 30),
        type: 'meeting',
        status: 'scheduled',
        client: 'Global Systems Ltd.',
        assignee: 'Sarah Smith',
        team: 'Sales',
        location: 'Conference Room A',
        zoomLink: 'https://zoom.us/j/123456789',
        reminders: [30],
        color: '#10b981',
        createdBy: 'admin',
        canEdit: true,
        isAutomated: false,
      },
      {
        id: '3',
        title: 'Contract Review Follow-up',
        start: new Date(2024, 0, 17, 9, 0),
        end: new Date(2024, 0, 17, 9, 30),
        type: 'follow-up',
        status: 'scheduled',
        client: 'Manufacturing Co.',
        assignee: 'Mike Johnson',
        team: 'Legal',
        description: 'Follow up on contract terms discussion',
        reminders: [60, 1440],
        color: '#f59e0b',
        createdBy: 'system',
        canEdit: false,
        isAutomated: true,
      },
      {
        id: '4',
        title: 'Weekly Team Standup',
        start: new Date(2024, 0, 18, 9, 0),
        end: new Date(2024, 0, 18, 9, 30),
        type: 'meeting',
        status: 'scheduled',
        assignee: 'Team Lead',
        team: 'Sales',
        location: 'Main Conference Room',
        reminders: [15],
        color: '#8b5cf6',
        createdBy: 'admin',
        canEdit: true,
        isAutomated: false,
      },
    ];
    setEvents(mockEvents);
  }, []);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
    setIsCreating(false);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const newEvent: CalendarEvent = {
      id: '',
      title: '',
      start,
      end,
      type: 'task',
      status: 'scheduled',
      assignee: '',
      team: '',
      reminders: [15],
      color: '#6b7280',
      createdBy: 'current-user',
      canEdit: true,
      isAutomated: false,
    };
    setSelectedEvent(newEvent);
    setIsEventModalOpen(true);
    setIsCreating(true);
  };

  const handleEventDrop = ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
    if (!event.canEdit) {
      toast.error('This event cannot be modified as it was created by automation');
      return;
    }

    const updatedEvents = events.map(e =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);
    toast.success('Event rescheduled successfully');
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: event.status === 'cancelled' ? 0.6 : 1,
        border: event.isAutomated ? '2px dashed #374151' : 'none',
      },
    };
  };

  const filteredEvents = events.filter(event => {
    if (filters.eventType && event.type !== filters.eventType) return false;
    if (filters.team && event.team !== filters.team) return false;
    if (filters.status && event.status !== filters.status) return false;
    if (filters.client && event.client && !event.client.toLowerCase().includes(filters.client.toLowerCase())) return false;
    return true;
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <FileText className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'appointment': return <Users className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            Calendar Module
          </h1>
          <p className="text-gray-600">Manage all scheduled activities and interactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {filteredEvents.length} Events
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Sidebar */}
        <div className="w-80 space-y-6">
          <CalendarFilters
            filters={filters}
            onFiltersChange={setFilters}
            events={events}
          />
          
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Event Types</h3>
            <div className="space-y-2">
              {[
                { type: 'task', label: 'Scheduled Task', color: '#6b7280' },
                { type: 'call', label: 'Timed Call', color: '#3b82f6' },
                { type: 'meeting', label: 'Meeting', color: '#10b981' },
                { type: 'appointment', label: 'Sales Appointment', color: '#f59e0b' },
                { type: 'follow-up', label: 'Follow-up', color: '#ef4444' },
              ].map(({ type, label, color }) => (
                <div key={type} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  {getEventTypeIcon(type)}
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredEvents
                .filter(e => e.start >= new Date())
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="flex items-center space-x-2 text-sm">
                    {getEventTypeIcon(event.type)}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {format(event.start, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CalendarToolbar
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
              />
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <div style={{ height: 'calc(100vh - 300px)' }}>
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  view={view}
                  date={date}
                  onView={setView}
                  onNavigate={setDate}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  onEventDrop={handleEventDrop}
                  selectable
                  resizable
                  eventPropGetter={eventStyleGetter}
                  popup
                  showMultiDayTimes
                  step={15}
                  timeslots={4}
                  defaultView="month"
                  views={['month', 'week', 'day', 'agenda']}
                  formats={{
                    timeGutterFormat: 'h:mm a',
                    eventTimeRangeFormat: ({ start, end }, culture, local) =>
                      local.format(start, 'h:mm a', culture) + ' - ' + local.format(end, 'h:mm a', culture)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        isCreating={isCreating}
        onSave={(event) => {
          if (isCreating) {
            const newEvent = { ...event, id: Date.now().toString() };
            setEvents([...events, newEvent]);
            toast.success('Event created successfully');
          } else {
            const updatedEvents = events.map(e =>
              e.id === event.id ? event : e
            );
            setEvents(updatedEvents);
            toast.success('Event updated successfully');
          }
          setIsEventModalOpen(false);
        }}
        onDelete={(eventId) => {
          setEvents(events.filter(e => e.id !== eventId));
          toast.success('Event deleted successfully');
          setIsEventModalOpen(false);
        }}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Calendar Settings</h2>
              <Button variant="ghost" onClick={() => setShowSettings(false)}>×</Button>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <CalendarSettings />
              </TabsContent>
              
              <TabsContent value="integrations">
                <IntegrationSettings />
              </TabsContent>
              
              <TabsContent value="permissions">
                <div className="space-y-4">
                  <h3 className="font-semibold">Permission Settings</h3>
                  <p className="text-gray-600">Configure calendar visibility and editing permissions.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
