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

interface DealAdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dateRange: { from?: Date; to?: Date };
    valueRange: { min: string; max: string };
    probabilityRange: { min: string; max: string };
    assignedTo: string;
    source: string;
    stage: string;
    lastActivity: string;
    operator: 'AND' | 'OR';
    textCondition: 'contains' | 'equals' | 'not_contains' | 'not_equals';
  };
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const DealAdvancedFilters: React.FC<DealAdvancedFiltersProps> = ({
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

  const handleValueRangeChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      valueRange: {
        ...filters.valueRange,
        [type]: value
      }
    });
  };

  const handleProbabilityRangeChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      probabilityRange: {
        ...filters.probabilityRange,
        [type]: value
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
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Advanced Deal Filters
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6 overflow-y-auto">
            {/* Saved Filters */}
            <div className="space-y-2">
              <Label className="font-semibold">Saved Filters</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select saved filter..." />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="my-deals">My Deals</SelectItem>
                  <SelectItem value="high-value">High Value Deals</SelectItem>
                  <SelectItem value="closing-soon">Closing Soon</SelectItem>
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

            {/* Filter Options */}
            {(showFilterFields || filters.dateRange.from || filters.valueRange.min || filters.probabilityRange.min || filters.assignedTo !== 'all' || filters.source !== 'all' || filters.stage !== 'all' || filters.lastActivity !== 'all') && (
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

            {/* Deal Value Range */}
            <div className="space-y-2">
              <Label>Deal Value Range</Label>
              <div className="flex space-x-2">
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

            {/* Probability Range */}
            <div className="space-y-2">
              <Label>Probability Range (%)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Min %"
                  type="number"
                  min="0"
                  max="100"
                  value={filters.probabilityRange.min}
                  onChange={(e) => handleProbabilityRangeChange('min', e.target.value)}
                />
                <Input
                  placeholder="Max %"
                  type="number"
                  min="0"
                  max="100"
                  value={filters.probabilityRange.max}
                  onChange={(e) => handleProbabilityRangeChange('max', e.target.value)}
                />
              </div>
            </div>

            {/* Dropdown fields - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Stage */}
              <div className="space-y-2">
                <Label>Deal Stage</Label>
                <Select value={filters.stage} onValueChange={(value) => onFiltersChange({ ...filters, stage: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source */}
              <div className="space-y-2">
                <Label>Lead Source</Label>
                <Select value={filters.source} onValueChange={(value) => onFiltersChange({ ...filters, source: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
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
              </div>
            )}

            {/* Save Current Filter */}
            <div className="pt-4 border-t">
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