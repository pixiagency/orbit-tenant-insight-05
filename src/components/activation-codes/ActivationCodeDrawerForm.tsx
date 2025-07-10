
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DrawerForm } from '../layout/DrawerForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ActivationCode, ActivationCodeFormData } from '../../types/superadmin';
import {
  toggleSourceSelection,
  selectAllSources,
  deselectAllSources,
} from './ActivationCodeHelpers';

const activationCodeSchema = z.object({
  code: z.string().min(1, 'Activation code is required').min(6, 'Code must be at least 6 characters'),
  packageId: z.string().min(1, 'Package is required'),
  usageType: z.enum(['one-time', 'multi-use', 'unlimited'], {
    required_error: 'Usage type is required',
  }).optional(),
  usageLimit: z.number().min(1, 'Usage limit must be at least 1').optional(),
  usersLimit: z.number().min(1, 'Users limit must be at least 1').optional(),
  validityDays: z.number().min(1, 'Validity days must be at least 1').optional(),
  expirationDate: z.string().optional(),
  status: z.enum(['active', 'expired'], {
    required_error: 'Status is required',
  }),
  type: z.enum(['activation', 'discount'], {
    required_error: 'Type is required',
  }),
  discountPercentage: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%').optional(),
  trialDays: z.number().min(1, 'Trial days must be at least 1').optional(),
  sources: z.array(z.string()).min(1, 'At least one source is required'),
  codeCount: z.number().min(1, 'Must generate at least 1 code').max(1000, 'Cannot generate more than 1000 codes at once').optional(),
  codeParts: z.number().min(3, 'Code must have at least 3 parts').max(6, 'Code cannot have more than 6 parts').optional(),
  partLength: z.number().min(3, 'Each part must be at least 3 characters').max(6, 'Each part cannot be more than 6 characters').optional(),
}).refine((data) => {
  if (data.usageType === 'multi-use' && !data.usageLimit) {
    return false;
  }
  return true;
}, {
  message: 'Usage limit is required for multi-use codes',
  path: ['usageLimit'],
}).refine((data) => {
  if (data.type === 'discount' && !data.discountPercentage) {
    return false;
  }
  return true;
}, {
  message: 'Discount percentage is required for discount codes',
  path: ['discountPercentage'],
});

interface ActivationCodeDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ActivationCodeFormData, shouldDownload?: boolean) => void;
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

// Source options for activation codes
const SOURCE_OPTIONS = [
  'Direct Sales',
  'Marketing Campaign',
  'Partner Channel',
  'Customer Support',
  'Trial Conversion',
  'Promotional Event',
  'Referral Program',
  'Website Signup',
  'Other',
];

