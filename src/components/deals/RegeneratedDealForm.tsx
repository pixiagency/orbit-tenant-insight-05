
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DrawerForm } from '../layout/DrawerForm';
import { CalendarIcon, DollarSign, Users, Target, Building, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Deal {
  id?: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  assignedTo: string;
  source: string;
  description: string;
  lastActivity: string;
}

interface RegeneratedDealFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
  initialData?: Deal | null;
}

const DEAL_STAGES = [
  { value: 'prospecting', label: 'Prospecting', probability: 10 },
  { value: 'qualification', label: 'Qualification', probability: 25 },
  { value: 'proposal', label: 'Proposal', probability: 50 },
  { value: 'negotiation', label: 'Negotiation', probability: 75 },
  { value: 'closed-won', label: 'Closed Won', probability: 100 },
  { value: 'closed-lost', label: 'Closed Lost', probability: 0 }
];

const LEAD_SOURCES = ['Website', 'Referral', 'Cold Call', 'Event', 'Social Media', 'Advertisement'];
const TEAM_MEMBERS = ['Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Brown', 'Alex Thompson'];

export const RegeneratedDealForm: React.FC<RegeneratedDealFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>('prospecting');

  const form = useForm<Deal>({
    defaultValues: {
      title: '',
      company: '',
      contact: '',
      value: 0,
      stage: 'prospecting',
      probability: 10,
      closeDate: '',
      assignedTo: '',
      source: 'Website',
      description: '',
      lastActivity: new Date().toISOString().split('T')[0]
    }
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedStage(initialData.stage);
    } else {
      reset({
        title: '',
        company: '',
        contact: '',
        value: 0,
        stage: 'prospecting',
        probability: 10,
        closeDate: '',
        assignedTo: '',
        source: 'Website',
        description: '',
        lastActivity: new Date().toISOString().split('T')[0]
      });
      setSelectedStage('prospecting');
    }
  }, [initialData, reset, isOpen]);

  const validateForm = (data: Deal): string[] => {
    const errors: string[] = [];
    
    if (!data.title?.trim()) {
      errors.push('Deal title is required');
    }
    
    if (!data.company?.trim()) {
      errors.push('Company name is required');
    }
    
    if (!data.contact?.trim()) {
      errors.push('Contact person is required');
    }
    
    if (!data.value || data.value <= 0) {
      errors.push('Deal value must be greater than 0');
    }
    
    if (!data.closeDate) {
      errors.push('Expected close date is required');
    }
    
    return errors;
  };

  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setValue('stage', stage as Deal['stage']);
    
    const stageData = DEAL_STAGES.find(s => s.value === stage);
    if (stageData) {
      setValue('probability', stageData.probability);
    }
  };

  const onFormSubmit = (data: Deal) => {
    const validationErrors = validateForm(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setValidationErrors([]);
    onSave(data);
    toast.success(initialData ? 'Deal updated successfully!' : 'Deal created successfully!');
    onClose();
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'outline';
      case 'qualification': return 'secondary';
      case 'proposal': return 'default';
      case 'negotiation': return 'default';
      case 'closed-won': return 'default';
      case 'closed-lost': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Deal' : 'Create New Deal'}
      description={initialData ? 'Update the deal information below.' : 'Enter the deal information below.'}
      onSave={handleSubmit(onFormSubmit)}
      saveText={initialData ? 'Update Deal' : 'Create Deal'}
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

        {/* Basic Deal Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Deal Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Deal Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('title', { required: true })}
                  placeholder="Enterprise Software License"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-medium">
                  Deal Value <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('value', { required: true, valueAsNumber: true })}
                    type="number"
                    placeholder="150000"
                    className="h-12 pl-10 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company & Contact Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Building className="h-5 w-5 mr-2 text-green-600" />
              Company & Contact
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
                <Label htmlFor="contact" className="text-sm font-medium">
                  Primary Contact <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('contact', { required: true })}
                    placeholder="John Smith"
                    className="h-12 pl-10 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Stage & Probability */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Stage & Assignment
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stage" className="text-sm font-medium">Deal Stage</Label>
                <Select value={selectedStage} onValueChange={handleStageChange}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStageColor(stage.value)}>
                            {stage.label}
                          </Badge>
                          <span className="text-sm text-gray-500">({stage.probability}%)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="probability" className="text-sm font-medium">Win Probability</Label>
                <Input
                  {...register('probability', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="75"
                  className="h-12 bg-white dark:bg-gray-800"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
                <Select onValueChange={(value) => setValue('assignedTo', value)} defaultValue={watch('assignedTo')}>
                  <SelectTrigger className="h-12 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select assignee" />
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

        {/* Timeline & Source */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <CalendarIcon className="h-5 w-5 mr-2 text-orange-600" />
              Timeline & Source
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="closeDate" className="text-sm font-medium">
                  Expected Close Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('closeDate', { required: true })}
                  type="date"
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source" className="text-sm font-medium">Lead Source</Label>
                <Select onValueChange={(value) => setValue('source', value)} defaultValue={watch('source')}>
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

        {/* Description */}
        <div className="space-y-4">
          <Label htmlFor="description" className="text-sm font-medium">Deal Description</Label>
          <Textarea
            {...register('description')}
            placeholder="Describe the deal details, requirements, and next steps..."
            rows={4}
            className="bg-white dark:bg-gray-800"
          />
        </div>
      </form>
    </DrawerForm>
  );
};
