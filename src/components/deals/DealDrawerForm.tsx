import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, Calendar, User, Building, TrendingUp, FileText, Target } from 'lucide-react';
import { DrawerForm } from '../layout/DrawerForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

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
  tags: string;
  notes: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DealFormData {
  title: string;
  description: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  value: string;
  stage: string;
  priority: string;
  probability: string;
  expectedCloseDate: string;
  actualCloseDate: string;
  source: string;
  dealType: string;
  assignedTo: string;
  tags: string;
  notes: string;
  status: string;
}

interface DealDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DealFormData) => void;
  deal?: Deal | null;
  isLoading?: boolean;
}

const DEAL_STAGES = [
  'Lead', 'Qualified', 'Proposal', 'Negotiation', 'Decision', 'Closed Won', 'Closed Lost'
];

const DEAL_PRIORITIES = [
  'Low', 'Medium', 'High', 'Urgent'
];

const DEAL_SOURCES = [
  'Website', 'Referral', 'Cold Call', 'Email Campaign', 'Social Media', 'Trade Show', 'Partner', 'Direct', 'Other'
];

const DEAL_TYPES = [
  'New Business', 'Existing Business', 'Renewal', 'Upsell', 'Cross-sell'
];

const SALES_REPS = [
  'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Brown', 'Lisa Miller'
];

const DEAL_STATUS = [
  'Active', 'On Hold', 'Cancelled', 'Completed'
];

