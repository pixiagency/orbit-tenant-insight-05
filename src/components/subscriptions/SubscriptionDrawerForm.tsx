import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Users, Package, DollarSign, Settings, Info, Paperclip, Key, AlertCircle, FileText, Send, Percent } from 'lucide-react';
import { DrawerForm } from '../layout/DrawerForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ClientSearchSelect } from './ClientSearchSelect';
import { SubscriptionActivationCodeInput } from './SubscriptionActivationCodeInput';
import { Subscription, SubscriptionFormData } from '../../types/superadmin';

interface SubscriptionDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SubscriptionFormData) => void;
  subscription?: Subscription | null;
  isLoading?: boolean;
}

// Updated mock data with yearly and lifetime packages
const MOCK_PACKAGES = [
  { 
    id: '1', 
    name: 'Starter Plan', 
    monthlyPrice: 29,
    yearlyPrice: 290,
    lifetimePrice: 1450,
    duration: 1,
    durationUnit: 'months',
    features: ['Basic CRM', 'Up to 1,000 contacts', 'Email support'],
    limits: { users: 3, contacts: 1000, storage: '5GB' }
  },
  { 
    id: '2', 
    name: 'Professional Plan', 
    monthlyPrice: 99,
    yearlyPrice: 990,
    lifetimePrice: 4950,
    duration: 1,
    durationUnit: 'months',
    features: ['Advanced CRM', 'Up to 10,000 contacts', 'Priority support', 'Automation'],
    limits: { users: 10, contacts: 10000, storage: '50GB' }
  },
  { 
    id: '3', 
    name: 'Enterprise Plan', 
    monthlyPrice: 299,
    yearlyPrice: 2990,
    lifetimePrice: 14950,
    duration: 1,
    durationUnit: 'years',
    features: ['Full CRM Suite', 'Unlimited contacts', '24/7 support', 'Custom integrations'],
    limits: { users: 50, contacts: 'unlimited', storage: '500GB' }
  },
  {
    id: '4',
    name: 'Lifetime Professional',
    monthlyPrice: 0,
    yearlyPrice: 0,
    lifetimePrice: 4950,
    duration: 0,
    durationUnit: 'lifetime',
    features: ['Advanced CRM', 'Up to 10,000 contacts', 'Priority support', 'Automation', 'Lifetime access'],
    limits: { users: 10, contacts: 10000, storage: '50GB' }
  },
];

// Mock clients for subdomain logic
const MOCK_CLIENTS = [
  { id: '1', name: 'TechCorp Inc.', email: 'john@techcorp.com', subdomain: 'techcorp' },
  { id: '2', name: 'StartupXYZ', email: 'sarah@startupxyz.com', subdomain: 'startupxyz' },
  { id: '3', name: 'BigCorp Ltd', email: 'michael@bigcorp.com', subdomain: 'bigcorp' },
];

// Updated mock activation codes with discount types
const MOCK_ACTIVATION_CODES = [
  {
    id: '1',
    code: 'BLACKFRIDAY2024',
    packageId: '2',
    packageName: 'Professional Plan',
    status: 'active',
    usageType: 'one-time',
    usageLimit: 1,
    usageCount: 0,
    validityDays: 365,
    source: 'Black Friday Deal',
    type: 'activation',
    trialDays: 14
  },
  {
    id: '2',
    code: 'LIFETIME50',
    packageId: '3',
    packageName: 'Enterprise Plan',
    status: 'active',
    usageType: 'multi-use',
    usageLimit: 50,
    usageCount: 12,
    validityDays: 180,
    source: 'Lifetime Deal',
    type: 'activation',
    trialDays: 30
  },
  {
    id: '3',
    code: 'PARTNER2024',
    packageId: '1',
    packageName: 'Starter Plan',
    status: 'active',
    usageType: 'unlimited',
    validityDays: 90,
    source: 'Partner Referral',
    type: 'activation',
    trialDays: 7
  },
  {
    id: '4',
    code: 'DISCOUNT25',
    packageId: '2',
    packageName: 'Professional Plan',
    status: 'active',
    usageType: 'multi-use',
    usageLimit: 100,
    usageCount: 5,
    validityDays: 90,
    source: 'Marketing Campaign',
    type: 'discount',
    discountPercentage: 25
  },
  {
    id: '5',
    code: 'SAVE50PERCENT',
    packageId: '1',
    packageName: 'Starter Plan',
    status: 'active',
    usageType: 'unlimited',
    validityDays: 60,
    source: 'Flash Sale',
    type: 'discount',
    discountPercentage: 50
  }
];

