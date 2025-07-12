
import React from 'react';
import { AdvancedFilters, FilterConfig } from '../shared/AdvancedFilters';

interface PRSRAdvancedFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  filteredCount?: number;
}

const prsrFilterConfig: FilterConfig = {
  searchPlaceholder: "Search contacts, companies, or roles...",
  fields: [
    {
      key: 'search',
      label: 'Search',  
      type: 'search',
      placeholder: 'Search contacts, companies, or roles...'
    },
    {
      key: 'type',
      label: 'Contact Type',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'pr', label: 'Product Relations' },
        { value: 'sr', label: 'Service Relations' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'qualified', label: 'Qualified' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'unqualified', label: 'Unqualified' }
      ]
    },
    {
      key: 'source',
      label: 'Lead Source',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Sources' },
        { value: 'website', label: 'Website' },
        { value: 'trade show', label: 'Trade Show' },
        { value: 'referral', label: 'Referral' },
        { value: 'event', label: 'Event' },
        { value: 'cold outreach', label: 'Cold Outreach' },
        { value: 'social media', label: 'Social Media' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      defaultValue: 'all',
      isAdvanced: true,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    },
    {
      key: 'industry',
      label: 'Industry',
      type: 'select',
      defaultValue: 'all',
      isAdvanced: true,
      options: [
        { value: 'all', label: 'All Industries' },
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'retail', label: 'Retail' },
        { value: 'financial services', label: 'Financial Services' },
        { value: 'education', label: 'Education' }
      ]
    },
    {
      key: 'media_type',
      label: 'Media Type',
      type: 'select',
      defaultValue: 'all',
      isAdvanced: true,
      options: [
        { value: 'all', label: 'All Media Types' },
        { value: 'print', label: 'Print' },
        { value: 'digital', label: 'Digital' },
        { value: 'tv', label: 'TV' },
        { value: 'radio', label: 'Radio' },
        { value: 'social media', label: 'Social Media' },
        { value: 'blog', label: 'Blog' },
        { value: 'podcast', label: 'Podcast' }
      ]
    },
    {
      key: 'contact_owner',
      label: 'Contact Owner',
      type: 'select',
      defaultValue: 'all',
      isAdvanced: true,
      options: [
        { value: 'all', label: 'All Owners' },
        { value: 'sarah johnson', label: 'Sarah Johnson' },
        { value: 'mike chen', label: 'Mike Chen' },
        { value: 'emily rodriguez', label: 'Emily Rodriguez' },
        { value: 'david brown', label: 'David Brown' },
        { value: 'alex thompson', label: 'Alex Thompson' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'date-range',
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    type: 'all',
    status: 'all',
    source: 'all',
    priority: 'all',
    industry: 'all',
    media_type: 'all',
    contact_owner: 'all',
    dateRange: {
      from: undefined,
      to: undefined
    }
  }
};

export const PRSRAdvancedFilters: React.FC<PRSRAdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  filteredCount
}) => {
  return (
    <AdvancedFilters
      config={prsrFilterConfig}
      filters={filters}
      onFiltersChange={onFiltersChange}
      title="Product/Service Relations Filters"
      filteredCount={filteredCount}
    />
  );
};