export const DealDrawerForm: React.FC<DealDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  deal,
  isLoading = false,
}) => {
  const form = useForm<DealFormData>({
    defaultValues: {
      title: '',
      description: '',
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      value: '',
      stage: 'Lead',
      priority: 'Medium',
      probability: '10',
      expectedCloseDate: '',
      actualCloseDate: '',
      source: 'Website',
      dealType: 'New Business',
      assignedTo: '',
      tags: '',
      notes: '',
      status: 'Active',
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  const selectedStage = watch('stage');

  // Auto-update probability based on stage
  const updateProbabilityByStage = (stage: string) => {
    const probabilities = {
      'Lead': '10',
      'Qualified': '25',
      'Proposal': '50',
      'Negotiation': '75',
      'Decision': '90',
      'Closed Won': '100',
      'Closed Lost': '0'
    };
    setValue('probability', probabilities[stage] || '10');
  };

  useEffect(() => {
    updateProbabilityByStage(selectedStage);
  }, [selectedStage, setValue]);

  useEffect(() => {
    if (deal) {
      reset({
        title: deal.title || '',
        description: deal.description || '',
        company: deal.company || '',
        contactName: deal.contactName || '',
        contactEmail: deal.contactEmail || '',
        contactPhone: deal.contactPhone || '',
        value: deal.value?.toString() || '',
        stage: deal.stage || 'Lead',
        priority: deal.priority || 'Medium',
        probability: deal.probability?.toString() || '10',
        expectedCloseDate: deal.expectedCloseDate?.split('T')[0] || '',
        actualCloseDate: deal.actualCloseDate?.split('T')[0] || '',
        source: deal.source || 'Website',
        dealType: deal.dealType || 'New Business',
        assignedTo: deal.assignedTo || '',
        tags: deal.tags || '',
        notes: deal.notes || '',
        status: deal.status || 'Active',
      });
    } else {
      reset({
        title: '',
        description: '',
        company: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        value: '',
        stage: 'Lead',
        priority: 'Medium',
        probability: '10',
        expectedCloseDate: '',
        actualCloseDate: '',
        source: 'Website',
        dealType: 'New Business',
        assignedTo: '',
        tags: '',
        notes: '',
        status: 'Active',
      });
    }
  }, [deal, reset]);

  const onSubmit = (data: DealFormData) => {
    onSave(data);
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? 'Edit Deal' : 'Add New Deal'}
      description={deal ? 'Update deal information and details' : 'Create a new deal opportunity'}
      onSave={handleSubmit(onSubmit)}
      isLoading={isLoading}
      saveText={deal ? 'Update Deal' : 'Create Deal'}
    >
      <form className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Target className="inline h-4 w-4 mr-2" />
            Deal Information
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Deal Title *</Label>
              <Input
                {...register('title', { required: 'Deal title is required' })}
                placeholder="e.g., Enterprise Software License"
                className="mt-1"
              />
              {errors.title && (
                <span className="text-sm text-red-600">{errors.title.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Brief description of the deal opportunity"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Company & Contact Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Building className="inline h-4 w-4 mr-2" />
            Company & Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="company" className="text-sm font-medium">Company *</Label>
              <Input
                {...register('company', { required: 'Company is required' })}
                placeholder="e.g., TechCorp Inc."
                className="mt-1"
              />
              {errors.company && (
                <span className="text-sm text-red-600">{errors.company.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="contactName" className="text-sm font-medium">Contact Name *</Label>
              <Input
                {...register('contactName', { required: 'Contact name is required' })}
                placeholder="e.g., John Smith"
                className="mt-1"
              />
              {errors.contactName && (
                <span className="text-sm text-red-600">{errors.contactName.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</Label>
              <Input
                {...register('contactEmail', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="john@techcorp.com"
                className="mt-1"
              />
              {errors.contactEmail && (
                <span className="text-sm text-red-600">{errors.contactEmail.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone" className="text-sm font-medium">Contact Phone</Label>
              <Input
                {...register('contactPhone')}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Deal Value & Stage */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <DollarSign className="inline h-4 w-4 mr-2" />
            Deal Value & Stage
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="value" className="text-sm font-medium">Deal Value *</Label>
              <Input
                {...register('value', { required: 'Deal value is required' })}
                type="number"
                placeholder="50000"
                className="mt-1"
              />
              {errors.value && (
                <span className="text-sm text-red-600">{errors.value.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="stage" className="text-sm font-medium">Stage *</Label>
              <Select 
                onValueChange={(value) => setValue('stage', value)} 
                defaultValue={watch('stage')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stage && (
                <span className="text-sm text-red-600">Please select a stage</span>
              )}
            </div>

            <div>
              <Label htmlFor="probability" className="text-sm font-medium">Probability (%)</Label>
              <Input
                {...register('probability')}
                type="number"
                min="0"
                max="100"
                placeholder="50"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
              <Select 
                onValueChange={(value) => setValue('priority', value)} 
                defaultValue={watch('priority')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline & Assignment */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Calendar className="inline h-4 w-4 mr-2" />
            Timeline & Assignment
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="expectedCloseDate" className="text-sm font-medium">Expected Close Date</Label>
              <Input
                {...register('expectedCloseDate')}
                type="date"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="actualCloseDate" className="text-sm font-medium">Actual Close Date</Label>
              <Input
                {...register('actualCloseDate')}
                type="date"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
              <Select 
                onValueChange={(value) => setValue('assignedTo', value)} 
                defaultValue={watch('assignedTo')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {SALES_REPS.map((rep) => (
                    <SelectItem key={rep} value={rep}>
                      {rep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select 
                onValueChange={(value) => setValue('status', value)} 
                defaultValue={watch('status')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <TrendingUp className="inline h-4 w-4 mr-2" />
            Additional Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="source" className="text-sm font-medium">Lead Source</Label>
              <Select 
                onValueChange={(value) => setValue('source', value)} 
                defaultValue={watch('source')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dealType" className="text-sm font-medium">Deal Type</Label>
              <Select 
                onValueChange={(value) => setValue('dealType', value)} 
                defaultValue={watch('dealType')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
              <Input
                {...register('tags')}
                placeholder="e.g., enterprise, software, urgent"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <FileText className="inline h-4 w-4 mr-2" />
            Notes
          </h4>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Any additional information about this deal..."
              className="mt-1"
              rows={4}
            />
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};