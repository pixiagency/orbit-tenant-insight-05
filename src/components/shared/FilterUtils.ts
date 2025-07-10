import { FilterConfig } from './AdvancedFilters';
import { Package } from '../../types/packages';

export interface FilterUtils {
  filterData: <T>(data: T[], filters: Record<string, any>, config: FilterConfig) => T[];
  getActiveFiltersCount: (filters: Record<string, any>, config: FilterConfig) => number;
  hasActiveFilters: (filters: Record<string, any>, config: FilterConfig) => boolean;
}

export interface FilterState {
  [key: string]: any;
}

/**
 * Utility functions for working with the AdvancedFilters component
 */
export const FilterUtils: FilterUtils = {
  /**
   * Filter data based on the provided filters and configuration
   */
  filterData: <T>(data: T[], filters: Record<string, any>, config: FilterConfig): T[] => {
    return data.filter(item => {
      // Check each field in the configuration
      for (const field of config.fields) {
        const filterValue = filters[field.key];
        
        if (!filterValue || filterValue === 'all' || filterValue === '') {
          continue; // Skip if no filter is applied
        }

        switch (field.type) {
          case 'search':
            // Search in multiple fields (you can customize this based on your data structure)
            const searchFields = ['name', 'title', 'companyName', 'contactName', 'email'];
            const searchValue = filterValue.toLowerCase();
            const hasMatch = searchFields.some(fieldName => {
              const fieldValue = (item as any)[fieldName];
              return fieldValue && fieldValue.toLowerCase().includes(searchValue);
            });
            if (!hasMatch) return false;
            break;

          case 'select':
            // Direct field comparison
            const itemValue = (item as any)[field.key];
            if (itemValue !== filterValue) {
              return false;
            }
            break;

          case 'date-range':
            // Date range filtering
            if (filters.dateRange?.from || filters.dateRange?.to) {
              const dateField = field.key === 'dateRange' ? 'createdAt' : field.key;
              const itemDate = new Date((item as any)[dateField]);
              
              if (filters.dateRange.from && itemDate < new Date(filters.dateRange.from)) {
                return false;
              }
              if (filters.dateRange.to && itemDate > new Date(filters.dateRange.to)) {
                return false;
              }
            }
            break;
        }
      }
      
      return true;
    });
  },

  /**
   * Get the count of active filters
   */
  getActiveFiltersCount: (filters: Record<string, any>, config: FilterConfig): number => {
    let count = 0;
    
    config.fields.forEach(field => {
      if (field.type === 'search') {
        if (filters[field.key] && filters[field.key] !== '') count++;
      } else if (field.type === 'select') {
        if (filters[field.key] && filters[field.key] !== 'all') count++;
      } else if (field.type === 'date-range') {
        if (filters.dateRange?.from || filters.dateRange?.to) count++;
      }
    });
    
    return count;
  },

  /**
   * Check if there are any active filters
   */
  hasActiveFilters: (filters: Record<string, any>, config: FilterConfig): boolean => {
    return FilterUtils.getActiveFiltersCount(filters, config) > 0;
  }
};

/**
 * Custom filter functions for specific data types
 */
