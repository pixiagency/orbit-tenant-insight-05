# Export Functionality Documentation

This document describes the comprehensive export functionality implemented across the application.

## Overview

The export system provides a unified way to export data from various components in multiple formats and languages. Each component has its own export modal and utility functions.

## Components with Export Functionality

### 1. Clients Export
- **Component**: `src/components/clients/ClientExportModal.tsx`
- **Table**: `src/components/clients/ClientTable.tsx`
- **Page**: `src/pages/superadmin/ClientsPage.tsx`
- **Utility**: `exportClients()` in `src/utils/exportUtils.ts`

### 2. Subscriptions Export
- **Component**: `src/components/subscriptions/SubscriptionExportModal.tsx`
- **Table**: `src/components/subscriptions/SubscriptionTable.tsx`
- **Page**: `src/pages/superadmin/SubscriptionsPage.tsx`
- **Utility**: `exportSubscriptions()` in `src/utils/exportUtils.ts`

### 3. Users Export
- **Component**: `src/components/users/UserExportModal.tsx`
- **Table**: `src/components/users/UserTable.tsx`
- **Page**: `src/pages/superadmin/UsersManagementPage.tsx`
- **Utility**: `exportUsers()` in `src/utils/exportUtils.ts`

### 4. Billing Logs Export
- **Component**: `src/components/billing-logs/BillingLogExportModal.tsx`
- **Table**: `src/components/billing-logs/BillingLogTable.tsx`
- **Page**: `src/pages/superadmin/BillingLogsPage.tsx`
- **Utility**: `exportBillingLogs()` in `src/utils/exportUtils.ts`

## Export Features

### Supported Formats
1. **CSV** - Comma-separated values for spreadsheet applications
2. **Excel** - Microsoft Excel format (.xlsx)
3. **JSON** - JavaScript Object Notation for data processing
4. **PDF** - Portable Document Format for printing/sharing

### Language Support
- English (🇺🇸)
- Spanish (🇪🇸)
- French (🇫🇷)
- German (🇩🇪)
- Italian (🇮🇹)
- Portuguese (🇵🇹)
- Chinese (🇨🇳)
- Japanese (🇯🇵)
- Korean (🇰🇷)
- Arabic (🇸🇦)

### Export Options

#### Client Export Fields (35+ fields)
- Company Name, Contact Name, Contact Email, Contact Phone
- Website, Address, Package Name
- Users Count/Limit, Contacts Count/Limit, Storage Used/Limit
- Call Minutes Used/Limit, Last Activity, Registration Date
- Subscription Start/Expiry, Subdomain, Login URL
- Notes, Source, Department, Assigned To, Priority
- Tags, Industry, Company Size, Billing/Shipping Address
- Timezone, Language, Currency, Status

#### Subscription Export Fields (25+ fields)
- Client ID/Name, Package ID/Name
- Activation Method, Source, Status
- Start Date, End Date, Auto Renew
- Amount, Currency, Payment Status
- Last Updated, Next Billing, Created Date
- Notes, Read Only, External Billing URL
- Trial Days, Billing Cycle, Discount Code/Amount
- Department, Sales Representative, Contract Terms
- Billing Contact, Purchase Order

#### User Export Fields (20+ fields)
- User Name, User Email, User Role, User Status
- Last Login, User Created Date
- Client ID/Name, Permissions
- Avatar, Phone, Department, Position
- Manager, Location, Timezone, Language
- Two Factor Enabled, Last Password Change
- Login Attempts

#### Billing Log Export Fields (13+ fields)
- Billing Log ID, Client ID/Name
- Type, Description, Amount, Currency
- Status, Payment Method, Transaction ID
- Subscription ID, Processed At, Notes

## Usage

### In Table Components
Each table component includes:
1. **Export Selected** button - appears when items are selected
2. **Export All** button - appears when no items are selected
3. **Export Modal** - configurable export interface

### Export Modal Interface
1. **Format Selection** - Choose CSV, Excel, JSON, or PDF
2. **Language Selection** - Select from 10 supported languages
3. **Field Selection** - Choose which fields to include in export
4. **Export Button** - Execute the export with selected options

### Toast Notifications
- Success notifications show the number of items exported
- Error notifications provide feedback on export failures
- Validation prevents exports with no selected fields

## Technical Implementation

### Export Utilities (`src/utils/exportUtils.ts`)
- Centralized export functions for each data type
- Multi-language field translations
- Format-specific export handlers
- File download functionality

### Export Modals
- Consistent UI across all components
- Reusable modal components
- Field validation and selection
- Language and format configuration

### Table Integration
- Bulk action support
- Selection state management
- Export button placement
- Modal state management

## File Structure
```
src/
├── components/
│   ├── clients/
│   │   ├── ClientExportModal.tsx
│   │   └── ClientTable.tsx
│   ├── subscriptions/
│   │   ├── SubscriptionExportModal.tsx
│   │   └── SubscriptionTable.tsx
│   ├── users/
│   │   ├── UserExportModal.tsx
│   │   └── UserTable.tsx
│   └── billing-logs/
│       ├── BillingLogExportModal.tsx
│       └── BillingLogTable.tsx
├── utils/
│   └── exportUtils.ts
└── pages/
    └── superadmin/
        ├── ClientsPage.tsx
        ├── SubscriptionsPage.tsx
        ├── UsersManagementPage.tsx
        └── BillingLogsPage.tsx
```

## Future Enhancements
- Scheduled exports
- Export templates
- Advanced filtering for exports
- Export history tracking
- Email delivery of exports
- Custom field mapping
- Export scheduling
- Integration with external systems

## Dependencies
- React hooks for state management
- Lucide React for icons
- Shadcn/ui components for UI
- Toast notifications for feedback
- File download utilities

## Browser Compatibility
- Modern browsers with ES6+ support
- File download functionality
- CSV/Excel export support
- PDF generation (HTML-based)
- JSON export support 