import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Briefcase,
  TrendingUp,
  DollarSign,
  Star,
  Grid3X3,
  List,
  Search,
  Filter,
  X
} from 'lucide-react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { AdvancedFilters } from '../../components/shared/AdvancedFilters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OpportunityTable } from '../../components/opportunities/OpportunityTable';
import { OpportunityKanbanView } from '../../components/opportunities/OpportunityKanbanView';
import { EnhancedOpportunityDrawerForm } from '../../components/opportunities/EnhancedOpportunityDrawerForm';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  description?: string;
  notes?: string;
  pipeline: string;
  city?: string;
  createdAt: string;
  lastActivity: string;
}


const opportunitiesData: Opportunity[] = [
  {
    id: '1',
    name: 'Enterprise CRM Implementation',
    company: 'TechCorp Inc.',
    contact: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    stage: 'negotiation',
    value: 125000,
    probability: 75,
    expectedCloseDate: '2024-02-15',
    assignedTo: 'Sarah Johnson',
    source: 'Website',
    description: 'Large-scale CRM implementation for enterprise client',
    notes: 'Key decision maker confirmed. Budget approved.',
    pipeline: 'sales',
    city: 'New York',
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-18'
  },
  {
    id: '2',
    name: 'Startup Growth Platform',
    company: 'StartupXYZ',
    contact: 'Emily Davis',
    email: 'emily.davis@startup.com',
    phone: '+1 (555) 987-6543',
    stage: 'proposal',
    value: 75000,
    probability: 60,
    expectedCloseDate: '2024-02-28',
    assignedTo: 'Mike Chen',
    source: 'LinkedIn',
    description: 'Growth platform for emerging startup',
    notes: 'Demo scheduled for next week.',
    pipeline: 'sales',
    city: 'San Francisco',
    createdAt: '2024-01-18T14:20:00Z',
    lastActivity: '2024-01-18'
  },
  {
    id: '3',
    name: 'Manufacturing Automation',
    company: 'Manufacturing Ltd',
    contact: 'Robert Wilson',
    email: 'r.wilson@manufacturing.com',
    phone: '+1 (555) 456-7890',
    stage: 'qualification',
    value: 95000,
    probability: 45,
    expectedCloseDate: '2024-03-10',
    assignedTo: 'Emily Rodriguez',
    source: 'Trade Show',
    description: 'Manufacturing automation solution',
    notes: 'Technical requirements gathering in progress.',
    pipeline: 'sales',
    city: 'Chicago',
    createdAt: '2024-01-12T09:15:00Z',
    lastActivity: '2024-01-17'
  },
  {
    id: '4',
    name: 'Financial Services Solution',
    company: 'Finance Corp',
    contact: 'Lisa Anderson',
    email: 'lisa.a@finance.com',
    phone: '+1 (555) 321-0987',
    stage: 'closed-won',
    value: 200000,
    probability: 100,
    expectedCloseDate: '2024-01-20',
    assignedTo: 'David Brown',
    source: 'Referral',
    description: 'Comprehensive financial services platform',
    notes: 'Contract signed and implementation started.',
    pipeline: 'sales',
    city: 'Boston',
    createdAt: '2024-01-08T16:45:00Z',
    lastActivity: '2024-01-16'
  }
];

const filterOpportunities = (opportunities: Opportunity[], searchTerm: string, stageFilter: string, assignedToFilter: string, sourceFilter: string, pipelineFilter: string) => {
  return opportunities.filter(opportunity => {
    // Search filter
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      const searchFields = [
        opportunity.name,
        opportunity.company,
        opportunity.contact,
        opportunity.email
      ].filter(Boolean);
      
      if (!searchFields.some(field => field.toLowerCase().includes(searchValue))) {
        return false;
      }
    }

    // Stage filter
    if (stageFilter !== 'all' && opportunity.stage !== stageFilter) {
      return false;
    }

    // Assigned to filter
    if (assignedToFilter !== 'all' && opportunity.assignedTo !== assignedToFilter) {
      return false;
    }

    // Source filter
    if (sourceFilter !== 'all' && opportunity.source !== sourceFilter) {
      return false;
    }

    // Pipeline filter
    if (pipelineFilter !== 'all' && opportunity.pipeline !== pipelineFilter) {
      return false;
    }

    return true;
  });
};

