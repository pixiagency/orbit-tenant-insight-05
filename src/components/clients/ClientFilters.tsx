import React, { useState } from 'react';
import { Search, Filter, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ClientFilters as ClientFiltersType } from '../../types/superadmin';
import { format } from 'date-fns';

interface ClientFiltersProps {
  filters: ClientFiltersType;
  onFiltersChange: (filters: ClientFiltersType) => void;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
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

  const handleUsageChange = (usage: string) => {
    onFiltersChange({ ...filters, usage });
  };

  const handleActivityChange = (activity: string) => {
    onFiltersChange({ ...filters, activity });
  };

  const handleTeamSizeChange = (teamSize: string) => {
    onFiltersChange({ ...filters, teamSize });
  };

  const handleSubscriptionChange = (subscription: string) => {
    onFiltersChange({ ...filters, subscription });
  };

  const handleCallUsageChange = (callUsage: string) => {
    onFiltersChange({ ...filters, callUsage });
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
      usage: 'all',
      activity: 'all',
      teamSize: 'all',
      subscription: 'all',
      callUsage: 'all',
      dateRange: {},
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.packageId !== 'all') count++;
    if (filters.usage !== 'all') count++;
    if (filters.activity !== 'all') count++;
    if (filters.teamSize !== 'all') count++;
    if (filters.subscription !== 'all') count++;
    if (filters.callUsage !== 'all') count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

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
            placeholder="Search clients, contacts, emails..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          {/* Package Filter */}
          <Select value={filters.packageId} onValueChange={handlePackageChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Packages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              <SelectItem value="1">Starter Plan</SelectItem>
              <SelectItem value="2">Professional Plan</SelectItem>
              <SelectItem value="3">Enterprise Plan</SelectItem>
            </SelectContent>
          </Select>

          {/* Usage Filter */}
          <Select value={filters.usage || 'all'} onValueChange={handleUsageChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Usage" />
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

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Activity Filter */}
              <Select value={filters.activity || 'all'} onValueChange={handleActivityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="active_today">Active Today</SelectItem>
                  <SelectItem value="active_week">Active This Week</SelectItem>
                  <SelectItem value="inactive_30">Inactive 30+ Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Team Size Filter */}
              <Select value={filters.teamSize || 'all'} onValueChange={handleTeamSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Team Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small (1-5 users)</SelectItem>
                  <SelectItem value="medium">Medium (6-20 users)</SelectItem>
                  <SelectItem value="large">Large (21+ users)</SelectItem>
                </SelectContent>
              </Select>

              {/* Subscription Filter */}
              <Select value={filters.subscription || 'all'} onValueChange={handleSubscriptionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="expires_soon">Expires Soon</SelectItem>
                  <SelectItem value="auto_renew">Auto Renew</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              {/* Call Usage Filter */}
              <Select value={filters.callUsage || 'all'} onValueChange={handleCallUsageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Call Usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Usage</SelectItem>
                  <SelectItem value="over_limit">Over Limit</SelectItem>
                  <SelectItem value="high_usage">High Usage (80%+)</SelectItem>
                  <SelectItem value="low_usage">Low Usage (20%-)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  From Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        format(new Date(filters.dateRange.from), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange.from ? new Date(filters.dateRange.from) : undefined}
                      onSelect={(date) => handleDateRangeChange('from', date)}
                      disabled={(date) =>
                        filters.dateRange.to ? date > new Date(filters.dateRange.to) : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  To Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? (
                        format(new Date(filters.dateRange.to), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange.to ? new Date(filters.dateRange.to) : undefined}
                      onSelect={(date) => handleDateRangeChange('to', date)}
                      disabled={(date) =>
                        filters.dateRange.from ? date < new Date(filters.dateRange.from) : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
