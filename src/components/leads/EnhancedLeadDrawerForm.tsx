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
  Settings, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { CountrySelect } from '@/components/shared/CountrySelect';
import { CitySelect } from '@/components/shared/CitySelect';
import { PhoneInput } from '@/components/shared/PhoneInput';
import { Lead } from '@/types/leads';

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

// CRM Specification Constants
const LIFECYCLE_STAGES = [
  'Subscriber',
  'Lead', 
  'Marketing Qualified Lead',
  'Sales Qualified Lead',
  'Customer'
];

const CONTACT_STATUSES = [
  'Active',
  'Inactive', 
  'Unqualified'
];

const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Cold Call',
  'Event',
  'Social Media',
  'Advertisement'
];

const PREFERRED_CONTACT_METHODS = [
  'Email',
  'Phone',
  'SMS',
  'WhatsApp'
];

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 
  'Education', 'Consulting', 'Real Estate', 'Legal', 'Marketing', 'Other'
];

const COMPANY_SIZES = [
  '1-10 employees', '11-50 employees', '51-200 employees', 
  '201-500 employees', '501-1000 employees', '1000+ employees'
];

const CONTACT_OWNERS = [
  'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Brown', 'Alex Thompson'
];

export const EnhancedLeadDrawerForm: React.FC<EnhancedLeadDrawerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  customFields = []
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const form = useForm<Lead>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      mobile_phone: '',
      job_title: '',
      department: '',
      lifecycle_stage: 'Lead',
      contact_status: 'Active',
      lead_source: 'Website',
      email_opt_in: true,
      phone_opt_in: true,
      preferred_contact_method: 'Email',
      do_not_call: false,
      company: '',
      website: '',
      industry: '',
      companySize: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      notes: '',
      tags: [],
      contact_owner: '',
      created_date: new Date().toISOString().split('T')[0],
      modified_date: new Date().toISOString().split('T')[0]
    }
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (lead) {
      reset(lead);
      setTags(lead.tags || []);
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        mobile_phone: '',
        job_title: '',
        department: '',
        lifecycle_stage: 'Lead',
        contact_status: 'Active',
        lead_source: 'Website',
        email_opt_in: true,
        phone_opt_in: true,
        preferred_contact_method: 'Email',
        do_not_call: false,
        company: '',
        website: '',
        industry: '',
        companySize: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        notes: '',
        tags: [],
        contact_owner: '',
        created_date: new Date().toISOString().split('T')[0],
        modified_date: new Date().toISOString().split('T')[0]
      });
      setTags([]);
    }
  }, [lead, reset, isOpen]);

  // Custom validation logic
  const validateForm = (data: Lead): string[] => {
    const errors: string[] = [];
    
    // First name is always required
    if (!data.first_name?.trim()) {
      errors.push('First name is required');
    }
    
    // Last name is required
    if (!data.last_name?.trim()) {
      errors.push('Last name is required');
    }
    
    // Email is required and must be unique
    if (!data.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Phone format validation (basic)
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid business phone number');
    }
    
    // Mobile phone format validation (basic)
    if (data.mobile_phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.mobile_phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid mobile phone number');
    }
    
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
    data.modified_date = new Date().toISOString().split('T')[0];
    
    onSubmit(data);
    toast.success(lead ? 'Contact updated successfully!' : 'Contact created successfully!');
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

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Edit Contact' : 'Add New Contact'}
      description={lead ? 'Update the contact information below.' : 'Enter the contact information below.'}
      onSave={handleSubmit(onFormSubmit)}
      saveText={lead ? 'Update Contact' : 'Create Contact'}
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

        {/* Basic Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Basic Contact Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('first_name', { required: true })}
                placeholder="John"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('last_name', { required: true })}
                placeholder="Smith"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(Must be unique)</span>
              </Label>
              <Input
                {...register('email', { required: true })}
                type="email"
                placeholder="john@example.com"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Business Phone</Label>
              <Input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile_phone" className="text-sm font-medium">Mobile Phone</Label>
              <PhoneInput
                value={watch('mobile_phone') || ''}
                onChange={(value) => setValue('mobile_phone', value)}
                placeholder="Enter mobile phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title" className="text-sm font-medium">Job Title</Label>
              <Input
                {...register('job_title')}
                placeholder="CEO, Manager, Director"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium">Department</Label>
              <Input
                {...register('department')}
                placeholder="Sales, Marketing, IT"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Status & Classification */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Contact Status & Classification
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_status" className="text-sm font-medium">Contact Status</Label>
              <Select onValueChange={(value) => setValue('contact_status', value)} defaultValue={watch('contact_status')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_STATUSES.map((status) => (
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
              <Label htmlFor="lead_source" className="text-sm font-medium">Lead Source</Label>
              <Select onValueChange={(value) => setValue('lead_source', value)} defaultValue={watch('lead_source')}>
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
              <Label htmlFor="preferred_contact_method" className="text-sm font-medium">Preferred Contact Method</Label>
              <Select onValueChange={(value) => setValue('preferred_contact_method', value)} defaultValue={watch('preferred_contact_method')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
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
                  checked={watch('email_opt_in')}
                  onCheckedChange={(checked) => setValue('email_opt_in', checked as boolean)}
                />
                <Label className="text-sm cursor-pointer">Permission to send emails</Label>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-blue-700 dark:text-blue-400">Phone Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Checkbox
                    checked={watch('phone_opt_in')}
                    onCheckedChange={(checked) => setValue('phone_opt_in', checked as boolean)}
                  />
                  <Label className="text-sm cursor-pointer">Permission to call</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Checkbox
                    checked={watch('do_not_call')}
                    onCheckedChange={(checked) => setValue('do_not_call', checked as boolean)}
                  />
                  <Label className="text-sm cursor-pointer text-red-700 dark:text-red-400">Do Not Call (Legal flag)</Label>
                </div>
              </div>
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

        {/* System Fields */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            System Fields
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_owner" className="text-sm font-medium">Contact Owner</Label>
              <Select onValueChange={(value) => setValue('contact_owner', value)} defaultValue={watch('contact_owner')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Assign to sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_OWNERS.map((owner) => (
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

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">Created Date</Label>
                  <div className="text-sm font-medium">{watch('created_date')}</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Modified Date</Label>
                  <div className="text-sm font-medium">{watch('modified_date')}</div>
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
              placeholder="Additional notes about this contact..."
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};