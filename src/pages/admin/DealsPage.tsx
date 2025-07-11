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
  Target
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
  expectedCloseDate: string;
  owner: string;
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
    expectedCloseDate: '2024-02-15',
    owner: 'Sarah Johnson',
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
    expectedCloseDate: '2024-03-01',
    owner: 'Mike Chen',
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
    expectedCloseDate: '2024-03-15',
    owner: 'Emily Rodriguez',
    source: 'Trade Show',
    description: 'Strategic consulting for digital transformation',
    lastActivity: '2024-01-30'
  }
];

export const DealsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // KPI Calculations
  const totalDeals = dealsData.length;
  const totalValue = dealsData.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = dealsData.filter(deal => deal.stage === 'closed-won').length;
  const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;

  // Filtered data
  const filteredDeals = dealsData.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    const matchesOwner = filterOwner === 'all' || deal.owner === filterOwner;
    
    return matchesSearch && matchesStage && matchesOwner;
  });

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsFormOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsFormOpen(true);
  };

  const handleDeleteDeal = (deal: Deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      toast.success(`Deal "${dealToDelete.title}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
    }
  };

  const handleFormSubmit = (dealData: any) => {
    if (selectedDeal) {
      toast.success('Deal updated successfully');
    } else {
      toast.success('New deal created successfully');
    }
    setIsFormOpen(false);
    setSelectedDeal(null);
  };

  const handleExport = () => {
    toast.success('Deals exported successfully');
  };

  const handleImport = () => {
    toast.success('Deals imported successfully');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals Management</h1>
          <p className="text-muted-foreground mt-1">Track and nurture your sales opportunities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddDeal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Deals</p>
                <p className="text-2xl font-bold text-blue-900">{totalDeals}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8 this week
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Handshake className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-green-900">${(totalValue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  High quality deals
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Won Deals</p>
                <p className="text-2xl font-bold text-purple-900">{wonDeals}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  Great results!
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-orange-900">${(avgDealSize / 1000).toFixed(0)}K</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Strong pipeline
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-600 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deal Filters */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Deal Filters</h2>
          <p className="text-sm text-muted-foreground">Filter and search your deals</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="prospecting">Prospecting</SelectItem>
                  <SelectItem value="qualification">Qualification</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                  <SelectItem value="closed-lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterOwner} onValueChange={setFilterOwner}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="trade-show">Trade Show</SelectItem>
                  <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="mike">Mike Chen</SelectItem>
                  <SelectItem value="emily">Emily Rodriguez</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80-100)</SelectItem>
                  <SelectItem value="medium">Medium (50-79)</SelectItem>
                  <SelectItem value="low">Low (0-49)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valueRange">Value Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10k">$0 - $10K</SelectItem>
                  <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                  <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                  <SelectItem value="100k+">$100K+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="trade-show">Trade Show</SelectItem>
                  <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(false)}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deals Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Deals ({filteredDeals.length})</h2>
            <p className="text-sm text-muted-foreground">Manage and track your sales deals</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Show</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center border rounded-md">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border">
          <DealTable
            deals={filteredDeals}
            onEdit={handleEditDeal}
            onDelete={(dealId) => {
              const deal = filteredDeals.find(d => d.id === dealId);
              if (deal) handleDeleteDeal(deal);
            }}
            searchTerm=""
            onSearchChange={() => {}}
            stageFilter="all"
            onStageFilterChange={() => {}}
          />
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1 to {Math.min(10, filteredDeals.length)} of {filteredDeals.length} records
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm">Page</span>
                <span className="font-medium">1</span>
                <span className="text-sm">of</span>
                <span className="font-medium">6</span>
              </div>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Form Modal */}
      {/* <DealDrawerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDeal(null);
        }}
        onSubmit={handleFormSubmit}
        deal={selectedDeal}
      /> */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{dealToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};