
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
  Mail, 
  Phone, 
  Building, 
  User, 
  Star,
  AlertCircle,
  Target,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { PRSR } from '@/types/pr-sr';

interface RegeneratedPRSRFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prsr: PRSR) => void;
  prsr?: PRSR | null;
}

// Product/Service specific constants
const CONTACT_STATUSES = ['Active', 'Qualified', 'Inactive', 'Unqualified'];
const LEAD_SOURCES = ['Website', 'Trade Show', 'Referral', 'Cold Outreach', 'Social Media', 'Industry Event', 'Partner Network'];
const CONTACT_METHODS = ['Email', 'Phone', 'LinkedIn', 'Video Call'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const INDUSTRIES = ['Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Financial Services', 'Education', 'Government'];
const TEAM_MEMBERS = ['Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Brown', 'Alex Thompson'];

// Product/Service specific interests
const PRODUCT_INTERESTS = [
  'Software Solutions', 'Hardware Products', 'SaaS Platforms', 'Mobile Apps',
  'Enterprise Tools', 'Consumer Electronics', 'Industrial Equipment', 'Medical Devices'
];

const SERVICE_INTERESTS = [
  'Consulting Services', 'Training Programs', 'Support Services', 'Maintenance',
  'Implementation', 'Custom Development', 'Managed Services', 'Professional Services'
];

export const RegeneratedPRSRForm: React.FC<RegeneratedPRSRFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prsr
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'pr' | 'sr'>('pr');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const form = useForm<PRSR>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      job_title: '',
      type: 'pr',
      contact_status: 'Active',
      lead_source: 'Website',
      email_opt_in: true,
      phone_opt_in: true,
      preferred_contact_method: 'Email',
      do_not_call: false,
      company: '',
      website: '',
      industry: '',
      notes: '',
      contact_owner: '',
      priority: 'Medium',
      reach: 0,
      influence_score: 0,
      campaign_interests: [],
      created_date: new Date().toISOString().split('T')[0],
      modified_date: new Date().toISOString().split('T')[0]
    }
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  useEffect(() => {
    if (prsr) {
      reset(prsr);
      setSelectedType(prsr.type);
      setSelectedInterests(prsr.campaign_interests || []);
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        job_title: '',
        type: 'pr',
        contact_status: 'Active',
        lead_source: 'Website',
        email_opt_in: true,
        phone_opt_in: true,
        preferred_contact_method: 'Email',
        do_not_call: false,
        company: '',
        website: '',
        industry: '',
        notes: '',
        contact_owner: '',
        priority: 'Medium',
        reach: 0,
        influence_score: 0,
        campaign_interests: [],
        created_date: new Date().toISOString().split('T')[0],
        modified_date: new Date().toISOString().split('T')[0]
      });
      setSelectedType('pr');
      setSelectedInterests([]);
    }
  }, [prsr, reset, isOpen]);

  const validateForm = (data: PRSR): string[] => {
    const errors: string[] = [];
    
    if (!data.first_name?.trim()) {
      errors.push('First name is required');
    }
    
    if (!data.last_name?.trim()) {
      errors.push('Last name is required');
    }
    
    if (!data.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!data.company?.trim()) {
      errors.push('Company name is required');
    }
    
    return errors;
  };

  const handleTypeChange = (type: 'pr' | 'sr') => {
    setSelectedType(type);
    setValue('type', type);
    setSelectedInterests([]); // Reset interests when type changes
    setValue('campaign_interests', []);
  };

  const handleInterestToggle = (interest: string) => {
    const updatedInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(updatedInterests);
    setValue('campaign_interests', updatedInterests);
  };

  const onFormSubmit = (data: PRSR) => {
    const validationErrors = validateForm(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setValidationErrors([]);
    data.campaign_interests = selectedInterests;
    data.modified_date = new Date().toISOString().split('T')[0];
    
    onSubmit(data);
    toast.success(prsr ? 'Contact updated successfully!' : 'Contact created successfully!');
    onClose();
  };

  const availableInterests = selectedType === 'pr' ? PRODUCT_INTERESTS : SERVICE_INTERESTS;

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={prsr ? 'Edit Product/Service Contact' : 'Add New Product/Service Contact'}
      description={prsr ? 'Update the contact information below.' : 'Enter the contact information for products or services.'}
      onSave={handleSubmit(onFormSubmit)}
      saveText={prsr ? 'Update Contact' : 'Create Contact'}
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

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Contact Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('first_name', { required: true })}
                  placeholder="John"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('last_name', { required: true })}
                  placeholder="Smith"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('email', { required: true })}
                    type="email"
                    placeholder="john@company.com"
                    className="h-12 pl-10 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('phone')}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="h-12 pl-10 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Building className="h-5 w-5 mr-2 text-green-600" />
              Company & Role
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('company', { required: true })}
                  placeholder="TechCorp Inc."
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title" className="text-sm font-medium">Job Title</Label>
                <Input
                  {...register('job_title')}
                  placeholder="Product Manager"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('website')}
                    type="url"
                    placeholder="https://company.com"
                    className="h-12 pl-10 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
                <Select onValueChange={(value) => setValue('industry', value)} defaultValue={watch('industry')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Type & Classification */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Contact Type & Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contact Type</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="pr"
                      checked={selectedType === 'pr'}
                      onChange={() => handleTypeChange('pr')}
                      className="text-blue-600"
                    />
                    <Label htmlFor="pr" className="flex items-center space-x-1 cursor-pointer">
                      <Package className="h-4 w-4" />
                      <span>Products</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="sr"
                      checked={selectedType === 'sr'}
                      onChange={() => handleTypeChange('sr')}
                      className="text-blue-600"
                    />
                    <Label htmlFor="sr" className="flex items-center space-x-1 cursor-pointer">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Services</span>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_status" className="text-sm font-medium">Status</Label>
                <Select onValueChange={(value) => setValue('contact_status', value as any)} defaultValue={watch('contact_status')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue={watch('priority')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead_source" className="text-sm font-medium">Lead Source</Label>
                <Select onValueChange={(value) => setValue('lead_source', value)} defaultValue={watch('lead_source')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Interests & Metrics */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Star className="h-5 w-5 mr-2 text-orange-600" />
              {selectedType === 'pr' ? 'Product' : 'Service'} Interests & Metrics
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  {selectedType === 'pr' ? 'Product' : 'Service'} Interests
                </Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableInterests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedInterests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label className="text-sm cursor-pointer">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reach" className="text-sm font-medium">Audience Reach</Label>
                    <Input
                      {...register('reach', { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                      className="h-12 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="influence_score" className="text-sm font-medium">Influence Score</Label>
                    <Input
                      {...register('influence_score', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="50"
                      className="h-12 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_owner" className="text-sm font-medium">Contact Owner</Label>
                  <Select onValueChange={(value) => setValue('contact_owner', value)} defaultValue={watch('contact_owner')}>
                    <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_MEMBERS.map((member) => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Mail className="h-5 w-5 mr-2 text-indigo-600" />
              Communication Preferences
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferred_contact_method" className="text-sm font-medium">Preferred Method</Label>
                <Select onValueChange={(value) => setValue('preferred_contact_method', value)} defaultValue={watch('preferred_contact_method')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={watch('email_opt_in')}
                    onCheckedChange={(checked) => setValue('email_opt_in', checked as boolean)}
                  />
                  <Label className="text-sm cursor-pointer">Email marketing consent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={watch('phone_opt_in')}
                    onCheckedChange={(checked) => setValue('phone_opt_in', checked as boolean)}
                  />
                  <Label className="text-sm cursor-pointer">Phone marketing consent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={watch('do_not_call')}
                    onCheckedChange={(checked) => setValue('do_not_call', checked as boolean)}
                  />
                  <Label className="text-sm cursor-pointer text-red-600">Do Not Call</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
          <Textarea
            {...register('notes')}
            placeholder="Additional notes about this contact..."
            rows={4}
            className="bg-white dark:bg-gray-800"
          />
        </div>
      </form>
    </DrawerForm>
  );
};
