
export interface CustomerRegistrationData {
  // Company Information
  companyName: string;
  subdomain: string;
  fullDomain: string; // Generated: subdomain.mycrm.com
  industry: string;
  companySize: string;
  website?: string;
  description?: string;
  
  // Primary Contact Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  jobTitle?: string;
  
  // Business Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Registration Details
  selectedPackage: string;
  registrationDate: string;
  status: 'pending_verification' | 'active' | 'suspended' | 'inactive';
  trialEndDate: string;
  
  // Preferences
  agreeToTerms: boolean;
  subscribeToUpdates: boolean;
  
  // System Generated
  customerId?: string;
  verificationToken?: string;
  activationCode?: string;
  
  // Billing Information (to be added later)
  billingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Subscription Details
  subscription?: {
    packageId: string;
    startDate: string;
    endDate?: string;
    status: 'trial' | 'active' | 'cancelled' | 'expired';
    autoRenew: boolean;
  };
  
  // Contact Preferences
  contactPreferences?: {
    emailMarketing: boolean;
    productUpdates: boolean;
    securityAlerts: boolean;
    billingNotifications: boolean;
  };
}

export interface SubdomainCheckResult {
  subdomain: string;
  available: boolean;
  suggestions?: string[];
  message?: string;
}

export interface RegistrationResponse {
  success: boolean;
  customerId?: string;
  message: string;
  verificationRequired?: boolean;
  loginUrl?: string;
}
