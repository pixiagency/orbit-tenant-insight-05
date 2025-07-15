
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DrawerForm } from '../layout/DrawerForm';
import { ContactSearchSelect } from '../shared/ContactSearchSelect';
import { 
  Target, 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Star, 
  Settings, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Users,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { CountrySelect } from '@/components/shared/CountrySelect';
import { CitySelect } from '@/components/shared/CitySelect';
import { PhoneInput } from '@/components/shared/PhoneInput';

interface Deal {
  id?: string;
  title: string;
  description: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  value: number;
  stage: string;
  priority: string;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  source: string;
  dealType: string;
  assignedTo: string;
  tags: string[];
  notes: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  // Address fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  // Communication preferences
  emailOptIn?: boolean;
  phoneOptIn?: boolean;
  preferredContactMethod?: string;
  doNotCall?: boolean;
  // System fields
  createdDate?: string;
  modifiedDate?: string;
}

interface DealDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
  deal?: Deal | null;
  customFields?: CustomField[];
}

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'url' | 'currency' | 'percentage' | 'rating' | 'boolean';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditionalLogic?: {
    showWhen: string;
    equals: any;
  };
  section?: string;
}

// Deal Specification Constants
const DEAL_STAGES = [
  'Lead',
  'Qualified', 
  'Proposal',
  'Negotiation',
  'Decision',
  'Closed Won',
  'Closed Lost'
];

const DEAL_STATUSES = [
  'Active',
  'Inactive', 
  'On Hold'
];

const DEAL_SOURCES = [
  'Website',
  'Referral',
  'Cold Call',
  'Event',
  'Social Media',
  'Advertisement',
  'Partner',
  'Direct'
];

const DEAL_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Urgent'
];

const DEAL_TYPES = [
  'New Business',
  'Existing Business',
  'Renewal',
  'Upsell',
  'Cross-sell'
];

const PREFERRED_CONTACT_METHODS = [
  'Email',
  'Phone',
  'SMS',
  'WhatsApp'
];

const DEAL_OWNERS = [
  'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Brown', 'Alex Thompson'
];

