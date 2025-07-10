import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Bell,
  Trash2,
  Save,
  X,
  Phone,
  FileText
} from 'lucide-react';
import { CalendarEvent } from '../../pages/admin/CalendarPage';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  isCreating: boolean;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  isCreating,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({});
  const [generateZoomLink, setGenerateZoomLink] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData(event);
      setGenerateZoomLink(event.type === 'meeting' && Boolean(event.zoomLink));
    }
  }, [event]);

  const handleSave = () => {
    if (!formData.title || !formData.assignee) {
      return;
    }

    const eventToSave: CalendarEvent = {
      ...event!,
      ...formData,
      zoomLink: generateZoomLink && formData.type === 'meeting' 
        ? `https://zoom.us/j/${Math.random().toString().substr(2, 10)}`
        : formData.zoomLink,
    } as CalendarEvent;

    onSave(eventToSave);
  };

  const handleDelete = () => {
    if (event?.id && confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  const handleGenerateZoomChange = (checked: boolean | "indeterminate") => {
    setGenerateZoomLink(checked === true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'task': return '#6b7280';
      case 'call': return '#3b82f6';
      case 'meeting': return '#10b981';
      case 'appointment': return '#f59e0b';
      case 'follow-up': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <FileText className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'appointment': return <Users className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getEventTypeIcon(formData.type || 'task')}
            <span>{isCreating ? 'Create New Event' : 'Edit Event'}</span>
            {formData.isAutomated && (
              <Badge variant="outline" className="text-xs">
                Automated
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title..."
                disabled={formData.isAutomated && !event.canEdit}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={formData.type || 'task'}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    type: value as CalendarEvent['type'],
                    color: getEventTypeColor(value)
                  })}
                  disabled={formData.isAutomated && !event.canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Scheduled Task</SelectItem>
                    <SelectItem value="call">Timed Call</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="appointment">Sales Appointment</SelectItem>
                    <SelectItem value="follow-up">Financial/Contract Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'scheduled'}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    status: value as CalendarEvent['status']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee *</Label>
                <Select
                  value={formData.assignee || ''}
                  onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Sarah Smith">Sarah Smith</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    <SelectItem value="Team Lead">Team Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select
                  value={formData.team || ''}
                  onValueChange={(value) => setFormData({ ...formData, team: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Client name..."
              />
            </div>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Date & Time
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start</Label>
                <Input
                  type="datetime-local"
                  value={formData.start ? format(formData.start, "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    start: new Date(e.target.value) 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End</Label>
                <Input
                  type="datetime-local"
                  value={formData.end ? format(formData.end, "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    end: new Date(e.target.value) 
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Location & Meeting Details */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location & Meeting Details
            </h4>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Meeting room, address, or 'Online'"
              />
            </div>

            {formData.type === 'meeting' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="generateZoom"
                    checked={generateZoomLink}
                    onCheckedChange={handleGenerateZoomChange}
                  />
                  <Label htmlFor="generateZoom">Auto-generate Zoom meeting link</Label>
                </div>

                {!generateZoomLink && (
                  <div className="space-y-2">
                    <Label htmlFor="zoomLink">Custom Meeting Link</Label>
                    <Input
                      id="zoomLink"
                      value={formData.zoomLink || ''}
                      onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add event details, agenda, or notes..."
              rows={3}
            />
          </div>

          {/* Reminders */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Reminders
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60, 120, 1440].map(minutes => (
                <div key={minutes} className="flex items-center space-x-2">
                  <Checkbox
                    id={`reminder-${minutes}`}
                    checked={formData.reminders?.includes(minutes) || false}
                    onCheckedChange={(checked) => {
                      const currentReminders = formData.reminders || [];
                      const newReminders = checked
                        ? [...currentReminders, minutes]
                        : currentReminders.filter(r => r !== minutes);
                      setFormData({ ...formData, reminders: newReminders });
                    }}
                  />
                  <Label htmlFor={`reminder-${minutes}`} className="text-sm">
                    {minutes < 60 ? `${minutes}m` : minutes === 60 ? '1h' : minutes === 120 ? '2h' : '1d'}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {!isCreating && event.canEdit && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? 'Create Event' : 'Save Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
