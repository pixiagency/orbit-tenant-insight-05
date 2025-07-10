export interface Lead {
  id?: string;
  
  // Basic Contact Information (CRM spec)
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
  
  // Company Information
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
  
  // System fields
  contact_owner?: string;
  created_date?: string;
  modified_date?: string;
  
  // Legacy fields for backward compatibility
  firstName?: string;
  lastName?: string;
  title?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score?: number;
  source?: string;
  assignedTo?: string;
  createdDate?: string;
  createdAt?: string;
  lastActivity?: string;
  value?: number;
}

// Transform legacy data to CRM format
export const transformLegacyLead = (legacyLead: any): Lead => ({
  ...legacyLead,
  first_name: legacyLead.firstName || legacyLead.first_name || '',
  last_name: legacyLead.lastName || legacyLead.last_name || '',
  job_title: legacyLead.title || legacyLead.job_title || '',
  lifecycle_stage: legacyLead.status === 'qualified' ? 'Sales Qualified Lead' : 
                  legacyLead.status === 'converted' ? 'Customer' : 'Lead',
  contact_status: legacyLead.status === 'unqualified' ? 'Unqualified' : 'Active',
  lead_source: legacyLead.source === 'Website Form' ? 'Website' : 
               legacyLead.source === 'LinkedIn' ? 'Social Media' :
               legacyLead.source === 'Trade Show' ? 'Event' : 
               legacyLead.source || 'Website',
  email_opt_in: true,
  phone_opt_in: true,
  preferred_contact_method: 'Email',
  do_not_call: false,
  contact_owner: legacyLead.assignedTo || legacyLead.contact_owner || '',
  created_date: legacyLead.createdDate || legacyLead.created_date || new Date().toISOString().split('T')[0],
  modified_date: legacyLead.createdDate || legacyLead.modified_date || new Date().toISOString().split('T')[0]
});