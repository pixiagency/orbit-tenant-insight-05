import React from 'react';
import { OpportunityForm } from './OpportunityForm';
import { useCustomFields } from '../../hooks/useCustomFields';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  description?: string;
  competitorInfo?: string;
  decisionMakers?: string;
  budget?: number;
  timeline?: string;
  painPoints?: string;
  proposalSent?: boolean;
  contractSent?: boolean;
  createdAt: string;
  lastActivity: string;
}

interface EnhancedOpportunityDrawerFormProps {
  isOpen: boolean;
  opportunity?: Opportunity | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const EnhancedOpportunityDrawerForm: React.FC<EnhancedOpportunityDrawerFormProps> = (props) => {
  const { getActiveFields } = useCustomFields();
  
  const handleCustomFieldsClick = () => {
    toast.info('Navigate to Settings > Custom Fields to manage opportunity fields');
  };
  
  return (
    <div className="relative">
      <OpportunityForm {...props} />
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCustomFieldsClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          Custom Fields
        </Button>
      </div>
    </div>
  );
};