
import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, Building2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DrawerForm } from '@/components/layout/DrawerForm';
import { ContactSearchSelect } from '@/components/shared/ContactSearchSelect';
import { CountrySelect } from '@/components/shared/CountrySelect';
import { CitySelect } from '@/components/shared/CitySelect';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contactId?: string;
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
  competitorInfo?: string;
  decisionMakers?: string;
  budget?: number;
  timeline?: string;
  painPoints?: string;
  proposalSent?: boolean;
  contractSent?: boolean;
  country?: string;
  city?: string;
  pipeline?: string;
  notes?: string;
  products?: ProductItem[];
  createdAt: string;
  lastActivity: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface OpportunityFormProps {
  isOpen: boolean;
  opportunity?: Opportunity | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  isOpen,
  opportunity,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactId: '',
    contact: '',
    email: '',
    phone: '',
    stage: 'prospecting',
    value: '',
    probability: '',
    expectedCloseDate: '',
    assignedTo: '',
    source: '',
    description: '',
    competitorInfo: '',
    decisionMakers: '',
    budget: '',
    timeline: '',
    painPoints: '',
    proposalSent: false,
    contractSent: false,
    country: '',
    city: '',
    pipeline: 'sales',
    notes: '',
    products: []
  });

  const [products, setProducts] = useState<ProductItem[]>([
    { id: '1', name: '', price: 0, quantity: 1, total: 0 }
  ]);

  useEffect(() => {
    if (opportunity) {
      setFormData({
        name: opportunity.name,
        company: opportunity.company,
        contactId: opportunity.contactId || '',
        contact: opportunity.contact,
        email: opportunity.email,
        phone: opportunity.phone,
        stage: opportunity.stage,
        value: opportunity.value.toString(),
        probability: opportunity.probability.toString(),
        expectedCloseDate: opportunity.expectedCloseDate,
        assignedTo: opportunity.assignedTo,
        source: opportunity.source,
        description: opportunity.description || '',
        competitorInfo: opportunity.competitorInfo || '',
        decisionMakers: opportunity.decisionMakers || '',
        budget: opportunity.budget?.toString() || '',
        timeline: opportunity.timeline || '',
        painPoints: opportunity.painPoints || '',
        proposalSent: opportunity.proposalSent || false,
        contractSent: opportunity.contractSent || false,
        country: opportunity.country || '',
        city: opportunity.city || '',
        pipeline: opportunity.pipeline || 'sales',
        notes: opportunity.notes || '',
        products: opportunity.products || []
      });
      setProducts(opportunity.products || [{ id: '1', name: '', price: 0, quantity: 1, total: 0 }]);
    } else {
      setFormData({
        name: '',
        company: '',
        contactId: '',
        contact: '',
        email: '',
        phone: '',
        stage: 'prospecting',
        value: '',
        probability: '',
        expectedCloseDate: '',
        assignedTo: '',
        source: '',
        description: '',
        competitorInfo: '',
        decisionMakers: '',
        budget: '',
        timeline: '',
        painPoints: '',
        proposalSent: false,
        contractSent: false,
        country: '',
        city: '',
        pipeline: 'sales',
        notes: '',
        products: []
      });
      setProducts([{ id: '1', name: '', price: 0, quantity: 1, total: 0 }]);
    }
  }, [opportunity, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactSelect = (contactId: string, contact: any) => {
    setFormData(prev => ({
      ...prev,
      contactId,
      contact: contact.firstName ? `${contact.firstName} ${contact.lastName}` : '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || prev.company,
      country: contact.country || prev.country,
      city: contact.city || prev.city,
      source: contact.source || prev.source,
      // Auto-fill opportunity name if not set
      name: prev.name || `${contact.company || 'Opportunity'} - ${contact.firstName} ${contact.lastName}`
    }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 0,
      budget: parseFloat(formData.budget) || undefined,
      products
    });
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
      description="Enter the opportunity details below"
      onSave={handleSave}
      saveText={opportunity ? 'Update Opportunity' : 'Create Opportunity'}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Opportunity Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter opportunity name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="company"
                  className="pl-10"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person *</Label>
              <ContactSearchSelect
                value={formData.contactId}
                onValueChange={handleContactSelect}
                placeholder="Search for contact..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Cold Email">Cold Email</SelectItem>
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <CountrySelect
                value={formData.country}
                onValueChange={(value) => handleInputChange('country', value)}
                placeholder="Select country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <CitySelect
                value={formData.city}
                onValueChange={(value) => handleInputChange('city', value)}
                country={formData.country}
                placeholder="Select city"
              />
            </div>
          </div>
        </div>

        {/* Opportunity Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Opportunity Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pipeline">Pipeline *</Label>
              <Select value={formData.pipeline} onValueChange={(value) => handleInputChange('pipeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Pipeline</SelectItem>
                  <SelectItem value="marketing">Marketing Pipeline</SelectItem>
                  <SelectItem value="customer-success">Customer Success Pipeline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage *</Label>
              <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {formData.pipeline === 'sales' && (
                    <>
                      <SelectItem value="prospecting">Prospecting</SelectItem>
                      <SelectItem value="qualification">Qualification</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed-won">Closed Won</SelectItem>
                      <SelectItem value="closed-lost">Closed Lost</SelectItem>
                    </>
                  )}
                  {formData.pipeline === 'marketing' && (
                    <>
                      <SelectItem value="lead-qualification">Lead Qualification</SelectItem>
                      <SelectItem value="nurturing">Nurturing</SelectItem>
                      <SelectItem value="content-creation">Content Creation</SelectItem>
                      <SelectItem value="proposal-review">Proposal Review</SelectItem>
                      <SelectItem value="closed-won">Closed Won</SelectItem>
                      <SelectItem value="closed-lost">Closed Lost</SelectItem>
                    </>
                  )}
                  {formData.pipeline === 'customer-success' && (
                    <>
                      <SelectItem value="requirements-gathering">Requirements Gathering</SelectItem>
                      <SelectItem value="implementation">Implementation</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="closed-won">Closed Won</SelectItem>
                      <SelectItem value="closed-lost">Closed Lost</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Deal Value ($) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="value"
                  type="number"
                  className="pl-10"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="probability">Win Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleInputChange('probability', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="expectedCloseDate"
                  type="date"
                  className="pl-10"
                  value={formData.expectedCloseDate}
                  onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                  <SelectItem value="David Brown">David Brown</SelectItem>
                  <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


        {/* Products/Services */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Products/Services</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newProduct = {
                  id: Date.now().toString(),
                  name: '',
                  price: 0,
                  quantity: 1,
                  total: 0
                };
                setProducts([...products, newProduct]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
          
          {products.map((product, index) => (
            <div key={product.id} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
              <div className="col-span-2 space-y-2">
                <Label htmlFor={`product-name-${index}`}>Product/Service Name</Label>
                <Input
                  id={`product-name-${index}`}
                  value={product.name}
                  onChange={(e) => {
                    const updatedProducts = products.map((p, i) =>
                      i === index ? { ...p, name: e.target.value } : p
                    );
                    setProducts(updatedProducts);
                  }}
                  placeholder="Enter product name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`product-price-${index}`}>Price ($)</Label>
                <Input
                  id={`product-price-${index}`}
                  type="number"
                  value={product.price}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value) || 0;
                    const updatedProducts = products.map((p, i) =>
                      i === index ? { ...p, price, total: price * p.quantity } : p
                    );
                    setProducts(updatedProducts);
                  }}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`product-quantity-${index}`}>Quantity</Label>
                <Input
                  id={`product-quantity-${index}`}
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => {
                    const quantity = parseInt(e.target.value) || 1;
                    const updatedProducts = products.map((p, i) =>
                      i === index ? { ...p, quantity, total: p.price * quantity } : p
                    );
                    setProducts(updatedProducts);
                  }}
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="space-y-2 flex-1">
                  <Label>Total</Label>
                  <div className="h-10 px-3 border rounded-md bg-gray-50 flex items-center">
                    ${(product.price * product.quantity).toFixed(2)}
                  </div>
                </div>
                {products.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProducts(products.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <div className="text-right">
            <div className="text-lg font-semibold">
              Total: ${products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Notes & Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Notes & Description</h3>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Internal notes and comments..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed opportunity description..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </DrawerForm>
  );
};
