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
            "w-full justify-start text-left font-normal h-12 px-4 border-gray-300 hover:border-gray-400",
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
      <SheetContent className="w-full max-w-6xl overflow-y-auto animate-fade-in">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">Deal Management Form</SheetTitle>
          <SheetDescription className="text-gray-600">
            Complete deal information with advanced tracking and management
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-muted p-1 rounded-lg h-12">
              <TabsTrigger value="essentials" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                Essentials
              </TabsTrigger>
              <TabsTrigger value="qualification" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                Qualification
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                Products
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                Financial
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                Intelligence
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                Collaboration
              </TabsTrigger>
            </TabsList>

            {/* Essential Deal Information */}
            <TabsContent value="essentials" className="space-y-8 mt-6 animate-fade-in">
              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Essential Deal Information</CardTitle>
                  <CardDescription className="text-gray-600">Core required fields for the deal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="dealName" className="text-sm font-semibold text-gray-700">
                        Deal Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dealName"
                        value={formData.dealName}
                        onChange={(e) => handleInputChange('dealName', e.target.value)}
                        placeholder="Enter deal name"
                        maxLength={255}
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="dealValue" className="text-sm font-semibold text-gray-700">
                        Deal Value <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dealValue"
                        type="number"
                        value={formData.dealValue}
                        onChange={(e) => handleInputChange('dealValue', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Close Date <span className="text-red-500">*</span>
                      </Label>
                      <DatePicker
                        value={formData.closeDate}
                        onChange={(date) => handleInputChange('closeDate', date)}
                        placeholder="Select close date"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="stage" className="text-sm font-semibold text-gray-700">
                        Stage <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

                  <div className="space-y-3">
                    <Label htmlFor="owner" className="text-sm font-semibold text-gray-700">
                      Owner <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.owner} onValueChange={(value) => handleInputChange('owner', value)}>
                      <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Contact and Account Information</CardTitle>
                  <CardDescription className="text-gray-600">Related contacts and account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="primaryAccount" className="text-sm font-semibold text-gray-700">
                        Primary Account <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="primaryAccount"
                        value={formData.primaryAccount}
                        onChange={(e) => handleInputChange('primaryAccount', e.target.value)}
                        placeholder="Select or enter account"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="primaryContact" className="text-sm font-semibold text-gray-700">Primary Contact</Label>
                      <Input
                        id="primaryContact"
                        value={formData.primaryContact}
                        onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                        placeholder="Select or enter contact"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="leadSource" className="text-sm font-semibold text-gray-700">Lead Source</Label>
                      <Select value={formData.leadSource} onValueChange={(value) => handleInputChange('leadSource', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                    <div className="space-y-3">
                      <Label htmlFor="contactRole" className="text-sm font-semibold text-gray-700">Contact Role</Label>
                      <Select value={formData.contactRole} onValueChange={(value) => handleInputChange('contactRole', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Extended Deal Information</CardTitle>
                  <CardDescription className="text-gray-600">Additional deal details and timeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="dealType" className="text-sm font-semibold text-gray-700">Deal Type</Label>
                      <Select value={formData.dealType} onValueChange={(value) => handleInputChange('dealType', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                    <div className="space-y-3">
                      <Label htmlFor="nextSteps" className="text-sm font-semibold text-gray-700">Next Steps</Label>
                      <Input
                        id="nextSteps"
                        value={formData.nextSteps}
                        onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                        placeholder="Immediate actions required"
                        maxLength={255}
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed opportunity description"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="decisionCriteria" className="text-sm font-semibold text-gray-700">Decision Criteria</Label>
                    <Textarea
                      id="decisionCriteria"
                      value={formData.decisionCriteria}
                      onChange={(e) => handleInputChange('decisionCriteria', e.target.value)}
                      placeholder="Customer's evaluation criteria"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Checkbox
                      id="budgetAuthority"
                      checked={formData.budgetAuthority}
                      onCheckedChange={(checked) => handleInputChange('budgetAuthority', checked)}
                    />
                    <Label htmlFor="budgetAuthority" className="text-sm font-semibold text-gray-700">
                      Budget Authority Confirmed
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Timeline Start</Label>
                      <DatePicker
                        value={formData.timelineStart}
                        onChange={(date) => handleInputChange('timelineStart', date)}
                        placeholder="Select start date"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Timeline End</Label>
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

            {/* Qualification Tab */}
            <TabsContent value="qualification" className="space-y-8 mt-6 animate-fade-in">
              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Lead Qualification (BANT/MEDDIC)</CardTitle>
                  <CardDescription className="text-gray-600">Budget, Authority, Need, Timeline assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Checkbox
                          id="budgetConfirmed"
                          checked={formData.budgetConfirmed}
                          onCheckedChange={(checked) => handleInputChange('budgetConfirmed', checked)}
                        />
                        <Label htmlFor="budgetConfirmed" className="text-sm font-semibold text-gray-700">
                          Budget Confirmed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Checkbox
                          id="authorityIdentified"
                          checked={formData.authorityIdentified}
                          onCheckedChange={(checked) => handleInputChange('authorityIdentified', checked)}
                        />
                        <Label htmlFor="authorityIdentified" className="text-sm font-semibold text-gray-700">
                          Authority Identified
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Checkbox
                          id="needEstablished"
                          checked={formData.needEstablished}
                          onCheckedChange={(checked) => handleInputChange('needEstablished', checked)}
                        />
                        <Label htmlFor="needEstablished" className="text-sm font-semibold text-gray-700">
                          Need Established
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Checkbox
                          id="timelineDefined"
                          checked={formData.timelineDefined}
                          onCheckedChange={(checked) => handleInputChange('timelineDefined', checked)}
                        />
                        <Label htmlFor="timelineDefined" className="text-sm font-semibold text-gray-700">
                          Timeline Defined
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="economicBuyer" className="text-sm font-semibold text-gray-700">Economic Buyer</Label>
                      <Input
                        id="economicBuyer"
                        value={formData.economicBuyer}
                        onChange={(e) => handleInputChange('economicBuyer', e.target.value)}
                        placeholder="Who controls the budget?"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="champion" className="text-sm font-semibold text-gray-700">Champion</Label>
                      <Input
                        id="champion"
                        value={formData.champion}
                        onChange={(e) => handleInputChange('champion', e.target.value)}
                        placeholder="Internal advocate"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="decisionProcess" className="text-sm font-semibold text-gray-700">Decision Process</Label>
                    <Textarea
                      id="decisionProcess"
                      value={formData.decisionProcess}
                      onChange={(e) => handleInputChange('decisionProcess', e.target.value)}
                      placeholder="How will the decision be made?"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Business Impact Assessment</CardTitle>
                  <CardDescription className="text-gray-600">Understanding customer pain points and success metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-3">
                    <Label htmlFor="roiExpectations" className="text-sm font-semibold text-gray-700">ROI Expectations</Label>
                    <Textarea
                      id="roiExpectations"
                      value={formData.roiExpectations}
                      onChange={(e) => handleInputChange('roiExpectations', e.target.value)}
                      placeholder="Expected return on investment"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="successMetrics" className="text-sm font-semibold text-gray-700">Success Metrics</Label>
                    <Textarea
                      id="successMetrics"
                      value={formData.successMetrics}
                      onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                      placeholder="How will success be measured?"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="implementationRisk" className="text-sm font-semibold text-gray-700">Implementation Risk</Label>
                      <Select value={formData.implementationRisk} onValueChange={(value) => handleInputChange('implementationRisk', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="technicalComplexity" className="text-sm font-semibold text-gray-700">Technical Complexity</Label>
                      <Select value={formData.technicalComplexity} onValueChange={(value) => handleInputChange('technicalComplexity', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-8 mt-6 animate-fade-in">
              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                    Products and Services
                    <Button onClick={addLineItem} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-600">Configure products and pricing</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {formData.lineItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg mb-4">No products added yet</p>
                      <Button onClick={addLineItem} variant="outline" className="h-12 px-8">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.lineItems.map((item, index) => (
                        <Card key={item.id} className="border-2 border-gray-200">
                          <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Product {index + 1}</CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeLineItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Product Name</Label>
                                <Input
                                  value={item.productName}
                                  onChange={(e) => updateLineItem(item.id, 'productName', e.target.value)}
                                  placeholder="Enter product name"
                                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Product Code</Label>
                                <Input
                                  value={item.productCode}
                                  onChange={(e) => updateLineItem(item.id, 'productCode', e.target.value)}
                                  placeholder="SKU/Code"
                                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Category</Label>
                                <Select value={item.category} onValueChange={(value) => updateLineItem(item.id, 'category', value)}>
                                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="software">Software</SelectItem>
                                    <SelectItem value="hardware">Hardware</SelectItem>
                                    <SelectItem value="services">Services</SelectItem>
                                    <SelectItem value="support">Support</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Quantity</Label>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                                  min="1"
                                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Unit Price</Label>
                                <Input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                                  placeholder="0.00"
                                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Discount %</Label>
                                <Input
                                  type="number"
                                  value={item.discountPercentage}
                                  onChange={(e) => updateLineItem(item.id, 'discountPercentage', Number(e.target.value))}
                                  min="0"
                                  max="100"
                                  placeholder="0"
                                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Line Total</Label>
                                <div className="h-12 px-4 py-3 bg-gray-100 border border-gray-300 rounded-md text-base font-semibold">
                                  ${(item.quantity * item.unitPrice * (1 - item.discountPercentage / 100)).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Service Details</CardTitle>
                  <CardDescription className="text-gray-600">Implementation and support information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Service Start Date</Label>
                      <DatePicker
                        value={formData.serviceStartDate}
                        onChange={(date) => handleInputChange('serviceStartDate', date)}
                        placeholder="Select start date"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Service End Date</Label>
                      <DatePicker
                        value={formData.serviceEndDate}
                        onChange={(date) => handleInputChange('serviceEndDate', date)}
                        placeholder="Select end date"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="billingFrequency" className="text-sm font-semibold text-gray-700">Billing Frequency</Label>
                      <Select value={formData.billingFrequency} onValueChange={(value) => handleInputChange('billingFrequency', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                    <div className="space-y-3">
                      <Label htmlFor="supportLevel" className="text-sm font-semibold text-gray-700">Support Level</Label>
                      <Select value={formData.supportLevel} onValueChange={(value) => handleInputChange('supportLevel', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="implementationTimeline" className="text-sm font-semibold text-gray-700">Implementation Timeline (weeks)</Label>
                      <Input
                        id="implementationTimeline"
                        type="number"
                        value={formData.implementationTimeline}
                        onChange={(e) => handleInputChange('implementationTimeline', Number(e.target.value))}
                        min="0"
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="professionalServices" className="text-sm font-semibold text-gray-700">Professional Services ($)</Label>
                      <Input
                        id="professionalServices"
                        type="number"
                        value={formData.professionalServices}
                        onChange={(e) => handleInputChange('professionalServices', Number(e.target.value))}
                        min="0"
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Checkbox
                      id="trainingIncluded"
                      checked={formData.trainingIncluded}
                      onCheckedChange={(checked) => handleInputChange('trainingIncluded', checked)}
                    />
                    <Label htmlFor="trainingIncluded" className="text-sm font-semibold text-gray-700">
                      Training Included
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-8 mt-6 animate-fade-in">
              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Financial Overview</CardTitle>
                  <CardDescription className="text-gray-600">Revenue breakdown and financial terms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="totalContractValue" className="text-sm font-semibold text-gray-700">Total Contract Value</Label>
                      <Input
                        id="totalContractValue"
                        type="number"
                        value={formData.totalContractValue}
                        onChange={(e) => handleInputChange('totalContractValue', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="annualContractValue" className="text-sm font-semibold text-gray-700">Annual Contract Value</Label>
                      <Input
                        id="annualContractValue"
                        type="number"
                        value={formData.annualContractValue}
                        onChange={(e) => handleInputChange('annualContractValue', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="marginPercentage" className="text-sm font-semibold text-gray-700">Margin %</Label>
                      <Input
                        id="marginPercentage"
                        type="number"
                        value={formData.marginPercentage}
                        onChange={(e) => handleInputChange('marginPercentage', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="oneTimeRevenue" className="text-sm font-semibold text-gray-700">One-time Revenue</Label>
                      <Input
                        id="oneTimeRevenue"
                        type="number"
                        value={formData.oneTimeRevenue}
                        onChange={(e) => handleInputChange('oneTimeRevenue', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recurringRevenue" className="text-sm font-semibold text-gray-700">Recurring Revenue</Label>
                      <Input
                        id="recurringRevenue"
                        type="number"
                        value={formData.recurringRevenue}
                        onChange={(e) => handleInputChange('recurringRevenue', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="totalDiscount" className="text-sm font-semibold text-gray-700">Total Discount</Label>
                      <Input
                        id="totalDiscount"
                        type="number"
                        value={formData.totalDiscount}
                        onChange={(e) => handleInputChange('totalDiscount', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="commissionAmount" className="text-sm font-semibold text-gray-700">Commission Amount</Label>
                      <Input
                        id="commissionAmount"
                        type="number"
                        value={formData.commissionAmount}
                        onChange={(e) => handleInputChange('commissionAmount', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Forecasting</CardTitle>
                  <CardDescription className="text-gray-600">Revenue forecasting and probability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="forecastCategory" className="text-sm font-semibold text-gray-700">Forecast Category</Label>
                      <Select value={formData.forecastCategory} onValueChange={(value) => handleInputChange('forecastCategory', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commit">Commit</SelectItem>
                          <SelectItem value="best-case">Best Case</SelectItem>
                          <SelectItem value="pipeline">Pipeline</SelectItem>
                          <SelectItem value="omitted">Omitted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="confidenceLevel" className="text-sm font-semibold text-gray-700">Confidence Level</Label>
                      <Select value={formData.confidenceLevel} onValueChange={(value) => handleInputChange('confidenceLevel', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select confidence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High (80-100%)</SelectItem>
                          <SelectItem value="medium">Medium (50-79%)</SelectItem>
                          <SelectItem value="low">Low (0-49%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="weightedAmount" className="text-sm font-semibold text-gray-700">Weighted Amount</Label>
                      <Input
                        id="weightedAmount"
                        type="number"
                        value={formData.weightedAmount}
                        onChange={(e) => handleInputChange('weightedAmount', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="expectedRevenue" className="text-sm font-semibold text-gray-700">Expected Revenue</Label>
                      <Input
                        id="expectedRevenue"
                        type="number"
                        value={formData.expectedRevenue}
                        onChange={(e) => handleInputChange('expectedRevenue', Number(e.target.value))}
                        placeholder="0.00"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Forecast Date</Label>
                    <DatePicker
                      value={formData.forecastDate}
                      onChange={(date) => handleInputChange('forecastDate', date)}
                      placeholder="Select forecast date"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Financial Terms</CardTitle>
                  <CardDescription className="text-gray-600">Contract terms and payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="paymentTerms" className="text-sm font-semibold text-gray-700">Payment Terms</Label>
                      <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="net-60">Net 60</SelectItem>
                          <SelectItem value="net-90">Net 90</SelectItem>
                          <SelectItem value="upfront">Upfront</SelectItem>
                          <SelectItem value="installments">Installments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="contractLength" className="text-sm font-semibold text-gray-700">Contract Length (months)</Label>
                      <Input
                        id="contractLength"
                        type="number"
                        value={formData.contractLength}
                        onChange={(e) => handleInputChange('contractLength', Number(e.target.value))}
                        min="1"
                        placeholder="12"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="currency" className="text-sm font-semibold text-gray-700">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="exchangeRate" className="text-sm font-semibold text-gray-700">Exchange Rate</Label>
                      <Input
                        id="exchangeRate"
                        type="number"
                        step="0.0001"
                        value={formData.exchangeRate}
                        onChange={(e) => handleInputChange('exchangeRate', Number(e.target.value))}
                        placeholder="1.0000"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="renewalTerms" className="text-sm font-semibold text-gray-700">Renewal Terms</Label>
                    <Textarea
                      id="renewalTerms"
                      value={formData.renewalTerms}
                      onChange={(e) => handleInputChange('renewalTerms', e.target.value)}
                      placeholder="Contract renewal conditions"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Intelligence Tab */}
            <TabsContent value="intelligence" className="space-y-8 mt-6 animate-fade-in">
              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Deal Intelligence Scores</CardTitle>
                  <CardDescription className="text-gray-600">AI-powered deal scoring and analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="dealScore" className="text-sm font-semibold text-gray-700">Overall Deal Score (0-100)</Label>
                      <Input
                        id="dealScore"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.dealScore}
                        onChange={(e) => handleInputChange('dealScore', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="engagementScore" className="text-sm font-semibold text-gray-700">Engagement Score (0-100)</Label>
                      <Input
                        id="engagementScore"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.engagementScore}
                        onChange={(e) => handleInputChange('engagementScore', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="fitScore" className="text-sm font-semibold text-gray-700">Fit Score (0-100)</Label>
                      <Input
                        id="fitScore"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.fitScore}
                        onChange={(e) => handleInputChange('fitScore', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="velocityScore" className="text-sm font-semibold text-gray-700">Velocity Score (0-100)</Label>
                      <Input
                        id="velocityScore"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.velocityScore}
                        onChange={(e) => handleInputChange('velocityScore', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="riskScore" className="text-sm font-semibold text-gray-700">Risk Score (0-100)</Label>
                      <Input
                        id="riskScore"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.riskScore}
                        onChange={(e) => handleInputChange('riskScore', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Sales Process Management</CardTitle>
                  <CardDescription className="text-gray-600">Stage progression and timeline tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="salesStage" className="text-sm font-semibold text-gray-700">Current Sales Stage</Label>
                      <Select value={formData.salesStage} onValueChange={(value) => handleInputChange('salesStage', value)}>
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select sales stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="demo">Demo</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="negotiation">Negotiation</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="stageProbability" className="text-sm font-semibold text-gray-700">Stage Probability (%)</Label>
                      <Input
                        id="stageProbability"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.stageProbability}
                        onChange={(e) => handleInputChange('stageProbability', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="stageDuration" className="text-sm font-semibold text-gray-700">Stage Duration (days)</Label>
                      <Input
                        id="stageDuration"
                        type="number"
                        min="0"
                        value={formData.stageDuration}
                        onChange={(e) => handleInputChange('stageDuration', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="previousStage" className="text-sm font-semibold text-gray-700">Previous Stage</Label>
                      <Input
                        id="previousStage"
                        value={formData.previousStage}
                        onChange={(e) => handleInputChange('previousStage', e.target.value)}
                        placeholder="Previous stage name"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Stage Entry Date</Label>
                    <DatePicker
                      value={formData.stageEntryDate}
                      onChange={(date) => handleInputChange('stageEntryDate', date)}
                      placeholder="Select entry date"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="stageExitCriteria" className="text-sm font-semibold text-gray-700">Stage Exit Criteria</Label>
                    <Textarea
                      id="stageExitCriteria"
                      value={formData.stageExitCriteria}
                      onChange={(e) => handleInputChange('stageExitCriteria', e.target.value)}
                      placeholder="What needs to happen to move to next stage?"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Activity Tracking</CardTitle>
                  <CardDescription className="text-gray-600">Engagement and activity metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Last Activity Date</Label>
                      <DatePicker
                        value={formData.lastActivityDate}
                        onChange={(date) => handleInputChange('lastActivityDate', date)}
                        placeholder="Select last activity"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="daysSinceLastActivity" className="text-sm font-semibold text-gray-700">Days Since Last Activity</Label>
                      <Input
                        id="daysSinceLastActivity"
                        type="number"
                        min="0"
                        value={formData.daysSinceLastActivity}
                        onChange={(e) => handleInputChange('daysSinceLastActivity', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Next Activity Date</Label>
                      <DatePicker
                        value={formData.nextActivityDate}
                        onChange={(date) => handleInputChange('nextActivityDate', date)}
                        placeholder="Select next activity"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="activityCount" className="text-sm font-semibold text-gray-700">Total Activity Count</Label>
                      <Input
                        id="activityCount"
                        type="number"
                        min="0"
                        value={formData.activityCount}
                        onChange={(e) => handleInputChange('activityCount', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="emailInteractions" className="text-sm font-semibold text-gray-700">Email Interactions</Label>
                      <Input
                        id="emailInteractions"
                        type="number"
                        min="0"
                        value={formData.emailInteractions}
                        onChange={(e) => handleInputChange('emailInteractions', Number(e.target.value))}
                        placeholder="0"
                        className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collaboration Tab */}
            <TabsContent value="collaboration" className="space-y-8 mt-6 animate-fade-in">
              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Deal Team & Collaboration</CardTitle>
                  <CardDescription className="text-gray-600">Team members and stakeholder information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-3">
                    <Label htmlFor="teamRoles" className="text-sm font-semibold text-gray-700">Team Roles</Label>
                    <Textarea
                      id="teamRoles"
                      value={formData.teamRoles}
                      onChange={(e) => handleInputChange('teamRoles', e.target.value)}
                      placeholder="Define team member roles and responsibilities"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="stakeholderMap" className="text-sm font-semibold text-gray-700">Stakeholder Map</Label>
                    <Textarea
                      id="stakeholderMap"
                      value={formData.stakeholderMap}
                      onChange={(e) => handleInputChange('stakeholderMap', e.target.value)}
                      placeholder="Map of key stakeholders and their influence"
                      className="min-h-24 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-lime-50 to-green-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Notes & Documentation</CardTitle>
                  <CardDescription className="text-gray-600">Internal and customer-facing notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-3">
                    <Label htmlFor="internalNotes" className="text-sm font-semibold text-gray-700">Internal Notes</Label>
                    <Textarea
                      id="internalNotes"
                      value={formData.internalNotes}
                      onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                      placeholder="Internal team notes and observations"
                      className="min-h-32 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="customerFacingNotes" className="text-sm font-semibold text-gray-700">Customer-Facing Notes</Label>
                    <Textarea
                      id="customerFacingNotes"
                      value={formData.customerFacingNotes}
                      onChange={(e) => handleInputChange('customerFacingNotes', e.target.value)}
                      placeholder="Notes that can be shared with the customer"
                      className="min-h-32 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-8 mt-8 border-t bg-gray-50 -mx-6 px-8 py-6">
              <Button variant="outline" onClick={onClose} className="px-8 py-3 h-12 text-base hover:bg-gray-100">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 h-12 text-base">
                <Save className="h-4 w-4 mr-2" />
                Save Deal
              </Button>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
