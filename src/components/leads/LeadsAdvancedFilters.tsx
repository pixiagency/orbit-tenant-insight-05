
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
import { CalendarIcon, X, Filter, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dateRange: { from?: Date; to?: Date };
    valueRange: { min: string; max: string };
    scoreRange: { min: string; max: string };
    assignedTo: string;
    source: string;
    lastActivity: string;
    operator: 'AND' | 'OR';
    textCondition: 'contains' | 'equals' | 'not_contains' | 'not_equals';
  };
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const LeadsAdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}) => {
  const [savedFilters] = useState([
    'High Value Leads',
    'Recent Activity',
    'Qualified Prospects'
  ]);

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

  const handleValueRangeChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      valueRange: {
        ...filters.valueRange,
        [type]: value
      }
    });
  };

  const handleScoreRangeChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      scoreRange: {
        ...filters.scoreRange,
        [type]: value
      }
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.valueRange.min || filters.valueRange.max) count++;
    if (filters.scoreRange.min || filters.scoreRange.max) count++;
    if (filters.assignedTo && filters.assignedTo !== 'all') count++;
    if (filters.source && filters.source !== 'all') count++;
    if (filters.lastActivity && filters.lastActivity !== 'all') count++;
    return count;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Advanced Lead Filters</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Saved Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Saved Filters</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select saved filter..." />
              </SelectTrigger>
              <SelectContent>
                {savedFilters.map((filter) => (
                  <SelectItem key={filter} value={filter.toLowerCase().replace(' ', '_')}>
                    {filter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Rules */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Filter Rules</Label>
            <Button variant="outline" className="w-full justify-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Filter Rule
            </Button>
          </div>

          {/* Filter Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Filter Options</Label>

            {/* Created Date Range */}
            <div className="space-y-2">
              <Label className="text-sm">Created Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? format(filters.dateRange.from, 'PPP') : 'From'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => handleDateRangeChange('from', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? format(filters.dateRange.to, 'PPP') : 'To'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => handleDateRangeChange('to', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Lead Value Range */}
            <div className="space-y-2">
              <Label className="text-sm">Lead Value Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min value"
                  type="number"
                  value={filters.valueRange.min}
                  onChange={(e) => handleValueRangeChange('min', e.target.value)}
                />
                <Input
                  placeholder="Max value"
                  type="number"
                  value={filters.valueRange.max}
                  onChange={(e) => handleValueRangeChange('max', e.target.value)}
                />
              </div>
            </div>

            {/* Score Range */}
            <div className="space-y-2">
              <Label className="text-sm">Score Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min score"
                  type="number"
                  min="0"
                  max="100"
                  value={filters.scoreRange.min}
                  onChange={(e) => handleScoreRangeChange('min', e.target.value)}
                />
                <Input
                  placeholder="Max score"
                  type="number"
                  min="0"
                  max="100"
                  value={filters.scoreRange.max}
                  onChange={(e) => handleScoreRangeChange('max', e.target.value)}
                />
              </div>
            </div>

            {/* Dropdown fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Assigned To</Label>
                <Select value={filters.assignedTo} onValueChange={(value) => onFiltersChange({ ...filters, assignedTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Assignees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                    <SelectItem value="David Brown">David Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Lead Source</Label>
                <Select value={filters.source} onValueChange={(value) => onFiltersChange({ ...filters, source: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Website Form">Website Form</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Last Activity</Label>
              <Select value={filters.lastActivity} onValueChange={(value) => onFiltersChange({ ...filters, lastActivity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
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

          {/* Save Current Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Save Current Filter</Label>
            <Input placeholder="Enter filter name..." />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onClearFilters}>
              Clear All Filters
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => { onApplyFilters(); onClose(); }}>
                Apply Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
