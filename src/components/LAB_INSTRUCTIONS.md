# Enhanced Entity Management System - Lab Instructions

## 1. **Page Layout & Styling**
- **Page Container**: Full-width with `bg-gray-50 min-h-full` background
- **Padding**: Consistent `p-6` for all main containers
- **Margins**: `space-y-6` between major sections
- **Typography**: 
  - Page title: `text-3xl font-bold text-gray-900`
  - Descriptions: `text-gray-600 mt-1`
  - Section headers: `text-lg font-medium text-gray-900`

## 2. **Entity Form (Right-Side Drawer)**
### **Drawer Specifications**:
- **Position**: Slides from right side (`side="right"`)
- **Width**: Default `sm:max-w-lg` (can be `wide: sm:max-w-2xl` or `extra-wide: sm:max-w-4xl`)
- **Background**: White with shadow overlay
- **Height**: Full viewport with `overflow-y-auto`

### **Form Organization**:
- **Sections**: Organized in collapsible groups:
  1. Basic Information
  2. Contact Details
  3. Address Information
  4. Business Information
  5. Custom Fields (if any)

### **Field Layout**:
- **Grid System**: Each row contains 2 columns (`grid-cols-2 gap-4`)
- **Field Types**:
  - **Text Inputs**: Standard height `h-10` with icons on the left (`pl-10`)
  - **Dropdowns**: Same height as inputs with search functionality for large datasets
  - **Phone Numbers**: Include country code dropdown (searchable)
  - **Countries**: Searchable dropdown with all countries
  - **Cities**: Dynamic dropdown based on selected country (searchable)
  - **Multi-select**: For tags, categories with search capability

### **Buttons**:
- **Primary Save**: `bg-blue-600 hover:bg-blue-700` with `flex-1` width
- **Cancel**: `variant="outline"` with `flex-1` width
- **Custom Fields**: `variant="outline" size="sm"` positioned `absolute top-4 right-4`

## 3. **Entity Table System**
### **Table Header**:
- **Title**: Left-aligned with description underneath
- **Show Entries**: Dropdown on top-left (`Select` component)
- **Pagination**: Top-right corner with page numbers and navigation
- **Background**: White with border (`bg-white rounded-lg border`)

### **Table Features**:
- **Multi-select**: Checkbox column with bulk action buttons
- **Row Actions**: Three-dot menu (`MoreHorizontal` icon) on rightmost column
- **Sortable Columns**: Click headers to sort (with visual indicators)
- **Status Badges**: Color-coded based on entity status:
  - Active: `bg-green-100 text-green-800`
  - Inactive: `bg-gray-100 text-gray-800`
  - Pending: `bg-blue-100 text-blue-800`
  - Processing: `bg-purple-100 text-purple-800`

### **Bulk Actions**:
- **Selection Count**: Shows "X items selected"
- **Actions**: Export, Delete, Change Status, Assign To
- **Position**: Appears above table when items are selected

## 4. **Filter System**
### **Basic Filters** (Always Visible):
- **Search Bar**: Full-width with search icon, placeholder text
- **4 Main Filters**: Status, Source, Assigned To, Date Range
- **Layout**: Responsive grid - single column on mobile, multiple on desktop

### **Advanced Filters** (Right-Side Drawer):
#### **Drawer Specifications**:
- **Width**: `sm:max-w-md` (narrower than form drawer)
- **Background**: White with `z-50` overlay
- **Header**: "Advanced Filters" with close button

#### **Filter Components**:
1. **Saved Filters Dropdown**: 
   - At top of drawer
   - Shows previously saved filter combinations
   - "Load Saved Filter" button

2. **Filter Rules Section**:
   - **Add Rule Button**: `+ Add Filter Rule`
   - **Logic Operators**: AND/OR buttons between rules
   - **Each Rule Contains**:
     - Field Selection (dropdown with search)
     - Operator Selection (equals, contains, greater than, etc.)
     - Value Input (varies by field type)
     - Remove button (X icon)

3. **Save Current Filter**:
   - Text input for filter name
   - Save button
   - "Save and Apply" vs "Save Only" options

#### **Filter Rule Behavior**:
- When adding a rule, hide other advanced options temporarily
- Show only relevant operators based on selected field type
- Dynamic value input based on field and operator selection

### **Applied Filters Display**:
- **Position**: Above table, below basic filters
- **Style**: Tag badges with remove buttons (`X` icon)
- **Clear All**: Button appears when filters are active
- **Filter Count**: Badge showing number of active filters
- **Tag Colors**: Different colors for different filter types

