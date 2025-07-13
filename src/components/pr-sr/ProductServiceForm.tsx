
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  Target,
  Truck,
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface VariantOption {
  name: string;
  values: string;
  priceModifier: number;
}

interface CustomField {
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'Checkbox';
  value: string;
  required: boolean;
}

interface ProductServiceFormData {
  item_type: 'Product' | 'Service';
  // Basic Information
  name: string;
  sku: string;
  description: string;
  category: string;
  // Product Fields
  product_type?: 'Physical Item' | 'Digital Download';
  price: number;
  compare_price?: number;
  has_variants?: boolean;
  variant_options?: VariantOption[];
  // Service Fields
  service_type?: 'One-time Service' | 'Recurring Service';
  duration?: string;
  booking_required?: boolean;
  // Inventory & Stock
  track_inventory?: boolean;
  quantity?: number;
  low_stock_threshold?: number;
  allow_backorders?: boolean;
  unlimited_quantity?: boolean;
  // Shipping Settings
  requires_shipping?: boolean;
  weight?: number;
  weight_unit?: 'kg' | 'lb' | 'g' | 'oz';
  shipping_class?: 'Standard' | 'Express' | 'Free' | 'Heavy Item';
  free_shipping_over?: number;
  // Media Gallery
  featured_image?: string;
  gallery_images?: string[];
  product_video_url?: string;
  // Custom Fields
  add_custom_fields?: boolean;
  custom_fields?: CustomField[];
  // Final Settings
  status: 'Active' | 'Inactive' | 'Draft';
  featured?: boolean;
  tax_included?: boolean;
  seo_title?: string;
  seo_description?: string;
}

interface ProductServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductServiceFormData) => void;
  productService?: ProductServiceFormData | null;
}

const CATEGORIES = [
  'Software Solutions', 'Hardware Products', 'SaaS Platforms', 'Mobile Apps',
  'Enterprise Tools', 'Consumer Electronics', 'Industrial Equipment', 'Medical Devices',
  'Consulting Services', 'Training Programs', 'Support Services', 'Maintenance',
  'Implementation', 'Custom Development', 'Managed Services', 'Professional Services'
];

