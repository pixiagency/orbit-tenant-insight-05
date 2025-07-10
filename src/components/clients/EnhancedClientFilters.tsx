import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ClientFilters } from '../../types/superadmin';

interface EnhancedClientFiltersProps {
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
  onAdvancedFilters: () => void;
  onExport: () => void;
  onRefresh: () => void;
  activeFiltersCount: number;
}

export const EnhancedClientFilters: React.FC<EnhancedClientFiltersProps> = ({
  filters,
  onFiltersChange,
  onAdvancedFilters,
  onExport,
  onRefresh,
  activeFiltersCount
}) => {
  const handleFilterChange = (key: keyof ClientFilters, value: string) => {
    // Convert "all" values back to empty strings for filter logic
    const filterValue = value === 'all' ? '' : value;
    onFiltersChange({
      ...filters,
      [key]: filterValue
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      packageId: '',
      usage: '',
      activity: '',
      teamSize: '',
      subscription: '',
      callUsage: '',
      source: '',
      dateRange: {}
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Search and Filters Row */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.packageId || 'all'} onValueChange={(value) => handleFilterChange('packageId', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Package" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Packages</SelectItem>
            <SelectItem value="1">Starter Plan</SelectItem>
            <SelectItem value="2">Professional Plan</SelectItem>
            <SelectItem value="3">Enterprise Plan</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onAdvancedFilters} className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Advanced
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters}>
              Clear All Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.packageId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Package: {filters.packageId}
              <button
                onClick={() => handleFilterChange('packageId', 'all')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
