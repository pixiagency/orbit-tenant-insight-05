import React from 'react';
import { DealDrawerForm } from './DealDrawerForm';
import { useCustomFields } from '../../hooks/useCustomFields';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

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

interface EnhancedDealDrawerFormProps {
  isOpen: boolean;
  deal?: Deal | null;
  onClose: () => void;
  onSubmit: (data: DealFormData) => void;
  isLoading?: boolean;
}

export const EnhancedDealDrawerForm: React.FC<EnhancedDealDrawerFormProps> = ({ onSubmit, ...props }) => {
  const { getActiveFields } = useCustomFields();
  
  const handleCustomFieldsClick = () => {
    toast.info('Navigate to Settings > Custom Fields to manage deal fields');
  };
  
  return (
    <div className="relative">
      <DealDrawerForm {...props} onSave={onSubmit} />
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCustomFieldsClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Custom Fields
        </Button>
      </div>
    </div>
  );
};