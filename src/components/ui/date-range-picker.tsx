
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick date range",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    onChange({});
    setIsOpen(false);
  };

  const formatDisplayValue = () => {
    if (!value?.from && !value?.to) return placeholder;
    
    if (value.from && value.to) {
      if (value.from.toDateString() === value.to.toDateString()) {
        return format(value.from, 'MMM dd, yyyy');
      }
      return `${format(value.from, 'MMM dd, yyyy')} - ${format(value.to, 'MMM dd, yyyy')}`;
    }
    
    if (value.from) {
      return `From ${format(value.from, 'MMM dd, yyyy')}`;
    }
    
    if (value.to) {
      return `To ${format(value.to, 'MMM dd, yyyy')}`;
    }
    
    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${className}`}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="truncate">{formatDisplayValue()}</span>
          {value?.from || value?.to ? (
            <Badge variant="secondary" className="ml-2 text-xs">
              Range
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Select Date Range</h4>
            <CalendarComponent
              mode="range"
              selected={value?.from && value?.to ? { from: value.from, to: value.to } : undefined}
              onSelect={(range) => {
                if (range?.from) {
                  onChange({ from: range.from, to: range.to });
                }
              }}
              numberOfMonths={2}
              className="rounded-md border pointer-events-auto"
              disabled={(date) => date > new Date()}
            />
          </div>

          <div className="flex justify-between pt-3 border-t">
            {value?.from || value?.to ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            ) : <div />}
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
