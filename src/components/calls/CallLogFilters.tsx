
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, X, Search } from 'lucide-react';
import { format } from 'date-fns';

interface CallLogFilters {
  search: string;
  user: string;
  type: string;
  status: string;
  outcome: string;
  dateRange: { from?: Date; to?: Date };
  hasRecording: string;
  linkedEntity: string;
}

interface CallLogFiltersProps {
  onFiltersChange: (filters: CallLogFilters) => void;
}

export const CallLogFilters: React.FC<CallLogFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<CallLogFilters>({
    search: '',
    user: 'all',
    type: 'all',
    status: 'all',
    outcome: 'all',
    dateRange: {},
    hasRecording: 'all',
    linkedEntity: 'all'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof CallLogFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: CallLogFilters = {
      search: '',
      user: 'all',
      type: 'all',
      status: 'all',
      outcome: 'all',
      dateRange: {},
      hasRecording: 'all',
      linkedEntity: 'all'
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (typeof value === 'string') return value.length > 0 && value !== 'all';
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length > 0;
    }
    return false;
  }).length;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts, phones..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.user} onValueChange={(value) => updateFilter('user', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="user1">Sarah Johnson</SelectItem>
                <SelectItem value="user2">Mike Wilson</SelectItem>
                <SelectItem value="user3">Emily Davis</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-answered">Not Answered</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <Select value={filters.outcome} onValueChange={(value) => updateFilter('outcome', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Outcomes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="not-interested">Not Interested</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.hasRecording} onValueChange={(value) => updateFilter('hasRecording', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Recording Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Calls</SelectItem>
                  <SelectItem value="true">With Recording</SelectItem>
                  <SelectItem value="false">Without Recording</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.linkedEntity} onValueChange={(value) => updateFilter('linkedEntity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Linked Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Calls</SelectItem>
                  <SelectItem value="lead">Linked to Lead</SelectItem>
                  <SelectItem value="deal">Linked to Deal</SelectItem>
                  <SelectItem value="contact">Linked to Contact</SelectItem>
                  <SelectItem value="task">Linked to Task</SelectItem>
                  <SelectItem value="none">Not Linked</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Picker */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {filters.dateRange.from ? format(filters.dateRange.from, 'PP') : 'From'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {filters.dateRange.to ? format(filters.dateRange.to, 'PP') : 'To'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
