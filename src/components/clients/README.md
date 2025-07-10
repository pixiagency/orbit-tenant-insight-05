# Client Components

This directory contains all client-related components for the Orbit Tenant Insight application.

## Components Overview

### Core Components

- **ClientTable.tsx** - Main table component for displaying and managing clients
- **ClientFiltersRefactored.tsx** - Enhanced filter component using the shared AdvancedFilters
- **ClientExportModal.tsx** - Comprehensive export functionality with multiple formats and field selection
- **ClientDrawerForm.tsx** - Form for creating and editing clients
- **EnhancedClientDrawerForm.tsx** - Extended client form with additional features

### Modal Components

- **ClientProfileModal.tsx** - Detailed client profile view
- **ClientBillingModal.tsx** - Billing information and management
- **ClientActivationCodeModal.tsx** - Activation code management
- **ClientTrialDaysModal.tsx** - Trial days management
- **ClientActionDialog.tsx** - Confirmation dialogs for client actions

### Subscription Management

- **ClientSubscriptionModals.tsx** - Collection of subscription-related modals:
  - AssignPackageModal
  - RenewSubscriptionModal
  - SendPasswordResetModal

## Enhanced Features

### Advanced Filtering

The client filtering system now supports comprehensive filtering options:

#### Basic Filters
- **Search**: Search across company name, contact name, email, phone, and subdomain
- **Status**: Filter by client status (active, trial, suspended, expired)
- **Package**: Filter by package type (Starter, Professional, Enterprise)

#### Advanced Filters
- **Usage Level**: Filter by storage usage (low, medium, high, over limit)
- **Activity**: Filter by recent activity (active today, this week, inactive 30+ days)
- **Team Size**: Filter by number of users (small: 1-5, medium: 6-20, large: 21+)
- **Subscription**: Filter by subscription status (active, expired, trial, cancelled)
- **Call Usage**: Filter by call usage patterns
- **Date Range**: Filter by creation date range

### Export Functionality

The export system provides comprehensive data export capabilities:

#### Supported Formats
- **CSV**: Comma-separated values for spreadsheet applications
- **Excel**: Microsoft Excel format with formatting
- **JSON**: JavaScript Object Notation for API integration
- **PDF**: Portable Document Format for reports

#### Field Categories
- **Basic Information**: Company name, contact details, subdomain, login URL
- **Package & Subscription**: Package details, status, dates, revenue, trial information
- **Usage & Limits**: User counts, storage usage, call minutes
- **Activity & Dates**: Registration date, last activity
- **System & Settings**: Read-only status, external billing URLs
- **Legacy Fields**: Backward compatibility fields

#### Export Features
- Multi-language support (English, Spanish, French, German, etc.)
- Selective field export
- Bulk export of selected clients
- Export filtered results
- Organized field selection by categories

## Usage Examples

### Basic Client Table with Filters

```tsx
import { ClientTable } from './ClientTable';
import { ClientFiltersRefactored } from './ClientFiltersRefactored';

const ClientsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    packageId: 'all',
    usage: 'all',
    activity: 'all',
    teamSize: 'all',
    subscription: 'all',
    callUsage: 'all',
    dateRange: {},
  });

  return (
    <div>
      <ClientFiltersRefactored
        filters={filters}
        onFiltersChange={setFilters}
      />
      <ClientTable
        clients={filteredClients}
        selectedClients={selectedClients}
        onSelectionChange={setSelectedClients}
        // ... other props
      />
    </div>
  );
};
```

### Export Integration

```tsx
import { ClientExportModal } from './ClientExportModal';
import { exportClients } from '../../utils/exportUtils';

const ClientsPage = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExport = (format: string, fields: string[], language: string) => {
    const clientsToExport = selectedClients.length > 0 
      ? filteredClients.filter(client => selectedClients.includes(client.id))
      : filteredClients;

    exportClients(clientsToExport, { format, fields, language });
  };

  return (
    <div>
      <ClientExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportConfirm={handleExport}
      />
    </div>
  );
};
```

## Filter Configuration

The client filters are configured in `src/components/shared/FilterConfigs.ts`:

```typescript
export const clientFilterConfig: FilterConfig = {
  searchPlaceholder: "Search clients by name, email, company, or subdomain...",
  fields: [
    // Basic filters
    { key: 'search', type: 'search', ... },
    { key: 'status', type: 'select', options: [...], ... },
    { key: 'packageId', type: 'select', options: [...], ... },
    
    // Advanced filters
    { key: 'usage', type: 'select', isAdvanced: true, ... },
    { key: 'activity', type: 'select', isAdvanced: true, ... },
    { key: 'teamSize', type: 'select', isAdvanced: true, ... },
    { key: 'subscription', type: 'select', isAdvanced: true, ... },
    { key: 'callUsage', type: 'select', isAdvanced: true, ... },
    { key: 'dateRange', type: 'date-range', isAdvanced: true, ... },
  ],
  defaultFilters: { ... }
};
```

## Data Types

### Client Interface

```typescript
interface Client {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  subdomain: string;
  status: 'active' | 'trial' | 'suspended' | 'expired';
  packageId?: string;
  packageName?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  monthlyRevenue: number;
  totalUsers: number;
  storageUsed: number;
  createdAt: string;
  lastLogin?: string;
  hasTrialDays?: boolean;
  trialDaysCount?: number;
  trialDaysReason?: string;
  isReadOnly?: boolean;
  externalBillingUrl?: string;
}
```

