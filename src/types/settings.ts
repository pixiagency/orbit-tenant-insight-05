export interface GeneralSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  systemLanguage: string;
  dateFormat: string;
  timeFormat: string;
  defaultCurrency: string;
  multiCurrency: boolean;
  supportedCurrencies: string[];
  timezone: string;
  workingHours: {
    start: string;
    end: string;
    workingDays: string[];
  };
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    favicon?: string;
  };
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  canExport: boolean;
  canImport: boolean;
  canAssignTasks: boolean;
  canAssignLeads: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  userIds: string[];
  regions: string[];
  products: string[];
  services: string[];
  leadDistribution: 'round-robin' | 'availability' | 'workload';
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'dropdown' | 'date' | 'checkbox' | 'textarea';
  module: 'leads' | 'deals' | 'contacts' | 'opportunities';
  options?: string[];
  required: boolean;
  visible: boolean;
  conditional?: {
    field: string;
    value: string;
  };
}

export interface Pipeline {
  id: string;
  name: string;
  module: 'deals' | 'opportunities';
  stages: PipelineStage[];
  teamIds: string[];
  isDefault: boolean;
  lossReasons: LossReason[];
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface LossReason {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export interface IntegrationSettings {
  social: {
    meta: { enabled: boolean; apiKey?: string; };
    instagram: { enabled: boolean; apiKey?: string; };
    linkedin: { enabled: boolean; apiKey?: string; };
  };
  voip: {
    provider: '3cx' | 'twilio' | 'sip' | 'none';
    config: Record<string, any>;
    recordingEnabled: boolean;
    storageLimit: number;
    callScoringEnabled: boolean;
  };
  messaging: {
    whatsapp: { enabled: boolean; apiKey?: string; };
    email: { enabled: boolean; provider: string; config: Record<string, any>; };
    sms: { enabled: boolean; provider: string; config: Record<string, any>; };
  };
  automation: {
    zapier: { enabled: boolean; webhookUrl?: string; };
    make: { enabled: boolean; webhookUrl?: string; };
    n8n: { enabled: boolean; webhookUrl?: string; };
  };
  maps: {
    googleMaps: { enabled: boolean; apiKey?: string; };
  };
}

export interface NotificationSettings {
  modules: {
    leads: { email: boolean; inApp: boolean; whatsapp: boolean; sms: boolean; };
    deals: { email: boolean; inApp: boolean; whatsapp: boolean; sms: boolean; };
    contacts: { email: boolean; inApp: boolean; whatsapp: boolean; sms: boolean; };
    tasks: { email: boolean; inApp: boolean; whatsapp: boolean; sms: boolean; };
  };
  roles: Record<string, {
    email: boolean;
    inApp: boolean;
    whatsapp: boolean;
    sms: boolean;
  }>;
}

export interface SystemSettings {
  general: GeneralSettings;
  roles: UserRole[];
  teams: Team[];
  customFields: CustomField[];
  pipelines: Pipeline[];
  clockInOut: {
    enabled: boolean;
    trackWorkingHours: boolean;
    exportable: boolean;
  };
  leadReassignment: {
    removeHistory: boolean;
    newLeadExperience: boolean;
  };
  integrations: IntegrationSettings;
  notifications: NotificationSettings;
  ai: {
    enabled: boolean;
    callSummarization: boolean;
    leadScoring: boolean;
    performanceAnalysis: boolean;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
  };
}
