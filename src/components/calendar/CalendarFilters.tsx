
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { CalendarEvent } from '../../pages/admin/CalendarPage';

interface CalendarFiltersProps {
  filters: {
    eventType: string;
    team: string;
    status: string;
    client: string;
  };
  onFiltersChange: (filters: any) => void;
  events: CalendarEvent[];
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFiltersChange,
  events,
}) => {
  const clearFilters = () => {
    onFiltersChange({
      eventType: '',
      team: '',
      status: '',
      client: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const uniqueTeams = [...new Set(events.map(e => e.team).filter(Boolean))];
  const uniqueClients = [...new Set(events.map(e => e.client).filter(Boolean))];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Event Type</label>
          <Select
            value={filters.eventType}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, eventType: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="task">Scheduled Task</SelectItem>
              <SelectItem value="call">Timed Call</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="appointment">Sales Appointment</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Team</label>
          <Select
            value={filters.team}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, team: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {uniqueTeams.map(team => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Client</label>
          <Input
            placeholder="Search clients..."
            value={filters.client}
            onChange={(e) =>
              onFiltersChange({ ...filters, client: e.target.value })
            }
            className="h-8"
          />
          {uniqueClients.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {uniqueClients.slice(0, 3).map(client => (
                <Badge
                  key={client}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    onFiltersChange({ ...filters, client: client })
                  }
                >
                  {client}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
