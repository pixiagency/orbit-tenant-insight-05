
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DrawerForm } from '../layout/DrawerForm';
import { ContactSearchSelect } from '../shared/ContactSearchSelect';
import { 
  Target, 
  Building, 
  DollarSign,
  Calendar,
  Users,
  CreditCard,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

interface DealFormData {
  deal_type: 'product_sale' | 'service_sale' | 'subscription';
  deal_name: string;
  customer: string;
  deal_value: number;
  sale_date: string;
  include_items: boolean;
  items: Array<{
    item: string;
    quantity?: number;
    unit_price: number;
  }>;
  sales_rep: string;
  payment_status: 'paid' | 'pending' | 'partial';
  payment_method?: 'cash' | 'card' | 'bank_transfer' | 'check';
  notes?: string;
  // Subscription-specific fields
  recurring_amount?: number;
  billing_cycle?: 'monthly' | 'quarterly' | 'yearly';
  subscription_start?: string;
  subscription_end?: string;
}

interface DealDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: DealFormData) => void;
  deal?: DealFormData | null;
}

// Mock data - replace with actual data from your backend
const CUSTOMERS = [
  { id: '1', name: 'ABC Corp', type: 'company' },
  { id: '2', name: 'XYZ Ltd', type: 'company' },
  { id: '3', name: 'John Smith', type: 'contact' },
];

const PRODUCTS = [
  { id: '1', name: 'Website Design', price: 2500 },
  { id: '2', name: 'Mobile App', price: 5000 },
  { id: '3', name: 'Logo Design', price: 500 },
];

const SERVICES = [
  { id: '1', name: 'Consulting Hours', price: 150 },
  { id: '2', name: 'Marketing Strategy', price: 2000 },
  { id: '3', name: 'SEO Audit', price: 800 },
];

const SUBSCRIPTIONS = [
  { id: '1', name: 'Monthly Maintenance', price: 200 },
  { id: '2', name: 'Cloud Hosting', price: 50 },
  { id: '3', name: 'Support Package', price: 300 },
];

const SALES_REPS = [
  'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Brown', 'Alex Thompson'
];

