
import React from 'react';
import { EnhancedLeadDrawerForm } from './EnhancedLeadDrawerForm';
import { useCustomFields } from '../../hooks/useCustomFields';

interface Lead {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: string;
  status: string;
  notes: string;
  website?: string;
  industry?: string;
  leadScore?: number;
  estimatedValue?: number;
  assignedTo?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface LeadDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Lead) => void;
  lead?: Lead | null;
}

export const LeadDrawerForm: React.FC<LeadDrawerFormProps> = (props) => {
  const { getActiveFields } = useCustomFields();
  
  return (
    <EnhancedLeadDrawerForm
      {...props}
      customFields={getActiveFields()}
    />
  );
};
