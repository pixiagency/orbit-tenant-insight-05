
import React from 'react';
import { DealDrawerForm } from './DealDrawerForm';
import { useCustomFields } from '../../hooks/useCustomFields';

interface DealFormData {
  deal_type: 'product_sale' | 'service_sale' | 'subscription';
  deal_name: string;
  customer: string;
  deal_value: number;
  sale_date: string;
  include_items: boolean;
  items: Array<{
    item: string;
    quantity?: number;
    unit_price: number;
  }>;
  sales_rep: string;
  payment_status: 'paid' | 'pending' | 'partial';
  payment_method?: 'cash' | 'card' | 'bank_transfer' | 'check';
  notes?: string;
  recurring_amount?: number;
  billing_cycle?: 'monthly' | 'quarterly' | 'yearly';
  subscription_start?: string;
  subscription_end?: string;
}

interface EnhancedDealDrawerFormProps {
  isOpen: boolean;
  deal?: DealFormData | null;
  onClose: () => void;
  onSave: (data: DealFormData) => void;
  isLoading?: boolean;
}

export const EnhancedDealDrawerForm: React.FC<EnhancedDealDrawerFormProps> = ({ onSave, ...props }) => {
  const { getActiveFields } = useCustomFields();
  
  return (
    <DealDrawerForm {...props} onSave={onSave} />
  );
};
