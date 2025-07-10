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

interface SubscriptionAdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dateRange: { from?: Date; to?: Date };
    amountRange: { min: string; max: string };
    status: string;
    packageId: string;
    activationMethod: string;
    paymentStatus: string;
    autoRenew: string;
    source: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const SubscriptionAdvancedFilters: React.FC<SubscriptionAdvancedFiltersProps> = ({
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

  const handleAmountRangeChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      amountRange: {
        ...filters.amountRange,
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
            <Label>Start Date Range</Label>
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

          {/* Amount Range */}
          <div className="space-y-2">
            <Label>Amount Range</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min amount"
                type="number"
                value={filters.amountRange.min}
                onChange={(e) => handleAmountRangeChange('min', e.target.value)}
              />
              <Input
                placeholder="Max amount"
                type="number"
                value={filters.amountRange.max}
                onChange={(e) => handleAmountRangeChange('max', e.target.value)}
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
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
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

          {/* Activation Method */}
          <div className="space-y-2">
            <Label>Activation Method</Label>
            <Select value={filters.activationMethod} onValueChange={(value) => onFiltersChange({ ...filters, activationMethod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="activation-code">Activation Code</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select value={filters.paymentStatus} onValueChange={(value) => onFiltersChange({ ...filters, paymentStatus: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto Renew */}
          <div className="space-y-2">
            <Label>Auto Renew</Label>
            <Select value={filters.autoRenew} onValueChange={(value) => onFiltersChange({ ...filters, autoRenew: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select auto renew" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auto Renew</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
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
                <SelectItem value="Direct Sale">Direct Sale</SelectItem>
                <SelectItem value="Partner Referral">Partner Referral</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="API Integration">API Integration</SelectItem>
                <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 