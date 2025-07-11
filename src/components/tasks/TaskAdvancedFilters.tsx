import React, { useState } from 'react';
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
import { CalendarIcon, X, Plus } from 'lucide-react';

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
  const [showFilterFields, setShowFilterFields] = useState(false);

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

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClickOutside}>
      <div className="fixed right-0 top-0 h-full w-96 bg-background shadow-lg" onClick={(e) => e.stopPropagation()}>
        <Card className="h-full border-0 rounded-none flex flex-col">
          <CardHeader className="border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Advanced Task Filters
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
            {/* Saved Filters */}
            <div className="space-y-2">
              <Label className="font-semibold">Saved Filters</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select saved filter..." />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="my-tasks">My Tasks</SelectItem>
                  <SelectItem value="overdue">Overdue Tasks</SelectItem>
                  <SelectItem value="high-priority">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Rules */}
            <div className="space-y-2">
              <Label className="font-semibold">Filter Rules</Label>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowFilterFields(!showFilterFields)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Filter Rule
              </Button>
            </div>

            {/* Filter Options - Always visible */}
            <div className="space-y-4">
              <Label className="font-semibold">Filter Options</Label>

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
          </div>

            {/* Add Filter Rule Fields */}
            {showFilterFields && (
              <div className="space-y-4 border rounded-lg p-4">
                <Label className="font-semibold">Filter Rules</Label>
                
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="status">Task Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="assignedTo">Assigned To</SelectItem>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="createdDate">Created Date</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Equals" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="not_equals">Not equals</SelectItem>
                      <SelectItem value="greater_than">Greater than</SelectItem>
                      <SelectItem value="less_than">Less than</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input placeholder="Enter value" />
                  
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setShowFilterFields(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Current Filter */}
            <div className="pt-4 border-t flex-shrink-0">
              <Button variant="outline" className="w-full mb-4">
                Save Current Filter
              </Button>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button onClick={onApplyFilters} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={onClearFilters} className="flex-1">
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};