export const ActivationCodeDrawerForm: React.FC<ActivationCodeDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  code,
  isLoading = false,
}) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isBulkGeneration, setIsBulkGeneration] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(activationCodeSchema),
    defaultValues: {
      code: code?.code || '',
      packageId: code?.packageId || '',
      usageType: code?.usageType || 'one-time',
      usageLimit: code?.usageLimit || undefined,
      usersLimit: code?.usersLimit || 1,
      validityDays: code?.validityDays || undefined,
      expirationDate: code?.expirationDate ? code.expirationDate.split('T')[0] : '',
      status: code?.status === 'used' ? 'active' : (code?.status || 'active'),
      type: code?.type || 'activation',
      discountPercentage: code?.discountPercentage || undefined,
      trialDays: code?.trialDays || undefined,
      sources: code?.source ? [code.source] : [],
      codeCount: 1,
      codeParts: 4,
      partLength: 4,
    },
  });

  const watchUsageType = form.watch('usageType');
  const watchType = form.watch('type');
  const watchCodeParts = form.watch('codeParts');
  const watchPartLength = form.watch('partLength');

  useEffect(() => {
    if (code) {
      const initialSources = code.source ? [code.source] : [];
      
      setSelectedSources(initialSources);
      setIsBulkGeneration(false);
      
      form.reset({
        code: code.code,
        packageId: code.packageId || '',
        usageType: code.usageType,
        usageLimit: code.usageLimit,
        usersLimit: code.usersLimit,
        validityDays: code.validityDays,
        expirationDate: code.expirationDate ? code.expirationDate.split('T')[0] : '',
        status: code.status === 'used' ? 'active' : (code.status === 'expired' ? 'expired' : 'active'),
        type: code.type || 'activation',
        discountPercentage: code.discountPercentage,
        trialDays: code.trialDays,
        sources: initialSources,
        codeCount: 1,
        codeParts: 4,
        partLength: 4,
      });
    }
  }, [code, form]);

  const handleSubmit = (data: any, shouldDownload: boolean = false) => {
    // Clean up data based on usage type and code type
    const cleanedData = { ...data };
    
    if (data.usageType !== 'multi-use') {
      cleanedData.usageLimit = undefined;
    }
    
    if (data.type !== 'discount') {
      cleanedData.discountPercentage = undefined;
    }

    if (data.type === 'activation') {
      delete cleanedData.usageType;
      delete cleanedData.usersLimit;
    }
    
    // Convert array back to single value for backward compatibility
    cleanedData.source = data.sources[0];
    
    onSave(cleanedData, shouldDownload);
  };

  const generateRandomCode = () => {
    if (watchType === 'discount') {
      // Generate single part code for discount
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      form.setValue('code', random);
    } else if (isBulkGeneration) {
      // Generate a sample code with parts for activation codes
      const parts = [];
      for (let i = 0; i < watchCodeParts; i++) {
        const part = Math.random().toString(36).substring(2, 2 + watchPartLength).toUpperCase();
        parts.push(part);
      }
      const randomCode = parts.join('-');
      form.setValue('code', randomCode);
    } else {
      // Generate single code for activation
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const randomCode = `${timestamp}${random}`;
      form.setValue('code', randomCode);
    }
  };

  const generateSampleCode = () => {
    const parts = [];
    for (let i = 0; i < watchCodeParts; i++) {
      const part = 'X'.repeat(watchPartLength);
      parts.push(part);
    }
    return parts.join('-');
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

  const handleBulkGenerationChange = (checked: boolean | "indeterminate") => {
    setIsBulkGeneration(checked === true);
  };

  const getFormTitle = () => {
    if (code) {
      return watchType === 'discount' ? 'Edit Discount Code' : 'Edit Activation Code';
    }
    return watchType === 'discount' ? 'Create Discount Code' : 'Create Activation Code';
  };

  const getFormDescription = () => {
    if (code) {
      return watchType === 'discount' ? 'Update discount code details' : 'Update activation code details';
    }
    return watchType === 'discount' ? 'Create a new discount code for packages' : 'Create a new activation code for packages';
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={getFormTitle()}
      description={getFormDescription()}
      onSave={() => form.handleSubmit((data) => handleSubmit(data, false))()}
      isLoading={isLoading}
      saveButtonText={isBulkGeneration && watchType === 'activation' ? 'Save & Download' : 'Save'}
      onAlternateSave={isBulkGeneration && watchType === 'activation' ? () => form.handleSubmit((data) => handleSubmit(data, true))() : undefined}
      alternateSaveText="Save & Download"
    >
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select code type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="activation">Activation Code</SelectItem>
                    <SelectItem value="discount">Discount Code</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {watchType === 'activation' && 'Standard activation code for package access'}
                  {watchType === 'discount' && 'Discount code with percentage off pricing'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!code && watchType === 'activation' && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Checkbox
                checked={isBulkGeneration}
                onCheckedChange={handleBulkGenerationChange}
              />
              <label className="text-sm font-medium">
                Generate multiple codes with structured format
              </label>
            </div>
          )}

          {isBulkGeneration && !code && watchType === 'activation' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FormField
                control={form.control}
                name="codeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Codes</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="1000"
                        placeholder="10"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      How many codes to generate (1-1000)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codeParts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Parts</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="4" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 Parts</SelectItem>
                        <SelectItem value="4">4 Parts</SelectItem>
                        <SelectItem value="5">5 Parts</SelectItem>
                        <SelectItem value="6">6 Parts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Number of code segments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Part Length</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="4" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 Characters</SelectItem>
                        <SelectItem value="4">4 Characters</SelectItem>
                        <SelectItem value="5">5 Characters</SelectItem>
                        <SelectItem value="6">6 Characters</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Characters per segment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Code Format Preview:</p>
                    <p className="text-lg font-mono text-blue-700 dark:text-blue-300 mt-1">
                      {generateSampleCode()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateRandomCode}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Sample
                  </Button>
                </div>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isBulkGeneration ? 'Sample Code' : (watchType === 'discount' ? 'Discount Code' : 'Activation Code')}
                </FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={isBulkGeneration ? "Sample code format" : "Enter code or generate random"}
                      className="font-mono uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      disabled={isBulkGeneration}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomCode}
                  >
                    Generate
                  </Button>
                </div>
                <FormDescription>
                  {isBulkGeneration 
                    ? 'This shows the format for generated codes. Actual codes will have random characters.'
                    : `This code will be used by customers to ${watchType === 'discount' ? 'get a discount on' : 'activate'} their subscription`
                  }
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

          {watchType === 'discount' && (
            <>
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
                        : 'Maximum number of users allowed for activated subscriptions'
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

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
                  The source or origin of this activation code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trialDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trial Days (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Enter trial days"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormDescription>
                  Number of trial days to grant with this code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="validityDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validity (Days)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="Optional"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Days until code expires (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  <FormDescription>
                    Specific expiration date (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
