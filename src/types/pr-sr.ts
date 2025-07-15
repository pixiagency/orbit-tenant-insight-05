
export interface PRSR {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile_phone?: string;
  job_title?: string;
  department?: string;
  type: 'pr' | 'sr'; // Product or Service
  contact_status: 'Active' | 'Inactive' | 'Qualified' | 'Unqualified';
  lead_source: string;
  email_opt_in: boolean;
  phone_opt_in: boolean;
  preferred_contact_method: string;
  do_not_call: boolean;
  company?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  tags?: string[];
  contact_owner?: string;
  created_date: string;
  modified_date: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  media_type?: 'Print' | 'Digital' | 'TV' | 'Radio' | 'Social Media' | 'Blog' | 'Podcast' | 'Service';
  reach?: number;
  influence_score?: number;
  last_contact_date?: string;
  next_follow_up_date?: string;
  campaign_interests?: string[];
  social_media_handles?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  // Product/Service specific fields
  price?: number;
  category?: string;
  sku?: string;
  inventory_quantity?: number;
  sales_count?: number;
}
