
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
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { CountrySelect } from '@/components/shared/CountrySelect';
import { CitySelect } from '@/components/shared/CitySelect';

interface Lead {
  id?: string;
  // Contact Information (Required)
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  
  // Company Information
  company?: string;
  jobTitle?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  
  // Lead Details
  source: string;
  status: string;
  leadScore?: number;
  estimatedValue?: number;
  assignedTo?: string;
  priority?: string;
  
  // Address Information
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // Additional Information
  notes?: string;
  tags?: string[];
  
  // System fields
  createdAt?: string;
  updatedAt?: string;
}

interface EnhancedLeadDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Lead) => void;
  lead?: Lead | null;
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

// Mock custom fields for demonstration - removed business-specific fields
const MOCK_CUSTOM_FIELDS: CustomField[] = [
  {
    id: 'preferred_contact_method',
    name: 'preferred_contact_method',
    label: 'Preferred Contact Method',
    type: 'select',
    required: false,
    section: 'contact',
    options: ['Email', 'Phone', 'Text Message', 'Mail']
  },
  {
    id: 'birthday',
    name: 'birthday',
    label: 'Birthday',
    type: 'date',
    required: false,
    section: 'contact'
  },
  {
    id: 'social_media',
    name: 'social_media',
    label: 'Social Media Profile',
    type: 'url',
    required: false,
    section: 'additional',
    helpText: 'LinkedIn, Twitter, etc.'
  }
];

const LEAD_SOURCES = [
  'Website', 'Referral', 'Cold Call', 'Cold Email', 'Social Media', 
  'Trade Show', 'Advertising', 'Partner', 'Content Marketing', 'SEO', 'Other'
];

const LEAD_STATUSES = [
  'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 
  'Converted', 'Lost', 'Nurturing', 'Follow Up'
];

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 
  'Education', 'Consulting', 'Real Estate', 'Legal', 'Marketing', 'Other'
];

const COMPANY_SIZES = [
  '1-10 employees', '11-50 employees', '51-200 employees', 
  '201-500 employees', '501-1000 employees', '1000+ employees'
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const ASSIGNEES = [
  'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Brown', 'Alex Thompson'
];

export const EnhancedLeadDrawerForm: React.FC<EnhancedLeadDrawerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  customFields = MOCK_CUSTOM_FIELDS
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const form = useForm<Lead>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      website: '',
      industry: '',
      companySize: '',
      source: '',
      status: 'New',
      leadScore: 0,
      estimatedValue: 0,
      assignedTo: '',
      priority: 'Medium',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      notes: '',
      tags: []
    }
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (lead) {
      reset(lead);
      setTags(lead.tags || []);
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        website: '',
        industry: '',
        companySize: '',
        source: '',
        status: 'New',
        leadScore: 0,
        estimatedValue: 0,
        assignedTo: '',
        priority: 'Medium',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        notes: '',
        tags: []
      });
      setTags([]);
    }
  }, [lead, reset, isOpen]);

  // Custom validation logic
  const validateForm = (data: Lead): string[] => {
    const errors: string[] = [];
    
    // First name is always required
    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }
    
    // At least one contact method (email OR phone) is required
    if (!data.email?.trim() && !data.phone?.trim()) {
      errors.push('Either email or phone number is required');
    }
    
    // Email format validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Phone format validation (basic)
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }
    
    // Skip custom fields validation since they're removed from contacts
    
    return errors;
  };

  const onFormSubmit = (data: Lead) => {
    const validationErrors = validateForm(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setValidationErrors([]);
    data.tags = tags;
    onSubmit(data);
    toast.success(lead ? 'Lead updated successfully!' : 'Lead created successfully!');
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

  // Simplified custom field rendering - removed to avoid complexity for contacts
  const renderCustomField = (field: CustomField) => {
    return null; // Removed custom fields for contacts
  };

  const getCustomFieldsBySection = (section: string) => {
    return customFields.filter(field => field.section === section);
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Edit Contact' : 'Add New Contact'}
      description={lead ? 'Update the lead information below.' : 'Enter the lead information below.'}
      onSave={handleSubmit(onFormSubmit)}
      saveText={lead ? 'Update Lead' : 'Create Lead'}
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

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Contact Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('firstName', { required: true })}
                placeholder="John"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
              <Input
                {...register('lastName')}
                placeholder="Smith"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-amber-500 text-xs">(Email OR Phone required)</span>
              </Label>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone <span className="text-amber-500 text-xs">(Email OR Phone required)</span>
              </Label>
              <Input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

        </div>

        <Separator />

        {/* Company Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Company Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
              <Input
                {...register('company')}
                placeholder="Acme Corporation"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title</Label>
              <Input
                {...register('jobTitle')}
                placeholder="CEO, Manager, Director"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium">Website</Label>
              <Input
                {...register('website')}
                type="url"
                placeholder="https://company.com"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
              <Select onValueChange={(value) => setValue('industry', value)} defaultValue={watch('industry')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
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

            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-sm font-medium">Company Size</Label>
              <Select onValueChange={(value) => setValue('companySize', value)} defaultValue={watch('companySize')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
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
          </div>

        </div>

        <Separator />

        {/* Lead Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Lead Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">Lead Source</Label>
              <Select onValueChange={(value) => setValue('source', value)} defaultValue={watch('source')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select onValueChange={(value) => setValue('status', value)} defaultValue={watch('status')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
              <Select onValueChange={(value) => setValue('priority', value)} defaultValue={watch('priority')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <Badge variant={priority === 'Urgent' ? 'destructive' : priority === 'High' ? 'default' : 'secondary'}>
                        {priority}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
              <Select onValueChange={(value) => setValue('assignedTo', value)} defaultValue={watch('assignedTo')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNEES.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadScore" className="text-sm font-medium">Lead Score (0-100)</Label>
              <Input
                {...register('leadScore', { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                placeholder="75"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedValue" className="text-sm font-medium">Estimated Value</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  {...register('estimatedValue', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  placeholder="50000"
                  className="bg-gray-50 dark:bg-gray-700 pl-10"
                />
              </div>
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
                className="bg-gray-50 dark:bg-gray-700"
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
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">ZIP/Postal Code</Label>
              <Input
                {...register('zipCode')}
                placeholder="10001"
                className="bg-gray-50 dark:bg-gray-700"
              />
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
                className="bg-gray-50 dark:bg-gray-700"
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
              placeholder="Additional notes about this lead..."
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};