export const DealDrawerForm: React.FC<DealDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  deal
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [items, setItems] = useState<Array<{ item: string; quantity?: number; unit_price: number }>>([]);

  const form = useForm<DealFormData>({
    defaultValues: {
      deal_type: 'product_sale',
      deal_name: '',
      customer: '',
      deal_value: 0,
      sale_date: new Date().toISOString().split('T')[0],
      include_items: false,
      items: [],
      sales_rep: '',
      payment_status: 'pending',
      payment_method: undefined,
      notes: '',
      recurring_amount: 0,
      billing_cycle: 'monthly',
      subscription_start: '',
      subscription_end: ''
    }
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  const dealType = watch('deal_type');
  const includeItems = watch('include_items');
  const customerValue = watch('customer');

  // Calculate total deal value based on items
  const calculateDealValue = () => {
    if (!includeItems || items.length === 0) {
      return 0;
    }

    return items.reduce((total, item) => {
      const quantity = dealType === 'product_sale' ? (item.quantity || 1) : 1;
      return total + (item.unit_price * quantity);
    }, 0);
  };

  // Auto-update deal value when items change
  useEffect(() => {
    if (includeItems && items.length > 0) {
      const calculatedValue = calculateDealValue();
      setValue('deal_value', calculatedValue);
    }
  }, [items, includeItems, dealType, setValue]);

  useEffect(() => {
    if (deal) {
      reset(deal);
      setItems(deal.items || []);
    } else {
      reset({
        deal_type: 'product_sale',
        deal_name: '',
        customer: '',
        deal_value: 0,
        sale_date: new Date().toISOString().split('T')[0],
        include_items: false,
        items: [],
        sales_rep: '',
        payment_status: 'pending',
        payment_method: undefined,
        notes: '',
        recurring_amount: 0,
        billing_cycle: 'monthly',
        subscription_start: '',
        subscription_end: ''
      });
      setItems([]);
    }
  }, [deal, reset, isOpen]);

  // Auto-generate deal name based on customer selection
  useEffect(() => {
    if (customerValue && !deal) {
      const customer = CUSTOMERS.find(c => c.id === customerValue);
      if (customer) {
        const dealTypeText = dealType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        setValue('deal_name', `${dealTypeText} for ${customer.name}`);
      }
    }
  }, [customerValue, dealType, setValue, deal]);

  const validateForm = (data: DealFormData): string[] => {
    const errors: string[] = [];
    
    if (!data.deal_type) errors.push('Deal type is required');
    if (!data.deal_name?.trim()) errors.push('Deal name is required');
    if (!data.customer) errors.push('Customer is required');
    if (!data.deal_value || data.deal_value <= 0) errors.push('Deal value must be greater than 0');
    if (!data.sale_date) errors.push('Sale date is required');
    if (!data.sales_rep) errors.push('Sales representative is required');
    if (!data.payment_status) errors.push('Payment status is required');
    
    if (data.deal_type === 'subscription') {
      if (!data.recurring_amount || data.recurring_amount <= 0) {
        errors.push('Recurring amount is required for subscriptions');
      }
      if (!data.billing_cycle) errors.push('Billing cycle is required for subscriptions');
      if (!data.subscription_start) errors.push('Subscription start date is required');
    }
    
    return errors;
  };

  const onFormSubmit = (data: DealFormData) => {
    const validationErrors = validateForm(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setValidationErrors([]);
    data.items = items;
    
    onSave(data);
    toast.success(deal ? 'Deal updated successfully!' : 'Deal created successfully!');
    onClose();
  };

  const addItem = () => {
    setItems([...items, { item: '', quantity: dealType === 'product_sale' ? 1 : undefined, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const getAvailableItems = () => {
    switch (dealType) {
      case 'product_sale': return PRODUCTS;
      case 'service_sale': return SERVICES;
      case 'subscription': return SUBSCRIPTIONS;
      default: return [];
    }
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? 'Edit Deal' : 'Add New Deal'}
      description={deal ? 'Update the deal information below.' : 'Enter the deal information below.'}
      onSave={handleSubmit(onFormSubmit)}
      saveText={deal ? 'Update Deal' : 'Create Deal'}
    >
      <form className="space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Deal Type */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Deal Type
          </h4>
          <RadioGroup
            value={watch('deal_type')}
            onValueChange={(value) => setValue('deal_type', value as any)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="product_sale" id="product_sale" />
              <Label htmlFor="product_sale" className="cursor-pointer font-medium">Product Sale</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="service_sale" id="service_sale" />
              <Label htmlFor="service_sale" className="cursor-pointer font-medium">Service Sale</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="subscription" id="subscription" />
              <Label htmlFor="subscription" className="cursor-pointer font-medium">Subscription</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Basic Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal_name" className="text-sm font-medium">
                Deal Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('deal_name', { required: true })}
                placeholder="Website Design for ABC Corp"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Customer <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue('customer', value)} value={watch('customer')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMERS.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deal_value" className="text-sm font-medium flex items-center">
                Deal Value <span className="text-red-500">*</span>
                {includeItems && items.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    <Calculator className="h-3 w-3 mr-1" />
                    Auto-calculated
                  </Badge>
                )}
              </Label>
              <Input
                {...register('deal_value', { required: true, valueAsNumber: true })}
                type="number"
                placeholder="5000"
                min="0"
                step="0.01"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                readOnly={includeItems && items.length > 0}
              />
              {includeItems && items.length > 0 && (
                <p className="text-xs text-gray-500">Value is automatically calculated from items below</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_date" className="text-sm font-medium">
                Sale Date <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('sale_date', { required: true })}
                type="date"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Subscription-specific fields */}
        {dealType === 'subscription' && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Subscription Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recurring_amount" className="text-sm font-medium">
                    Recurring Amount <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('recurring_amount', { valueAsNumber: true })}
                    type="number"
                    placeholder="200"
                    min="0"
                    step="0.01"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Billing Cycle <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => setValue('billing_cycle', value as any)} value={watch('billing_cycle')}>
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subscription_start" className="text-sm font-medium">
                    Subscription Start <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('subscription_start')}
                    type="date"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subscription_end" className="text-sm font-medium">Subscription End</Label>
                  <Input
                    {...register('subscription_end')}
                    type="date"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Products/Services */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={includeItems}
              onCheckedChange={(checked) => setValue('include_items', checked as boolean)}
            />
            <Label className="text-sm font-medium">Include Items</Label>
          </div>

          {includeItems && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium">Items</h5>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Item</Label>
                      <Select 
                        onValueChange={(value) => {
                          const selectedItem = getAvailableItems().find(i => i.id === value);
                          updateItem(index, 'item', value);
                          if (selectedItem) {
                            updateItem(index, 'unit_price', selectedItem.price);
                          }
                        }} 
                        value={item.item}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableItems().map((availableItem) => (
                            <SelectItem key={availableItem.id} value={availableItem.id}>
                              {availableItem.name} - ${availableItem.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {dealType === 'product_sale' && (
                      <div className="space-y-2">
                        <Label className="text-sm">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm">Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Show item total */}
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      Total: ${((item.unit_price || 0) * (dealType === 'product_sale' ? (item.quantity || 1) : 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Show grand total */}
              {items.length > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Deal Value:</span>
                    <span className="text-lg font-bold">${calculateDealValue().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Assignment */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Assignment
          </h4>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Sales Representative <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(value) => setValue('sales_rep', value)} value={watch('sales_rep')}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select sales rep" />
              </SelectTrigger>
              <SelectContent>
                {SALES_REPS.map((rep) => (
                  <SelectItem key={rep} value={rep}>
                    {rep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Payment & Status */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment & Status
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Payment Status <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={watch('payment_status')}
                onValueChange={(value) => setValue('payment_status', value as any)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Paid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <Label htmlFor="partial">Partial</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Method</Label>
              <Select onValueChange={(value) => setValue('payment_method', value as any)} value={watch('payment_method')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              {...register('notes')}
              rows={3}
              placeholder="Additional notes about this deal..."
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};