export const DealDrawerForm: React.FC<DealDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  deal,
  customFields = []
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');

  const form = useForm<Deal>({
    defaultValues: {
      title: '',
      description: '',
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      value: 0,
      stage: 'Lead',
      priority: 'Medium',
      probability: 10,
      expectedCloseDate: '',
      actualCloseDate: '',
      source: 'Website',
      dealType: 'New Business',
      assignedTo: '',
      tags: [],
      notes: '',
      status: 'Active',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      website: '',
      emailOptIn: true,
      phoneOptIn: true,
      preferredContactMethod: 'Email',
      doNotCall: false,
      createdDate: new Date().toISOString().split('T')[0],
      modifiedDate: new Date().toISOString().split('T')[0]
    }
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  const selectedStage = watch('stage');

  // Auto-update probability based on stage
  const updateProbabilityByStage = (stage: string) => {
    const probabilities: { [key: string]: number } = {
      'Lead': 10,
      'Qualified': 25,
      'Proposal': 50,
      'Negotiation': 75,
      'Decision': 90,
      'Closed Won': 100,
      'Closed Lost': 0
    };
    setValue('probability', probabilities[stage] || 10);
  };

  useEffect(() => {
    updateProbabilityByStage(selectedStage);
  }, [selectedStage, setValue]);

  useEffect(() => {
    if (deal) {
      reset(deal);
      setTags(deal.tags || []);
    } else {
      reset({
        title: '',
        description: '',
        company: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        value: 0,
        stage: 'Lead',
        priority: 'Medium',
        probability: 10,
        expectedCloseDate: '',
        actualCloseDate: '',
        source: 'Website',
        dealType: 'New Business',
        assignedTo: '',
        tags: [],
        notes: '',
        status: 'Active',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        website: '',
        emailOptIn: true,
        phoneOptIn: true,
        preferredContactMethod: 'Email',
        doNotCall: false,
        createdDate: new Date().toISOString().split('T')[0],
        modifiedDate: new Date().toISOString().split('T')[0]
      });
      setTags([]);
    }
  }, [deal, reset, isOpen]);

  // Custom validation logic
  const validateForm = (data: Deal): string[] => {
    const errors: string[] = [];
    
    // Title is always required
    if (!data.title?.trim()) {
      errors.push('Deal title is required');
    }
    
    // Company is required
    if (!data.company?.trim()) {
      errors.push('Company name is required');
    }
    
    // Contact name is required
    if (!data.contactName?.trim()) {
      errors.push('Contact name is required');
    }
    
    // Email validation
    if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    // Value must be greater than 0
    if (!data.value || data.value <= 0) {
      errors.push('Deal value must be greater than 0');
    }
    
    return errors;
  };

  const onFormSubmit = (data: Deal) => {
    const validationErrors = validateForm(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setValidationErrors([]);
    data.tags = tags;
    data.modifiedDate = new Date().toISOString().split('T')[0];
    
    onSave(data);
    toast.success(deal ? 'Deal updated successfully!' : 'Deal created successfully!');
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleContactSelect = (contactId: string, contact: any) => {
    setSelectedContactId(contactId);
    if (contact.firstName) {
      setValue('contactName', `${contact.firstName} ${contact.lastName}`);
      setValue('contactEmail', contact.email);
      setValue('company', contact.company || '');
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

        {/* Basic Deal Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Basic Deal Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Deal Title <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('title', { required: true })}
                placeholder="Enterprise Software License - Q4 2024"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                {...register('description')}
                rows={3}
                placeholder="Brief description of the deal opportunity..."
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Company & Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Company & Contact Information
          </h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search Existing Contact</Label>
              <ContactSearchSelect
                value={selectedContactId}
                onValueChange={handleContactSelect}
                placeholder="Search for existing contact..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('company', { required: true })}
                  placeholder="TechCorp Inc."
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-sm font-medium">
                  Contact Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('contactName', { required: true })}
                  placeholder="John Smith"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</Label>
                <Input
                  {...register('contactEmail')}
                  type="email"
                  placeholder="john@techcorp.com"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-sm font-medium">Contact Phone</Label>
                <PhoneInput
                  value={watch('contactPhone') || ''}
                  onChange={(value) => setValue('contactPhone', value)}
                  placeholder="Enter contact phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                <Input
                  {...register('website')}
                  type="url"
                  placeholder="https://company.com"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Deal Value & Stage */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Deal Value & Stage
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm font-medium">
                Deal Value <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('value', { required: true, valueAsNumber: true })}
                type="number"
                placeholder="50000"
                min="0"
                step="0.01"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage" className="text-sm font-medium">Stage</Label>
              <Select onValueChange={(value) => setValue('stage', value)} defaultValue={watch('stage')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {DEAL_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability" className="text-sm font-medium">Probability (%)</Label>
              <Input
                {...register('probability', { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
              <Select onValueChange={(value) => setValue('priority', value)} defaultValue={watch('priority')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {DEAL_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <Badge variant={priority === 'Urgent' ? 'destructive' : priority === 'High' ? 'default' : 'secondary'}>
                        {priority}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Deal Status & Classification */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Deal Status & Classification
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Deal Status</Label>
              <Select onValueChange={(value) => setValue('status', value)} defaultValue={watch('status')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {DEAL_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      <Badge variant={status === 'Active' ? 'default' : status === 'Inactive' ? 'secondary' : 'destructive'}>
                        {status}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">Deal Source</Label>
              <Select onValueChange={(value) => setValue('source', value)} defaultValue={watch('source')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {DEAL_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dealType" className="text-sm font-medium">Deal Type</Label>
              <Select onValueChange={(value) => setValue('dealType', value)} defaultValue={watch('dealType')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {DEAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Communication Preferences */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Communication Preferences
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredContactMethod" className="text-sm font-medium">Preferred Contact Method</Label>
              <Select onValueChange={(value) => setValue('preferredContactMethod', value)} defaultValue={watch('preferredContactMethod')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {PREFERRED_CONTACT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Communication Permissions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-green-700 dark:text-green-400">Email Permissions</Label>
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Checkbox
                  checked={watch('emailOptIn')}
                  onCheckedChange={(checked) => setValue('emailOptIn', checked as boolean)}
                />
                <Label className="text-sm cursor-pointer">Permission to send emails</Label>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-blue-700 dark:text-blue-400">Phone Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Checkbox
                    checked={watch('phoneOptIn')}
                    onCheckedChange={(checked) => setValue('phoneOptIn', checked as boolean)}
                  />
                  <Label className="text-sm cursor-pointer">Permission to call</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Checkbox
                    checked={watch('doNotCall')}
                    onCheckedChange={(checked) => setValue('doNotCall', checked as boolean)}
                  />
                  <Label className="text-sm cursor-pointer text-red-700 dark:text-red-400">Do Not Call (Legal flag)</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline & Assignment */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline & Assignment
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate" className="text-sm font-medium">Expected Close Date</Label>
              <Input
                {...register('expectedCloseDate')}
                type="date"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualCloseDate" className="text-sm font-medium">Actual Close Date</Label>
              <Input
                {...register('actualCloseDate')}
                type="date"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
              <Select onValueChange={(value) => setValue('assignedTo', value)} defaultValue={watch('assignedTo')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Assign to sales rep" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {DEAL_OWNERS.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{owner}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Address Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Street Address</Label>
              <Input
                {...register('address')}
                placeholder="123 Main Street"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">Country</Label>
              <CountrySelect
                value={watch('country')}
                onValueChange={(val) => setValue('country', val)}
                placeholder="Select country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">City</Label>
              <CitySelect
                value={watch('city')}
                onValueChange={(val) => setValue('city', val)}
                country={watch('country')}
                placeholder="Select city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">State/Province</Label>
              <Input
                {...register('state')}
                placeholder="NY"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">ZIP/Postal Code</Label>
              <Input
                {...register('zipCode')}
                placeholder="10001"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* System Fields */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            System Fields
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">Created Date</Label>
                  <div className="text-sm font-medium">{watch('createdDate')}</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Modified Date</Label>
                  <div className="text-sm font-medium">{watch('modifiedDate')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Additional Information
          </h4>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              {...register('notes')}
              rows={4}
              placeholder="Additional notes about this deal opportunity..."
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};