### Client Filters Interface

```typescript
interface ClientFilters {
  search: string;
  status: string;
  packageId: string;
  usage?: string;
  activity?: string;
  teamSize?: string;
  subscription?: string;
  callUsage?: string;
  dateRange: { from?: string; to?: string };
}
```

## Best Practices

1. **Filter Performance**: Use debounced search to avoid excessive API calls
2. **Export Optimization**: Limit export size for large datasets
3. **Field Selection**: Provide sensible defaults for commonly exported fields
4. **Error Handling**: Implement proper error handling for export operations
5. **User Feedback**: Show loading states and success/error messages

## Future Enhancements

- Real-time filter updates
- Saved filter presets
- Advanced export scheduling
- Custom export templates
- Integration with external reporting tools

# Client Filters Component

This directory contains the refactored client filtering system that provides advanced filtering capabilities for client data.

## Components

### ClientFiltersRefactored

A modern, reusable filter component specifically designed for client data with the best filter attributes for client management.

#### Features

- **Search**: Search across company name, contact name, email, and subdomain
- **Status Filter**: Filter by client status (active, trial, suspended, expired, inactive)
- **Package Filter**: Filter by subscription package
- **Usage Level**: Filter by usage percentage (low, medium, high, over limit)
- **Activity**: Filter by recent activity (active today, this week, inactive 30+ days)
- **Team Size**: Filter by company size (small, medium, large)
- **Subscription**: Filter by subscription status
- **Call Usage**: Filter by call minutes usage
- **Date Range**: Filter by creation date range

#### Usage

```tsx
import { ClientFiltersRefactored } from './components/clients/ClientFiltersRefactored';
import { Client } from './types/superAdmin';

const MyClientPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  return (
    <ClientFiltersRefactored
      clients={clients}
      onFilteredClientsChange={setFilteredClients}
      className="mb-4"
    />
  );
};
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `clients` | `Client[]` | Yes | Array of client data to filter |
| `onFilteredClientsChange` | `(filteredClients: Client[]) => void` | Yes | Callback when filtered results change |
| `className` | `string` | No | Additional CSS classes |

#### Filter Configuration

The component uses the `clientFilterConfig` from `../shared/FilterConfigs` which includes:

- **Search fields**: companyName, contactName, contactEmail, subdomain
- **Status options**: active, trial, suspended, expired, inactive
- **Package options**: Starter Plan, Professional Plan, Enterprise Plan
- **Usage levels**: Low (0-25%), Medium (26-75%), High (76-100%), Over Limit
- **Activity periods**: Active Today, Active This Week, Inactive 30+ Days
- **Team sizes**: Small (1-5), Medium (6-20), Large (21+)
- **Date range**: Creation date filtering

#### Integration with Existing Pages

The component has been integrated into the `ClientsPage` to replace the previous `EnhancedClientFilters` component. The integration provides:

- Simplified state management
- Automatic filtering logic
- Better performance
- Consistent UI/UX

### ClientFiltersDemo

A demonstration component that shows how to use the `ClientFiltersRefactored` component with sample data.

#### Features

- Sample client data with various statuses and usage patterns
- Visual demonstration of all filter capabilities
- Real-time filtering results display
- Usage percentage indicators with color coding
- Status badges with appropriate colors

## Filter Logic

The filtering logic is handled by the `filterClients` function in `../shared/FilterUtils` which provides:

1. **Text Search**: Case-insensitive search across multiple fields
2. **Exact Matching**: For status, package, and other categorical fields
3. **Range Filtering**: For usage percentages and date ranges
4. **Activity Filtering**: Based on last activity timestamps
5. **Usage Calculations**: Automatic calculation of usage percentages

## Best Practices

1. **Performance**: The component is optimized for large datasets with efficient filtering algorithms
2. **Accessibility**: All filter controls include proper ARIA labels and keyboard navigation
3. **Responsive Design**: Filters adapt to different screen sizes
4. **Type Safety**: Full TypeScript support with proper type definitions
5. **Reusability**: Can be easily integrated into any client management page

## Migration from EnhancedClientFilters

To migrate from the old `EnhancedClientFilters`:

1. Replace the import:
   ```tsx
   // Old
   import { EnhancedClientFilters } from './EnhancedClientFilters';
   
   // New
   import { ClientFiltersRefactored } from './ClientFiltersRefactored';
   ```

2. Update the component usage:
   ```tsx
   // Old
   <EnhancedClientFilters
     filters={filters}
     onFiltersChange={setFilters}
     onAdvancedFilters={handleAdvancedFilters}
     onExport={handleExport}
     onRefresh={handleRefresh}
     activeFiltersCount={activeFiltersCount}
   />
   
   // New
   <ClientFiltersRefactored
     clients={clients}
     onFilteredClientsChange={setFilteredClients}
     className="mb-4"
   />
   ```

3. Remove manual filtering logic - the new component handles it internally

## Examples

See `ClientFiltersDemo.tsx` for a complete example of how to use the component with sample data and visual results display. 