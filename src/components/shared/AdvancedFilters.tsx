import React, { useState } from 'react';
import { Search, Filter, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Label } from '../ui/label';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import '../ui/date-range-custom.css';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date-range';
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: string;
  isAdvanced?: boolean;
}

export interface FilterConfig {
  searchPlaceholder?: string;
  fields: FilterField[];
  defaultFilters: Record<string, any>;
}

export interface AdvancedFiltersProps {
  config: FilterConfig;
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  title?: string;
  className?: string;
  filteredCount?: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  config,
  filters,
  onFiltersChange,
  title = "Search & Filters",
  className = "",
  filteredCount,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleFieldChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
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
    onFiltersChange(config.defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    config.fields.forEach(field => {
      if (field.type === 'search') {
        if (filters[field.key] && filters[field.key] !== '') count++;
      } else if (field.type === 'select') {
        if (filters[field.key] && filters[field.key] !== 'all') count++;
      } else if (field.type === 'date-range') {
        if (filters.dateRange?.from || filters.dateRange?.to) count++;
      }
    });
    
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'search':
        return (
          <div key={field.key}>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </Label>
            <Input
              placeholder={field.placeholder || `Search ${field.label.toLowerCase()}...`}
              value={filters[field.key] || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="h-10 mt-1"
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.key}>
            <Label htmlFor={field.key} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </Label>
            <Select 
              value={filters[field.key] || field.defaultValue || 'all'} 
              onValueChange={(value) => handleFieldChange(field.key, value)}
            >
              <SelectTrigger id={field.key} className="mt-1 h-10">
                <SelectValue placeholder={field.placeholder || `All ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'date-range':
        // Preset ranges for the sidebar
        const presetRanges = [
          {
            label: 'Today',
            range: () => ({ startDate: new Date(), endDate: new Date() })
          },
          {
            label: 'Yesterday',
            range: () => ({ startDate: subDays(new Date(), 1), endDate: subDays(new Date(), 1) })
          },
          {
            label: 'Last 7 Days',
            range: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() })
          },
          {
            label: 'Last 30 Days',
            range: () => ({ startDate: subDays(new Date(), 29), endDate: new Date() })
          },
          {
            label: 'This Month',
            range: () => ({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) })
          },
          {
            label: 'Last Month',
            range: () => {
              const lastMonth = subDays(startOfMonth(new Date()), 1);
              return {
                startDate: startOfMonth(lastMonth),
                endDate: endOfMonth(lastMonth)
              };
            }
          },
          {
            label: 'This Year',
            range: () => ({ startDate: startOfYear(new Date()), endDate: endOfYear(new Date()) })
          },
          {
            label: 'Last Year',
            range: () => {
              const lastYear = new Date(new Date().getFullYear() - 1, 0, 1);
              return {
                startDate: startOfYear(lastYear),
                endDate: endOfYear(lastYear)
              };
            }
          }
        ];

        // Convert ISO strings to Date objects for DateRangePicker
        const selectionRange = {
          startDate: filters.dateRange?.from ? new Date(filters.dateRange.from) : new Date(),
          endDate: filters.dateRange?.to ? new Date(filters.dateRange.to) : new Date(),
          key: 'selection',
        };

        return (
          <div key={field.key} className="col-span-1 md:col-span-2 lg:col-span-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              {field.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-10"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from && filters.dateRange?.to
                    ? `${format(new Date(filters.dateRange.from), "PPP")} - ${format(new Date(filters.dateRange.to), "PPP")}`
                    : "Select date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={(ranges) => {
                    const range = ranges.selection;
                    onFiltersChange({
                      ...filters,
                      dateRange: {
                        from: range.startDate?.toISOString(),
                        to: range.endDate?.toISOString(),
                      }
                    });
                  }}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  direction="horizontal"
                  showMonthAndYearPickers={true}
                  minDate={new Date(2000, 0, 1)}
                  maxDate={new Date(2100, 11, 31)}
                  rangeColors={["#2563eb"]}
                  color="#2563eb"
                  staticRanges={presetRanges.map(preset => ({
                    label: preset.label,
                    range: preset.range,
                    isSelected: () => false,
                  }))}
                  inputRanges={[]}
                  disabledDates={[]}
                  renderDayContent={(day) => {
                    return <span>{day.getDate()}</span>;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      default:
        return null;
    }
  };

  const searchField = config.fields.find(field => field.type === 'search');
  const basicFields = config.fields.filter(field => !field.isAdvanced && field.type !== 'search');
  const advancedFields = config.fields.filter(field => field.isAdvanced);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
                <Badge variant="secondary" className="ml-2">
                  {filteredCount}
                </Badge>
              </Button>
            )}
            {advancedFields.length > 0 && (
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
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          {searchField && renderField(searchField)}
          
          {basicFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {basicFields.map(field => renderField(field))}
            </div>
          )}
        </div>

        {advancedFields.length > 0 && isAdvancedOpen && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advancedFields.map(field => renderField(field))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 