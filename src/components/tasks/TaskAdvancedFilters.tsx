import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';

interface TaskAdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dateRange: { from?: Date; to?: Date };
    dueDateRange: { from?: Date; to?: Date };
    priorityFilter: string;
    assignedTo: string;
    status: string;
    lastActivity: string;
    operator: 'AND' | 'OR';
    textCondition: 'contains' | 'equals' | 'not_contains' | 'not_equals';
  };
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const TaskAdvancedFilters: React.FC<TaskAdvancedFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}) => {
  if (!isOpen) return null;

  const handleDateRangeChange = (type: 'from' | 'to', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: date
      }
    });
  };

  const handleDueDateRangeChange = (type: 'from' | 'to', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dueDateRange: {
        ...filters.dueDateRange,
        [type]: date
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-96 bg-background shadow-lg" onClick={(e) => e.stopPropagation()}>
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6 overflow-y-auto">
            {/* Created Date Range */}
            <div className="space-y-2">
              <Label>Created Date Range</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? filters.dateRange.from.toLocaleDateString() : 'From'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => handleDateRangeChange('from', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? filters.dateRange.to.toLocaleDateString() : 'To'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => handleDateRangeChange('to', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Due Date Range */}
            <div className="space-y-2">
              <Label>Due Date Range</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dueDateRange.from ? filters.dueDateRange.from.toLocaleDateString() : 'From'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dueDateRange.from}
                      onSelect={(date) => handleDueDateRangeChange('from', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dueDateRange.to ? filters.dueDateRange.to.toLocaleDateString() : 'To'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dueDateRange.to}
                      onSelect={(date) => handleDueDateRangeChange('to', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Dropdown fields - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={filters.priorityFilter} onValueChange={(value) => onFiltersChange({ ...filters, priorityFilter: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Select value={filters.assignedTo} onValueChange={(value) => onFiltersChange({ ...filters, assignedTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Assignees" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                    <SelectItem value="David Brown">David Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Last Activity */}
              <div className="space-y-2">
                <Label>Last Activity</Label>
                <Select value={filters.lastActivity} onValueChange={(value) => onFiltersChange({ ...filters, lastActivity: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Logic Operator */}
            <div className="space-y-2">
              <Label>Logic Operator</Label>
              <Select value={filters.operator} onValueChange={(value) => onFiltersChange({ ...filters, operator: value as 'AND' | 'OR' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="AND">AND (all conditions must match)</SelectItem>
                  <SelectItem value="OR">OR (any condition can match)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button onClick={onApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={onClearFilters} className="flex-1">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};