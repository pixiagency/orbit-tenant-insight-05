import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Filter, 
  Search, 
  Briefcase,
  TrendingUp,
  DollarSign,
  Star,
  Grid3X3,
  List,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Download,
  Upload,
  UserPlus,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OpportunityForm } from '../../components/opportunities/OpportunityForm';
import { OpportunityTable } from '../../components/opportunities/OpportunityTable';
import { OpportunityKanbanView } from '../../components/opportunities/OpportunityKanbanView';
import { OpportunityFilters } from '../../components/opportunities/OpportunityFilters';
import { OpportunityAdvancedFilters } from '../../components/opportunities/OpportunityAdvancedFilters';
import { OpportunityDetailsModal } from '../../components/opportunities/OpportunityDetailsModal';
import { OpportunityImportModal } from '../../components/opportunities/OpportunityImportModal';
import { OpportunityExportModal } from '../../components/opportunities/OpportunityExportModal';
import { FilterDrawer } from '../../components/shared/FilterDrawer';
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
  },
  {
    id: '5',
    name: 'Retail Analytics Platform',
    company: 'Retail Solutions',
    contact: 'Michael Johnson',
    email: 'mjohnson@retail.com',
    phone: '+1 (555) 654-3210',
    stage: 'prospecting',
    value: 45000,
    probability: 25,
    expectedCloseDate: '2024-04-15',
    assignedTo: 'Sarah Johnson',
    source: 'Cold Call',
    description: 'Analytics platform for retail chain',
    notes: 'Initial contact made, follow-up scheduled.',
    pipeline: 'sales',
    city: 'Los Angeles',
    createdAt: '2024-01-10T11:30:00Z',
    lastActivity: '2024-01-14'
  },
  // Marketing Pipeline Opportunities
  {
    id: '11',
    name: 'Digital Marketing Campaign',
    company: 'Marketing Agency Pro',
    contact: 'Jennifer Martinez',
    email: 'jennifer@marketingpro.com',
    phone: '+1 (555) 111-2222',
    stage: 'mql',
    value: 35000,
    probability: 40,
    expectedCloseDate: '2024-03-15',
    assignedTo: 'Marketing Team',
    source: 'Content Marketing',
    description: 'Lead generation and nurturing campaign',
    notes: 'High engagement on content.',
    pipeline: 'marketing',
    city: 'Austin',
    createdAt: '2024-01-12T09:00:00Z',
    lastActivity: '2024-01-16'
  },
  {
    id: '12',
    name: 'Social Media Strategy',
    company: 'Brand Builders Inc',
    contact: 'Mark Rodriguez',
    email: 'mark@brandbuilders.com',
    phone: '+1 (555) 333-4444',
    stage: 'nurturing',
    value: 28000,
    probability: 30,
    expectedCloseDate: '2024-04-01',
    assignedTo: 'Marketing Team',
    source: 'Social Media',
    description: 'Comprehensive social media strategy development',
    notes: 'Multiple touchpoints established.',
    pipeline: 'marketing',
    city: 'Miami',
    createdAt: '2024-01-08T14:30:00Z',
    lastActivity: '2024-01-15'
  },
  {
    id: '13',
    name: 'Email Automation Setup',
    company: 'Tech Innovators',
    contact: 'Amanda Chen',
    email: 'amanda@techinnovators.com',
    phone: '+1 (555) 555-6666',
    stage: 'sql',
    value: 42000,
    probability: 65,
    expectedCloseDate: '2024-02-20',
    assignedTo: 'Marketing Team',
    source: 'Email Campaign',
    description: 'Advanced email marketing automation',
    notes: 'Budget confirmed, timeline discussed.',
    pipeline: 'marketing',
    city: 'Portland',
    createdAt: '2024-01-10T10:15:00Z',
    lastActivity: '2024-01-17'
  },
  {
    id: '14',
    name: 'Content Strategy Overhaul',
    company: 'Creative Solutions',
    contact: 'Brian Thompson',
    email: 'brian@creativesolutions.com',
    phone: '+1 (555) 777-8888',
    stage: 'opportunity',
    value: 55000,
    probability: 75,
    expectedCloseDate: '2024-03-01',
    assignedTo: 'Marketing Team',
    source: 'Webinar',
    description: 'Complete content strategy and creation',
    notes: 'Proposal in final review.',
    pipeline: 'marketing',
    city: 'Denver',
    createdAt: '2024-01-14T13:45:00Z',
    lastActivity: '2024-01-18'
  },
  {
    id: '15',
    name: 'Marketing Analytics Dashboard',
    company: 'Data Insights Co',
    contact: 'Lisa Wang',
    email: 'lisa@datainsights.com',
    phone: '+1 (555) 999-0000',
    stage: 'customer',
    value: 38000,
    probability: 100,
    expectedCloseDate: '2024-01-25',
    assignedTo: 'Marketing Team',
    source: 'Referral',
    description: 'Custom marketing analytics solution',
    notes: 'Contract signed, project started.',
    pipeline: 'marketing',
    city: 'Phoenix',
    createdAt: '2024-01-05T16:20:00Z',
    lastActivity: '2024-01-16'
  },
  // Customer Success Pipeline Opportunities
  {
    id: '16',
    name: 'Enterprise Onboarding',
    company: 'Global Enterprise Corp',
    contact: 'David Miller',
    email: 'david@globalenterprise.com',
    phone: '+1 (555) 222-3333',
    stage: 'onboarding',
    value: 120000,
    probability: 95,
    expectedCloseDate: '2024-02-10',
    assignedTo: 'Customer Success',
    source: 'Existing Customer',
    description: 'Full enterprise platform onboarding',
    notes: 'Kickoff meeting scheduled.',
    pipeline: 'customer-success',
    city: 'Atlanta',
    createdAt: '2024-01-11T11:00:00Z',
    lastActivity: '2024-01-17'
  },
  {
    id: '17',
    name: 'Platform Expansion',
    company: 'Growing Business Ltd',
    contact: 'Rachel Green',
    email: 'rachel@growingbusiness.com',
    phone: '+1 (555) 444-5555',
    stage: 'expansion',
    value: 85000,
    probability: 80,
    expectedCloseDate: '2024-03-20',
    assignedTo: 'Customer Success',
    source: 'Existing Customer',
    description: 'Platform expansion to new departments',
    notes: 'Expansion plan approved.',
    pipeline: 'customer-success',
    city: 'Tampa',
    createdAt: '2024-01-09T12:30:00Z',
    lastActivity: '2024-01-16'
  },
  {
    id: '18',
    name: 'Annual Renewal',
    company: 'Loyal Customer Inc',
    contact: 'Tom Wilson',
    email: 'tom@loyalcustomer.com',
    phone: '+1 (555) 666-7777',
    stage: 'renewal',
    value: 95000,
    probability: 90,
    expectedCloseDate: '2024-04-30',
    assignedTo: 'Customer Success',
    source: 'Existing Customer',
    description: 'Annual subscription renewal',
    notes: 'Renewal discussion started.',
    pipeline: 'customer-success',
    city: 'Nashville',
    createdAt: '2024-01-13T14:00:00Z',
    lastActivity: '2024-01-18'
  },
  {
    id: '19',
    name: 'Churn Prevention',
    company: 'Struggling Client Co',
    contact: 'Sarah Davis',
    email: 'sarah@strugglingclient.com',
    phone: '+1 (555) 888-9999',
    stage: 'churn-risk',
    value: 45000,
    probability: 25,
    expectedCloseDate: '2024-02-28',
    assignedTo: 'Customer Success',
    source: 'Existing Customer',
    description: 'Retention and value demonstration',
    notes: 'Intervention plan activated.',
    pipeline: 'customer-success',
    city: 'Salt Lake City',
    createdAt: '2024-01-07T15:45:00Z',
    lastActivity: '2024-01-15'
  },
  {
    id: '20',
    name: 'Win-back Campaign',
    company: 'Former Customer LLC',
    contact: 'Kevin Brown',
    email: 'kevin@formercustomer.com',
    phone: '+1 (555) 000-1111',
    stage: 'churned',
    value: 0,
    probability: 10,
    expectedCloseDate: '2024-05-15',
    assignedTo: 'Customer Success',
    source: 'Former Customer',
    description: 'Win-back campaign for churned client',
    notes: 'Initial outreach completed.',
    pipeline: 'customer-success',
    city: 'Las Vegas',
    createdAt: '2024-01-06T10:30:00Z',
    lastActivity: '2024-01-14'
  },
  {
    id: '6',
    name: 'Healthcare Management System',
    company: 'HealthTech Solutions',
    contact: 'Dr. Sarah Williams',
    email: 'sarah.williams@healthtech.com',
    phone: '+1 (555) 789-0123',
    stage: 'qualification',
    value: 180000,
    probability: 55,
    expectedCloseDate: '2024-03-05',
    assignedTo: 'Mike Chen',
    source: 'Website',
    description: 'Complete healthcare management system',
    notes: 'Compliance requirements discussion scheduled.',
    pipeline: 'sales',
    city: 'Seattle',
    createdAt: '2024-01-05T08:15:00Z',
    lastActivity: '2024-01-15'
  },
  {
    id: '7',
    name: 'E-commerce Platform Upgrade',
    company: 'Online Retail Inc',
    contact: 'James Thompson',
    email: 'james.t@onlineretail.com',
    phone: '+1 (555) 345-6789',
    stage: 'proposal',
    value: 65000,
    probability: 70,
    expectedCloseDate: '2024-02-20',
    assignedTo: 'Emily Rodriguez',
    source: 'Referral',
    description: 'E-commerce platform modernization',
    notes: 'Technical proposal submitted, waiting for feedback.',
    pipeline: 'sales',
    city: 'Miami',
    createdAt: '2024-01-12T13:45:00Z',
    lastActivity: '2024-01-17'
  },
  {
    id: '8',
    name: 'Digital Marketing Platform',
    company: 'Marketing Agency Pro',
    contact: 'Jennifer Wilson',
    email: 'j.wilson@marketingpro.com',
    phone: '+1 (555) 234-5678',
    stage: 'prospecting',
    value: 85000,
    probability: 30,
    expectedCloseDate: '2024-04-10',
    assignedTo: 'Sarah Johnson',
    source: 'Google Ads',
    description: 'Marketing automation and analytics platform',
    notes: 'Initial discovery call completed.',
    pipeline: 'marketing',
    city: 'Austin',
    createdAt: '2024-01-15T10:20:00Z',
    lastActivity: '2024-01-20'
  },
  {
    id: '9',
    name: 'Enterprise Security Solution',
    company: 'SecureTech Corp',
    contact: 'David Kim',
    email: 'd.kim@securetech.com',
    phone: '+1 (555) 876-5432',
    stage: 'qualification',
    value: 250000,
    probability: 60,
    expectedCloseDate: '2024-03-15',
    assignedTo: 'Mike Chen',
    source: 'Referral',
    description: 'Comprehensive enterprise security platform',
    notes: 'Security assessment in progress.',
    pipeline: 'enterprise',
    city: 'Denver',
    createdAt: '2024-01-20T14:30:00Z',
    lastActivity: '2024-01-25'
  },
  {
    id: '10',
    name: 'Customer Support Platform',
    company: 'Support Solutions Inc',
    contact: 'Rachel Green',
    email: 'r.green@supportsolutions.com',
    phone: '+1 (555) 345-6789',
    stage: 'proposal',
    value: 120000,
    probability: 75,
    expectedCloseDate: '2024-02-28',
    assignedTo: 'Emily Rodriguez',
    source: 'Website',
    description: 'Advanced customer support and ticketing system',
    notes: 'Proposal submitted and under review.',
    pipeline: 'support',
    city: 'Phoenix',
    createdAt: '2024-01-18T09:15:00Z',
    lastActivity: '2024-01-22'
  },
  {
    id: '11',
    name: 'Supply Chain Optimization',
    company: 'Logistics Masters',
    contact: 'Alex Johnson',
    email: 'a.johnson@logisticsmasters.com',
    phone: '+1 (555) 987-1234',
    stage: 'negotiation',
    value: 180000,
    probability: 85,
    expectedCloseDate: '2024-02-15',
    assignedTo: 'David Brown',
    source: 'Trade Show',
    description: 'Supply chain management and optimization tools',
    notes: 'Contract negotiations in final stages.',
    pipeline: 'sales',
    city: 'Chicago',
    createdAt: '2024-01-10T11:45:00Z',
    lastActivity: '2024-01-24'
  },
  {
    id: '12',
    name: 'Data Analytics Dashboard',
    company: 'Analytics Pro',
    contact: 'Maria Rodriguez',
    email: 'm.rodriguez@analyticspro.com',
    phone: '+1 (555) 567-8901',
    stage: 'closed-won',
    value: 95000,
    probability: 100,
    expectedCloseDate: '2024-01-30',
    assignedTo: 'Sarah Johnson',
    source: 'LinkedIn',
    description: 'Business intelligence and data visualization platform',
    notes: 'Successfully closed and implementation started.',
    pipeline: 'marketing',
    city: 'San Diego',
    createdAt: '2024-01-05T16:20:00Z',
    lastActivity: '2024-01-30'
  }
];

