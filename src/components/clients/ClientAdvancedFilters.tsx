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

interface ClientAdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dateRange: { from?: Date; to?: Date };
    revenueRange: { min: string; max: string };
    usersRange: { min: string; max: string };
    contactsRange: { min: string; max: string };
    storageRange: { min: string; max: string };
    callMinutesRange: { min: string; max: string };
    status: string;
    packageId: string;
    usage: string;
    activity: string;
    teamSize: string;
    subscription: string;
    callUsage: string;
    source: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const ClientAdvancedFilters: React.FC<ClientAdvancedFiltersProps> = ({
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

  const handleRangeChange = (field: string, type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: {
        ...filters[field as keyof typeof filters] as any,
        [type]: value
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Advanced Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Registration Date Range</Label>
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

          {/* Revenue Range */}
          <div className="space-y-2">
            <Label>Monthly Revenue Range</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min revenue"
                type="number"
                value={filters.revenueRange.min}
                onChange={(e) => handleRangeChange('revenueRange', 'min', e.target.value)}
              />
              <Input
                placeholder="Max revenue"
                type="number"
                value={filters.revenueRange.max}
                onChange={(e) => handleRangeChange('revenueRange', 'max', e.target.value)}
              />
            </div>
          </div>

          {/* Users Range */}
          <div className="space-y-2">
            <Label>Users Range</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min users"
                type="number"
                min="1"
                value={filters.usersRange.min}
                onChange={(e) => handleRangeChange('usersRange', 'min', e.target.value)}
              />
              <Input
                placeholder="Max users"
                type="number"
                min="1"
                value={filters.usersRange.max}
                onChange={(e) => handleRangeChange('usersRange', 'max', e.target.value)}
              />
            </div>
          </div>

          {/* Contacts Range */}
          <div className="space-y-2">
            <Label>Contacts Range</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min contacts"
                type="number"
                min="0"
                value={filters.contactsRange.min}
                onChange={(e) => handleRangeChange('contactsRange', 'min', e.target.value)}
              />
              <Input
                placeholder="Max contacts"
                type="number"
                min="0"
                value={filters.contactsRange.max}
                onChange={(e) => handleRangeChange('contactsRange', 'max', e.target.value)}
              />
            </div>
          </div>

          {/* Storage Range */}
          <div className="space-y-2">
            <Label>Storage Range (GB)</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min storage"
                type="number"
                min="0"
                step="0.1"
                value={filters.storageRange.min}
                onChange={(e) => handleRangeChange('storageRange', 'min', e.target.value)}
              />
              <Input
                placeholder="Max storage"
                type="number"
                min="0"
                step="0.1"
                value={filters.storageRange.max}
                onChange={(e) => handleRangeChange('storageRange', 'max', e.target.value)}
              />
            </div>
          </div>

          {/* Call Minutes Range */}
          <div className="space-y-2">
            <Label>Call Minutes Range</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min minutes"
                type="number"
                min="0"
                value={filters.callMinutesRange.min}
                onChange={(e) => handleRangeChange('callMinutesRange', 'min', e.target.value)}
              />
              <Input
                placeholder="Max minutes"
                type="number"
                min="0"
                value={filters.callMinutesRange.max}
                onChange={(e) => handleRangeChange('callMinutesRange', 'max', e.target.value)}
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
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
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

          {/* Usage Level */}
          <div className="space-y-2">
            <Label>Usage Level</Label>
            <Select value={filters.usage} onValueChange={(value) => onFiltersChange({ ...filters, usage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Usage</SelectItem>
                <SelectItem value="low">Low (0-25%)</SelectItem>
                <SelectItem value="medium">Medium (26-75%)</SelectItem>
                <SelectItem value="high">High (76-100%)</SelectItem>
                <SelectItem value="over">Over Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity */}
          <div className="space-y-2">
            <Label>Activity</Label>
            <Select value={filters.activity} onValueChange={(value) => onFiltersChange({ ...filters, activity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="active_today">Active Today</SelectItem>
                <SelectItem value="active_week">Active This Week</SelectItem>
                <SelectItem value="inactive_30">Inactive 30+ Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <Label>Team Size</Label>
            <Select value={filters.teamSize} onValueChange={(value) => onFiltersChange({ ...filters, teamSize: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small (1-5 users)</SelectItem>
                <SelectItem value="medium">Medium (6-20 users)</SelectItem>
                <SelectItem value="large">Large (21+ users)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription */}
          <div className="space-y-2">
            <Label>Subscription</Label>
            <Select value={filters.subscription} onValueChange={(value) => onFiltersChange({ ...filters, subscription: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Call Usage */}
          <div className="space-y-2">
            <Label>Call Usage</Label>
            <Select value={filters.callUsage} onValueChange={(value) => onFiltersChange({ ...filters, callUsage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select call usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Call Usage</SelectItem>
                <SelectItem value="low">Low Usage</SelectItem>
                <SelectItem value="medium">Medium Usage</SelectItem>
                <SelectItem value="high">High Usage</SelectItem>
                <SelectItem value="over">Over Limit</SelectItem>
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
                <SelectItem value="Direct Sales">Direct Sales</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Partner Channel">Partner Channel</SelectItem>
                <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 