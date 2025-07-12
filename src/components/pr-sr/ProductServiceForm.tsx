
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DrawerForm } from '../layout/DrawerForm';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Tag,
  FileText,
  Settings,
  Star,
  AlertCircle,
  Calendar,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductService } from '@/types/products-services';

interface ProductServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productService: ProductService) => void;
  productService?: ProductService | null;
}

const CATEGORIES = [
  'Software Solutions', 'Hardware Products', 'SaaS Platforms', 'Mobile Apps',
  'Enterprise Tools', 'Consumer Electronics', 'Industrial Equipment', 'Medical Devices',
  'Consulting Services', 'Training Programs', 'Support Services', 'Maintenance',
  'Implementation', 'Custom Development', 'Managed Services', 'Professional Services'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
const SUPPORT_LEVELS = ['Basic', 'Standard', 'Premium', 'Enterprise'];
const STATUSES = ['Active', 'Inactive', 'Discontinued', 'Coming Soon'];
const AVAILABILITY_OPTIONS = ['In Stock', 'Out of Stock', 'On Demand', 'Limited'];
const TARGET_MARKETS = ['Enterprise', 'SMB', 'Individual', 'Government', 'Healthcare', 'Education', 'Retail'];

export const ProductServiceForm: React.FC<ProductServiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productService
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'product' | 'service'>('product');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTargetMarkets, setSelectedTargetMarkets] = useState<string[]>([]);
  const [customSpecifications, setCustomSpecifications] = useState<{[key: string]: string}>({});

  const form = useForm<ProductService>({
    defaultValues: {
      name: '',
      type: 'product',
      category: '',
      description: '',
      price: 0,
      currency: 'USD',
      sku: '',
      status: 'Active',
      features: [],
      specifications: {},
      availability: 'In Stock',
      minimum_order_quantity: 1,
      lead_time: '',
      warranty_period: '',
      support_level: 'Standard',
      tags: [],
      created_date: new Date().toISOString().split('T')[0],
      modified_date: new Date().toISOString().split('T')[0],
      target_market: [],
      competitor_products: []
    }
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  useEffect(() => {
    if (productService) {
      reset(productService);
      setSelectedType(productService.type);
      setSelectedFeatures(productService.features || []);
      setSelectedTargetMarkets(productService.target_market || []);
      setCustomSpecifications(productService.specifications || {});
    } else {
      reset({
        name: '',
        type: 'product',
        category: '',
        description: '',
        price: 0,
        currency: 'USD',
        sku: '',
        status: 'Active',
        features: [],
        specifications: {},
        availability: 'In Stock',
        minimum_order_quantity: 1,
        lead_time: '',
        warranty_period: '',
        support_level: 'Standard',
        tags: [],
        created_date: new Date().toISOString().split('T')[0],
        modified_date: new Date().toISOString().split('T')[0],
        target_market: [],
        competitor_products: []
      });
      setSelectedType('product');
      setSelectedFeatures([]);
      setSelectedTargetMarkets([]);
      setCustomSpecifications({});
    }
  }, [productService, reset, isOpen]);

  const validateForm = (data: ProductService): string[] => {
    const errors: string[] = [];
    
    if (!data.name?.trim()) {
      errors.push('Product/Service name is required');
    }
    
    if (!data.category?.trim()) {
      errors.push('Category is required');
    }
    
    if (data.price && data.price < 0) {
      errors.push('Price cannot be negative');
    }
    
    return errors;
  };

  const handleTypeChange = (type: 'product' | 'service') => {
    setSelectedType(type);
    setValue('type', type);
  };

  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    
    setSelectedFeatures(updatedFeatures);
    setValue('features', updatedFeatures);
  };

  const handleTargetMarketToggle = (market: string) => {
    const updatedMarkets = selectedTargetMarkets.includes(market)
      ? selectedTargetMarkets.filter(m => m !== market)
      : [...selectedTargetMarkets, market];
    
    setSelectedTargetMarkets(updatedMarkets);
    setValue('target_market', updatedMarkets);
  };

  const addSpecification = (key: string, value: string) => {
    if (key && value) {
      const updated = { ...customSpecifications, [key]: value };
      setCustomSpecifications(updated);
      setValue('specifications', updated);
    }
  };

  const removeSpecification = (key: string) => {
    const updated = { ...customSpecifications };
    delete updated[key];
    setCustomSpecifications(updated);
    setValue('specifications', updated);
  };

  const onFormSubmit = (data: ProductService) => {
    const validationErrors = validateForm(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setValidationErrors([]);
    data.features = selectedFeatures;
    data.target_market = selectedTargetMarkets;
    data.specifications = customSpecifications;
    data.modified_date = new Date().toISOString().split('T')[0];
    
    onSubmit(data);
    toast.success(productService ? 'Product/Service updated successfully!' : 'Product/Service created successfully!');
    onClose();
  };

  const availableFeatures = selectedType === 'product' 
    ? ['Cloud-based', 'Mobile Compatible', 'API Integration', 'Multi-language', 'Scalable', 'Secure', 'Real-time', 'Analytics']
    : ['24/7 Support', 'On-site Service', 'Remote Support', 'Training Included', 'Custom Implementation', 'Consultation', 'Maintenance', 'Documentation'];

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={productService ? 'Edit Product/Service' : 'Add New Product/Service'}
      description={productService ? 'Update the product/service information below.' : 'Enter the details for your product or service.'}
      onSave={handleSubmit(onFormSubmit)}
      saveText={productService ? 'Update Product/Service' : 'Create Product/Service'}
      width="wide"
    >
      <form className="space-y-8">
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

        {/* Basic Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('name', { required: true })}
                  placeholder="Enter product/service name"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="product"
                      checked={selectedType === 'product'}
                      onChange={() => handleTypeChange('product')}
                      className="text-blue-600"
                    />
                    <Label htmlFor="product" className="flex items-center space-x-1 cursor-pointer">
                      <Package className="h-4 w-4" />
                      <span>Product</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="service"
                      checked={selectedType === 'service'}
                      onChange={() => handleTypeChange('service')}
                      className="text-blue-600"
                    />
                    <Label htmlFor="service" className="flex items-center space-x-1 cursor-pointer">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Service</span>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('category', value)} defaultValue={watch('category')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
                <Input
                  {...register('sku')}
                  placeholder="Product/Service SKU"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Enter detailed description..."
                rows={4}
                className="bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Pricing & Availability
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                <Input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                <Select onValueChange={(value) => setValue('currency', value)} defaultValue={watch('currency')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability" className="text-sm font-medium">Availability</Label>
                <Select onValueChange={(value) => setValue('availability', value as any)} defaultValue={watch('availability')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="minimum_order_quantity" className="text-sm font-medium">Minimum Order Quantity</Label>
                <Input
                  {...register('minimum_order_quantity', { valueAsNumber: true })}
                  type="number"
                  placeholder="1"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead_time" className="text-sm font-medium">Lead Time</Label>
                <Input
                  {...register('lead_time')}
                  placeholder="e.g., 2-3 weeks"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status & Support */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Settings className="h-5 w-5 mr-2 text-purple-600" />
              Status & Support
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={watch('status')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_level" className="text-sm font-medium">Support Level</Label>
                <Select onValueChange={(value) => setValue('support_level', value as any)} defaultValue={watch('support_level')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select support level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORT_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty_period" className="text-sm font-medium">Warranty Period</Label>
                <Input
                  {...register('warranty_period')}
                  placeholder="e.g., 1 year"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features & Target Markets */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Star className="h-5 w-5 mr-2 text-orange-600" />
              Features & Target Markets
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Key Features</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label className="text-sm cursor-pointer">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Target Markets</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {TARGET_MARKETS.map((market) => (
                    <div key={market} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedTargetMarkets.includes(market)}
                        onCheckedChange={() => handleTargetMarketToggle(market)}
                      />
                      <Label className="text-sm cursor-pointer">{market}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};