// Mock discount codes
const MOCK_DISCOUNT_CODES = [
  { code: 'SAVE10', discount: 10, type: 'percentage' },
  { code: 'SAVE25', discount: 25, type: 'percentage' },
  { code: 'FLAT50', discount: 50, type: 'fixed' },
  { code: 'NEWCLIENT', discount: 15, type: 'percentage' },
  { code: 'EARLY2024', discount: 30, type: 'percentage' },
];

const SOURCE_OPTIONS = [
  'Direct Sale',
  'Partner Referral',
  'Website',
  'API Integration',
  'Reseller',
  'Marketing Campaign',
  'Trial Conversion',
  'Upsell',
  'Black Friday Deal',
  'Lifetime Deal',
  'Flash Sale',
  'Other'
];

export const SubscriptionDrawerForm: React.FC<SubscriptionDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  subscription,
  isLoading = false,
}) => {
  const [validatedActivationCode, setValidatedActivationCode] = useState<any>(null);
  const [createInvoice, setCreateInvoice] = useState(false);
  const [discountCodeError, setDiscountCodeError] = useState<string>('');
  const [validatedDiscountCode, setValidatedDiscountCode] = useState<any>(null);

  const form = useForm<SubscriptionFormData>({
    defaultValues: {
      clientId: '',
      packageId: '',
      activationMethod: 'manual',
      source: 'Direct Sale',
      startDate: new Date().toISOString().split('T')[0],
      autoRenew: true,
      paymentStatus: 'not-applicable',
      status: 'active',
      createInvoice: false,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  const selectedPackageId = watch('packageId');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const activationMethod = watch('activationMethod');
  const selectedClientId = watch('clientId');
  const source = watch('source');
  const activationCode = watch('activationCode');
  const discountCode = watch('discountCode');

  // Get selected package and client data
  const selectedPackage = useMemo(() => 
    MOCK_PACKAGES.find(pkg => pkg.id === selectedPackageId), 
    [selectedPackageId]
  );

  const selectedClient = useMemo(() => 
    MOCK_CLIENTS.find(client => client.id === selectedClientId), 
    [selectedClientId]
  );

  // Calculate end date based on package and trial period
  const calculateEndDate = useMemo(() => {
    if (!startDate || !selectedPackage) return '';
    
    const start = new Date(startDate);
    
    // For lifetime packages, no end date
    if (selectedPackage.durationUnit === 'lifetime') {
      return '';
    }
    
    let endDate = new Date(start);
    
    // Add package duration
    if (selectedPackage.durationUnit === 'months') {
      endDate.setMonth(endDate.getMonth() + selectedPackage.duration);
    } else if (selectedPackage.durationUnit === 'years') {
      endDate.setFullYear(endDate.getFullYear() + selectedPackage.duration);
    } else if (selectedPackage.durationUnit === 'days') {
      endDate.setDate(endDate.getDate() + selectedPackage.duration);
    }
    
    return endDate.toISOString().split('T')[0];
  }, [startDate, selectedPackage]);

  // Calculate subscription amount with discount
  const calculateSubscriptionAmount = useMemo(() => {
    if (!selectedPackage) return { originalAmount: 0, discountAmount: 0, finalAmount: 0 };

    let originalAmount = selectedPackage.monthlyPrice;
    if (selectedPackage.durationUnit === 'years') {
      originalAmount = selectedPackage.yearlyPrice;
    } else if (selectedPackage.durationUnit === 'lifetime') {
      originalAmount = selectedPackage.lifetimePrice;
    }

    let discountAmount = 0;
    if (validatedDiscountCode) {
      if (validatedDiscountCode.type === 'percentage') {
        discountAmount = (originalAmount * validatedDiscountCode.discount) / 100;
      } else {
        discountAmount = validatedDiscountCode.discount;
      }
    }

    const finalAmount = Math.max(0, originalAmount - discountAmount);

    return { originalAmount, discountAmount, finalAmount };
  }, [selectedPackage, validatedDiscountCode]);

  // Validate discount code
  const validateDiscountCode = (code: string) => {
    if (!code) {
      setDiscountCodeError('');
      setValidatedDiscountCode(null);
      return;
    }

    const foundCode = MOCK_DISCOUNT_CODES.find(dc => dc.code.toLowerCase() === code.toLowerCase());
    
    if (!foundCode) {
      setDiscountCodeError('Invalid discount code');
      setValidatedDiscountCode(null);
      return;
    }

    setDiscountCodeError('');
    setValidatedDiscountCode(foundCode);
  };

  // Watch for discount code changes
  useEffect(() => {
    if (discountCode) {
      validateDiscountCode(discountCode);
    } else {
      setDiscountCodeError('');
      setValidatedDiscountCode(null);
    }
  }, [discountCode]);

  useEffect(() => {
    if (subscription) {
      reset({
        clientId: subscription.clientId,
        packageId: subscription.packageId,
        activationMethod: subscription.activationMethod,
        source: subscription.source,
        startDate: subscription.startDate.split('T')[0],
        endDate: subscription.endDate?.split('T')[0],
        autoRenew: subscription.autoRenew,
        paymentStatus: subscription.paymentStatus,
        status: subscription.status,
        notes: subscription.notes,
        discountCode: subscription.discountCode,
        discountAmount: subscription.discountAmount,
        createInvoice: false,
      });
    } else {
      reset({
        clientId: '',
        packageId: '',
        activationMethod: 'manual',
        source: 'Direct Sale',
        startDate: new Date().toISOString().split('T')[0],
        autoRenew: true,
        paymentStatus: 'not-applicable',
        status: 'active',
        createInvoice: false,
      });
    }
  }, [subscription, reset]);

  // Set default payment status based on activation method
  useEffect(() => {
    if (!subscription) {
      switch (activationMethod) {
        case 'stripe':
          setValue('paymentStatus', 'paid');
          break;
        case 'activation-code':
          setValue('paymentStatus', 'not-applicable');
          break;
        case 'api':
          setValue('paymentStatus', 'paid');
          break;
        default:
          setValue('paymentStatus', 'not-applicable');
      }
    }
  }, [activationMethod, subscription, setValue]);

  const handleAddClient = (clientData: { name: string; email: string; phone: string; subdomain: string }) => {
    console.log('Add new client:', clientData);
    // In a real app, you would create the client here and set the ID
  };

  const handleActivationCodeValidation = (isValid: boolean, codeData?: any) => {
    if (isValid && codeData) {
      setValidatedActivationCode(codeData);
      setValue('packageId', codeData.packageId);
      setValue('source', codeData.source);
      setValue('paymentStatus', 'not-applicable');
    } else {
      setValidatedActivationCode(null);
    }
  };

  const onSubmit = (data: SubscriptionFormData) => {
    // Add calculated end date if not set
    if (!data.endDate && calculateEndDate) {
      data.endDate = calculateEndDate;
    }
    
    // Include invoice creation flag
    data.createInvoice = createInvoice;
    
    // Include discount amount if calculated
    if (validatedDiscountCode) {
      data.discountAmount = calculateSubscriptionAmount.discountAmount;
    }
    
    onSave(data);
  };

  const isReadOnly = subscription?.isReadOnly;
  const isLifetimePackage = selectedPackage?.durationUnit === 'lifetime';

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={subscription ? 'Edit Subscription' : 'Create New Subscription'}
      description={subscription ? 'Update subscription details' : 'Set up a new subscription for a client'}
      onSave={handleSubmit(onSubmit)}
      isLoading={isLoading}
      saveText={subscription ? 'Update Subscription' : 'Create Subscription'}
      additionalActions={
        !subscription && (
          <Button
            type="button"
            onClick={() => {
              setCreateInvoice(true);
              handleSubmit(onSubmit)();
            }}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Create and Send Invoice
          </Button>
        )
      }
    >
      <form className="space-y-4 sm:space-y-6">
        {/* Read-Only Warning */}
        {isReadOnly && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
            <Settings className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              This subscription is managed by an external billing system. Some fields are read-only.
            </AlertDescription>
          </Alert>
        )}

        {/* Client Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Users className="inline h-4 w-4 mr-2" />
            Client *
          </Label>
          <ClientSearchSelect
            value={watch('clientId')}
            onValueChange={(value) => setValue('clientId', value)}
            onAddClient={handleAddClient}
            disabled={isReadOnly}
            showSubdomain={true}
          />
          {selectedClient && (
            <div className="text-xs text-gray-500">
              Subdomain: {selectedClient.subdomain}.mycrm.com
            </div>
          )}
          {errors.clientId && (
            <span className="text-sm text-red-600 dark:text-red-400">Please select a client</span>
          )}
        </div>

        <Separator />

        {/* Subscription Configuration */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Settings className="inline h-4 w-4 mr-2" />
            Subscription Configuration
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="activationMethod" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Activation Method
              </Label>
              <Select 
                onValueChange={(value) => setValue('activationMethod', value as any)} 
                defaultValue={watch('activationMethod')}
                disabled={isReadOnly}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Activation</SelectItem>
                  <SelectItem value="activation-code">Activation Code</SelectItem>
                  <SelectItem value="stripe">Stripe Payment</SelectItem>
                  <SelectItem value="api">API Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Source
              </Label>
              <Select 
                onValueChange={(value) => setValue('source', value)} 
                defaultValue={watch('source')}
                disabled={isReadOnly || (activationMethod === 'activation-code' && validatedActivationCode)}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((sourceOption) => (
                    <SelectItem key={sourceOption} value={sourceOption}>
                      {sourceOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Activation Code Field */}
          {activationMethod === 'activation-code' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                <Key className="inline h-4 w-4 mr-2" />
                Activation Code *
              </Label>
              <SubscriptionActivationCodeInput
                value={watch('activationCode') || ''}
                onChange={(value) => setValue('activationCode', value)}
                onValidationChange={handleActivationCodeValidation}
                disabled={isReadOnly}
              />
            </div>
          )}
        </div>

        {/* Package Selection */}
        <div className="space-y-2">
          <Label htmlFor="packageId" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Package className="inline h-4 w-4 mr-2" />
            Package *
          </Label>
          <Select 
            onValueChange={(value) => setValue('packageId', value)} 
            defaultValue={watch('packageId')}
            disabled={isReadOnly || (activationMethod === 'activation-code' && validatedActivationCode)}
          >
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue placeholder="Select a package" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PACKAGES.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{pkg.name}</span>
                    <span className="text-xs text-gray-500">
                      {pkg.durationUnit === 'lifetime' ? 'Lifetime access' : 
                       `${pkg.duration} ${pkg.durationUnit}`} • Up to {pkg.limits.users} users
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.packageId && (
            <span className="text-sm text-red-600 dark:text-red-400">Please select a package</span>
          )}
        </div>

        {/* Package Features Preview */}
        {selectedPackage && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              {selectedPackage.name} Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800 dark:text-blue-200">
              {selectedPackage.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Date Configuration */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Calendar className="inline h-4 w-4 mr-2" />
            Subscription Period
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Subscription Start *
              </Label>
              <Input
                {...register('startDate', { required: 'Start date is required' })}
                type="date"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                disabled={isReadOnly}
              />
              {errors.startDate && (
                <span className="text-sm text-red-600 dark:text-red-400">{errors.startDate.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {isLifetimePackage ? 'End Date (No expiry)' : 'Subscription End Date'}
              </Label>
              <Input
                {...register('endDate')}
                type="date"
                value={endDate || calculateEndDate}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                disabled={isReadOnly || isLifetimePackage}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isLifetimePackage ? 'Lifetime packages never expire' : 'Auto-calculated from package duration'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Discount & Coupon */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Percent className="inline h-4 w-4 mr-2" />
            Discount & Coupon
          </h4>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="discountCode" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Discount Code
              </Label>
              <Input
                {...register('discountCode')}
                placeholder="Enter discount code (e.g., SAVE25)"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                disabled={isReadOnly}
              />
              {discountCodeError && (
                <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {discountCodeError}
                </div>
              )}
              {validatedDiscountCode && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Valid discount code! {validatedDiscountCode.type === 'percentage' 
                      ? `${validatedDiscountCode.discount}% off` 
                      : `$${validatedDiscountCode.discount} off`
                    }
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Available codes: SAVE10 (10% off), SAVE25 (25% off), FLAT50 ($50 off), NEWCLIENT (15% off), EARLY2024 (30% off)
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment and Status Configuration */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <DollarSign className="inline h-4 w-4 mr-2" />
            Payment & Status
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Payment Status
              </Label>
              <Select 
                onValueChange={(value) => setValue('paymentStatus', value as any)} 
                defaultValue={watch('paymentStatus')}
                disabled={isReadOnly}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Subscription Status
              </Label>
              <Select 
                onValueChange={(value) => setValue('status', value as any)} 
                defaultValue={watch('status')}
                disabled={isReadOnly}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Auto Renew */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Auto Renewal
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically renew this subscription when it expires
              </p>
            </div>
            <Switch
              checked={watch('autoRenew')}
              onCheckedChange={(checked) => setValue('autoRenew', checked)}
              disabled={isReadOnly || isLifetimePackage}
            />
          </div>
        </div>

        <Separator />

        {/* Attachment */}
        <div className="space-y-2">
          <Label htmlFor="attachment" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Paperclip className="inline h-4 w-4 mr-2" />
            Attachment (Optional)
          </Label>
          <Input
            {...register('attachment')}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            disabled={isReadOnly}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG (max 10MB)
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Notes (Optional)
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="Admin reference notes..."
            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            rows={3}
            disabled={isReadOnly}
          />
        </div>

        {/* Pricing Summary */}
        {selectedPackage && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                <DollarSign className="inline h-4 w-4 mr-2" />
                Subscription Summary
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Package:</span>
                <span className="text-gray-900 dark:text-gray-100">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isLifetimePackage ? 'Lifetime' : `${selectedPackage.duration} ${selectedPackage.durationUnit}`}
                </span>
              </div>
              {selectedClient && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Client:</span>
                  <span className="text-gray-900 dark:text-gray-100">{selectedClient.name}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Original Amount:</span>
                <span className="text-gray-900 dark:text-gray-100">${calculateSubscriptionAmount.originalAmount}</span>
              </div>
              
              {validatedDiscountCode && calculateSubscriptionAmount.discountAmount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({validatedDiscountCode.code}):</span>
                    <span>-${calculateSubscriptionAmount.discountAmount}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span className="text-gray-900 dark:text-gray-100">Total Amount:</span>
                    <span className="text-gray-900 dark:text-gray-100">${calculateSubscriptionAmount.finalAmount}</span>
                  </div>
                </>
              )}
              
              {!validatedDiscountCode && (
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900 dark:text-gray-100">Total Amount:</span>
                  <span className="text-gray-900 dark:text-gray-100">${calculateSubscriptionAmount.originalAmount}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </DrawerForm>
  );
};
