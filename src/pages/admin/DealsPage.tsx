
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Filter, 
  Search, 
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Handshake,
  FileText,
  Download,
  Upload,
  Users,
  Star,
  Target,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { DealTable } from '../../components/deals/DealTable';
import { DealAdvancedFilters } from '../../components/deals/DealAdvancedFilters';
import { EnhancedDealDrawerForm } from '../../components/deals/EnhancedDealDrawerForm';
import { FilterDrawer } from '../../components/shared/FilterDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
}

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
    lastActivity: '2024-01-28'
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
    lastActivity: '2024-01-29'
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
    lastActivity: '2024-01-30'
  }
];

const DealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>(dealsData);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [appliedFilters, setAppliedFilters] = useState<Array<{id: string, label: string, type: string}>>([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    valueRange: { min: '', max: '' },
    probabilityRange: { min: '', max: '' },
    assignedTo: 'all',
    source: 'all',
    stage: 'all',
    lastActivity: 'all',
    operator: 'AND' as 'AND' | 'OR',
    textCondition: 'contains' as 'contains' | 'equals' | 'not_contains' | 'not_equals'
  });
  const [dealFormOpen, setDealFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any | null>(null);

  const filteredDeals = deals.filter(deal => {
    const matchesStatus = statusFilter === 'all' || deal.stage === statusFilter;
    return matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeals = filteredDeals.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectDeal = (dealId: string) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleSelectAllDeals = () => {
    if (selectedDeals.length === paginatedDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(paginatedDeals.map(deal => deal.id));
    }
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setDealFormOpen(true);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDealToDelete(dealId);
    setDeleteModalOpen(true);
  };

  const handleSaveDeal = (dealData: any) => {
    if (editingDeal) {
      // Update existing deal
      setDeals(prev => prev.map(deal => 
        deal.id === editingDeal.id ? { 
          ...deal, 
          title: dealData.deal_name,
          company: dealData.customer,
          contact: dealData.customer, // You might want to get actual contact name
          value: dealData.deal_value,
          stage: dealData.payment_status === 'paid' ? 'closed-won' : 'negotiation' as Deal['stage'],
          probability: dealData.payment_status === 'paid' ? 100 : 80,
          closeDate: dealData.sale_date,
          assignedTo: dealData.sales_rep,
          source: 'Direct',
          description: dealData.notes || '',
          lastActivity: new Date().toISOString().split('T')[0]
        } : deal
      ));
      toast.success('Deal updated successfully!');
    } else {
      // Add new deal
      const newDeal = {
        id: String(Date.now()),
        title: dealData.deal_name,
        company: dealData.customer,
        contact: dealData.customer, // You might want to get actual contact name
        value: dealData.deal_value,
        stage: dealData.payment_status === 'paid' ? 'closed-won' : 'negotiation' as Deal['stage'],
        probability: dealData.payment_status === 'paid' ? 100 : 80,
        closeDate: dealData.sale_date,
        assignedTo: dealData.sales_rep,
        source: 'Direct',
        description: dealData.notes || '',
        lastActivity: new Date().toISOString().split('T')[0]
      };
      setDeals(prev => [...prev, newDeal]);
      toast.success('Deal created successfully!');
    }
    setDealFormOpen(false);
    setEditingDeal(null);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      setDeals(prev => prev.filter(deal => deal.id !== dealToDelete));
      toast.success('Deal deleted successfully');
      setDeleteModalOpen(false);
      setDealToDelete(null);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) count++;
    if (advancedFilters.valueRange.min || advancedFilters.valueRange.max) count++;
    if (advancedFilters.probabilityRange.min || advancedFilters.probabilityRange.max) count++;
    if (advancedFilters.assignedTo !== 'all') count++;
    if (advancedFilters.source !== 'all') count++;
    if (advancedFilters.stage !== 'all') count++;
    if (advancedFilters.lastActivity !== 'all') count++;
    return count;
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      valueRange: { min: '', max: '' },
      probabilityRange: { min: '', max: '' },
      assignedTo: 'all',
      source: 'all',
      stage: 'all',
      lastActivity: 'all',
      operator: 'AND',
      textCondition: 'contains'
    });
    setAppliedFilters([]);
  };

  const applyAdvancedFilters = () => {
    const newAppliedFilters = [];
    
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) {
      newAppliedFilters.push({
        id: 'dateRange',
        label: `Created: ${advancedFilters.dateRange.from?.toLocaleDateString() || 'Any'} - ${advancedFilters.dateRange.to?.toLocaleDateString() || 'Any'}`,
        type: 'dateRange'
      });
    }
    
    if (advancedFilters.valueRange.min || advancedFilters.valueRange.max) {
      newAppliedFilters.push({
        id: 'valueRange',
        label: `Value: $${advancedFilters.valueRange.min || '0'} - $${advancedFilters.valueRange.max || '∞'}`,
        type: 'valueRange'
      });
    }
    
    if (advancedFilters.probabilityRange.min || advancedFilters.probabilityRange.max) {
      newAppliedFilters.push({
        id: 'probabilityRange',
        label: `Probability: ${advancedFilters.probabilityRange.min || '0'}% - ${advancedFilters.probabilityRange.max || '100'}%`,
        type: 'probabilityRange'
      });
    }
    
    if (advancedFilters.assignedTo !== 'all') {
      newAppliedFilters.push({
        id: 'assignedTo',
        label: `Assigned: ${advancedFilters.assignedTo}`,
        type: 'assignedTo'
      });
    }
    
    if (advancedFilters.source !== 'all') {
      newAppliedFilters.push({
        id: 'source',
        label: `Source: ${advancedFilters.source}`,
        type: 'source'
      });
    }
    
    if (advancedFilters.stage !== 'all') {
      newAppliedFilters.push({
        id: 'stage',
        label: `Stage: ${advancedFilters.stage}`,
        type: 'stage'
      });
    }
    
    if (advancedFilters.lastActivity !== 'all') {
      newAppliedFilters.push({
        id: 'lastActivity',
        label: `Activity: ${advancedFilters.lastActivity}`,
        type: 'lastActivity'
      });
    }
    
    setAppliedFilters(newAppliedFilters);
    setShowAdvancedFilters(false);
  };

  const removeAppliedFilter = (filterId: string) => {
    const updatedAdvancedFilters = { ...advancedFilters };
    
    switch (filterId) {
      case 'dateRange':
        updatedAdvancedFilters.dateRange = { from: undefined, to: undefined };
        break;
      case 'valueRange':
        updatedAdvancedFilters.valueRange = { min: '', max: '' };
        break;
      case 'probabilityRange':
        updatedAdvancedFilters.probabilityRange = { min: '', max: '' };
        break;
      case 'assignedTo':
        updatedAdvancedFilters.assignedTo = 'all';
        break;
      case 'source':
        updatedAdvancedFilters.source = 'all';
        break;
      case 'stage':
        updatedAdvancedFilters.stage = 'all';
        break;
      case 'lastActivity':
        updatedAdvancedFilters.lastActivity = 'all';
        break;
    }
    
    setAdvancedFilters(updatedAdvancedFilters);
    setAppliedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
        </div>
        <Button onClick={() => setDealFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Deals"
          value={deals.length.toString()}
          change={{ value: "+12%", trend: "up" }}
          icon={Handshake}
        />
        <ModernKPICard
          title="Pipeline Value"
          value={`$${Math.round(deals.reduce((sum, deal) => sum + deal.value, 0) / 1000)}K`}
          change={{ value: "+18%", trend: "up" }}
          icon={DollarSign}
        />
        <ModernKPICard
          title="Won Deals"
          value={deals.filter(d => d.stage === 'closed-won').length.toString()}
          change={{ value: "+25%", trend: "up" }}
          icon={Target}
        />
        <ModernKPICard
          title="Avg Deal Size"
          value={`$${Math.round(deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length / 1000)}K`}
          change={{ value: "+8%", trend: "up" }}
          icon={TrendingUp}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Deal Filters</CardTitle>
              <CardDescription>Filter and search your deals</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              {getActiveFiltersCount() > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters ({getActiveFiltersCount()})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search deals..." className="pl-10" />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="prospecting">Prospecting</SelectItem>
                <SelectItem value="qualification">Qualification</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="trade-show">Trade Show</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Chen</SelectItem>
                <SelectItem value="emily">Emily Rodriguez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {appliedFilters.map((filter) => (
                <div key={filter.id} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  <span>{filter.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-primary/20"
                    onClick={() => removeAppliedFilter(filter.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {selectedDeals.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedDeals.length} selected
              </span>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Make Call
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
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
                  <span className="text-sm text-muted-foreground">entries</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDeals.length)} of {filteredDeals.length} records
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <DealTable
            deals={paginatedDeals}
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
            selectedDeals={selectedDeals}
            onSelectDeal={handleSelectDeal}
            onSelectAllDeals={handleSelectAllDeals}
          />
        </CardContent>
      </Card>

      {/* Enhanced Deal Form */}
      <EnhancedDealDrawerForm
        isOpen={dealFormOpen}
        deal={editingDeal}
        onClose={() => {
          setDealFormOpen(false);
          setEditingDeal(null);
        }}
        onSave={handleSaveDeal}
      />

      <DealAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onApplyFilters={applyAdvancedFilters}
        onClearFilters={() => {
          setAdvancedFilters({
            dateRange: { from: undefined, to: undefined },
            valueRange: { min: '', max: '' },
            probabilityRange: { min: '', max: '' },
            assignedTo: 'all',
            source: 'all',
            stage: 'all',
            lastActivity: 'all',
            operator: 'AND',
            textCondition: 'contains'
          });
          setAppliedFilters([]);
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this deal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DealsPage;
