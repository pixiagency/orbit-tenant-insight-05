import React, { useState } from 'react';
import { Search, Filter, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { EnhancedDatePicker } from '@/components/ui/enhanced-date-picker';
import { SubscriptionFilters as SubscriptionFiltersType } from '../../types/superadmin';
import { format } from 'date-fns';

interface SubscriptionFiltersProps {
  filters: SubscriptionFiltersType;
  onFiltersChange: (filters: SubscriptionFiltersType) => void;
}

export const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status });
  };

  const handlePackageChange = (packageId: string) => {
    onFiltersChange({ ...filters, packageId });
  };

  const handlePaymentStatusChange = (paymentStatus: string) => {
    onFiltersChange({ ...filters, paymentStatus });
  };

  const handleActivationMethodChange = (activationMethod: string) => {
    onFiltersChange({ ...filters, activationMethod });
  };

  const handleStartDateRangeChange = (startDateRange: string) => {
    onFiltersChange({ ...filters, startDateRange });
  };

  const handleDateRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date?.toISOString()
      }
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      packageId: 'all',
      cycle: 'all',
      activationMethod: 'all',
      paymentStatus: 'all',
      autoRenew: 'all',
      startDateRange: 'all',
      endDateRange: 'all',
      dateRange: {}
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.packageId !== 'all') count++;
    if (filters.paymentStatus !== 'all') count++;
    if (filters.activationMethod !== 'all') count++;
    if (filters.startDateRange !== 'all') count++;
    if (filters.cycle !== 'all') count++;
    if (filters.autoRenew !== 'all') count++;
    if (filters.endDateRange !== 'all') count++;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Select date';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search & Filters
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced
              {isAdvancedOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Input
            placeholder="Search subscriptions..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {/* Package Filter */}
          <Select value={filters.packageId} onValueChange={handlePackageChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Packages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              <SelectItem value="1">Starter</SelectItem>
              <SelectItem value="2">Professional</SelectItem>
              <SelectItem value="3">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Status Filter */}
          <Select value={filters.paymentStatus} onValueChange={handlePaymentStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="not-applicable">Not Applicable</SelectItem>
            </SelectContent>
          </Select>

          {/* Activation Method Filter */}
          <Select value={filters.activationMethod} onValueChange={handleActivationMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="activation-code">Activation Code</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>

          {/* Start Date Range Filter */}
          <Select value={filters.startDateRange} onValueChange={handleStartDateRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Billing Cycle Filter */}
              <Select value={filters.cycle} onValueChange={(cycle) => onFiltersChange({ ...filters, cycle })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cycles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>

              {/* Auto Renew Filter */}
              <Select value={filters.autoRenew} onValueChange={(autoRenew) => onFiltersChange({ ...filters, autoRenew })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Auto Renew" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Auto Renew</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>

              {/* Enhanced Date Range Picker */}
              <div>
                <EnhancedDatePicker
                  value={{
                    from: filters.dateRange?.from ? new Date(filters.dateRange.from) : undefined,
                    to: filters.dateRange?.to ? new Date(filters.dateRange.to) : undefined,
                  }}
                  onChange={(range) => {
                    onFiltersChange({
                      ...filters,
                      dateRange: {
                        from: range.from?.toISOString(),
                        to: range.to?.toISOString(),
                      },
                    });
                  }}
                  placeholder="Pick date range"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {filters.status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, status: 'all' })}
                />
              </Badge>
            )}
            {filters.packageId !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Package: {filters.packageId === '1' ? 'Starter' : filters.packageId === '2' ? 'Professional' : 'Enterprise'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, packageId: 'all' })}
                />
              </Badge>
            )}
            {filters.paymentStatus !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Payment: {filters.paymentStatus}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, paymentStatus: 'all' })}
                />
              </Badge>
            )}
            {filters.activationMethod !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Method: {filters.activationMethod}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, activationMethod: 'all' })}
                />
              </Badge>
            )}
            {filters.startDateRange !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Start: {filters.startDateRange}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, startDateRange: 'all' })}
                />
              </Badge>
            )}
            {(filters.dateRange?.from || filters.dateRange?.to) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Custom: {formatDate(filters.dateRange.from)} - {formatDate(filters.dateRange.to)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, dateRange: {} })}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
