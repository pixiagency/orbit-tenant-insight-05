
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface ProductService {
  id: string;
  name: string;
  type: 'product' | 'service';
  price: number;
}

interface OpportunityItem {
  productServiceId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OpportunityFormData {
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  description?: string;
  includeItems: boolean;
  items: OpportunityItem[];
}

// Mock products/services data
const PRODUCTS_SERVICES: ProductService[] = [
  { id: '1', name: 'Website Design', type: 'service', price: 2500 },
  { id: '2', name: 'Mobile App Development', type: 'service', price: 5000 },
  { id: '3', name: 'Software License', type: 'product', price: 199 },
  { id: '4', name: 'Consulting Hours', type: 'service', price: 150 },
  { id: '5', name: 'Hardware Equipment', type: 'product', price: 800 },
];

interface EnhancedOpportunityFormProps {
  isOpen: boolean;
  opportunity?: any;
  onClose: () => void;
  onSave: (data: OpportunityFormData) => void;
}

export const EnhancedOpportunityForm: React.FC<EnhancedOpportunityFormProps> = ({
  isOpen,
  opportunity,
  onClose,
  onSave,
}) => {
  const [includeItems, setIncludeItems] = useState(false);
  const [items, setItems] = useState<OpportunityItem[]>([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<OpportunityFormData>({
    defaultValues: {
      includeItems: false,
      items: [],
      value: 0
    }
  });

  // Calculate total value from items
  const calculateTotalValue = () => {
    if (!includeItems || items.length === 0) return 0;
    return items.reduce((total, item) => total + item.total, 0);
  };

  // Update opportunity value when items change
  useEffect(() => {
    if (includeItems) {
      const totalValue = calculateTotalValue();
      setValue('value', totalValue);
    }
  }, [items, includeItems, setValue]);

  const addItem = () => {
    setItems([...items, {
      productServiceId: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OpportunityItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If product/service changed, update unit price
    if (field === 'productServiceId') {
      const product = PRODUCTS_SERVICES.find(p => p.id === value);
      if (product) {
        newItems[index].unitPrice = product.price;
      }
    }

    // Recalculate total for this item
    if (field === 'quantity' || field === 'unitPrice' || field === 'productServiceId') {
      const item = newItems[index];
      const product = PRODUCTS_SERVICES.find(p => p.id === item.productServiceId);
      
      // Hide quantity for services
      if (product?.type === 'service') {
        item.quantity = 1;
      }
      
      item.total = item.quantity * item.unitPrice;
    }

    setItems(newItems);
  };

  const onSubmit = (data: OpportunityFormData) => {
    data.includeItems = includeItems;
    data.items = items;
    data.value = includeItems ? calculateTotalValue() : data.value;
    
    onSave(data);
    onClose();
  };

  const getProductService = (id: string) => {
    return PRODUCTS_SERVICES.find(p => p.id === id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">
            {opportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h2>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Opportunity Name *</Label>
              <Input {...register('name', { required: true })} />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input {...register('company', { required: true })} />
            </div>
            <div>
              <Label htmlFor="contact">Contact Person *</Label>
              <Input {...register('contact', { required: true })} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input {...register('email', { required: true })} type="email" />
            </div>
            <div>
              <Label htmlFor="stage">Stage *</Label>
              <Select onValueChange={(value) => setValue('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospecting">Prospecting</SelectItem>
                  <SelectItem value="qualification">Qualification</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                  <SelectItem value="closed-lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="probability">Probability (%)</Label>
              <Input {...register('probability', { valueAsNumber: true })} type="number" min="0" max="100" />
            </div>
          </div>

          {/* Include Items Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={includeItems}
              onCheckedChange={(checked) => setIncludeItems(checked as boolean)}
            />
            <Label>Include Products/Services</Label>
          </div>

          {/* Items Section */}
          {includeItems && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Products & Services</h3>
                <Button type="button" onClick={addItem} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => {
                const product = getProductService(item.productServiceId);
                const isService = product?.type === 'service';

                return (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Item {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Label>Product/Service *</Label>
                        <Select
                          value={item.productServiceId}
                          onValueChange={(value) => updateItem(index, 'productServiceId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product/service" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCTS_SERVICES.map((ps) => (
                              <SelectItem key={ps.id} value={ps.id}>
                                {ps.name} ({ps.type}) - ${ps.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {!isService && (
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                      )}

                      <div>
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-medium">
                        Total: ${item.total.toFixed(2)}
                        {isService && " (Service - No quantity)"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Total Value Display */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span className="font-medium">Total Opportunity Value:</span>
                  </div>
                  <span className="text-2xl font-bold">${calculateTotalValue().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Manual Value Input (when not including items) */}
          {!includeItems && (
            <div>
              <Label htmlFor="value">Opportunity Value *</Label>
              <Input {...register('value', { required: true, valueAsNumber: true })} type="number" step="0.01" />
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea {...register('description')} rows={3} />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {opportunity ? 'Update' : 'Create'} Opportunity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