export const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(opportunitiesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPipeline, setSelectedPipeline] = useState('sales');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [selectedOpportunityForDetails, setSelectedOpportunityForDetails] = useState<Opportunity | null>(null);
  const [showOpportunityDetails, setShowOpportunityDetails] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    valueRange: { min: '', max: '' },
    probabilityRange: { min: '', max: '' },
    assignedTo: 'all',
    source: 'all',
    stage: 'all',
    operator: 'AND' as 'AND' | 'OR',
    textCondition: 'contains' as 'contains' | 'equals' | 'not_contains' | 'not_equals',
    filterRules: [] as any[]
  });
  const [appliedFilters, setAppliedFilters] = useState<Array<{id: string, label: string, type: string, ruleId?: string}>>([]);
  const [filters, setFilters] = useState({
    stage: 'all',
    assignedTo: 'all',
    source: 'all',
    dateRange: 'all',
    valueRange: 'all',
    probability: 'all'
  });

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || opportunity.stage === stageFilter;
    const matchesSource = sourceFilter === 'all' || opportunity.source === sourceFilter;
    const matchesAssignee = assigneeFilter === 'all' || opportunity.assignedTo === assigneeFilter;
    const matchesPipeline = selectedPipeline === 'all' || opportunity.pipeline === selectedPipeline;

    return matchesSearch && matchesStage && matchesSource && matchesAssignee && matchesPipeline;
  });

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
      setSelectedOpportunities(filteredOpportunities.map(opp => opp.id));
    } else {
      setSelectedOpportunities([]);
    }
  };

  const handleBulkDelete = () => {
    setOpportunities(prev => prev.filter(opp => !selectedOpportunities.includes(opp.id)));
    setSelectedOpportunities([]);
    setShowBulkDeleteDialog(false);
    toast.success(`${selectedOpportunities.length} opportunities deleted successfully`);
  };

  const handleImportOpportunities = (importedOpportunities: Opportunity[]) => {
    setOpportunities(prev => [...prev, ...importedOpportunities]);
    setShowImportModal(false);
  };

  const handleStageChange = (opportunityId: string, newStage: string) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, stage: newStage }
        : opp
    ));
  };

  const handleCardClick = (opportunity: Opportunity) => {
    setSelectedOpportunityForDetails(opportunity);
    setShowOpportunityDetails(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStageFilter('all');
    setSourceFilter('all');
    setAssigneeFilter('all');
    setSelectedPipeline('all');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      valueRange: { min: '', max: '' },
      probabilityRange: { min: '', max: '' },
      assignedTo: 'all',
      source: 'all',
      stage: 'all',
      operator: 'AND' as 'AND' | 'OR',
      textCondition: 'contains' as 'contains' | 'equals' | 'not_contains' | 'not_equals',
      filterRules: []
    });
    setAppliedFilters([]);
    setFilters({
      stage: 'all',
      assignedTo: 'all',
      source: 'all',
      dateRange: 'all',
      valueRange: 'all',
      probability: 'all'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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
          change={{ value: "+12 this month", trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Pipeline Value"
          value={`$${(opportunityStats.totalValue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change={{ value: "Strong pipeline", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Avg. Probability"
          value={`${opportunityStats.averageProbability}%`}
          icon={TrendingUp}
          change={{ value: "Good prospects", trend: "up" }}
          gradient="from-yellow-500 to-yellow-600"
        />
        <ModernKPICard
          title="Won This Month"
          value={opportunityStats.wonThisMonth.toString()}
          icon={Star}
          change={{ value: "Great results!", trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Opportunity Filters</CardTitle>
              <CardDescription>Filter and search your opportunities</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Pipeline" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectItem value="all">All Pipelines</SelectItem>
                  <SelectItem value="sales">Sales Pipeline</SelectItem>
                  <SelectItem value="marketing">Marketing Pipeline</SelectItem>
                  <SelectItem value="support">Support Pipeline</SelectItem>
                  <SelectItem value="enterprise">Enterprise Pipeline</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
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
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Trade Show">Trade Show</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                <SelectItem value="David Brown">David Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applied Filters Tags */}
      {appliedFilters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Applied Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map((filter) => (
                <Badge key={filter.id} variant="secondary" className="px-3 py-1">
                  {filter.label}
                  <button
                    onClick={() => {/* Remove filter logic */}}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters Drawer */}
      <FilterDrawer
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        title="Advanced Opportunity Filters"
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onApplyFilters={() => {
          console.log('Applying advanced filters:', advancedFilters);
          setAppliedFilters([
            { id: 'test', label: 'Advanced filters applied', type: 'advanced' }
          ]);
          setShowAdvancedFilters(false);
        }}
      >
        <OpportunityAdvancedFilters
          isOpen={true}
          onClose={() => {}}
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
          onApplyFilters={() => {}}
          onClearFilters={() => {}}
        />
      </FilterDrawer>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div></div>
            <div className="flex items-center space-x-2">
              {/* Bulk Actions */}
              {selectedOpportunities.length > 0 && (
                <div className="flex items-center space-x-2 mr-4">
                  <Badge variant="secondary">{selectedOpportunities.length} selected</Badge>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowBulkDeleteDialog(true)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}

              {/* View Toggle */}
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}
              >
                {viewMode === 'table' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <OpportunityTable
              opportunities={filteredOpportunities.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
              selectedOpportunities={selectedOpportunities}
              onSelectOpportunity={handleSelectOpportunity}
              onSelectAll={handleSelectAll}
              onEdit={handleEditOpportunity}
              onDelete={handleDeleteOpportunity}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredOpportunities.length / pageSize)}
              pageSize={pageSize}
              totalItems={filteredOpportunities.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            />
          ) : (
            <OpportunityKanbanView
              opportunities={filteredOpportunities}
              onStageChange={handleStageChange}
              onCardClick={handleCardClick}
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
      <OpportunityForm
        isOpen={showOpportunityForm}
        opportunity={selectedOpportunity}
        onClose={() => {
          setShowOpportunityForm(false);
          setSelectedOpportunity(null);
        }}
        onSave={handleSaveOpportunity}
      />

      {/* Opportunity Details Modal */}
      <OpportunityDetailsModal
        isOpen={showOpportunityDetails}
        onClose={() => {
          setShowOpportunityDetails(false);
          setSelectedOpportunityForDetails(null);
        }}
        opportunity={selectedOpportunityForDetails}
      />

      {/* Import Modal */}
      <OpportunityImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportOpportunities}
      />

      {/* Export Modal */}
      <OpportunityExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        opportunities={filteredOpportunities}
        selectedOpportunities={selectedOpportunities}
      />

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunities</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOpportunities.length} selected opportunity(ies)? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
