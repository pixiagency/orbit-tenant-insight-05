
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
  Handshake
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
  lastActivity: string;
  source: string;
  description: string;
}

const dealsData: Deal[] = [
  {
    id: '1',
    title: 'Enterprise CRM Implementation',
    company: 'TechCorp Inc.',
    contact: 'John Smith',
    value: 150000,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: '2024-02-15',
    owner: 'Sarah Johnson',
    lastActivity: '2024-01-18',
    source: 'Referral',
    description: 'Complete CRM system implementation for enterprise client'
  },
  {
    id: '2',
    title: 'Cloud Migration Services',
    company: 'Global Industries',
    contact: 'Emily Davis',
    value: 85000,
    stage: 'negotiation',
    probability: 60,
    expectedCloseDate: '2024-01-30',
    owner: 'Mike Chen',
    lastActivity: '2024-01-17',
    source: 'Website',
    description: 'Migration of legacy systems to cloud infrastructure'
  },
  {
    id: '3',
    title: 'Sales Training Program',
    company: 'StartupXYZ',
    contact: 'Robert Wilson',
    value: 45000,
    stage: 'qualification',
    probability: 40,
    expectedCloseDate: '2024-03-01',
    owner: 'Emily Rodriguez',
    lastActivity: '2024-01-16',
    source: 'Cold Call',
    description: 'Comprehensive sales training for growing team'
  },
  {
    id: '4',
    title: 'Security Audit & Compliance',
    company: 'Finance Corp',
    contact: 'Lisa Anderson',
    value: 125000,
    stage: 'closed-won',
    probability: 100,
    expectedCloseDate: '2024-01-15',
    owner: 'David Brown',
    lastActivity: '2024-01-15',
    source: 'Trade Show',
    description: 'Complete security audit and compliance implementation'
  },
  {
    id: '5',
    title: 'Marketing Automation Setup',
    company: 'Retail Solutions',
    contact: 'Michael Johnson',
    value: 35000,
    stage: 'prospecting',
    probability: 25,
    expectedCloseDate: '2024-02-28',
    owner: 'Sarah Johnson',
    lastActivity: '2024-01-15',
    source: 'LinkedIn',
    description: 'Marketing automation platform setup and training'
  }
];

export const DealsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    valueRange: { min: '', max: '' },
    probabilityRange: { min: '', max: '' },
    stage: 'all',
    owner: 'all',
    source: 'all'
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'qualification': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'proposal': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'negotiation': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'closed-won': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed-lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredDeals = dealsData.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const dealStats = {
    total: dealsData.length,
    totalValue: dealsData.reduce((sum, deal) => sum + deal.value, 0),
    weightedValue: dealsData.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0),
    wonDeals: dealsData.filter(d => d.stage === 'closed-won').length,
    activeDeals: dealsData.filter(d => !d.stage.startsWith('closed')).length
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your sales deals pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilterDrawer(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowDealForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ModernKPICard
          title="Total Deals"
          value={dealStats.total.toString()}
          icon={Handshake}
          change={{ value: "+3 this month", trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Total Value"
          value={`$${(dealStats.totalValue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change={{ value: "+15% from last month", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Weighted Value"
          value={`$${(dealStats.weightedValue / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          change={{ value: "Expected revenue", trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="Won Deals"
          value={dealStats.wonDeals.toString()}
          icon={TrendingUp}
          change={{ value: "Great success!", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Active Deals"
          value={dealStats.activeDeals.toString()}
          icon={Eye}
          change={{ value: "In progress", trend: "neutral" }}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Deals Pipeline</CardTitle>
              <CardDescription>Manage your sales deals and track progress through the pipeline</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {/* Search functionality moved to DealTable component */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <DealTable
                deals={filteredDeals}
                onEdit={(deal) => {
                  setSelectedDeal(deal as any);
                  setShowDealForm(true);
                }}
                onDelete={(dealId) => {
                  console.log('Delete deal:', dealId);
                }}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                stageFilter={stageFilter}
                onStageFilterChange={setStageFilter}
              />
            </TabsContent>

            <TabsContent value="pipeline">
              <div className="text-center py-12">
                <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Pipeline visualization coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="forecast">
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sales forecast view coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Deal Form Drawer */}
      <DealDrawerForm
        isOpen={showDealForm}
        deal={selectedDeal ? {
          ...selectedDeal,
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
          industry: '',
          companySize: '',
          website: ''
        } : null}
        onClose={() => {
          setShowDealForm(false);
          setSelectedDeal(null);
        }}
        onSave={(dealData) => {
          console.log('Saving deal:', dealData);
          setShowDealForm(false);
          setSelectedDeal(null);
        }}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        title="Deal Filters"
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={() => {
          console.log('Applying filters:', filters);
          setShowFilterDrawer(false);
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stage-filter">Stage</Label>
            <Select value={filters.stage} onValueChange={(value) => setFilters({...filters, stage: value})}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner-filter">Deal Owner</Label>
            <Select value={filters.owner} onValueChange={(value) => setFilters({...filters, owner: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                <SelectItem value="David Brown">David Brown</SelectItem>
                <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Deal Value Range</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min value"
                type="number"
                value={filters.valueRange.min}
                onChange={(e) => setFilters({...filters, valueRange: {...filters.valueRange, min: e.target.value}})}
              />
              <Input
                placeholder="Max value"
                type="number"
                value={filters.valueRange.max}
                onChange={(e) => setFilters({...filters, valueRange: {...filters.valueRange, max: e.target.value}})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Probability Range (%)</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Min %"
                type="number"
                min="0"
                max="100"
                value={filters.probabilityRange.min}
                onChange={(e) => setFilters({...filters, probabilityRange: {...filters.probabilityRange, min: e.target.value}})}
              />
              <Input
                placeholder="Max %"
                type="number"
                min="0"
                max="100"
                value={filters.probabilityRange.max}
                onChange={(e) => setFilters({...filters, probabilityRange: {...filters.probabilityRange, max: e.target.value}})}
              />
            </div>
          </div>
        </div>
      </FilterDrawer>
    </div>
  );
};
