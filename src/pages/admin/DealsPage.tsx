import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Handshake,
  TrendingUp,
  DollarSign,
  Target
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
import { DealTable } from '../../components/deals/DealTable';
import { EnhancedDealDrawerForm } from '../../components/deals/EnhancedDealDrawerForm';
import { toast } from 'sonner';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  assignedTo: string;
  source: string;
  description: string;
  lastActivity: string;
  payment_status: 'pending' | 'paid' | 'partial';
}

// Filter configuration for deals
const dealFilterConfig = {
  searchPlaceholder: "Search deals by title, company, or contact...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const,
      placeholder: 'Search deals by title, company, or contact...'
    },
    {
      key: 'stage',
      label: 'Stage',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Stages' },
        { value: 'prospecting', label: 'Prospecting' },
        { value: 'qualification', label: 'Qualification' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'closed-won', label: 'Closed Won' },
        { value: 'closed-lost', label: 'Closed Lost' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Assignees' },
        { value: 'Sarah Johnson', label: 'Sarah Johnson' },
        { value: 'Mike Chen', label: 'Mike Chen' },
        { value: 'Emily Rodriguez', label: 'Emily Rodriguez' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Sources' },
        { value: 'Website', label: 'Website' },
        { value: 'Referral', label: 'Referral' },
        { value: 'Trade Show', label: 'Trade Show' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'valueRange',
      label: 'Value Range',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Values' },
        { value: 'small', label: 'Small (< $50k)' },
        { value: 'medium', label: 'Medium ($50k - $100k)' },
        { value: 'large', label: 'Large (> $100k)' }
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
    stage: 'all',
    assignedTo: 'all',
    source: 'all',
    valueRange: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

const dealsData: Deal[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    company: 'TechCorp Inc.',
    contact: 'John Smith',
    value: 150000,
    stage: 'negotiation',
    probability: 80,
    closeDate: '2024-02-15',
    assignedTo: 'Sarah Johnson',
    source: 'Website',
    description: 'Annual enterprise software license renewal',
    lastActivity: '2024-01-28',
    payment_status: 'pending'
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    company: 'StartupXYZ',
    contact: 'Emily Davis',
    value: 85000,
    stage: 'proposal',
    probability: 65,
    closeDate: '2024-03-01',
    assignedTo: 'Mike Chen',
    source: 'Referral',
    description: 'Complete cloud infrastructure migration',
    lastActivity: '2024-01-29',
    payment_status: 'pending'
  },
  {
    id: '3',
    title: 'Consulting Services',
    company: 'Manufacturing Ltd',
    contact: 'Robert Wilson',
    value: 45000,
    stage: 'qualification',
    probability: 40,
    closeDate: '2024-03-15',
    assignedTo: 'Emily Rodriguez',
    source: 'Trade Show',
    description: 'Strategic consulting for digital transformation',
    lastActivity: '2024-01-30',
    payment_status: 'pending'
  }
];

const filterDeals = (deals: Deal[], filters: Record<string, any>) => {
  return deals.filter(deal => {
    // Search filter
    if (filters.search) {
      const searchValue = filters.search.toLowerCase();
      const searchFields = [
        deal.title,
        deal.company,
        deal.contact,
        deal.description
      ].filter(Boolean);
      
      if (!searchFields.some(field => field.toLowerCase().includes(searchValue))) {
        return false;
      }
    }

    // Stage filter
    if (filters.stage !== 'all' && deal.stage !== filters.stage) {
      return false;
    }

    // Assigned to filter
    if (filters.assignedTo !== 'all' && deal.assignedTo !== filters.assignedTo) {
      return false;
    }

    // Source filter
    if (filters.source !== 'all' && deal.source !== filters.source) {
      return false;
    }

    // Value range filter
    if (filters.valueRange !== 'all') {
      switch (filters.valueRange) {
        case 'small':
          if (deal.value >= 50000) return false;
          break;
        case 'medium':
          if (deal.value < 50000 || deal.value > 100000) return false;
          break;
        case 'large':
          if (deal.value <= 100000) return false;
          break;
      }
    }

    // Date range filter (using lastActivity as a proxy for creation date)
    if (filters.dateRange?.from || filters.dateRange?.to) {
      const dealDate = new Date(deal.lastActivity);
      if (filters.dateRange.from && dealDate < new Date(filters.dateRange.from)) {
        return false;
      }
      if (filters.dateRange.to && dealDate > new Date(filters.dateRange.to)) {
        return false;
      }
    }

    return true;
  });
};

const DealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>(dealsData);
  const [filters, setFilters] = useState(dealFilterConfig.defaultFilters);
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredDeals = filterDeals(deals, filters);

  // Pagination
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeals = filteredDeals.slice(startIndex, startIndex + itemsPerPage);

  const dealStats = {
    total: deals.length,
    totalValue: deals.reduce((sum, deal) => sum + deal.value, 0),
    wonDeals: deals.filter(deal => deal.stage === 'closed-won').length,
    avgDealSize: Math.round(deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length)
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowDealForm(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealForm(true);
  };

  const handleSaveDeal = (dealData: any) => {
    if (selectedDeal) {
      // Edit existing deal
      setDeals(prev => prev.map(deal => 
        deal.id === selectedDeal.id 
          ? { 
              ...deal, 
              title: dealData.deal_name || deal.title,
              company: dealData.customer || deal.company,
              value: dealData.deal_value || deal.value,
              stage: dealData.payment_status === 'paid' ? 'closed-won' : deal.stage,
              assignedTo: dealData.sales_rep || deal.assignedTo,
              closeDate: dealData.sale_date || deal.closeDate,
              description: dealData.notes || deal.description,
              lastActivity: new Date().toISOString().split('T')[0]
            }
          : deal
      ));
      toast.success('Deal updated successfully');
    } else {
      // Add new deal
      const newDeal: Deal = {
        id: Date.now().toString(),
        title: dealData.deal_name || 'New Deal',
        company: dealData.customer || '',
        contact: dealData.customer || '',
        value: dealData.deal_value || 0,
        stage: dealData.payment_status === 'paid' ? 'closed-won' : 'qualification',
        probability: dealData.payment_status === 'paid' ? 100 : 50,
        closeDate: dealData.sale_date || new Date().toISOString().split('T')[0],
        assignedTo: dealData.sales_rep || 'Unassigned',
        source: 'Direct',
        description: dealData.notes || '',
        lastActivity: new Date().toISOString().split('T')[0],
        payment_status: dealData.payment_status || 'pending'
      };
      setDeals(prev => [...prev, newDeal]);
      toast.success('Deal created successfully');
    }
    setShowDealForm(false);
    setSelectedDeal(null);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== dealId));
    toast.success('Deal deleted successfully');
  };

  const handleViewDeal = (deal: Deal) => {
    // For now, just edit the deal
    handleEditDeal(deal);
  };

  const handleSelectDeal = (dealId: string, checked: boolean) => {
    if (checked) {
      setSelectedDeals(prev => [...prev, dealId]);
    } else {
      setSelectedDeals(prev => prev.filter(id => id !== dealId));
    }
  };

  const handleSelectAllDeals = (checked: boolean) => {
    if (checked) {
      setSelectedDeals(paginatedDeals.map(deal => deal.id));
    } else {
      setSelectedDeals([]);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage your sales deals and revenue</p>
        </div>
        <Button onClick={handleAddDeal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernKPICard
          title="Total Deals"
          value={dealStats.total.toString()}
          icon={Handshake}
          change={{ value: "+12%", trend: "up" }}
        />
        <ModernKPICard
          title="Pipeline Value"
          value={`$${Math.round(dealStats.totalValue / 1000)}K`}
          icon={DollarSign}
          change={{ value: "+18%", trend: "up" }}
        />
        <ModernKPICard
          title="Won Deals"
          value={dealStats.wonDeals.toString()}
          icon={Target}
          change={{ value: "+25%", trend: "up" }}
        />
        <ModernKPICard
          title="Avg Deal Size"
          value={`$${Math.round(dealStats.avgDealSize / 1000)}K`}
          icon={TrendingUp}
          change={{ value: "+8%", trend: "up" }}
        />
      </div>

      {/* Filters */}
      <AdvancedFilters
        config={dealFilterConfig}
        filters={filters}
        onFiltersChange={setFilters}
        title="Deal Filters"
        filteredCount={filteredDeals.length}
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Deals</CardTitle>
              <CardDescription>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDeals.length)} of {filteredDeals.length} records
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
          <DealTable
            deals={paginatedDeals}
            selectedDeals={selectedDeals}
            onSelectDeal={(id) => handleSelectDeal(id, true)}
            onSelectAllDeals={() => handleSelectAllDeals(true)}
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
            onView={handleViewDeal}
          />

          {filteredDeals.length === 0 && (
            <div className="text-center py-12">
              <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No deals found matching your filters</p>
              <Button onClick={() => setFilters(dealFilterConfig.defaultFilters)} variant="outline" className="mt-2">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deal Form */}
      <EnhancedDealDrawerForm
        isOpen={showDealForm}
        deal={selectedDeal as any}
        onClose={() => {
          setShowDealForm(false);
          setSelectedDeal(null);
        }}
        onSave={handleSaveDeal}
      />
    </div>
  );
};

export default DealsPage;