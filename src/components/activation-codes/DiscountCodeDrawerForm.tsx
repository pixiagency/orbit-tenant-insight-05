
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DrawerForm } from '../layout/DrawerForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, Check, Shuffle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ActivationCode, ActivationCodeFormData } from '../../types/superadmin';
import {
  toggleSourceSelection,
  selectAllSources,
  deselectAllSources,
} from './ActivationCodeHelpers';

const discountCodeSchema = z.object({
  code: z.string().min(1, 'Discount code is required').min(3, 'Code must be at least 3 characters'),
  packageId: z.string().min(1, 'Package is required'),
  usageType: z.enum(['one-time', 'multi-use', 'unlimited'], {
    required_error: 'Usage type is required',
  }),
  usageLimit: z.number().min(1, 'Usage limit must be at least 1').optional(),
  usersLimit: z.number().min(1, 'Users limit must be at least 1'),
  expirationDate: z.string().optional(),
  status: z.enum(['active', 'expired'], {
    required_error: 'Status is required',
  }),
  discountPercentage: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  sources: z.array(z.string()).min(1, 'At least one source is required'),
}).refine((data) => {
  if (data.usageType === 'multi-use' && !data.usageLimit) {
    return false;
  }
  return true;
}, {
  message: 'Usage limit is required for multi-use codes',
  path: ['usageLimit'],
});

interface DiscountCodeDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ActivationCodeFormData) => void;
  code?: ActivationCode | null;
  isLoading?: boolean;
}

// Mock packages for dropdown
const MOCK_PACKAGES = [
  { id: '1', name: 'Starter Plan' },
  { id: '2', name: 'Professional Plan' },
  { id: '3', name: 'Enterprise Plan' },
  { id: '4', name: 'Yearly Starter Plan' },
  { id: '5', name: 'Lifetime Professional' },
  { id: '6', name: 'Yearly Professional Plan' },
  { id: '7', name: 'Lifetime Enterprise' },
];

// Source options for discount codes
const SOURCE_OPTIONS = [
  'Marketing Campaign',
  'Promotional Event',
  'Black Friday',
  'Cyber Monday',
  'Holiday Sale',
  'Newsletter',
  'Social Media',
  'Partner Channel',
  'Customer Support',
  'Other',
];

export const DiscountCodeDrawerForm: React.FC<DiscountCodeDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  code,
  isLoading = false,
}) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const form = useForm<any>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      code: '',
      packageId: '',
      usageType: 'multi-use',
      usageLimit: 100,
      usersLimit: 5,
      expirationDate: '',
      status: 'active',
      discountPercentage: 10,
      sources: [],
    },
  });

  const watchUsageType = form.watch('usageType');

  useEffect(() => {
    if (code) {
      const initialSources = code.source ? [code.source] : [];
      
      setSelectedSources(initialSources);
      
      form.reset({
        code: code.code,
        packageId: code.packageId || '',
        usageType: code.usageType,
        usageLimit: code.usageLimit,
        usersLimit: code.usersLimit,
        expirationDate: code.expirationDate ? code.expirationDate.split('T')[0] : '',
        status: code.status === 'used' ? 'active' : (code.status === 'expired' ? 'expired' : 'active'),
        discountPercentage: code.discountPercentage,
        sources: initialSources,
      });
    } else {
      // Reset to default values when creating new
      setSelectedSources([]);
      form.reset({
        code: '',
        packageId: '',
        usageType: 'multi-use',
        usageLimit: 100,
        usersLimit: 5,
        expirationDate: '',
        status: 'active',
        discountPercentage: 10,
        sources: [],
      });
    }
  }, [code, form]);

  const handleSubmit = (data: any) => {
    // Clean up data
    const cleanedData = { ...data, type: 'discount' };
    
    if (data.usageType !== 'multi-use') {
      cleanedData.usageLimit = undefined;
    }
    
    // Convert array back to single value for backward compatibility
    cleanedData.source = data.sources[0];
    
    onSave(cleanedData);
  };

  const generateRandomCode = () => {
    const prefixes = ['SAVE', 'DISCOUNT', 'DEAL', 'PROMO', 'OFFER'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 900) + 100;
    const randomCode = `${prefix}${number}`;
    form.setValue('code', randomCode);
  };

  const handleToggleSourceSelection = (source: string) => {
    toggleSourceSelection(source, selectedSources, setSelectedSources, form);
  };

  const handleSelectAllSources = () => {
    selectAllSources(SOURCE_OPTIONS, setSelectedSources, form);
  };

  const handleDeselectAllSources = () => {
    deselectAllSources(setSelectedSources, form);
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={code ? 'Edit Discount Code' : 'Create Discount Code'}
      description={code ? 'Update discount code details' : 'Create a new discount code for packages'}
      onSave={() => form.handleSubmit(handleSubmit)()}
      isLoading={isLoading}
      saveButtonText="Save"
    >
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Code</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter discount code or generate random"
                      className="font-mono uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomCode}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <FormDescription>
                  This code will be used by customers to get a discount on their subscription
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOCK_PACKAGES.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Enter discount percentage"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormDescription>
                  Discount percentage (1-100%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select usage type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="one-time">One-time Use</SelectItem>
                    <SelectItem value="multi-use">Multi-use (Limited)</SelectItem>
                    <SelectItem value="unlimited">Unlimited Use</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {watchUsageType === 'one-time' && 'Code can only be used once'}
                  {watchUsageType === 'multi-use' && 'Code can be used multiple times up to the limit'}
                  {watchUsageType === 'unlimited' && 'Code can be used unlimited times'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchUsageType === 'multi-use' && (
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="Enter maximum uses"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of times this code can be used
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="usersLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Users Limit</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Enter users limit"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    disabled={watchUsageType === 'unlimited'}
                  />
                </FormControl>
                <FormDescription>
                  {watchUsageType === 'unlimited' 
                    ? 'Users limit is disabled for unlimited usage'
                    : 'Maximum number of users allowed for discounted subscriptions'
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sources"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sources</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedSources.length === 0
                          ? "Select sources..."
                          : selectedSources.length === 1
                          ? selectedSources[0]
                          : `${selectedSources.length} sources selected`}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <div className="p-2 border-b">
                      <div className="flex justify-between space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAllSources}
                          className="flex-1"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDeselectAllSources}
                          className="flex-1"
                        >
                          Deselect All
                        </Button>
                      </div>
                    </div>
                    <div className="p-2 max-h-60 overflow-y-auto">
                      {SOURCE_OPTIONS.map((source) => (
                        <div key={source} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          <Checkbox
                            checked={selectedSources.includes(source)}
                            onCheckedChange={() => handleToggleSourceSelection(source)}
                          />
                          <label className="text-sm cursor-pointer flex-1">
                            {source}
                          </label>
                          {selectedSources.includes(source) && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The source or origin of this discount code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DrawerForm>
  );
};
