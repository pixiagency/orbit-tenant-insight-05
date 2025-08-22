import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Package, Calendar, Globe, Eye, EyeOff, RefreshCw, MapPin, Briefcase } from 'lucide-react';
import { DrawerForm } from '../layout/DrawerForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Client, ClientFormData } from '../../types/superadmin';

interface ClientDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
  client?: Client | null;
  isLoading?: boolean;
}

const MOCK_PACKAGES = [
  { id: '1', name: 'Starter Plan', price: 29 },
  { id: '2', name: 'Professional Plan', price: 99 },
  { id: '3', name: 'Enterprise Plan', price: 299 },
];

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Brazil', 'India', 'China'
];

const COMPANY_SIZES = [
  '1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501-1000 employees', '1000+ employees'
];

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Real Estate', 'Legal', 'Other'
];

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const ClientDrawerForm: React.FC<ClientDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  client,
  isLoading = false,
}) => {
  const [sendPasswordSetupEmail, setSendPasswordSetupEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ClientFormData>({
    defaultValues: {
      companyName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      address: '',
      packageId: '',
      status: 'active',
      subscriptionStart: new Date().toISOString().split('T')[0],
      domainSubdomain: '',
      sendPasswordSetupEmail: true,
      notes: '',
      companySize: '',
      industry: '',
      jobTitle: '',
      country: '',
      city: '',
      postalCode: '',
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  const selectedPackageId = watch('packageId');
  const subscriptionStart = watch('subscriptionStart');
  const domainSubdomain = watch('domainSubdomain');

  // Calculate subscription expiry based on package
  const calculateSubscriptionExpiry = (packageId: string, startDate: string) => {
    if (!packageId || !startDate) return '';
    
    const start = new Date(startDate);
    const pkg = MOCK_PACKAGES.find(p => p.id === packageId);
    
    if (pkg) {
      // Default to 1 month for all packages in this example
      const expiry = new Date(start);
      expiry.setMonth(expiry.getMonth() + 1);
      return expiry.toISOString().split('T')[0];
    }
    
    return '';
  };

  useEffect(() => {
    if (selectedPackageId && subscriptionStart) {
      const expiry = calculateSubscriptionExpiry(selectedPackageId, subscriptionStart);
      setValue('subscriptionExpiry', expiry);
    }
  }, [selectedPackageId, subscriptionStart, setValue]);

  useEffect(() => {
    if (client) {
      reset({
        companyName: client.companyName || '',
        contactName: client.contactName || '',
        contactEmail: client.contactEmail || '',
        contactPhone: client.contactPhone || '',
        website: client.website || '',
        address: client.address || '',
        packageId: client.packageId || '',
        status: client.status === 'active' ? 'active' : 'inactive',
        subscriptionStart: client.subscriptionStart?.split('T')[0] || new Date().toISOString().split('T')[0],
        subscriptionExpiry: client.subscriptionExpiry?.split('T')[0],
        domainSubdomain: client.subdomain || '',
        sendPasswordSetupEmail: true,
        notes: client.notes || '',
        companySize: client.companySize || '',
        industry: client.industry || '',
        jobTitle: '',
        country: '',
        city: '',
        postalCode: '',
      });
      setSendPasswordSetupEmail(true);
    } else {
      reset({
        companyName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        address: '',
        packageId: '',
        status: 'active',
        subscriptionStart: new Date().toISOString().split('T')[0],
        domainSubdomain: '',
        sendPasswordSetupEmail: true,
        notes: '',
        companySize: '',
        industry: '',
        jobTitle: '',
        country: '',
        city: '',
        postalCode: '',
      });
      setSendPasswordSetupEmail(true);
    }
  }, [client, reset]);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setValue('password', newPassword);
  };

  const validateSubdomain = (value: string) => {
    if (!value) return 'Subdomain is required';
    if (value.length < 3) return 'Subdomain must be at least 3 characters';
    if (!/^[a-z0-9-]+$/.test(value)) return 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    if (value.startsWith('-') || value.endsWith('-')) return 'Subdomain cannot start or end with a hyphen';
    return true;
  };

  const onSubmit = (data: ClientFormData) => {
    onSave({
      ...data,
      sendPasswordSetupEmail,
    });
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Edit Client' : 'Add New Client'}
      description={client ? 'Update client information and settings' : 'Create a new client account with subscription details'}
      onSave={handleSubmit(onSubmit)}
      isLoading={isLoading}
      saveText={client ? 'Update Client' : 'Create Client'}
    >
      <form className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <User className="inline h-4 w-4 mr-2" />
            Basic Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
              <Input
                {...register('companyName', { required: 'Company name is required' })}
                placeholder="e.g., TechCorp Inc."
                className="mt-1"
              />
              {errors.companyName && (
                <span className="text-sm text-red-600">{errors.companyName.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="contactName" className="text-sm font-medium">Contact Name *</Label>
              <Input
                {...register('contactName', { required: 'Contact name is required' })}
                placeholder="e.g., John Smith"
                className="mt-1"
              />
              {errors.contactName && (
                <span className="text-sm text-red-600">{errors.contactName.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email *</Label>
              <Input
                {...register('contactEmail', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="john@techcorp.com"
                className="mt-1"
              />
              {errors.contactEmail && (
                <span className="text-sm text-red-600">{errors.contactEmail.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone" className="text-sm font-medium">Contact Phone</Label>
              <Input
                {...register('contactPhone')}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title</Label>
              <Input
                {...register('jobTitle')}
                placeholder="e.g., CEO, Manager, Director"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="website" className="text-sm font-medium">Website</Label>
              <Input
                {...register('website')}
                placeholder="https://techcorp.com"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Company Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Briefcase className="inline h-4 w-4 mr-2" />
            Company Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="companySize" className="text-sm font-medium">Company Size</Label>
              <Select onValueChange={(value) => setValue('companySize', value)} defaultValue={watch('companySize')}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
              <Select onValueChange={(value) => setValue('industry', value)} defaultValue={watch('industry')}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Location Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <MapPin className="inline h-4 w-4 mr-2" />
            Location Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="country" className="text-sm font-medium">Country</Label>
              <Select onValueChange={(value) => setValue('country', value)} defaultValue={watch('country')}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium">City</Label>
              <Input
                {...register('city')}
                placeholder="e.g., New York, London, Tokyo"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="postalCode" className="text-sm font-medium">Postal Code</Label>
              <Input
                {...register('postalCode')}
                placeholder="e.g., 10001, SW1A 1AA"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Input
                {...register('address')}
                placeholder="123 Business St, Suite 100"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Domain & Subdomain */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Globe className="inline h-4 w-4 mr-2" />
            Domain & Subdomain
          </h4>

          <div>
            <Label htmlFor="domainSubdomain" className="text-sm font-medium">Subdomain *</Label>
            <div className="flex items-center mt-1">
              <Input
                {...register('domainSubdomain', { 
                  required: 'Subdomain is required',
                  validate: validateSubdomain
                })}
                placeholder="e.g., techcorp"
                className="rounded-r-none border-r-0"
                onChange={(e) => setValue('domainSubdomain', e.target.value.toLowerCase())}
              />
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md text-sm text-gray-500">
                .mycrm.com
              </div>
            </div>
            {errors.domainSubdomain && (
              <span className="text-sm text-red-600 mt-1 block">{errors.domainSubdomain.message}</span>
            )}
            {domainSubdomain && validateSubdomain(domainSubdomain) === true && (
              <p className="text-xs text-green-600 mt-1">
                Full URL: {domainSubdomain}.mycrm.com
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Package Selection */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Package className="inline h-4 w-4 mr-2" />
            Package & Subscription
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="packageId" className="text-sm font-medium">Package *</Label>
              <Select 
                onValueChange={(value) => setValue('packageId', value)} 
                defaultValue={watch('packageId')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PACKAGES.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - ${pkg.price}/month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.packageId && (
                <span className="text-sm text-red-600">Please select a package</span>
              )}
            </div>

            <div>
              <Label htmlFor="subscriptionStart" className="text-sm font-medium">Subscription Start *</Label>
              <Input
                {...register('subscriptionStart', { required: 'Start date is required' })}
                type="date"
                className="mt-1"
              />
              {errors.subscriptionStart && (
                <span className="text-sm text-red-600">{errors.subscriptionStart.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="subscriptionExpiry" className="text-sm font-medium">Subscription Expiry</Label>
              <Input
                {...register('subscriptionExpiry')}
                type="date"
                className="mt-1 bg-gray-100 dark:bg-gray-800"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Auto-calculated based on package</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Account Setup */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Account Setup
          </h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Send Password Setup Email</Label>
              <p className="text-xs text-gray-500">Send email to client to set up their password</p>
            </div>
            <Switch
              checked={sendPasswordSetupEmail}
              onCheckedChange={setSendPasswordSetupEmail}
            />
          </div>

          {!sendPasswordSetupEmail && (
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
              <div className="relative mt-1">
                <Input
                  {...register('password', { required: !sendPasswordSetupEmail ? 'Password is required' : false })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGeneratePassword}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-6 w-6 p-0"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              {errors.password && (
                <span className="text-sm text-red-600">{errors.password.message}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Client Status</Label>
              <p className="text-xs text-gray-500">Enable or disable client access</p>
            </div>
            <Switch
              checked={watch('status') === 'active'}
              onCheckedChange={(checked) => setValue('status', checked ? 'active' : 'inactive')}
            />
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
          <Textarea
            {...register('notes')}
            placeholder="Add any additional notes about this client..."
            className="mt-1"
            rows={3}
          />
        </div>
      </form>
    </DrawerForm>
  );
};