export const CustomFilters = {
  /**
   * Filter clients with specific logic
   */
  filterClients: (clients: any[], filters: Record<string, any>) => {
    return clients.filter(client => {
      // Search filter
      if (filters.search) {
        const searchValue = filters.search.toLowerCase();
        const searchFields = [
          client.companyName,
          client.contactName,
          client.contactEmail,
          client.website
        ].filter(Boolean);
        
        if (!searchFields.some(field => field.toLowerCase().includes(searchValue))) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && client.status !== filters.status) {
        return false;
      }

      // Package filter
      if (filters.packageId !== 'all' && client.packageId !== filters.packageId) {
        return false;
      }

      // Usage filter
      if (filters.usage && filters.usage !== 'all') {
        const usagePercentage = (client.usersCount / client.usersLimit) * 100;
        switch (filters.usage) {
          case 'low':
            if (usagePercentage > 25) return false;
            break;
          case 'medium':
            if (usagePercentage <= 25 || usagePercentage > 75) return false;
            break;
          case 'high':
            if (usagePercentage <= 75 || usagePercentage > 100) return false;
            break;
          case 'over':
            if (usagePercentage <= 100) return false;
            break;
        }
      }

      // Activity filter
      if (filters.activity && filters.activity !== 'all') {
        const lastActivity = new Date(client.lastActivity);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.activity) {
          case 'active_today':
            if (daysDiff > 0) return false;
            break;
          case 'active_week':
            if (daysDiff > 7) return false;
            break;
          case 'inactive_30':
            if (daysDiff <= 30) return false;
            break;
        }
      }

      // Team size filter
      if (filters.teamSize && filters.teamSize !== 'all') {
        switch (filters.teamSize) {
          case 'small':
            if (client.usersCount > 5) return false;
            break;
          case 'medium':
            if (client.usersCount <= 5 || client.usersCount > 20) return false;
            break;
          case 'large':
            if (client.usersCount <= 20) return false;
            break;
        }
      }

      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const clientDate = new Date(client.createdAt);
        if (filters.dateRange.from && clientDate < new Date(filters.dateRange.from)) {
          return false;
        }
        if (filters.dateRange.to && clientDate > new Date(filters.dateRange.to)) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Filter subscriptions with specific logic
   */
  filterSubscriptions: (subscriptions: any[], filters: Record<string, any>) => {
    return subscriptions.filter(subscription => {
      // Search filter
      if (filters.search) {
        const searchValue = filters.search.toLowerCase();
        const searchFields = [
          subscription.clientName,
          subscription.packageName,
          subscription.id
        ].filter(Boolean);
        
        if (!searchFields.some(field => field.toLowerCase().includes(searchValue))) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && subscription.status !== filters.status) {
        return false;
      }

      // Package filter
      if (filters.packageId !== 'all' && subscription.packageId !== filters.packageId) {
        return false;
      }

      // Payment status filter
      if (filters.paymentStatus !== 'all' && subscription.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Activation method filter
      if (filters.activationMethod !== 'all' && subscription.activationMethod !== filters.activationMethod) {
        return false;
      }

      // Billing cycle filter
      if (filters.cycle && filters.cycle !== 'all') {
        // You might need to add cycle field to your subscription data
        // const subscriptionCycle = getSubscriptionCycle(subscription);
        // if (subscriptionCycle !== filters.cycle) return false;
      }

      // Auto renew filter
      if (filters.autoRenew && filters.autoRenew !== 'all') {
        const autoRenew = filters.autoRenew === 'true';
        if (subscription.autoRenew !== autoRenew) return false;
      }

      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const subscriptionDate = new Date(subscription.createdAt);
        if (filters.dateRange.from && subscriptionDate < new Date(filters.dateRange.from)) {
          return false;
        }
        if (filters.dateRange.to && subscriptionDate > new Date(filters.dateRange.to)) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Filter contacts with specific logic
   */
  filterContacts: (contacts: any[], filters: Record<string, any>) => {
    return contacts.filter(contact => {
      // Search filter
      if (filters.search) {
        const searchValue = filters.search.toLowerCase();
        const searchFields = [
          contact.name,
          contact.email,
          contact.company,
          contact.phone
        ].filter(Boolean);
        
        if (!searchFields.some(field => field.toLowerCase().includes(searchValue))) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && contact.status !== filters.status) {
        return false;
      }

      // Source filter
      if (filters.source !== 'all' && contact.source !== filters.source) {
        return false;
      }

      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const contactDate = new Date(contact.createdAt);
        if (filters.dateRange.from && contactDate < new Date(filters.dateRange.from)) {
          return false;
        }
        if (filters.dateRange.to && contactDate > new Date(filters.dateRange.to)) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Filter packages with specific logic
   */
  filterPackages: (packages: any[], filters: Record<string, any>) => {
    return packages.filter(pkg => {
      // Search filter
      if (filters.search) {
        const searchValue = filters.search.toLowerCase();
        const searchFields = [
          pkg.name,
          pkg.description
        ].filter(Boolean);
        
        if (!searchFields.some(field => field.toLowerCase().includes(searchValue))) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && pkg.status !== filters.status) {
        return false;
      }

      // Price type filter
      if (filters.priceType !== 'all') {
        // You might need to adjust this based on your package data structure
        const packagePriceType = getPackagePriceType(pkg);
        if (packagePriceType !== filters.priceType) {
          return false;
        }
      }

      // Duration filter
      if (filters.duration !== 'all') {
        const packageDuration = pkg.pricing?.durationUnit || pkg.durationUnit;
        if (packageDuration !== filters.duration) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange.length === 2) {
        const packagePrice = pkg.pricing?.amount || pkg.price;
        if (packagePrice < filters.priceRange[0] || packagePrice > filters.priceRange[1]) {
          return false;
        }
      }

      // Modules filter
      if (filters.modules && filters.modules.length > 0) {
        const packageModules = pkg.modules || [];
        const hasMatchingModule = filters.modules.some(moduleId => 
          packageModules.includes(moduleId)
        );
        if (!hasMatchingModule) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const packageDate = new Date(pkg.createdAt);
        if (filters.dateRange.from && packageDate < new Date(filters.dateRange.from)) {
          return false;
        }
        if (filters.dateRange.to && packageDate > new Date(filters.dateRange.to)) {
          return false;
        }
      }

      return true;
    });
  }
};

// Helper function to determine package price type
function getPackagePriceType(pkg: any): string {
  const duration = pkg.pricing?.durationUnit || pkg.durationUnit;
  
  if (duration === 'months' && pkg.pricing?.duration === 1) {
    return 'monthly';
  } else if (duration === 'years' && pkg.pricing?.duration === 1) {
    return 'yearly';
  } else {
    return 'custom';
  }
}

// Generic filter function for any data type
export const applyFilters = <T>(
  data: T[],
  filters: FilterState,
  filterConfig: any
): T[] => {
  return data.filter(item => {
    return filterConfig.fields.every((field: any) => {
      const filterValue = filters[field.key];
      
      if (!filterValue || filterValue === 'all' || filterValue === '') {
        return true;
      }

      switch (field.key) {
        case 'search':
          return handleSearchFilter(item, filterValue, filterConfig.searchFields);
        case 'dateRange':
          return handleDateRangeFilter(item, filterValue);
        default:
          return handleSelectFilter(item, field.key, filterValue);
      }
    });
  });
};

// Handle search filter
const handleSearchFilter = (item: any, searchValue: string, searchFields?: string[]): boolean => {
  if (!searchValue.trim()) return true;
  
  const searchTerm = searchValue.toLowerCase();
  const fieldsToSearch = searchFields || ['name', 'email', 'description', 'title'];
  
  return fieldsToSearch.some(field => {
    const value = item[field];
    return value && value.toString().toLowerCase().includes(searchTerm);
  });
};

// Handle date range filter
const handleDateRangeFilter = (item: any, dateRange: any): boolean => {
  if (!dateRange?.from && !dateRange?.to) return true;
  
  const itemDate = new Date(item.createdAt || item.updatedAt || item.date);
  const fromDate = dateRange.from ? new Date(dateRange.from) : null;
  const toDate = dateRange.to ? new Date(dateRange.to) : null;
  
  if (fromDate && itemDate < fromDate) return false;
  if (toDate && itemDate > toDate) return false;
  
  return true;
};

// Handle select filter
const handleSelectFilter = (item: any, fieldKey: string, filterValue: string): boolean => {
  const itemValue = item[fieldKey];
  
  if (filterValue === 'all') return true;
  
  // Handle nested object properties
  if (fieldKey.includes('.')) {
    const keys = fieldKey.split('.');
    let value = item;
    for (const key of keys) {
      value = value?.[key];
    }
    return value === filterValue;
  }
  
  return itemValue === filterValue;
};

// Package-specific filtering logic
export const filterPackages = (packages: Package[], filters: FilterState): Package[] => {
  return packages.filter(pkg => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        pkg.name,
        pkg.description,
        pkg.id
      ];
      if (!searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (pkg.status !== filters.status) return false;
    }

    // Duration unit filter
    if (filters.durationUnit && filters.durationUnit !== 'all') {
      if (pkg.pricing.durationUnit !== filters.durationUnit) return false;
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      const price = pkg.pricing.amount;
      switch (filters.priceRange) {
        case 'free':
          if (price !== 0) return false;
          break;
        case 'low':
          if (price >= 50) return false;
          break;
        case 'medium':
          if (price < 50 || price > 200) return false;
          break;
        case 'high':
          if (price < 200 || price > 500) return false;
          break;
        case 'premium':
          if (price <= 500) return false;
          break;
      }
    }

    // Max users filter
    if (filters.maxUsers && filters.maxUsers !== 'all') {
      const maxUsers = pkg.limits.maxUsers;
      switch (filters.maxUsers) {
        case 'small':
          if (maxUsers > 5) return false;
          break;
        case 'medium':
          if (maxUsers < 6 || maxUsers > 20) return false;
          break;
        case 'large':
          if (maxUsers < 21 || maxUsers > 100) return false;
          break;
        case 'enterprise':
          if (maxUsers <= 100) return false;
          break;
      }
    }

    // AI enabled filter
    if (filters.aiEnabled && filters.aiEnabled !== 'all') {
      const aiEnabled = pkg.aiOptions?.enabled || false;
      if (filters.aiEnabled === 'enabled' && !aiEnabled) return false;
      if (filters.aiEnabled === 'disabled' && aiEnabled) return false;
    }

    // Public/Private filter
    if (filters.isPublic && filters.isPublic !== 'all') {
      if (filters.isPublic === 'public' && !pkg.isPublic) return false;
      if (filters.isPublic === 'private' && pkg.isPublic) return false;
    }

    // Modules filter
    if (filters.modules && filters.modules !== 'all') {
      if (!pkg.modules.includes(filters.modules)) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const pkgDate = new Date(pkg.createdAt);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (fromDate && pkgDate < fromDate) return false;
      if (toDate && pkgDate > toDate) return false;
    }

    return true;
  });
};

// Client filtering logic
export const filterClients = (clients: any[], filters: FilterState): any[] => {
  return clients.filter(client => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        client.name,
        client.email,
        client.company,
        client.phone
      ];
      if (!searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (client.status !== filters.status) return false;
    }

    // Subscription status filter
    if (filters.subscriptionStatus && filters.subscriptionStatus !== 'all') {
      if (client.subscription?.status !== filters.subscriptionStatus) return false;
    }

    // Package type filter
    if (filters.packageType && filters.packageType !== 'all') {
      if (client.package?.type !== filters.packageType) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const clientDate = new Date(client.createdAt);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (fromDate && clientDate < fromDate) return false;
      if (toDate && clientDate > toDate) return false;
    }

    return true;
  });
};

// Contact filtering logic
export const filterContacts = (contacts: any[], filters: FilterState): any[] => {
  return contacts.filter(contact => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        contact.name,
        contact.email,
        contact.phone,
        contact.company
      ];
      if (!searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (contact.status !== filters.status) return false;
    }

    // Source filter
    if (filters.source && filters.source !== 'all') {
      if (contact.source !== filters.source) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const contactDate = new Date(contact.createdAt);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (fromDate && contactDate < fromDate) return false;
      if (toDate && contactDate > toDate) return false;
    }

    return true;
  });
};

// User filtering logic
export const filterUsers = (users: any[], filters: FilterState): any[] => {
  return users.filter(user => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        user.name,
        user.email,
        user.username
      ];
      if (!searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Role filter
    if (filters.role && filters.role !== 'all') {
      if (user.role !== filters.role) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (user.status !== filters.status) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const userDate = new Date(user.createdAt);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (fromDate && userDate < fromDate) return false;
      if (toDate && userDate > toDate) return false;
    }

    return true;
  });
};

// Task filtering logic
export const filterTasks = (tasks: any[], filters: FilterState): any[] => {
  return tasks.filter(task => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        task.title,
        task.description,
        task.id
      ];
      if (!searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (task.status !== filters.status) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      if (task.priority !== filters.priority) return false;
    }

    // Assignee filter
    if (filters.assignee && filters.assignee !== 'all') {
      if (filters.assignee === 'me' && task.assigneeId !== 'current-user-id') return false;
      if (filters.assignee === 'unassigned' && task.assigneeId) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const taskDate = new Date(task.dueDate || task.createdAt);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (fromDate && taskDate < fromDate) return false;
      if (toDate && taskDate > toDate) return false;
    }

    return true;
  });
};