## 5. **Interactive Behaviors**
### **Search Functionality**:
- **Real-time Search**: Updates results as user types (300ms debounce)
- **Search Scope**: Primary entity fields (name, email, company, etc.)
- **Highlight**: Search terms highlighted in results

### **Dropdown Enhancements**:
- **Large Datasets**: Auto-add search functionality when >10 options
- **Loading States**: Skeleton loaders for dynamic dropdowns
- **Error States**: Fallback messages for failed loads

### **Country/City Integration**:
- **Countries**: Full list with search, flag icons
- **Cities**: Filtered by selected country, searchable
- **Auto-complete**: Suggestions as user types

## 6. **Responsive Design**
### **Mobile Adaptations**:
- **Drawer Forms**: Full-width on mobile, overlay on desktop
- **Table**: Horizontal scroll with sticky first column
- **Filters**: Stack vertically, collapsible sections
- **Pagination**: Simplified on small screens

### **Tablet Adaptations**:
- **2-column Form Layout**: Maintained on tablets
- **Filter Grid**: 2-column layout
- **Table**: Full functionality preserved

## 7. **Custom Fields Integration**
### **Field Types Supported**:
- Text, Textarea, Number, Email, Phone, Date, DateTime
- Select, Multi-select, Checkbox, Radio, File Upload
- URL, Currency, Percentage, Rating, Boolean

### **Dynamic Form Rendering**:
- **Conditional Logic**: Show/hide fields based on other field values
- **Validation**: Real-time validation with error messages
- **Sections**: Group custom fields in logical sections
- **Order**: Drag-and-drop reordering in settings

## 8. **Performance Optimizations**:
- **Virtual Scrolling**: For large datasets (>1000 records)
- **Lazy Loading**: Load data as needed
- **Caching**: Filter results and form data
- **Debounced Search**: Prevent excessive API calls

## 9. **Accessibility Features**:
- **Keyboard Navigation**: Full tab order, arrow key navigation
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Clear focus indicators

## 10. **TypeScript Interface Design Patterns**:
### **Field Requirements**:
- **Required Fields**: Core entity properties should be required (no `?` modifier)
  - `id: string` - Always required for existing entities
  - Primary fields like `title`, `name`, `email` - Essential for entity identification
  - Business-critical fields that must always have values
- **Optional Fields**: Use sparingly, only for truly optional data
  - Fields that can legitimately be empty or undefined
  - Computed or derived fields that may not always be present
- **Consistency**: Maintain consistent field requirements across similar entities
  - If `address` is required in one entity, consider if it should be required in related entities
  - Align interface design with actual business requirements and form validation

### **Interface Organization**:
- **Base Properties**: Group core identification fields first
- **Contact Information**: Email, phone, address fields together  
- **Business Data**: Company, industry, value fields together
- **Metadata**: Created dates, updated dates, status fields last

## 11. **Error Handling & Loading States**:
- **Form Validation**: Real-time with clear error messages  
- **Loading Spinners**: On buttons during save operations
- **Network Errors**: Retry mechanisms with user feedback
- **Empty States**: Helpful messages when no data exists

## 12. **Project Knowledge Management**:
### **What to Include in Knowledge Files**:
- **Project Overview**: Brief description of the project, its goals, and objectives
- **User Personas**: Detailed descriptions of target users and their needs
- **Feature Specifications**: User stories, acceptance criteria, and detailed descriptions of each feature
- **Design Assets**: Links to design files, color palettes, typography, and other visual elements
- **API Documentation**: Detailed API endpoints, request/response examples, and authentication methods
- **Database Schema**: ER diagrams, table structures, and relationships
- **Environment Setup**: Instructions for setting up the development environment, including dependencies and configurations
- **Testing Guidelines**: Types of tests, testing frameworks, and coverage requirements
- **Deployment Instructions**: Steps for deploying the application to different environments (development, staging, production)
- **Version Control Practices**: Define branching strategy, commit message conventions, and code review guidelines
- **Security Practices**: Guidelines for secure coding, data protection, and handling sensitive information
- **Compliance Requirements**: Any legal or regulatory requirements the project must adhere to

### **Best Practices for Maintaining Knowledge Files**:
- **Start Early**: Use tools like Lovable's experimental chat mode to generate a knowledge file at the beginning of the project
- **Keep It Dynamic**: Automate updates to ensure knowledge files stay in sync with codebase and documentation
- **Define Roles Clearly**: Assign ownership to different sections to ensure accountability and avoid outdated information
- **Regular Reviews**: Schedule periodic reviews to ensure information remains current and accurate
- **Centralized Location**: Keep all knowledge files in a consistent, easily accessible location
- **Version Control**: Track changes to knowledge files using version control systems