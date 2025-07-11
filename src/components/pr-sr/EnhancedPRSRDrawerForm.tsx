import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Star, 
  Calendar,
  AlertCircle,
  Users,
  Megaphone,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { CountrySelect } from '@/components/shared/CountrySelect';
import { CitySelect } from '@/components/shared/CitySelect';
import { PhoneInput } from '@/components/shared/PhoneInput';
import { PRSR } from '@/types/pr-sr';

interface EnhancedPRSRDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prsr: PRSR) => void;
  prsr?: PRSR | null;
  customFields?: CustomField[];
}

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

// PR/SR Specific Constants
const CONTACT_STATUSES = ['Active', 'Inactive', 'Qualified', 'Unqualified'];
const LEAD_SOURCES = ['Website', 'Referral', 'Cold Call', 'Event', 'Social Media', 'Advertisement', 'Press Release'];
const PREFERRED_CONTACT_METHODS = ['Email', 'Phone', 'SMS', 'WhatsApp'];
const INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Non-Profit', 'Media', 'Government'];
const CONTACT_OWNERS = ['Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Brown', 'Alex Thompson'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const MEDIA_TYPES = ['Print', 'Digital', 'TV', 'Radio', 'Social Media', 'Blog', 'Podcast'];
const CAMPAIGN_INTERESTS = ['Environmental', 'Education', 'Healthcare', 'Technology', 'Community Development', 'Sustainability', 'Innovation'];

export const EnhancedPRSRDrawerForm: React.FC<EnhancedPRSRDrawerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prsr,
  customFields = []
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const form = useForm<PRSR>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      mobile_phone: '',
      job_title: '',
      department: '',
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
      companySize: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      notes: '',
      tags: [],
      contact_owner: '',
      priority: 'Medium',
      media_type: 'Digital',
      reach: 0,
      influence_score: 0,
      campaign_interests: [],
      social_media_handles: {},
      created_date: new Date().toISOString().split('T')[0],
      modified_date: new Date().toISOString().split('T')[0]
    }
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (prsr) {
      reset(prsr);
      setTags(prsr.tags || []);
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        mobile_phone: '',
        job_title: '',
        department: '',
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
        companySize: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        notes: '',
        tags: [],
        contact_owner: '',
        priority: 'Medium',
        media_type: 'Digital',
        reach: 0,
        influence_score: 0,
        campaign_interests: [],
        social_media_handles: {},
        created_date: new Date().toISOString().split('T')[0],
        modified_date: new Date().toISOString().split('T')[0]
      });
      setTags([]);
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
    
    return errors;
  };

  const onFormSubmit = (data: PRSR) => {
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
    toast.success(prsr ? 'PR/SR contact updated successfully!' : 'PR/SR contact created successfully!');
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
      title={prsr ? 'Edit PR/SR Contact' : 'Add New PR/SR Contact'}
      description={prsr ? 'Update the contact information below.' : 'Enter the contact information below.'}
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

        {/* Basic Contact Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Basic Contact Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('first_name', { required: true })}
                  placeholder="John"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('last_name', { required: true })}
                  placeholder="Smith"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="john@example.com"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Business Phone</Label>
                <Input
                  {...register('phone')}
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
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
                  placeholder="PR Manager, Communications Director"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* PR/SR Classification */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Star className="h-5 w-5 mr-2 text-purple-600" />
              PR/SR Classification & Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Contact Type</Label>
                <Select onValueChange={(value) => setValue('type', value as 'pr' | 'sr')} defaultValue={watch('type')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pr">
                      <div className="flex items-center space-x-2">
                        <Megaphone className="h-4 w-4" />
                        <span>Public Relations</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sr">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4" />
                        <span>Social Responsibility</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_status" className="text-sm font-medium">Contact Status</Label>
                <Select onValueChange={(value) => setValue('contact_status', value as any)} defaultValue={watch('contact_status')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        <Badge variant={status === 'Active' ? 'default' : status === 'Qualified' ? 'secondary' : 'outline'}>
                          {status}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">Priority Level</Label>
                <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue={watch('priority')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        <Badge variant={priority === 'Critical' ? 'destructive' : priority === 'High' ? 'default' : 'outline'}>
                          {priority}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media_type" className="text-sm font-medium">Media Type</Label>
                <Select onValueChange={(value) => setValue('media_type', value as any)} defaultValue={watch('media_type')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reach" className="text-sm font-medium">Audience Reach</Label>
                <Input
                  {...register('reach', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="influence_score" className="text-sm font-medium">Influence Score (1-100)</Label>
                <Input
                  {...register('influence_score', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="100"
                  placeholder="50"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Communication Preferences */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Mail className="h-5 w-5 mr-2 text-green-600" />
              Communication Preferences
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferred_contact_method" className="text-sm font-medium">Preferred Contact Method</Label>
                <Select onValueChange={(value) => setValue('preferred_contact_method', value)} defaultValue={watch('preferred_contact_method')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREFERRED_CONTACT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_owner" className="text-sm font-medium">Contact Owner</Label>
                <Select onValueChange={(value) => setValue('contact_owner', value)} defaultValue={watch('contact_owner')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_OWNERS.map((owner) => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Communication Permissions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-green-700 dark:text-green-400">Email Permissions</Label>
                <div className="flex items-center space-x-2 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
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
                  <div className="flex items-center space-x-2 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Checkbox
                      checked={watch('phone_opt_in')}
                      onCheckedChange={(checked) => setValue('phone_opt_in', checked as boolean)}
                    />
                    <Label className="text-sm cursor-pointer">Permission to call</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
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
        </div>

        <Separator />

        {/* Company Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Building className="h-5 w-5 mr-2 text-orange-600" />
              Company & Organization Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">Company/Organization Name</Label>
                <Input
                  {...register('company')}
                  placeholder="ABC Media Group"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                <Input
                  {...register('website')}
                  type="url"
                  placeholder="https://company.com"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
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

        <Separator />

        {/* Campaign Interests & Social Media */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Campaign Interests & Social Media
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Campaign Interests</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CAMPAIGN_INTERESTS.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        checked={watch('campaign_interests')?.includes(interest)}
                        onCheckedChange={(checked) => {
                          const current = watch('campaign_interests') || [];
                          if (checked) {
                            setValue('campaign_interests', [...current, interest]);
                          } else {
                            setValue('campaign_interests', current.filter(i => i !== interest));
                          }
                        }}
                      />
                      <Label className="text-sm cursor-pointer">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Social Media Handles</Label>
                <div className="space-y-3">
                  <Input
                    {...register('social_media_handles.twitter')}
                    placeholder="@twitter_handle"
                    className="h-10 bg-white dark:bg-gray-800"
                  />
                  <Input
                    {...register('social_media_handles.linkedin')}
                    placeholder="LinkedIn profile URL"
                    className="h-10 bg-white dark:bg-gray-800"
                  />
                  <Input
                    {...register('social_media_handles.instagram')}
                    placeholder="@instagram_handle"
                    className="h-10 bg-white dark:bg-gray-800"
                  />
                  <Input
                    {...register('social_media_handles.facebook')}
                    placeholder="Facebook page URL"
                    className="h-10 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Notes and Tags */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Additional notes about this contact..."
              rows={4}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add Tag
              </Button>
            </div>
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};