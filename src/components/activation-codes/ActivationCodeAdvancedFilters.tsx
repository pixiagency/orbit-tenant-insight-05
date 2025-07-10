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
import { CalendarIcon, X, Search } from 'lucide-react';

interface ActivationCodeAdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dateRange: { from?: Date; to?: Date };
    usageRange: { min: string; max: string };
    status: string;
    packageId: string;
    createdBy: string;
    usageType: string;
    validityPeriod: string;
    source: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const ActivationCodeAdvancedFilters: React.FC<ActivationCodeAdvancedFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange
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

  const handleUsageRangeChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      usageRange: {
        ...filters.usageRange,
        [type]: value
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Search className="h-5 w-5 mr-2" />
          Activation Code Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range */}
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

          {/* Usage Range */}
          <div className="space-y-2">
            <Label>Usage Range</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min usage"
                type="number"
                value={filters.usageRange.min}
                onChange={(e) => handleUsageRangeChange('min', e.target.value)}
              />
              <Input
                placeholder="Max usage"
                type="number"
                value={filters.usageRange.max}
                onChange={(e) => handleUsageRangeChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Package */}
          <div className="space-y-2">
            <Label>Package</Label>
            <Select value={filters.packageId} onValueChange={(value) => onFiltersChange({ ...filters, packageId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                <SelectItem value="1">Starter Plan</SelectItem>
                <SelectItem value="2">Professional Plan</SelectItem>
                <SelectItem value="3">Enterprise Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Created By */}
          <div className="space-y-2">
            <Label>Created By</Label>
            <Select value={filters.createdBy} onValueChange={(value) => onFiltersChange({ ...filters, createdBy: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select creator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Creators</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Usage Type */}
          <div className="space-y-2">
            <Label>Usage Type</Label>
            <Select value={filters.usageType} onValueChange={(value) => onFiltersChange({ ...filters, usageType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select usage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Usage Types</SelectItem>
                <SelectItem value="single">Single Use</SelectItem>
                <SelectItem value="multiple">Multiple Use</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Validity Period */}
          <div className="space-y-2">
            <Label>Validity Period</Label>
            <Select value={filters.validityPeriod} onValueChange={(value) => onFiltersChange({ ...filters, validityPeriod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select validity period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="7-days">7 Days</SelectItem>
                <SelectItem value="30-days">30 Days</SelectItem>
                <SelectItem value="90-days">90 Days</SelectItem>
                <SelectItem value="1-year">1 Year</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label>Source</Label>
            <Select value={filters.source} onValueChange={(value) => onFiltersChange({ ...filters, source: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="manual">Manual Creation</SelectItem>
                <SelectItem value="bulk-import">Bulk Import</SelectItem>
                <SelectItem value="api">API Generation</SelectItem>
                <SelectItem value="system">System Generated</SelectItem>
                <SelectItem value="partner">Partner Generated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 