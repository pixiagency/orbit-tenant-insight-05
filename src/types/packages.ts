export interface PackageFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  durationUnit: 'days' | 'months' | 'years' | 'lifetime';
  maxUsers: number;
  maxStorageGB: number;
  maxContacts: number;
  maxLeads: number;
  modules: string[];
  aiEnabled: boolean;
  aiFeatures: string[];
  integrationsEnabled: boolean;
  selectedIntegrations: string[];
  smsSendingLimit?: number;
  monthlyWhatsAppMessages?: number;
  monthlyEmailMessages?: number;
  monthlyCallMinutes?: number;
  monthlyAiAutomations?: number;
  monthlySmartRecommendations?: number;
  monthlyAiAssistantQueries?: number;
  isPublic: boolean;
  status: 'active' | 'inactive';
  notificationsEnabled: boolean;
  refund_period?: number;
}

// Complete Package type with all properties needed for display and management
export interface Package {
  id: string;
  name: string;
  description?: string;
  pricing: {
    amount: number;
    currency: string;
    duration: number;
    durationUnit: 'days' | 'months' | 'years' | 'lifetime';
  };
  limits: {
    maxUsers: number;
    maxLeads: number;
    maxStorageGB: number;
    maxContacts: number;
    smsSendingLimit?: number;
    monthlyWhatsAppMessages?: number;
    monthlyEmailMessages?: number;
    monthlyCallMinutes?: number;
    monthlyAiAutomations?: number;
    monthlySmartRecommendations?: number;
    monthlyAiAssistantQueries?: number;
  };
  modules: string[];
  aiOptions?: {
    enabled: boolean;
    features: string[];
  };
  isPublic: boolean;
  status: 'active' | 'inactive';
  usersCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  refundPeriodDays: number;
}

// Export PackageFilters interface with all required properties
export interface PackageFilters {
  search: string;
  status: 'all' | 'active' | 'inactive';
  pricing: 'all' | 'monthly' | 'yearly' | 'custom';
  priceType: 'all' | 'monthly' | 'yearly' | 'custom';
  duration: 'all' | 'days' | 'months' | 'years' | 'lifetime';
  priceRange: [number, number];
  modules: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const AVAILABLE_MODULES = [
  { id: 'crm', name: 'CRM Core', color: 'bg-blue-100 text-blue-800' },
  { id: 'leads', name: 'Lead Management', color: 'bg-green-100 text-green-800' },
  { id: 'contacts', name: 'Contact Management', color: 'bg-purple-100 text-purple-800' },
  { id: 'deals', name: 'Deal Pipeline', color: 'bg-orange-100 text-orange-800' },
  { id: 'tasks', name: 'Task Management', color: 'bg-red-100 text-red-800' },
  { id: 'calendar', name: 'Calendar & Scheduling', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'reports', name: 'Reports & Analytics', color: 'bg-pink-100 text-pink-800' },
  { id: 'automation', name: 'Workflow Automation', color: 'bg-teal-100 text-teal-800' },
  { id: 'forms', name: 'Forms & Landing Pages', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'email', name: 'Email', color: 'bg-sky-100 text-sky-800' },
  { id: 'products', name: 'Product Catalog', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'invoicing', name: 'Invoicing & Billing', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'custom-fields', name: 'Custom Fields', color: 'bg-violet-100 text-violet-800' },
  { id: 'integrations', name: 'Third-party Integrations', color: 'bg-rose-100 text-rose-800' },
  { id: 'mobile', name: 'Mobile App Access', color: 'bg-amber-100 text-amber-800' },
  { id: 'api', name: 'API Access', color: 'bg-slate-100 text-slate-800' },
];