// Deal filtering logic
export const filterDeals = (deals: any[], filters: FilterState): any[] => {
  return deals.filter(deal => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        deal.name,
        deal.client?.name,
        deal.id
      ];
      if (!searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Stage filter
    if (filters.stage && filters.stage !== 'all') {
      if (deal.stage !== filters.stage) return false;
    }

    // Value filter
    if (filters.value && filters.value !== 'all') {
      const dealValue = deal.value || 0;
      switch (filters.value) {
        case 'small':
          if (dealValue >= 10000) return false;
          break;
        case 'medium':
          if (dealValue < 10000 || dealValue > 50000) return false;
          break;
        case 'large':
          if (dealValue < 50000 || dealValue > 100000) return false;
          break;
        case 'enterprise':
          if (dealValue <= 100000) return false;
          break;
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const dealDate = new Date(deal.createdAt);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (fromDate && dealDate < fromDate) return false;
      if (toDate && dealDate > toDate) return false;
    }

    return true;
  });
};

// Subscription filtering logic
export const filterSubscriptions = (subscriptions: any[], filters: FilterState): any[] => {
  return subscriptions.filter(subscription => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        subscription.client?.name,
        subscription.id,
        subscription.package?.name
      ];
      if (!searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (subscription.status !== filters.status) return false;
    }

    // Package type filter
    if (filters.packageType && filters.packageType !== 'all') {
      if (subscription.package?.type !== filters.packageType) return false;
    }

    // Billing cycle filter
    if (filters.billingCycle && filters.billingCycle !== 'all') {
      if (subscription.billingCycle !== filters.billingCycle) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const subscriptionDate = new Date(subscription.createdAt);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (fromDate && subscriptionDate < fromDate) return false;
      if (toDate && subscriptionDate > toDate) return false;
    }

    return true;
  });
}; 