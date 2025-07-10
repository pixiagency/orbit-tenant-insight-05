import React, { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { UserFilters as UserFiltersType } from '../../types/users';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  onExport?: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  const activeFiltersCount = [
    filters.role !== 'all' ? filters.role : null,
    filters.status !== 'all' ? filters.status : null,
    filters.clientId !== 'all' ? filters.clientId : null,
    filters.department !== 'all' ? filters.department : null,
    filters.isEmailVerified !== 'all' ? filters.isEmailVerified : null,
    filters.isTwoFactorEnabled !== 'all' ? filters.isTwoFactorEnabled : null,
    filters.lastLoginRange !== 'all' ? filters.lastLoginRange : null,
    filters.dateRange?.from ? 'custom-start' : null,
    filters.dateRange?.to ? 'custom-end' : null,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      role: 'all',
      status: 'all',
      clientId: 'all',
      department: 'all',
      isEmailVerified: 'all',
      isTwoFactorEnabled: 'all',
      lastLoginRange: 'all',
      dateRange: {}
    });
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Select date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            User Filters
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
                <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                Export
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="bg-gray-50 dark:bg-gray-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Less Filters' : 'More Filters'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10 bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <Select value={filters.role} onValueChange={(role) => onFiltersChange({ ...filters, role })}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super-admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(status) => onFiltersChange({ ...filters, status })}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.clientId} onValueChange={(clientId) => onFiltersChange({ ...filters, clientId })}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="1">TechCorp Inc.</SelectItem>
              <SelectItem value="2">StartupXYZ</SelectItem>
              <SelectItem value="3">Enterprise Solutions</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-gray-50 dark:bg-gray-700 justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">From Date</Label>
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateRange?.from ? new Date(filters.dateRange.from) : undefined}
                    onSelect={(date) => handleDateRangeChange('from', date)}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">To Date</Label>
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateRange?.to ? new Date(filters.dateRange.to) : undefined}
                    onSelect={(date) => handleDateRangeChange('to', date)}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      onFiltersChange({ ...filters, dateRange: {} });
                      setDateRangeOpen(false);
                    }}
                  >
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setDateRangeOpen(false)}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Select value={filters.department} onValueChange={(department) => onFiltersChange({ ...filters, department })}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="management">Management</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.isEmailVerified} onValueChange={(isEmailVerified) => onFiltersChange({ ...filters, isEmailVerified })}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                <SelectValue placeholder="Email Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.isTwoFactorEnabled} onValueChange={(isTwoFactorEnabled) => onFiltersChange({ ...filters, isTwoFactorEnabled })}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                <SelectValue placeholder="Two Factor Auth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All 2FA</SelectItem>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.lastLoginRange} onValueChange={(lastLoginRange) => onFiltersChange({ ...filters, lastLoginRange })}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                <SelectValue placeholder="Last Login" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="never">Never Logged In</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {filters.role !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Role: {filters.role}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, role: 'all' })}
                />
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {filters.status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, status: 'all' })}
                />
              </Badge>
            )}
            {(filters.dateRange?.from || filters.dateRange?.to) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Custom Range
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
