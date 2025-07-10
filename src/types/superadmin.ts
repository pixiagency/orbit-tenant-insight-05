// Client Types
export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  subdomain: string;
  status: 'active' | 'inactive' | 'suspended' | 'trial' | 'expired';
  packageId?: string;
  packageName?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  monthlyRevenue: number;
  totalUsers: number;
  storageUsed: number;
  createdAt: string;
  lastLogin?: string;
  isReadOnly?: boolean;
  externalBillingUrl?: string;
  hasTrialDays?: boolean; // New field to track if trial days have been used
  trialDaysCount?: number; // Number of trial days added
  trialDaysReason?: string; // Reason for adding trial days
  website?: string;
  address?: string;
  notes?: string;
  companySize?: string;
  industry?: string;
  source?: string;
  // Additional properties used in components
  usersCount?: number;
  usersLimit?: number;
  contactsCount?: number;
  contactsLimit?: number;
  storageLimit?: number;
  callMinutesUsed?: number;
  callMinutesLimit?: number;
  registrationDate?: string;
  loginUrl?: string;
  lastActivity?: string;
  // Add subscription aliases for compatibility
  subscriptionStart?: string;
  subscriptionExpiry?: string;
}

export interface ClientFormData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  packageId: string;
  status: 'active' | 'inactive';
  subscriptionStart: string;
  subscriptionExpiry?: string;
  usersLimitOverride?: number;
  contactsLimitOverride?: number;
  storageLimitOverride?: number;
  domainSubdomain: string;
  sendPasswordSetupEmail: boolean;
  password?: string;
  notes?: string;
  createdAt?: string;
  source?: string;
  trialDays?: number;
  department?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  industry?: string;
  companySize?: string;
  billingAddress?: string;
  shippingAddress?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  jobTitle?: string;
  country?: string;
  city?: string;
  postalCode?: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  clientId: string;
  clientName: string;
  packageId: string;
  packageName: string;
  activationMethod: 'manual' | 'activation-code' | 'stripe' | 'api';
  source: string;
  status: 'active' | 'expired' | 'cancelled' | 'suspended';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  amount: number;
  currency: string;
  paymentStatus: 'paid' | 'unpaid' | 'not-applicable';
  lastUpdated: string;
  nextBilling?: string;
  createdAt: string;
  notes?: string;
  isReadOnly?: boolean;
  externalBillingUrl?: string;
  trialDays?: number;
  cycle?: string;
  discountCode?: string;
  discountAmount?: number;
  department?: string;
  salesRep?: string;
  contractTerms?: string;
  billingContact?: string;
  purchaseOrder?: string;
}

export interface SubscriptionFormData {
  clientId: string;
  packageId: string;
  activationMethod: 'manual' | 'activation-code' | 'stripe' | 'api';
  source: string;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentStatus: 'paid' | 'unpaid' | 'not-applicable';
  status: 'active' | 'suspended' | 'cancelled' | 'expired';
  attachment?: FileList;
  activationCode?: string;
  notes?: string;
  trialDays?: number;
  createInvoice?: boolean;
  discountCode?: string;
  discountAmount?: number;
  department?: string;
  salesRep?: string;
  contractTerms?: string;
  billingContact?: string;
  purchaseOrder?: string;
}

// Activation Code Types
export interface ActivationCode {
  id: string;
  code: string;
  packageId?: string;
  packageName: string;
  usageType: 'one-time' | 'multi-use' | 'unlimited';
  usageLimit?: number;
  usageCount: number;
  usersLimit: number;
  validityDays?: number;
  expirationDate?: string;
  status: 'active' | 'expired' | 'used';
  usedBy?: string[];
  createdAt: string;
  createdBy: string;
  type: 'activation' | 'discount';
  discountPercentage?: number;
  trialDays?: number;
  source?: string;
  department?: string;
  campaign?: string;
  partner?: string;
  region?: string;
  restrictions?: string[];
}

export interface ActivationCodeFormData {
  code: string;
  packageId?: string;
  usageType: 'one-time' | 'multi-use' | 'unlimited';
  usageLimit?: number;
  usersLimit: number;
  validityDays?: number;
  expirationDate?: string;
  status: 'active' | 'expired' | 'used';
  type: 'activation' | 'discount';
  discountPercentage?: number;
  trialDays?: number;
  source?: string;
  sources?: string[];
  codeCount?: number;
  codeParts?: number;
  partLength?: number;
  department?: string;
  campaign?: string;
  partner?: string;
  region?: string;
  restrictions?: string[];
}

