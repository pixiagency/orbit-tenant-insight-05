import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface LineItem {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  listPrice: number;
  discountPercentage: number;
  discountAmount: number;
  lineTotal: number;
  category: string;
  family: string;
  subscriptionDuration: number;
  licenseType: string;
}

interface DealFormData {
  // Essential Deal Information
  dealName: string;
  dealValue: number;
  closeDate: Date | undefined;
  stage: string;
  owner: string;
  
  // Contact and Account Fields
  primaryAccount: string;
  primaryContact: string;
  additionalContacts: string[];
  leadSource: string;
  contactRole: string;
  
  // Extended Deal Information
  dealType: string;
  description: string;
  nextSteps: string;
  competitors: string[];
  decisionCriteria: string;
  budgetAuthority: boolean;
  timelineStart: Date | undefined;
  timelineEnd: Date | undefined;
  
  // Sales Process Management
  salesStage: string;
  stageDuration: number;
  stageProbability: number;
  previousStage: string;
  stageEntryDate: Date | undefined;
  stageExitCriteria: string;
  
  // Activity Tracking
  lastActivityDate: Date | undefined;
  daysSinceLastActivity: number;
  nextActivityDate: Date | undefined;
  activityCount: number;
  emailInteractions: number;
  
  // Lead Qualification (BANT/MEDDIC)
  budgetConfirmed: boolean;
  authorityIdentified: boolean;
  needEstablished: boolean;
  timelineDefined: boolean;
  decisionProcess: string;
  economicBuyer: string;
  champion: string;
  competition: string[];
  
  // Business Impact Assessment
  painPoints: string[];
  roiExpectations: string;
  successMetrics: string;
  implementationRisk: string;
  technicalComplexity: string;
  
  // Products and Services
  lineItems: LineItem[];
  
  // Service Details
  serviceStartDate: Date | undefined;
  serviceEndDate: Date | undefined;
  billingFrequency: string;
  implementationTimeline: number;
  supportLevel: string;
  trainingIncluded: boolean;
  professionalServices: number;
  
  // Financial and Forecasting
  totalContractValue: number;
  annualContractValue: number;
  oneTimeRevenue: number;
  recurringRevenue: number;
  commissionAmount: number;
  totalDiscount: number;
  marginPercentage: number;
  
  // Forecasting
  forecastCategory: string;
  weightedAmount: number;
  expectedRevenue: number;
  forecastDate: Date | undefined;
  confidenceLevel: string;
  riskFactors: string[];
  
  // Financial Terms
  paymentTerms: string;
  contractLength: number;
  renewalTerms: string;
  currency: string;
  exchangeRate: number;
  
  // Deal Intelligence
  dealScore: number;
  engagementScore: number;
  fitScore: number;
  velocityScore: number;
  riskScore: number;
  
  // Collaboration
  dealTeam: string[];
  teamRoles: string;
  stakeholderMap: string;
  internalNotes: string;
  customerFacingNotes: string;
}

interface EnhancedDealFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DealFormData) => void;
  initialData?: Partial<DealFormData>;
}

