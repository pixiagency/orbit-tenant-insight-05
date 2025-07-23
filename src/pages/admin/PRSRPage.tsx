import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdvancedFilters } from '../../components/shared/AdvancedFilters';
import { RegeneratedPRSRTable } from '../../components/pr-sr/RegeneratedPRSRTable';
import { EnhancedPRSRDrawerForm } from '../../components/pr-sr/EnhancedPRSRDrawerForm';
import { PRSR } from '@/types/pr-sr';
import { toast } from 'sonner';

// Filter configuration for products/services
const prsrFilterConfig = {
  searchPlaceholder: "Search products/services by name or category...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const,
      placeholder: 'Search products/services by name or category...'
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'pr', label: 'Product' },
        { value: 'sr', label: 'Service' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'contact_status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Qualified', label: 'Qualified' },
        { value: 'Unqualified', label: 'Unqualified' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Retail', label: 'Retail' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'lead_source',
      label: 'Source',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Sources' },
        { value: 'Website', label: 'Website' },
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'Referral', label: 'Referral' },
        { value: 'Trade Show', label: 'Trade Show' },
        { value: 'Cold Call', label: 'Cold Call' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Created Date Range',
      type: 'date-range' as const,
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    type: 'all',
    contact_status: 'all',
    category: 'all',
    lead_source: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

const prsrData: PRSR[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    job_title: 'Product Manager',
    department: 'Technology',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Website',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Email',
    do_not_call: false,
    company: 'TechCorp Inc.',
    website: 'https://techcorp.com',
    industry: 'Technology',
    created_date: '2024-01-15',
    modified_date: '2024-01-20',
    priority: 'High',
    media_type: 'Digital',
    reach: 50000,
    influence_score: 85,
    category: 'Software',
    price: 299.99,
    sku: 'TECH-001'
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@healthcare.com',
    phone: '+1 (555) 987-6543',
    job_title: 'Service Director',
    department: 'Healthcare',
    type: 'sr',
    contact_status: 'Active',
    lead_source: 'LinkedIn',
    email_opt_in: true,
    phone_opt_in: false,
    preferred_contact_method: 'Email',
    do_not_call: false,
    company: 'HealthCare Solutions',
    industry: 'Healthcare',
    created_date: '2024-01-10',
    modified_date: '2024-01-18',
    priority: 'Medium',
    media_type: 'Service',
    category: 'Consulting',
    price: 150.00
  }
];

const filterPRSR = (items: PRSR[], filters: Record<string, any>) => {
  return items.filter(item => {
    // Search filter
    if (filters.search) {
      const searchValue = filters.search.toLowerCase();
      const searchFields = [
        item.first_name,
        item.last_name,
        item.email,
        item.company,
        item.category
      ].filter(Boolean);
      
      if (!searchFields.some(field => field?.toLowerCase().includes(searchValue))) {
        return false;
      }
    }

    // Type filter
    if (filters.type !== 'all' && item.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.contact_status !== 'all' && item.contact_status !== filters.contact_status) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }

    // Source filter
    if (filters.lead_source !== 'all' && item.lead_source !== filters.lead_source) {
      return false;
    }

    // Date range filter
    if (filters.dateRange?.from || filters.dateRange?.to) {
      const itemDate = new Date(item.created_date);
      if (filters.dateRange.from && itemDate < new Date(filters.dateRange.from)) {
        return false;
      }
      if (filters.dateRange.to && itemDate > new Date(filters.dateRange.to)) {
        return false;
      }
    }

    return true;
  });
};

const PRSRPage = () => {
  const [items, setItems] = useState<PRSR[]>(prsrData);
  const [filters, setFilters] = useState(prsrFilterConfig.defaultFilters);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PRSR | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredItems = filterPRSR(items, filters);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const itemStats = {
    total: items.length,
    active: items.filter(item => item.contact_status === 'Active').length,
    totalRevenue: items.reduce((sum, item) => sum + (item.price || 0), 0),
    totalSales: items.reduce((sum, item) => sum + (item.sales_count || 0), 0)
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: PRSR) => {
    setSelectedItem(item);
    setShowItemForm(true);
  };

  const handleSaveItem = (itemData: PRSR) => {
    if (selectedItem) {
      // Edit existing item
      setItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...itemData, id: item.id, modified_date: new Date().toISOString().split('T')[0] }
          : item
      ));
      toast.success('Item updated successfully');
    } else {
      // Add new item
      const newItem: PRSR = {
        ...itemData,
        id: Date.now().toString(),
        created_date: new Date().toISOString().split('T')[0],
        modified_date: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [...prev, newItem]);
      toast.success('Item created successfully');
    }
    setShowItemForm(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item deleted successfully');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products & Services</h1>
          <p className="text-gray-600 mt-1">Manage your products and services catalog</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product/Service
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernKPICard
          title="Total Products"
          value={itemStats.total.toString()}
          icon={Package}
          change={{ value: "+2", trend: "up" }}
        />
        <ModernKPICard
          title="Active Products"
          value={itemStats.active.toString()}
          icon={ShoppingCart}
          change={{ value: "+1", trend: "up" }}
        />
        <ModernKPICard
          title="Total Revenue"
          value={`$${itemStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change={{ value: "+12.5%", trend: "up" }}
        />
        <ModernKPICard
          title="Total Sales"
          value={itemStats.totalSales.toString()}
          icon={TrendingUp}
          change={{ value: "+18.2%", trend: "up" }}
        />
      </div>

      {/* Filters */}
      <AdvancedFilters
        config={prsrFilterConfig}
        filters={filters}
        onFiltersChange={setFilters}
        title="Product/Service Filters"
        filteredCount={filteredItems.length}
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Products & Services</CardTitle>
              <CardDescription>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} records
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RegeneratedPRSRTable
            searchTerm={filters.search}
            typeFilter={filters.type !== 'all' ? filters.type : undefined}
            statusFilter={filters.contact_status}
            sourceFilter={filters.lead_source}
            onEdit={handleEditItem}
          />

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products/services found matching your filters</p>
              <Button onClick={() => setFilters(prsrFilterConfig.defaultFilters)} variant="outline" className="mt-2">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Item Form */}
      <EnhancedPRSRDrawerForm
        isOpen={showItemForm}
        prsr={selectedItem}
        onClose={() => {
          setShowItemForm(false);
          setSelectedItem(null);
        }}
        onSubmit={handleSaveItem}
      />
    </div>
  );
};

export default PRSRPage;