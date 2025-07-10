
import React from 'react';
import { EnhancedLeadDrawerForm } from './EnhancedLeadDrawerForm';
import { useCustomFields } from '../../hooks/useCustomFields';

interface Lead {
  id?: string;
  
  // Basic Contact Information (from CRM spec)
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile_phone?: string;
  job_title?: string;
  department?: string;
  
  // Contact Status & Classification
  lifecycle_stage: string;
  contact_status: string;
  lead_source: string;
  
  // Communication Preferences
  email_opt_in: boolean;
  phone_opt_in: boolean;
  preferred_contact_method: string;
  do_not_call: boolean;
  
  // Company Information (Optional)
  company?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  
  // Address Information
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // Additional Information
  notes?: string;
  tags?: string[];
  
  // System fields (Auto-Generated)
  contact_owner?: string;
  created_date?: string;
  modified_date?: string;
  
  // Legacy compatibility fields
  firstName?: string;
  lastName?: string;
  title?: string;
  source?: string;
  status?: string;
  assignedTo?: string;
  createdAt?: string;
  createdDate?: string;
  lastActivity?: string;
  value?: number;
  score?: number;
}

interface LeadDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Lead) => void;
  lead?: Lead | null;
}

export const LeadDrawerForm: React.FC<LeadDrawerFormProps> = (props) => {
  const { getActiveFields } = useCustomFields();
  
  // Transform legacy lead data to new CRM format
  const transformLead = (lead: Lead) => {
    if (!lead) return lead;
    
    return {
      ...lead,
      first_name: lead.firstName || lead.first_name || '',
      last_name: lead.lastName || lead.last_name || '',
      job_title: lead.title || lead.job_title || '',
      lead_source: lead.source || lead.lead_source || 'Website',
      contact_status: lead.status || lead.contact_status || 'Active',
      lifecycle_stage: 'Lead',
      email_opt_in: true,
      phone_opt_in: true,
      preferred_contact_method: 'Email',
      do_not_call: false,
      contact_owner: lead.assignedTo || lead.contact_owner || '',
      created_date: lead.createdAt || lead.created_date || new Date().toISOString().split('T')[0],
      modified_date: new Date().toISOString().split('T')[0]
    };
  };
  
  return (
    <EnhancedLeadDrawerForm
      {...props}
      lead={transformLead(props.lead)}
      customFields={getActiveFields()}
    />
  );
};
