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
  Phone
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
import { DealDrawerForm } from '../../components/deals/DealDrawerForm';
import { DealTable } from '../../components/deals/DealTable';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    setIsDrawerOpen(true);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDealToDelete(dealId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      setDeals(prev => prev.filter(deal => deal.id !== dealToDelete));
      toast.success('Deal deleted successfully');
      setDeleteModalOpen(false);
      setDealToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground mt-1">Manage your sales pipeline</p>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)}>
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

      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(true)}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          
          {selectedDeals.length > 0 && (
            <div className="flex items-center gap-2">
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
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsDrawerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

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

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <FilterDrawer
          isOpen={showAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
          title="Advanced Filters"
        />
      )}

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