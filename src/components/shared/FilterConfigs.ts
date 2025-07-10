import { FilterConfig } from './AdvancedFilters';
import { AVAILABLE_MODULES } from '../../types/packages';

// Client Filter Configuration
export const clientFilterConfig: FilterConfig = {
  searchPlaceholder: "Search clients by name, email, company, or subdomain...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search clients by name, email, company, or subdomain...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'trial', label: 'Trial' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'expired', label: 'Expired' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'packageId',
      label: 'Package',
      type: 'select',
      options: [
        { value: 'all', label: 'All Packages' },
        { value: '1', label: 'Starter Plan' },
        { value: '2', label: 'Professional Plan' },
        { value: '3', label: 'Enterprise Plan' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'usage',
      label: 'Usage Level',
      type: 'select',
      options: [
        { value: 'all', label: 'All Usage' },
        { value: 'low', label: 'Low (0-25%)' },
        { value: 'medium', label: 'Medium (26-75%)' },
        { value: 'high', label: 'High (76-100%)' },
        { value: 'over', label: 'Over Limit' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'activity',
      label: 'Activity',
      type: 'select',
      options: [
        { value: 'all', label: 'All Activity' },
        { value: 'active_today', label: 'Active Today' },
        { value: 'active_week', label: 'Active This Week' },
        { value: 'inactive_30', label: 'Inactive 30+ Days' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'teamSize',
      label: 'Team Size',
      type: 'select',
      options: [
        { value: 'all', label: 'All Sizes' },
        { value: 'small', label: 'Small (1-5 users)' },
        { value: 'medium', label: 'Medium (6-20 users)' },
        { value: 'large', label: 'Large (21+ users)' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'subscription',
      label: 'Subscription',
      type: 'select',
      options: [
        { value: 'all', label: 'All Subscriptions' },
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'trial', label: 'Trial' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'callUsage',
      label: 'Call Usage',
      type: 'select',
      options: [
        { value: 'all', label: 'All Call Usage' },
        { value: 'low', label: 'Low Usage' },
        { value: 'medium', label: 'Medium Usage' },
        { value: 'high', label: 'High Usage' },
        { value: 'over', label: 'Over Limit' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Created Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    status: 'all',
    packageId: 'all',
    usage: 'all',
    activity: 'all',
    teamSize: 'all',
    subscription: 'all',
    callUsage: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

// Subscription Filter Configuration
export const subscriptionFilterConfig: FilterConfig = {
  searchPlaceholder: "Search subscriptions...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by client name or subscription ID...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'pending', label: 'Pending' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'packageType',
      label: 'Package Type',
      type: 'select',
      options: [
        { value: 'all', label: 'All Packages' },
        { value: 'basic', label: 'Basic' },
        { value: 'premium', label: 'Premium' },
        { value: 'enterprise', label: 'Enterprise' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'billingCycle',
      label: 'Billing Cycle',
      type: 'select',
      options: [
        { value: 'all', label: 'All Cycles' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'custom', label: 'Custom' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Subscription Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    status: 'all',
    packageType: 'all',
    billingCycle: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

// Contact Filter Configuration
export const contactFilterConfig: FilterConfig = {
  searchPlaceholder: "Search contacts...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name, email, or phone...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'lead', label: 'Lead' },
        { value: 'customer', label: 'Customer' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select',
      options: [
        { value: 'all', label: 'All Sources' },
        { value: 'website', label: 'Website' },
        { value: 'referral', label: 'Referral' },
        { value: 'social', label: 'Social Media' },
        { value: 'cold-call', label: 'Cold Call' },
        { value: 'other', label: 'Other' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Created Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    status: 'all',
    source: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

// User Filter Configuration
export const userFilterConfig: FilterConfig = {
  searchPlaceholder: "Search users...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name or email...'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'all', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' },
        { value: 'user', label: 'User' },
        { value: 'viewer', label: 'Viewer' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Created Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    role: 'all',
    status: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

// Task Filter Configuration
export const taskFilterConfig: FilterConfig = {
  searchPlaceholder: "Search tasks...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by title or description...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'assignee',
      label: 'Assignee',
      type: 'select',
      options: [
        { value: 'all', label: 'All Assignees' },
        { value: 'me', label: 'Assigned to Me' },
        { value: 'unassigned', label: 'Unassigned' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Due Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    status: 'all',
    priority: 'all',
    assignee: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

// Deal Filter Configuration
export const dealFilterConfig: FilterConfig = {
  searchPlaceholder: "Search deals...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by deal name or client...'
    },
    {
      key: 'stage',
      label: 'Stage',
      type: 'select',
      options: [
        { value: 'all', label: 'All Stages' },
        { value: 'lead', label: 'Lead' },
        { value: 'qualified', label: 'Qualified' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'closed-won', label: 'Closed Won' },
        { value: 'closed-lost', label: 'Closed Lost' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'value',
      label: 'Deal Value',
      type: 'select',
      options: [
        { value: 'all', label: 'All Values' },
        { value: 'small', label: 'Small (< $10k)' },
        { value: 'medium', label: 'Medium ($10k - $50k)' },
        { value: 'large', label: 'Large ($50k - $100k)' },
        { value: 'enterprise', label: 'Enterprise (> $100k)' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Created Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    stage: 'all',
    value: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

// Package Filter Configuration - Updated with all relevant fields as selects
export const packageFilterConfig: FilterConfig = {
  searchPlaceholder: "Search packages...",
  fields: [
    {
      key: 'search',
      label: 'Search Packages',
      type: 'search',
      placeholder: 'Search by package name or description...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'durationUnit',
      label: 'Duration',
      type: 'select',
      options: [
        { value: 'all', label: 'All Durations' },
        { value: 'days', label: 'Days' },
        { value: 'months', label: 'Months' },
        { value: 'years', label: 'Years' },
        { value: 'lifetime', label: 'Lifetime' }
      ],
      defaultValue: 'all',
    },
    {
      key: 'priceRange',
      label: 'Price Type',
      type: 'select',
      options: [
        { value: 'all', label: 'All Prices' },
        { value: 'free', label: 'Free' },
        { value: 'low', label: 'Low (< $50)' },
        { value: 'medium', label: 'Medium ($50 - $200)' },
        { value: 'high', label: 'High ($200 - $500)' },
        { value: 'premium', label: 'Premium (> $500)' }
      ],
      defaultValue: 'all',
    },
    {
      key: 'maxUsers',
      label: 'Max Users',
      type: 'select',
      options: [
        { value: 'all', label: 'All User Limits' },
        { value: 'small', label: 'Small (1-5 users)' },
        { value: 'medium', label: 'Medium (6-20 users)' },
        { value: 'large', label: 'Large (21-100 users)' },
        { value: 'enterprise', label: 'Enterprise (100+ users)' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'aiEnabled',
      label: 'AI Features',
      type: 'select',
      options: [
        { value: 'all', label: 'All AI Options' },
        { value: 'enabled', label: 'AI Enabled' },
        { value: 'disabled', label: 'AI Disabled' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'isPublic',
      label: 'Visibility',
      type: 'select',
      options: [
        { value: 'all', label: 'All Visibility' },
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'modules',
      label: 'Modules',
      type: 'select',
      options: [
        { value: 'all', label: 'All Modules' },
        ...AVAILABLE_MODULES.map(module => ({
          value: module.id,
          label: module.name
        }))
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Creation Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    status: 'all',
    durationUnit: 'all',
    priceRange: 'all',
    maxUsers: 'all',
    aiEnabled: 'all',
    isPublic: 'all',
    modules: 'all',
    dateRange: { from: undefined, to: undefined }
  }
}; 