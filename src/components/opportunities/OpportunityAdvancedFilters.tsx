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

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dateRange: { from?: Date; to?: Date };
    valueRange: { min: string; max: string };
    probabilityRange: { min: string; max: string };
    assignedTo: string;
    source: string;
    stage: string;
    operator: 'AND' | 'OR';
    textCondition: 'contains' | 'equals' | 'not_contains' | 'not_equals';
  };
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const OpportunityAdvancedFilters: React.FC<AdvancedFiltersProps> = ({
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

  return (
    <div className="space-y-4">
      <div className="space-y-4">

        {/* Date Range - Single column for non-dropdown */}
        <div className="space-y-2">
          <Label>Expected Close Date Range</Label>
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
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Value Range - Single column for non-dropdown */}
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

        {/* Probability Range - Single column for non-dropdown */}
        <div className="space-y-2">
          <Label>Win Probability Range (%)</Label>
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
          {/* Assigned To */}
          <div className="space-y-2">
            <Label>Assigned To</Label>
            <Select value={filters.assignedTo} onValueChange={(value) => onFiltersChange({ ...filters, assignedTo: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
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

          {/* Source */}
          <div className="space-y-2">
            <Label>Opportunity Source</Label>
            <Select value={filters.source} onValueChange={(value) => onFiltersChange({ ...filters, source: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Trade Show">Trade Show</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stage */}
          <div className="space-y-2 col-span-2">
            <Label>Opportunity Stage</Label>
            <Select value={filters.stage} onValueChange={(value) => onFiltersChange({ ...filters, stage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
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
        </div>

      </div>
    </div>
  );
};