export const ProductServiceForm: React.FC<ProductServiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productService
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const form = useForm<ProductServiceFormData>({
    defaultValues: {
      item_type: 'Product',
      name: '',
      sku: '',
      description: '',
      category: '',
      price: 0,
      status: 'Active',
      has_variants: false,
      track_inventory: false,
      requires_shipping: false,
      add_custom_fields: false,
      unlimited_quantity: false,
      booking_required: false,
      featured: false,
      tax_included: false
    }
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;
  const watchedValues = watch();

  // Auto-generate SKU from name
  useEffect(() => {
    if (watchedValues.name && !productService) {
      const sku = watchedValues.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('sku', sku.toUpperCase());
    }
  }, [watchedValues.name, setValue, productService]);

  // Auto-populate SEO fields
  useEffect(() => {
    if (watchedValues.name && !productService) {
      setValue('seo_title', watchedValues.name.substring(0, 60));
    }
    if (watchedValues.description && !productService) {
      setValue('seo_description', watchedValues.description.substring(0, 160));
    }
  }, [watchedValues.name, watchedValues.description, setValue, productService]);

  useEffect(() => {
    if (productService) {
      reset(productService);
      setVariantOptions(productService.variant_options || []);
      setCustomFields(productService.custom_fields || []);
    } else {
      reset({
        item_type: 'Product',
        name: '',
        sku: '',
        description: '',
        category: '',
        price: 0,
        status: 'Active',
        has_variants: false,
        track_inventory: false,
        requires_shipping: false,
        add_custom_fields: false,
        unlimited_quantity: false,
        booking_required: false,
        featured: false,
        tax_included: false
      });
      setVariantOptions([]);
      setCustomFields([]);
    }
  }, [productService, reset, isOpen]);

  const validateForm = (data: ProductServiceFormData): string[] => {
    const errors: string[] = [];
    
    if (!data.name?.trim()) {
      errors.push('Name is required');
    }
    
    if (!data.description?.trim()) {
      errors.push('Description is required');
    }

    if (data.item_type === 'Product' && !data.product_type) {
      errors.push('Product type is required');
    }

    if (data.item_type === 'Service' && !data.service_type) {
      errors.push('Service type is required');
    }

    if (!data.price || data.price < 0) {
      errors.push('Valid price is required');
    }
    
    return errors;
  };

  const addVariantOption = () => {
    const newVariant: VariantOption = {
      name: '',
      values: '',
      priceModifier: 0
    };
    const updated = [...variantOptions, newVariant];
    setVariantOptions(updated);
    setValue('variant_options', updated);
  };

  const removeVariantOption = (index: number) => {
    const updated = variantOptions.filter((_, i) => i !== index);
    setVariantOptions(updated);
    setValue('variant_options', updated);
  };

  const updateVariantOption = (index: number, field: keyof VariantOption, value: string | number) => {
    const updated = variantOptions.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    );
    setVariantOptions(updated);
    setValue('variant_options', updated);
  };

  const addCustomField = () => {
    const newField: CustomField = {
      name: '',
      type: 'Text',
      value: '',
      required: false
    };
    const updated = [...customFields, newField];
    setCustomFields(updated);
    setValue('custom_fields', updated);
  };

  const removeCustomField = (index: number) => {
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
    setValue('custom_fields', updated);
  };

  const updateCustomField = (index: number, field: keyof CustomField, value: string | boolean) => {
    const updated = customFields.map((field_item, i) => 
      i === index ? { ...field_item, [field]: value } : field_item
    );
    setCustomFields(updated);
    setValue('custom_fields', updated);
  };

  const onFormSubmit = (data: ProductServiceFormData) => {
    const validationErrors = validateForm(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setValidationErrors([]);
    data.variant_options = variantOptions;
    data.custom_fields = customFields;
    
    onSubmit(data);
    toast.success(productService ? 'Product/Service updated successfully!' : 'Product/Service created successfully!');
    onClose();
  };

  const isProduct = watchedValues.item_type === 'Product';
  const isService = watchedValues.item_type === 'Service';
  const isPhysicalProduct = isProduct && watchedValues.product_type === 'Physical Item';

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
      <form className="space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* What Are You Adding */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-semibold flex items-center mb-4">
            <Target className="h-5 w-5 mr-2" />
            What Are You Adding?
          </h4>
          
          <div className="space-y-2">
            <Label>Item Type <span className="text-destructive">*</span></Label>
            <RadioGroup
              value={watchedValues.item_type}
              onValueChange={(value) => setValue('item_type', value as 'Product' | 'Service')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Product" id="product" />
                <Label htmlFor="product" className="flex items-center space-x-1 cursor-pointer">
                  <Package className="h-4 w-4" />
                  <span>Product</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Service" id="service" />
                <Label htmlFor="service" className="flex items-center space-x-1 cursor-pointer">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Service</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Basic Information */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-semibold flex items-center mb-4">
            <FileText className="h-5 w-5 mr-2" />
            Basic Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register('name', { required: true })}
                placeholder="Enter product/service name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                {...register('sku')}
                placeholder="Auto-generated from name"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                {...register('description', { required: true })}
                placeholder="Enter detailed description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue('category', value)} value={watchedValues.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Fields */}
        {isProduct && (
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold flex items-center mb-4">
              <Package className="h-5 w-5 mr-2" />
              Product Details
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Type <span className="text-destructive">*</span></Label>
                <RadioGroup
                  value={watchedValues.product_type || ''}
                  onValueChange={(value) => setValue('product_type', value as 'Physical Item' | 'Digital Download')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Physical Item" id="physical" />
                    <Label htmlFor="physical">Physical Item</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Digital Download" id="digital" />
                    <Label htmlFor="digital">Digital Download</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...register('price', { valueAsNumber: true, required: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_price">Compare Price</Label>
                  <Input
                    {...register('compare_price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={watchedValues.has_variants}
                  onCheckedChange={(checked) => setValue('has_variants', !!checked)}
                />
                <Label>Enable product variants</Label>
              </div>

              {/* Variant Options */}
              {watchedValues.has_variants && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Product Variants</Label>
                    <Button type="button" onClick={addVariantOption} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Variant
                    </Button>
                  </div>
                  
                  {variantOptions.map((variant, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-lg bg-background">
                      <div className="space-y-1">
                        <Label className="text-xs">Variant Name</Label>
                        <Input
                          placeholder="e.g., Size, Color"
                          value={variant.name}
                          onChange={(e) => updateVariantOption(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Values (comma-separated)</Label>
                        <Input
                          placeholder="e.g., S,M,L or Red,Blue"
                          value={variant.values}
                          onChange={(e) => updateVariantOption(index, 'values', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price Modifier</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={variant.priceModifier}
                          onChange={(e) => updateVariantOption(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          onClick={() => removeVariantOption(index)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Service Fields */}
        {isService && (
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold flex items-center mb-4">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Service Details
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Service Type <span className="text-destructive">*</span></Label>
                <RadioGroup
                  value={watchedValues.service_type || ''}
                  onValueChange={(value) => setValue('service_type', value as 'One-time Service' | 'Recurring Service')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="One-time Service" id="onetime" />
                    <Label htmlFor="onetime">One-time Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Recurring Service" id="recurring" />
                    <Label htmlFor="recurring">Recurring Service</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...register('price', { valueAsNumber: true, required: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_price">Compare Price</Label>
                  <Input
                    {...register('compare_price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    {...register('duration')}
                    placeholder="e.g., 2 hours, 1 month"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={watchedValues.booking_required}
                  onCheckedChange={(checked) => setValue('booking_required', !!checked)}
                />
                <Label>Booking required</Label>
              </div>
            </div>
          </div>
        )}

        {/* Inventory & Stock - Physical Products only */}
        {isPhysicalProduct && (
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold flex items-center mb-4">
              <Package className="h-5 w-5 mr-2" />
              Inventory & Stock
            </h4>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={watchedValues.track_inventory}
                  onCheckedChange={(checked) => setValue('track_inventory', !!checked)}
                />
                <Label>Track inventory</Label>
              </div>

              {watchedValues.track_inventory && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      {...register('quantity', { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                    <Input
                      {...register('low_stock_threshold', { valueAsNumber: true })}
                      type="number"
                      placeholder="5"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      checked={watchedValues.allow_backorders}
                      onCheckedChange={(checked) => setValue('allow_backorders', !!checked)}
                    />
                    <Label>Allow backorders</Label>
                  </div>
                </div>
              )}

              {!isPhysicalProduct && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={watchedValues.unlimited_quantity}
                    onCheckedChange={(checked) => setValue('unlimited_quantity', !!checked)}
                  />
                  <Label>Unlimited quantity</Label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shipping Settings - Physical Products only */}
        {isPhysicalProduct && (
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold flex items-center mb-4">
              <Truck className="h-5 w-5 mr-2" />
              Shipping Settings
            </h4>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={watchedValues.requires_shipping}
                  onCheckedChange={(checked) => setValue('requires_shipping', !!checked)}
                />
                <Label>Requires shipping</Label>
              </div>

              {watchedValues.requires_shipping && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      {...register('weight', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight_unit">Weight Unit</Label>
                    <Select onValueChange={(value) => setValue('weight_unit', value as any)} value={watchedValues.weight_unit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">lb</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="oz">oz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping_class">Shipping Class</Label>
                    <Select onValueChange={(value) => setValue('shipping_class', value as any)} value={watchedValues.shipping_class}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Express">Express</SelectItem>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Heavy Item">Heavy Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="free_shipping_over">Free Shipping Over</Label>
                    <Input
                      {...register('free_shipping_over', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Gallery */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-semibold flex items-center mb-4">
            <ImageIcon className="h-5 w-5 mr-2" />
            Media Gallery
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="featured_image">
                Featured Image <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register('featured_image')}
                type="file"
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery_images">Gallery Images (up to 10)</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_video_url">Product Video URL</Label>
              <Input
                {...register('product_video_url')}
                placeholder="YouTube, Vimeo, or direct link"
              />
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-semibold flex items-center mb-4">
            <Settings className="h-5 w-5 mr-2" />
            Custom Fields
          </h4>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={watchedValues.add_custom_fields}
                onCheckedChange={(checked) => setValue('add_custom_fields', !!checked)}
              />
              <Label>Enable custom fields</Label>
            </div>

            {watchedValues.add_custom_fields && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Custom Fields</Label>
                  <Button type="button" onClick={addCustomField} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </Button>
                </div>
                
                {customFields.map((field, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border rounded-lg bg-background">
                    <div className="space-y-1">
                      <Label className="text-xs">Field Name</Label>
                      <Input
                        placeholder="Field name"
                        value={field.name}
                        onChange={(e) => updateCustomField(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Field Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value) => updateCustomField(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Text">Text</SelectItem>
                          <SelectItem value="Number">Number</SelectItem>
                          <SelectItem value="Date">Date</SelectItem>
                          <SelectItem value="Dropdown">Dropdown</SelectItem>
                          <SelectItem value="Checkbox">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Value</Label>
                      <Input
                        placeholder="Field value"
                        value={field.value}
                        onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox
                        checked={field.required}
                        onCheckedChange={(checked) => updateCustomField(index, 'required', !!checked)}
                      />
                      <Label className="text-xs">Required</Label>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={() => removeCustomField(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Final Settings */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-semibold flex items-center mb-4">
            <Star className="h-5 w-5 mr-2" />
            Final Settings
          </h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={watchedValues.status}
                onValueChange={(value) => setValue('status', value as 'Active' | 'Inactive' | 'Draft')}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Active" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inactive" id="inactive" />
                  <Label htmlFor="inactive">Inactive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Draft" id="draft" />
                  <Label htmlFor="draft">Draft</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={watchedValues.featured}
                  onCheckedChange={(checked) => setValue('featured', !!checked)}
                />
                <Label>Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={watchedValues.tax_included}
                  onCheckedChange={(checked) => setValue('tax_included', !!checked)}
                />
                <Label>Tax included</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title (60 chars)</Label>
                <Input
                  {...register('seo_title')}
                  placeholder="Auto-populated from name"
                  maxLength={60}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Description (160 chars)</Label>
                <Textarea
                  {...register('seo_description')}
                  placeholder="Auto-populated from description"
                  maxLength={160}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};
