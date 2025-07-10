# Advanced Filters Component

A reusable, configurable filter component that provides advanced filtering capabilities across different parts of the application. This component replaces the need for individual filter components in each module.

## Features

- **Configurable**: Define filter fields through configuration objects
- **Advanced/Basic Toggle**: Automatically shows/hides advanced filters
- **Active Filter Count**: Shows the number of active filters with a badge
- **Clear All**: One-click to clear all active filters
- **Date Range Picker**: Built-in date range selection with calendar popup
- **Search Input**: Text search functionality
- **Select Dropdowns**: Multiple choice filters with predefined options
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Fully compatible with dark/light themes

## Components

### 1. AdvancedFilters
The main reusable filter component.

### 2. FilterConfigs
Predefined configurations for different filter types (clients, contacts, users, etc.).

### 3. FilterUtils
Utility functions for filtering data and managing filter state.

## Usage

### Basic Usage

```tsx
import React, { useState } from 'react';
import { AdvancedFilters } from '@/components/shared/AdvancedFilters';
import { clientFiltersConfig } from '@/components/shared/FilterConfigs';

const MyComponent = () => {
  const [filters, setFilters] = useState(clientFiltersConfig.defaultFilters);

  return (
    <AdvancedFilters
      config={clientFiltersConfig}
      filters={filters}
      onFiltersChange={setFilters}
      title="My Custom Filters"
    />
  );
};
```

### Using Predefined Configurations

```tsx
// For Clients
import { clientFiltersConfig } from '@/components/shared/FilterConfigs';

// For Subscriptions
import { subscriptionFiltersConfig } from '@/components/shared/FilterConfigs';

// For Contacts
import { contactFiltersConfig } from '@/components/shared/FilterConfigs';

// For Users
import { userFiltersConfig } from '@/components/shared/FilterConfigs';

// For Tasks
import { taskFiltersConfig } from '@/components/shared/FilterConfigs';

// For Deals
import { dealFiltersConfig } from '@/components/shared/FilterConfigs';
```

### Creating Custom Filter Configuration

```tsx
import { FilterConfig } from '@/components/shared/AdvancedFilters';

const customFiltersConfig: FilterConfig = {
  searchPlaceholder: "Search items...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search items...',
      isAdvanced: false
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
      defaultValue: 'all',
      isAdvanced: false
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
    status: 'all',
    dateRange: {}
  }
};
```

## Migration Guide

### From ClientFilters to AdvancedFilters

**Before (Old ClientFilters):**
```tsx
import { ClientFilters } from '@/components/clients/ClientFilters';

const MyComponent = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    packageId: 'all',
    // ... other filter properties
  });

  return (
    <ClientFilters
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
};
```

**After (Using AdvancedFilters):**
```tsx
import { AdvancedFilters } from '@/components/shared/AdvancedFilters';
import { clientFiltersConfig } from '@/components/shared/FilterConfigs';

const MyComponent = () => {
  const [filters, setFilters] = useState(clientFiltersConfig.defaultFilters);

  return (
    <AdvancedFilters
      config={clientFiltersConfig}
      filters={filters}
      onFiltersChange={setFilters}
      title="Client Search & Filters"
    />
  );
};
```

### From ContactFilters to AdvancedFilters

**Before (Old ContactFilters):**
```tsx
import { ContactFilters } from '@/components/contacts/ContactFilters';

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSourceFilter('all');
  };

  return (
    <ContactFilters
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      sourceFilter={sourceFilter}
      onSourceFilterChange={setSourceFilter}
      onClearFilters={handleClearFilters}
    />
  );
};
```

**After (Using AdvancedFilters):**
```tsx
import { AdvancedFilters } from '@/components/shared/AdvancedFilters';
import { contactFiltersConfig } from '@/components/shared/FilterConfigs';

const MyComponent = () => {
  const [filters, setFilters] = useState(contactFiltersConfig.defaultFilters);

  return (
    <AdvancedFilters
      config={contactFiltersConfig}
      filters={filters}
      onFiltersChange={setFilters}
      title="Contact Search & Filters"
    />
  );
};
```

## API Reference

### AdvancedFilters Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `FilterConfig` | Yes | Configuration object defining filter fields |
| `filters` | `Record<string, any>` | Yes | Current filter values |
| `onFiltersChange` | `(filters: Record<string, any>) => void` | Yes | Callback when filters change |
| `title` | `string` | No | Title displayed in the filter header (default: "Search & Filters") |
| `className` | `string` | No | Additional CSS classes |

### FilterConfig Interface

```tsx
interface FilterConfig {
  searchPlaceholder?: string;
  fields: FilterField[];
  defaultFilters: Record<string, any>;
}
```

### FilterField Interface

```tsx
interface FilterField {
  key: string;                    // Unique identifier for the field
  label: string;                  // Display label
  type: 'select' | 'search' | 'date-range';
  options?: FilterOption[];       // Required for 'select' type
  placeholder?: string;           // Placeholder text
  defaultValue?: string;          // Default value
  isAdvanced?: boolean;           // Whether to show in advanced section
}
```

### FilterOption Interface

```tsx
interface FilterOption {
  value: string;
  label: string;
}
```

## Benefits

1. **Consistency**: All filter components look and behave the same way
2. **Maintainability**: Single component to maintain instead of multiple filter components
3. **Reusability**: Easy to add filters to new components
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Performance**: Optimized rendering and state management
6. **Accessibility**: Built-in accessibility features
7. **Customization**: Highly configurable through configuration objects

## Examples

### Complete Example with Data Filtering

```tsx
import React, { useState, useMemo } from 'react';
import { AdvancedFilters } from '@/components/shared/AdvancedFilters';
import { clientFiltersConfig } from '@/components/shared/FilterConfigs';
import { CustomFilters } from '@/components/shared/FilterUtils';

const ClientsPage = () => {
  const [filters, setFilters] = useState(clientFiltersConfig.defaultFilters);
  const [clients, setClients] = useState(/* your clients data */);

  // Filter the data based on current filters
  const filteredClients = useMemo(() => {
    return CustomFilters.filterClients(clients, filters);
  }, [clients, filters]);

  return (
    <div>
      <AdvancedFilters
        config={clientFiltersConfig}
        filters={filters}
        onFiltersChange={setFilters}
        title="Client Search & Filters"
      />
      
      {/* Your table or list component */}
      <ClientTable clients={filteredClients} />
    </div>
  );
};
```

### Using Filter Utilities

```tsx
import { FilterUtils } from '@/components/shared/FilterUtils';

const MyComponent = () => {
  const [filters, setFilters] = useState(clientFiltersConfig.defaultFilters);
  const [data, setData] = useState(/* your data */);

  // Get active filter count
  const activeCount = FilterUtils.getActiveFiltersCount(filters, clientFiltersConfig);

  // Check if any filters are active
  const hasFilters = FilterUtils.hasActiveFilters(filters, clientFiltersConfig);

  // Filter data using generic utility
  const filteredData = FilterUtils.filterData(data, filters, clientFiltersConfig);

  return (
    <div>
      {hasFilters && (
        <div>Active filters: {activeCount}</div>
      )}
      <AdvancedFilters
        config={clientFiltersConfig}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <DataTable data={filteredData} />
    </div>
  );
};
```

This approach provides a clean, maintainable, and consistent way to implement filters across your entire application. 