// Billing Log Types
export interface BillingLog {
  id: string;
  clientId: string;
  clientName: string;
  type: 'payment' | 'refund' | 'charge' | 'credit';
  description: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'cancelled' | 'successful';
  paymentMethod?: string;
  transactionId?: string;
  subscriptionId?: string;
  processedAt: string;
  notes?: string;
  invoiceNumber?: string;
  retryCount?: number;
  billingDate: string;
  dueDate: string;
  paidAt?: string;
}

// Audit Trail Types
export interface AuditLog {
  id: string;
  event: string;
  entityType: 'client' | 'package' | 'subscription' | 'user' | 'system';
  entityId?: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'access';
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// System Settings Types
export interface SystemSettings {
  id: string;
  category: 'general' | 'security' | 'notifications' | 'billing' | 'features';
  key: string;
  value: string | number | boolean;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  isPublic: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

// Filter Types
export interface ClientFilters {
  search: string;
  status: string;
  packageId: string;
  usage?: string;
  activity?: string;
  teamSize?: string;
  subscription?: string;
  callUsage?: string;
  source?: string;
  dateRange: { from?: string; to?: string };
}

export interface SubscriptionFilters {
  search: string;
  status: string;
  packageId: string;
  cycle: string;
  activationMethod: string;
  paymentStatus: string;
  autoRenew: string;
  startDateRange: string;
  endDateRange: string;
  dateRange: { from?: string; to?: string };
}

export interface ActivationCodeFilters {
  search: string;
  status: string;
  usageType: string;
  packageId: string;
  dateRange: { from?: string; to?: string };
}

export interface BillingLogFilters {
  search: string;
  type: string;
  status: string;
  clientId: string;
  dateRange: { from?: string; to?: string };
}

export interface AuditLogFilters {
  search: string;
  entityType: string;
  action: string;
  userId: string;
  severity: string;
  dateRange: { from?: string; to?: string };
}

// Table View Options
export interface TableViewOptions {
  view: 'list' | 'grid';
  columns: string[];
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Package Types
export interface Package {
  id: string;
  name: string;
  description: string;
  type: 'subscription' | 'one-time' | 'freemium';
  category: string;
  status: 'active' | 'inactive' | 'archived';
  usersLimit: number;
  contactsLimit?: number;
  storageLimit?: number;
  callMinutesLimit: number;
  features: string[];
  pricing: {
    monthly?: number;
    yearly?: number;
    oneTime?: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPopular?: boolean;
  trial?: {
    enabled: boolean;
    days: number;
  };
  department?: string;
  targetMarket?: string;
  minimumContract?: number;
  setupFee?: number;
  customizations?: string[];
}

export interface PackageFormData {
  name: string;
  description: string;
  type: 'subscription' | 'one-time' | 'freemium';
  category: string;
  status: 'active' | 'inactive';
  usersLimit: number;
  contactsLimit?: number;
  storageLimit?: number;
  callMinutesLimit: number;
  features: string[];
  monthlyPrice?: number;
  yearlyPrice?: number;
  oneTimePrice?: number;
  currency: string;
  isPopular?: boolean;
  trialEnabled?: boolean;
  trialDays?: number;
  department?: string;
  targetMarket?: string;
  minimumContract?: number;
  setupFee?: number;
  customizations?: string[];
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user' | 'manager' | 'sales' | 'support' | 'viewer';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin?: string;
  createdAt: string;
  clientId?: string;
  clientName?: string;
  permissions?: string[];
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  manager?: string;
  location?: string;
  timezone?: string;
  language?: string;
  twoFactorEnabled?: boolean;
  lastPasswordChange?: string;
  loginAttempts?: number;
  loginCount?: number;
  jobTitle?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user' | 'manager' | 'sales' | 'support' | 'viewer';
  status: 'active' | 'inactive';
  clientId?: string;
  permissions?: string[];
  password?: string;
  sendWelcomeEmail?: boolean;
  phone?: string;
  department?: string;
  position?: string;
  manager?: string;
  location?: string;
  timezone?: string;
  language?: string;
  twoFactorEnabled?: boolean;
}
