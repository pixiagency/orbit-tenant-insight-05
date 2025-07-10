
import React from 'react';
import { DealDrawerForm } from './DealDrawerForm';
import { useCustomFields } from '../../hooks/useCustomFields';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  source: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  industry: string;
  companySize: string;
  website: string;
}

interface EnhancedDealDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deal: Deal) => void;
  deal?: Deal | null;
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