export const EnhancedDealForm: React.FC<EnhancedDealFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<DealFormData>({
    // Essential Deal Information
    dealName: '',
    dealValue: 0,
    closeDate: undefined,
    stage: '',
    owner: '',
    
    // Contact and Account Fields
    primaryAccount: '',
    primaryContact: '',
    additionalContacts: [],
    leadSource: '',
    contactRole: '',
    
    // Extended Deal Information
    dealType: '',
    description: '',
    nextSteps: '',
    competitors: [],
    decisionCriteria: '',
    budgetAuthority: false,
    timelineStart: undefined,
    timelineEnd: undefined,
    
    // Sales Process Management
    salesStage: '',
    stageDuration: 0,
    stageProbability: 0,
    previousStage: '',
    stageEntryDate: undefined,
    stageExitCriteria: '',
    
    // Activity Tracking
    lastActivityDate: undefined,
    daysSinceLastActivity: 0,
    nextActivityDate: undefined,
    activityCount: 0,
    emailInteractions: 0,
    
    // Lead Qualification (BANT/MEDDIC)
    budgetConfirmed: false,
    authorityIdentified: false,
    needEstablished: false,
    timelineDefined: false,
    decisionProcess: '',
    economicBuyer: '',
    champion: '',
    competition: [],
    
    // Business Impact Assessment
    painPoints: [],
    roiExpectations: '',
    successMetrics: '',
    implementationRisk: '',
    technicalComplexity: '',
    
    // Products and Services
    lineItems: [],
    
    // Service Details
    serviceStartDate: undefined,
    serviceEndDate: undefined,
    billingFrequency: '',
    implementationTimeline: 0,
    supportLevel: '',
    trainingIncluded: false,
    professionalServices: 0,
    
    // Financial and Forecasting
    totalContractValue: 0,
    annualContractValue: 0,
    oneTimeRevenue: 0,
    recurringRevenue: 0,
    commissionAmount: 0,
    totalDiscount: 0,
    marginPercentage: 0,
    
    // Forecasting
    forecastCategory: '',
    weightedAmount: 0,
    expectedRevenue: 0,
    forecastDate: undefined,
    confidenceLevel: '',
    riskFactors: [],
    
    // Financial Terms
    paymentTerms: '',
    contractLength: 0,
    renewalTerms: '',
    currency: 'USD',
    exchangeRate: 1,
    
    // Deal Intelligence
    dealScore: 0,
    engagementScore: 0,
    fitScore: 0,
    velocityScore: 0,
    riskScore: 0,
    
    // Collaboration
    dealTeam: [],
    teamRoles: '',
    stakeholderMap: '',
    internalNotes: '',
    customerFacingNotes: '',
    
    ...initialData
  });

  const [activeTab, setActiveTab] = useState('essentials');

  const handleInputChange = (field: keyof DealFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLineItem = () => {
    const newLineItem: LineItem = {
      id: Date.now().toString(),
      productName: '',
      productCode: '',
      quantity: 1,
      unitPrice: 0,
      listPrice: 0,
      discountPercentage: 0,
      discountAmount: 0,
      lineTotal: 0,
      category: '',
      family: '',
      subscriptionDuration: 12,
      licenseType: ''
    };
    
    handleInputChange('lineItems', [...formData.lineItems, newLineItem]);
  };

  const removeLineItem = (id: string) => {
    handleInputChange('lineItems', formData.lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = formData.lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    handleInputChange('lineItems', updatedItems);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const DatePicker = ({ value, onChange, placeholder }: { 
    value: Date | undefined; 
    onChange: (date: Date | undefined) => void; 
    placeholder: string 
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Deal Management Form</SheetTitle>
          <SheetDescription>
            Complete deal information with advanced tracking and management
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="essentials">Essentials</TabsTrigger>
              <TabsTrigger value="qualification">Qualification</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>

            {/* Essential Deal Information */}
            <TabsContent value="essentials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Essential Deal Information</CardTitle>
                  <CardDescription>Core required fields for the deal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dealName">Deal Name *</Label>
                      <Input
                        id="dealName"
                        value={formData.dealName}
                        onChange={(e) => handleInputChange('dealName', e.target.value)}
                        placeholder="Enter deal name"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealValue">Deal Value *</Label>
                      <Input
                        id="dealValue"
                        type="number"
                        value={formData.dealValue}
                        onChange={(e) => handleInputChange('dealValue', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Close Date *</Label>
                      <DatePicker
                        value={formData.closeDate}
                        onChange={(date) => handleInputChange('closeDate', date)}
                        placeholder="Select close date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stage">Stage *</Label>
                      <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
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
                  </div>

                  <div>
                    <Label htmlFor="owner">Owner *</Label>
                    <Select value={formData.owner} onValueChange={(value) => handleInputChange('owner', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                        <SelectItem value="emily">Emily Rodriguez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact and Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryAccount">Primary Account *</Label>
                      <Input
                        id="primaryAccount"
                        value={formData.primaryAccount}
                        onChange={(e) => handleInputChange('primaryAccount', e.target.value)}
                        placeholder="Select or enter account"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryContact">Primary Contact</Label>
                      <Input
                        id="primaryContact"
                        value={formData.primaryContact}
                        onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                        placeholder="Select or enter contact"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leadSource">Lead Source</Label>
                      <Select value={formData.leadSource} onValueChange={(value) => handleInputChange('leadSource', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="trade-show">Trade Show</SelectItem>
                          <SelectItem value="cold-call">Cold Call</SelectItem>
                          <SelectItem value="email-campaign">Email Campaign</SelectItem>
                          <SelectItem value="social-media">Social Media</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contactRole">Contact Role</Label>
                      <Select value={formData.contactRole} onValueChange={(value) => handleInputChange('contactRole', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="decision-maker">Decision Maker</SelectItem>
                          <SelectItem value="influencer">Influencer</SelectItem>
                          <SelectItem value="champion">Champion</SelectItem>
                          <SelectItem value="end-user">End User</SelectItem>
                          <SelectItem value="technical-buyer">Technical Buyer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Extended Deal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dealType">Deal Type</Label>
                      <Select value={formData.dealType} onValueChange={(value) => handleInputChange('dealType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select deal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new-business">New Business</SelectItem>
                          <SelectItem value="renewal">Renewal</SelectItem>
                          <SelectItem value="expansion">Expansion</SelectItem>
                          <SelectItem value="upsell">Upsell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nextSteps">Next Steps</Label>
                      <Input
                        id="nextSteps"
                        value={formData.nextSteps}
                        onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                        placeholder="Immediate actions required"
                        maxLength={255}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed opportunity description"
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="decisionCriteria">Decision Criteria</Label>
                    <Textarea
                      id="decisionCriteria"
                      value={formData.decisionCriteria}
                      onChange={(e) => handleInputChange('decisionCriteria', e.target.value)}
                      placeholder="Customer's evaluation criteria"
                      className="min-h-20"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="budgetAuthority"
                      checked={formData.budgetAuthority}
                      onCheckedChange={(checked) => handleInputChange('budgetAuthority', checked)}
                    />
                    <Label htmlFor="budgetAuthority">Budget Authority Confirmed</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Timeline Start</Label>
                      <DatePicker
                        value={formData.timelineStart}
                        onChange={(date) => handleInputChange('timelineStart', date)}
                        placeholder="Select start date"
                      />
                    </div>
                    <div>
                      <Label>Timeline End</Label>
                      <DatePicker
                        value={formData.timelineEnd}
                        onChange={(date) => handleInputChange('timelineEnd', date)}
                        placeholder="Select end date"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lead Qualification Framework */}
            <TabsContent value="qualification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>BANT/MEDDIC Qualification</CardTitle>
                  <CardDescription>Lead qualification framework</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="budgetConfirmed"
                          checked={formData.budgetConfirmed}
                          onCheckedChange={(checked) => handleInputChange('budgetConfirmed', checked)}
                        />
                        <Label htmlFor="budgetConfirmed">Budget Confirmed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="authorityIdentified"
                          checked={formData.authorityIdentified}
                          onCheckedChange={(checked) => handleInputChange('authorityIdentified', checked)}
                        />
                        <Label htmlFor="authorityIdentified">Authority Identified</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="needEstablished"
                          checked={formData.needEstablished}
                          onCheckedChange={(checked) => handleInputChange('needEstablished', checked)}
                        />
                        <Label htmlFor="needEstablished">Need Established</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="timelineDefined"
                          checked={formData.timelineDefined}
                          onCheckedChange={(checked) => handleInputChange('timelineDefined', checked)}
                        />
                        <Label htmlFor="timelineDefined">Timeline Defined</Label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="economicBuyer">Economic Buyer</Label>
                        <Input
                          id="economicBuyer"
                          value={formData.economicBuyer}
                          onChange={(e) => handleInputChange('economicBuyer', e.target.value)}
                          placeholder="Final decision authority"
                        />
                      </div>
                      <div>
                        <Label htmlFor="champion">Champion</Label>
                        <Input
                          id="champion"
                          value={formData.champion}
                          onChange={(e) => handleInputChange('champion', e.target.value)}
                          placeholder="Internal advocate"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="decisionProcess">Decision Process</Label>
                    <Textarea
                      id="decisionProcess"
                      value={formData.decisionProcess}
                      onChange={(e) => handleInputChange('decisionProcess', e.target.value)}
                      placeholder="How decisions are made"
                      className="min-h-20"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Impact Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="roiExpectations">ROI Expectations</Label>
                    <Textarea
                      id="roiExpectations"
                      value={formData.roiExpectations}
                      onChange={(e) => handleInputChange('roiExpectations', e.target.value)}
                      placeholder="Expected return on investment"
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="successMetrics">Success Metrics</Label>
                    <Textarea
                      id="successMetrics"
                      value={formData.successMetrics}
                      onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                      placeholder="How success will be measured"
                      className="min-h-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="implementationRisk">Implementation Risk</Label>
                      <Select value={formData.implementationRisk} onValueChange={(value) => handleInputChange('implementationRisk', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="technicalComplexity">Technical Complexity</Label>
                      <Select value={formData.technicalComplexity} onValueChange={(value) => handleInputChange('technicalComplexity', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="complex">Complex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products and Services */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Deal Line Items</CardTitle>
                      <CardDescription>Products and services being sold</CardDescription>
                    </div>
                    <Button onClick={addLineItem} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Line Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.lineItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No line items added yet. Click "Add Line Item" to get started.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.lineItems.map((item, index) => (
                        <Card key={item.id} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">Line Item #{index + 1}</CardTitle>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeLineItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Product/Service Name *</Label>
                                <Input
                                  value={item.productName}
                                  onChange={(e) => updateLineItem(item.id, 'productName', e.target.value)}
                                  placeholder="Product name"
                                />
                              </div>
                              <div>
                                <Label>Product Code/SKU</Label>
                                <Input
                                  value={item.productCode}
                                  onChange={(e) => updateLineItem(item.id, 'productCode', e.target.value)}
                                  placeholder="SKU"
                                />
                              </div>
                              <div>
                                <Label>Category</Label>
                                <Select value={item.category} onValueChange={(value) => updateLineItem(item.id, 'category', value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hardware">Hardware</SelectItem>
                                    <SelectItem value="software">Software</SelectItem>
                                    <SelectItem value="services">Services</SelectItem>
                                    <SelectItem value="support">Support</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-4">
                              <div>
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                                  min="1"
                                />
                              </div>
                              <div>
                                <Label>Unit Price</Label>
                                <Input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                                  placeholder="0.00"
                                />
                              </div>
                              <div>
                                <Label>Discount %</Label>
                                <Input
                                  type="number"
                                  value={item.discountPercentage}
                                  onChange={(e) => updateLineItem(item.id, 'discountPercentage', Number(e.target.value))}
                                  placeholder="0"
                                  max="100"
                                />
                              </div>
                              <div>
                                <Label>Line Total</Label>
                                <Input
                                  type="number"
                                  value={(item.quantity * item.unitPrice * (1 - item.discountPercentage / 100)).toFixed(2)}
                                  readOnly
                                  className="bg-muted"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>License Type</Label>
                                <Select value={item.licenseType} onValueChange={(value) => updateLineItem(item.id, 'licenseType', value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select license type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="perpetual">Perpetual</SelectItem>
                                    <SelectItem value="subscription">Subscription</SelectItem>
                                    <SelectItem value="usage-based">Usage-based</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Subscription Duration (months)</Label>
                                <Input
                                  type="number"
                                  value={item.subscriptionDuration}
                                  onChange={(e) => updateLineItem(item.id, 'subscriptionDuration', Number(e.target.value))}
                                  min="1"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Service Start Date</Label>
                      <DatePicker
                        value={formData.serviceStartDate}
                        onChange={(date) => handleInputChange('serviceStartDate', date)}
                        placeholder="Select start date"
                      />
                    </div>
                    <div>
                      <Label>Service End Date</Label>
                      <DatePicker
                        value={formData.serviceEndDate}
                        onChange={(date) => handleInputChange('serviceEndDate', date)}
                        placeholder="Select end date"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingFrequency">Billing Frequency</Label>
                      <Select value={formData.billingFrequency} onValueChange={(value) => handleInputChange('billingFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="one-time">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="supportLevel">Support Level</Label>
                      <Select value={formData.supportLevel} onValueChange={(value) => handleInputChange('supportLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select support level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="implementationTimeline">Implementation Timeline (days)</Label>
                      <Input
                        id="implementationTimeline"
                        type="number"
                        value={formData.implementationTimeline}
                        onChange={(e) => handleInputChange('implementationTimeline', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="professionalServices">Professional Services Cost</Label>
                      <Input
                        id="professionalServices"
                        type="number"
                        value={formData.professionalServices}
                        onChange={(e) => handleInputChange('professionalServices', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trainingIncluded"
                      checked={formData.trainingIncluded}
                      onCheckedChange={(checked) => handleInputChange('trainingIncluded', checked)}
                    />
                    <Label htmlFor="trainingIncluded">Training Package Included</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial and Forecasting */}
            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Tracking</CardTitle>
                  <CardDescription>Financial metrics and calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="totalContractValue">Total Contract Value</Label>
                      <Input
                        id="totalContractValue"
                        type="number"
                        value={formData.totalContractValue}
                        onChange={(e) => handleInputChange('totalContractValue', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualContractValue">Annual Contract Value</Label>
                      <Input
                        id="annualContractValue"
                        type="number"
                        value={formData.annualContractValue}
                        onChange={(e) => handleInputChange('annualContractValue', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oneTimeRevenue">One-time Revenue</Label>
                      <Input
                        id="oneTimeRevenue"
                        type="number"
                        value={formData.oneTimeRevenue}
                        onChange={(e) => handleInputChange('oneTimeRevenue', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="recurringRevenue">Recurring Revenue</Label>
                      <Input
                        id="recurringRevenue"
                        type="number"
                        value={formData.recurringRevenue}
                        onChange={(e) => handleInputChange('recurringRevenue', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="commissionAmount">Commission Amount</Label>
                      <Input
                        id="commissionAmount"
                        type="number"
                        value={formData.commissionAmount}
                        onChange={(e) => handleInputChange('commissionAmount', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="marginPercentage">Margin Percentage</Label>
                      <Input
                        id="marginPercentage"
                        type="number"
                        value={formData.marginPercentage}
                        onChange={(e) => handleInputChange('marginPercentage', Number(e.target.value))}
                        placeholder="0"
                        max="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forecasting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="forecastCategory">Forecast Category</Label>
                      <Select value={formData.forecastCategory} onValueChange={(value) => handleInputChange('forecastCategory', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pipeline">Pipeline</SelectItem>
                          <SelectItem value="best-case">Best Case</SelectItem>
                          <SelectItem value="commit">Commit</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="confidenceLevel">Confidence Level</Label>
                      <Select value={formData.confidenceLevel} onValueChange={(value) => handleInputChange('confidenceLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select confidence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weightedAmount">Weighted Amount</Label>
                      <Input
                        id="weightedAmount"
                        type="number"
                        value={formData.weightedAmount}
                        onChange={(e) => handleInputChange('weightedAmount', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedRevenue">Expected Revenue</Label>
                      <Input
                        id="expectedRevenue"
                        type="number"
                        value={formData.expectedRevenue}
                        onChange={(e) => handleInputChange('expectedRevenue', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Forecast Date</Label>
                    <DatePicker
                      value={formData.forecastDate}
                      onChange={(date) => handleInputChange('forecastDate', date)}
                      placeholder="Select forecast date"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="net-60">Net 60</SelectItem>
                          <SelectItem value="net-90">Net 90</SelectItem>
                          <SelectItem value="upon-delivery">Upon Delivery</SelectItem>
                          <SelectItem value="advance-payment">Advance Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contractLength">Contract Length (months)</Label>
                      <Input
                        id="contractLength"
                        type="number"
                        value={formData.contractLength}
                        onChange={(e) => handleInputChange('contractLength', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="exchangeRate">Exchange Rate</Label>
                      <Input
                        id="exchangeRate"
                        type="number"
                        step="0.0001"
                        value={formData.exchangeRate}
                        onChange={(e) => handleInputChange('exchangeRate', Number(e.target.value))}
                        placeholder="1.0000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="renewalTerms">Renewal Terms</Label>
                    <Textarea
                      id="renewalTerms"
                      value={formData.renewalTerms}
                      onChange={(e) => handleInputChange('renewalTerms', e.target.value)}
                      placeholder="Renewal conditions and terms"
                      className="min-h-20"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deal Intelligence */}
            <TabsContent value="intelligence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Intelligence Scores</CardTitle>
                  <CardDescription>AI-powered insights and scoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dealScore">Deal Score (0-100)</Label>
                      <Input
                        id="dealScore"
                        type="number"
                        value={formData.dealScore}
                        onChange={(e) => handleInputChange('dealScore', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="engagementScore">Engagement Score (0-100)</Label>
                      <Input
                        id="engagementScore"
                        type="number"
                        value={formData.engagementScore}
                        onChange={(e) => handleInputChange('engagementScore', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fitScore">Fit Score (0-100)</Label>
                      <Input
                        id="fitScore"
                        type="number"
                        value={formData.fitScore}
                        onChange={(e) => handleInputChange('fitScore', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="velocityScore">Velocity Score (0-100)</Label>
                      <Input
                        id="velocityScore"
                        type="number"
                        value={formData.velocityScore}
                        onChange={(e) => handleInputChange('velocityScore', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="riskScore">Risk Score (0-100)</Label>
                      <Input
                        id="riskScore"
                        type="number"
                        value={formData.riskScore}
                        onChange={(e) => handleInputChange('riskScore', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Last Activity Date</Label>
                      <DatePicker
                        value={formData.lastActivityDate}
                        onChange={(date) => handleInputChange('lastActivityDate', date)}
                        placeholder="Select last activity date"
                      />
                    </div>
                    <div>
                      <Label>Next Activity Date</Label>
                      <DatePicker
                        value={formData.nextActivityDate}
                        onChange={(date) => handleInputChange('nextActivityDate', date)}
                        placeholder="Select next activity date"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="activityCount">Activity Count</Label>
                      <Input
                        id="activityCount"
                        type="number"
                        value={formData.activityCount}
                        onChange={(e) => handleInputChange('activityCount', Number(e.target.value))}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailInteractions">Email Interactions</Label>
                      <Input
                        id="emailInteractions"
                        type="number"
                        value={formData.emailInteractions}
                        onChange={(e) => handleInputChange('emailInteractions', Number(e.target.value))}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="daysSinceLastActivity">Days Since Last Activity</Label>
                      <Input
                        id="daysSinceLastActivity"
                        type="number"
                        value={formData.daysSinceLastActivity}
                        onChange={(e) => handleInputChange('daysSinceLastActivity', Number(e.target.value))}
                        min="0"
                        placeholder="0"
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collaboration */}
            <TabsContent value="collaboration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Team & Collaboration</CardTitle>
                  <CardDescription>Team members and stakeholder management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="teamRoles">Team Roles</Label>
                    <Textarea
                      id="teamRoles"
                      value={formData.teamRoles}
                      onChange={(e) => handleInputChange('teamRoles', e.target.value)}
                      placeholder="Specific roles for each team member"
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stakeholderMap">Stakeholder Map</Label>
                    <Textarea
                      id="stakeholderMap"
                      value={formData.stakeholderMap}
                      onChange={(e) => handleInputChange('stakeholderMap', e.target.value)}
                      placeholder="Visual representation of decision makers and influencers"
                      className="min-h-24"
                    />
                  </div>

                  <div>
                    <Label htmlFor="internalNotes">Internal Notes</Label>
                    <Textarea
                      id="internalNotes"
                      value={formData.internalNotes}
                      onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                      placeholder="Team-only observations and notes"
                      className="min-h-24"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerFacingNotes">Customer-Facing Notes</Label>
                    <Textarea
                      id="customerFacingNotes"
                      value={formData.customerFacingNotes}
                      onChange={(e) => handleInputChange('customerFacingNotes', e.target.value)}
                      placeholder="Shareable updates and communications"
                      className="min-h-24"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Deal
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};