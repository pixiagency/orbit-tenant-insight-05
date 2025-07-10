import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getCitiesForCountry } from '@/data/countriesAndCities';

interface CitySelectProps {
  value?: string;
  onValueChange: (city: string) => void;
  country?: string;
  placeholder?: string;
  className?: string;
}

export const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onValueChange,
  country,
  placeholder = "Select city...",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (country) {
      setCities(getCitiesForCountry(country));
    } else {
      setCities([]);
    }
    // Clear city selection when country changes
    if (value && country) {
      const countryCities = getCitiesForCountry(country);
      if (!countryCities.includes(value)) {
        onValueChange('');
      }
    }
  }, [country, value, onValueChange]);

  const isDisabled = !country || cities.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn("w-full justify-between", className)}
        >
          {value || (
            <span className="text-gray-500">
              {isDisabled ? "Select country first" : placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};