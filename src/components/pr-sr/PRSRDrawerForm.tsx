import React from 'react';
import { EnhancedPRSRDrawerForm } from './EnhancedPRSRDrawerForm';
import { useCustomFields } from '../../hooks/useCustomFields';
import { PRSR } from '@/types/pr-sr';

interface PRSRDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prsr: PRSR) => void;
  prsr?: PRSR | null;
}

export const PRSRDrawerForm: React.FC<PRSRDrawerFormProps> = (props) => {
  const { getActiveFields } = useCustomFields();
  
  return (
    <EnhancedPRSRDrawerForm
      {...props}
      customFields={getActiveFields()}
    />
  );
};