export const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(opportunitiesData);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    stage: 'all',
    assignedTo: 'all',
    source: 'all',
    pipeline: 'all',
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined }
  });
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredOpportunities = filterOpportunities(opportunities, filters.search, filters.stage, filters.assignedTo, filters.source, filters.pipeline);

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);

  const opportunityStats = {
    total: opportunities.length,
    totalValue: opportunities.reduce((sum, opp) => sum + opp.value, 0),
    averageProbability: Math.round(opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length),
    wonThisMonth: opportunities.filter(opp => opp.stage === 'closed-won').length
  };

  const handleAddOpportunity = () => {
    setSelectedOpportunity(null);
    setShowOpportunityForm(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowOpportunityForm(true);
  };

  const handleSaveOpportunity = (opportunityData: any) => {
    if (selectedOpportunity) {
      // Edit existing opportunity
      setOpportunities(prev => prev.map(opp => 
        opp.id === selectedOpportunity.id 
          ? { ...opp, ...opportunityData, id: opp.id }
          : opp
      ));
      toast.success('Opportunity updated successfully');
    } else {
      // Add new opportunity
      const newOpportunity: Opportunity = {
        ...opportunityData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString().split('T')[0]
      };
      setOpportunities(prev => [...prev, newOpportunity]);
      toast.success('Opportunity created successfully');
    }
    setShowOpportunityForm(false);
    setSelectedOpportunity(null);
  };

  const handleDeleteOpportunity = (opportunityId: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
    toast.success('Opportunity deleted successfully');
  };

  const handleSelectOpportunity = (opportunityId: string, checked: boolean) => {
    if (checked) {
      setSelectedOpportunities(prev => [...prev, opportunityId]);
    } else {
      setSelectedOpportunities(prev => prev.filter(id => id !== opportunityId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOpportunities(paginatedOpportunities.map(opp => opp.id));
    } else {
      setSelectedOpportunities([]);
    }
  };

  const handleStageChange = (opportunityId: string, newStage: string) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, stage: newStage }
        : opp
    ));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.stage !== 'all') count++;
    if (filters.assignedTo !== 'all') count++;
    if (filters.source !== 'all') count++;
    if (filters.pipeline !== 'all') count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      stage: 'all',
      assignedTo: 'all',
      source: 'all',
      pipeline: 'all',
      dateRange: { from: undefined, to: undefined }
    });
  };

  // Filter configuration for AdvancedFilters component
  const filterConfig = {
    searchPlaceholder: "Search opportunities...",
    fields: [
      {
        key: 'search',
        label: 'Search',
        type: 'search' as const,
        placeholder: 'Search opportunities...'
      },
      {
        key: 'stage',
        label: 'Stage',
        type: 'select' as const,
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Stages' },
          { value: 'prospecting', label: 'Prospecting' },
          { value: 'qualification', label: 'Qualification' },
          { value: 'proposal', label: 'Proposal' },
          { value: 'negotiation', label: 'Negotiation' },
          { value: 'closed-won', label: 'Closed Won' },
          { value: 'closed-lost', label: 'Closed Lost' }
        ]
      },
      {
        key: 'assignedTo',
        label: 'Assigned To',
        type: 'select' as const,
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Assignees' },
          { value: 'Sarah Johnson', label: 'Sarah Johnson' },
          { value: 'Mike Chen', label: 'Mike Chen' },
          { value: 'Emily Rodriguez', label: 'Emily Rodriguez' },
          { value: 'David Brown', label: 'David Brown' }
        ]
      },
      {
        key: 'source',
        label: 'Source',
        type: 'select' as const,
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Sources' },
          { value: 'Website', label: 'Website' },
          { value: 'LinkedIn', label: 'LinkedIn' },
          { value: 'Referral', label: 'Referral' },
          { value: 'Trade Show', label: 'Trade Show' },
          { value: 'Cold Call', label: 'Cold Call' }
        ]
      },
      {
        key: 'pipeline',
        label: 'Pipeline',
        type: 'select' as const,
        defaultValue: 'all',
        isAdvanced: true,
        options: [
          { value: 'all', label: 'All Pipelines' },
          { value: 'sales', label: 'Sales' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'customer-success', label: 'Customer Success' },
          { value: 'enterprise', label: 'Enterprise' }
        ]
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        type: 'date-range' as const,
        isAdvanced: true
      }
    ],
    defaultFilters: {
      search: '',
      stage: 'all',
      assignedTo: 'all',
      source: 'all',
      pipeline: 'all',
      dateRange: { from: undefined, to: undefined }
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Opportunities</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleAddOpportunity}>
              <Plus className="h-4 w-4 mr-2" />
              New Opportunity
            </Button>
          </div>
        </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernKPICard
          title="Total Opportunities"
          value={opportunityStats.total.toString()}
          icon={Briefcase}
          change={{ value: "+12%", trend: "up" }}
        />
        <ModernKPICard
          title="Pipeline Value"
          value={`$${(opportunityStats.totalValue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change={{ value: "+18%", trend: "up" }}
        />
        <ModernKPICard
          title="Avg. Probability"
          value={`${opportunityStats.averageProbability}%`}
          icon={TrendingUp}
          change={{ value: "+5%", trend: "up" }}
        />
        <ModernKPICard
          title="Won This Month"
          value={opportunityStats.wonThisMonth.toString()}
          icon={Star}
          change={{ value: "+25%", trend: "up" }}
        />
      </div>

        {/* Filters Section */}
        <AdvancedFilters
          config={filterConfig}
          filters={filters}
          onFiltersChange={setFilters}
          title="Opportunity Filters"
          filteredCount={filteredOpportunities.length}
        />

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div></div>
              <div className="flex items-center space-x-2">
                {/* View Toggle - Two separate buttons */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <OpportunityTable
                opportunities={paginatedOpportunities}
                selectedOpportunities={selectedOpportunities}
                onSelectOpportunity={handleSelectOpportunity}
                onSelectAll={handleSelectAll}
                onEdit={handleEditOpportunity}
                onDelete={handleDeleteOpportunity}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={itemsPerPage}
                totalItems={filteredOpportunities.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newPageSize) => {
                  setItemsPerPage(newPageSize);
                  setCurrentPage(1);
                }}
              />
            ) : (
              <OpportunityKanbanView
                opportunities={filteredOpportunities}
                onStageChange={handleStageChange}
                onCardClick={handleEditOpportunity}
              />
            )}

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No opportunities found matching your filters</p>
                <Button onClick={clearFilters} variant="outline" className="mt-2">
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Opportunity Form */}
        <EnhancedOpportunityDrawerForm
          isOpen={showOpportunityForm}
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowOpportunityForm(false);
            setSelectedOpportunity(null);
          }}
          onSave={handleSaveOpportunity}
        />
      </div>
    </div>
  );
};