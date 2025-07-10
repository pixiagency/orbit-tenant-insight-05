import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, UserCheck, Users, Filter, Search, X, Building, UserX } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientDrawerForm } from '../../components/clients/ClientDrawerForm';
import { ClientTable } from '../../components/clients/ClientTable';
import { ClientAdvancedFilters } from '../../components/clients/ClientAdvancedFilters';
import { PageHeader } from '../../components/layout/PageHeader';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { Client, ClientFormData } from '../../types/superadmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data with expanded fields
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    companyName: 'TechCorp Inc.',
    contactName: 'John Smith',
    contactEmail: 'john@techcorp.com',
    contactPhone: '+1 (555) 123-4567',
    website: 'https://techcorp.com',
    address: '123 Tech Street, Silicon Valley, CA',
    packageId: '2',
    packageName: 'Professional Plan',
    status: 'active',
    usersCount: 8,
    usersLimit: 10,
    contactsCount: 2500,
    contactsLimit: 5000,
    storageUsed: 15.5,
    storageLimit: 50,
    callMinutesUsed: 3500,
    callMinutesLimit: 5000,
    lastActivity: '2024-01-15T14:30:00Z',
    registrationDate: '2023-06-15T10:00:00Z',
    subscriptionStart: '2023-06-15T10:00:00Z',
    subscriptionExpiry: '2024-06-15T10:00:00Z',
    subdomain: 'techcorp',
    loginUrl: 'https://techcorp.mycrm.com',
    notes: 'High-value client, excellent communication',
    source: 'Direct Sales',
    monthlyRevenue: 99,
    totalUsers: 8,
    createdAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    companyName: 'StartupXYZ',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@startupxyz.com',
    contactPhone: '+1 (555) 987-6543',
    packageId: '1',
    packageName: 'Starter Plan',
    status: 'trial',
    usersCount: 2,
    usersLimit: 3,
    contactsCount: 150,
    contactsLimit: 1000,
    storageUsed: 2.1,
    storageLimit: 10,
    callMinutesUsed: 750,
    callMinutesLimit: 1000,
    lastActivity: '2024-01-14T09:15:00Z',
    registrationDate: '2024-01-01T10:00:00Z',
    subscriptionStart: '2024-01-01T10:00:00Z',
    subscriptionExpiry: '2024-01-31T10:00:00Z',
    subdomain: 'startupxyz',
    loginUrl: 'https://startupxyz.mycrm.com',
    source: 'Website',
    monthlyRevenue: 29,
    totalUsers: 2,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '3',
    companyName: 'BigCorp Ltd',
    contactName: 'Michael Brown',
    contactEmail: 'michael@bigcorp.com',
    contactPhone: '+1 (555) 456-7890',
    website: 'https://bigcorp.com',
    packageId: '3',
    packageName: 'Enterprise Plan',
    status: 'active',
    usersCount: 45,
    usersLimit: 50,
    contactsCount: 18500,
    contactsLimit: 20000,
    storageUsed: 125.8,
    storageLimit: 200,
    callMinutesUsed: 18500,
    callMinutesLimit: 20000,
    lastActivity: '2024-01-15T16:45:00Z',
    registrationDate: '2023-03-10T10:00:00Z',
    subscriptionStart: '2023-03-10T10:00:00Z',
    subscriptionExpiry: '2024-03-10T10:00:00Z',
    subdomain: 'bigcorp',
    loginUrl: 'https://bigcorp.mycrm.com',
    notes: 'Enterprise client with custom requirements',
    source: 'Partner Channel',
    monthlyRevenue: 299,
    totalUsers: 45,
    createdAt: '2023-03-10T10:00:00Z',
  },
  {
    id: '4',
    companyName: 'ExpiredCorp',
    contactName: 'Jane Doe',
    contactEmail: 'jane@expiredcorp.com',
    contactPhone: '+1 (555) 111-2222',
    packageId: '2',
    packageName: 'Professional Plan',
    status: 'expired',
    usersCount: 5,
    usersLimit: 10,
    contactsCount: 1200,
    contactsLimit: 5000,
    storageUsed: 8.5,
    storageLimit: 50,
    callMinutesUsed: 2500,
    callMinutesLimit: 5000,
    lastActivity: '2023-12-20T10:30:00Z',
    registrationDate: '2022-12-01T10:00:00Z',
    subscriptionStart: '2022-12-01T10:00:00Z',
    subscriptionExpiry: '2023-12-01T10:00:00Z',
    subdomain: 'expiredcorp',
    loginUrl: 'https://expiredcorp.mycrm.com',
    notes: 'Subscription expired, needs renewal follow-up',
    source: 'Marketing Campaign',
    monthlyRevenue: 99,
    totalUsers: 5,
    createdAt: '2022-12-01T10:00:00Z',
  },
];

export const ClientsPage = () => {
  const navigate = useNavigate();
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    revenueRange: { min: '', max: '' },
    usersRange: { min: '', max: '' },
    contactsRange: { min: '', max: '' },
    storageRange: { min: '', max: '' },
    callMinutesRange: { min: '', max: '' },
    status: 'all',
    packageId: 'all',
    usage: 'all',
    activity: 'all',
    teamSize: 'all',
    subscription: 'all',
    callUsage: 'all',
    source: 'all'
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced filter logic
  const filteredClients = clients.filter(client => {
    // Basic filters
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPackage = packageFilter === 'all' || client.packageId === packageFilter;
    const matchesSource = sourceFilter === 'all' || client.source === sourceFilter;

    // Advanced filters
    const matchesAdvancedStatus = advancedFilters.status === 'all' || client.status === advancedFilters.status;
    const matchesAdvancedPackage = advancedFilters.packageId === 'all' || client.packageId === advancedFilters.packageId;
    const matchesAdvancedSource = advancedFilters.source === 'all' || client.source === advancedFilters.source;

    // Usage filter logic
    let matchesUsage = true;
    if (advancedFilters.usage && advancedFilters.usage !== 'all') {
      const usagePercent = (client.usersCount! / client.usersLimit!) * 100;
      switch (advancedFilters.usage) {
        case 'low':
          matchesUsage = usagePercent <= 25;
          break;
        case 'medium':
          matchesUsage = usagePercent > 25 && usagePercent <= 75;
          break;
        case 'high':
          matchesUsage = usagePercent > 75 && usagePercent <= 100;
          break;
        case 'over':
          matchesUsage = usagePercent > 100;
          break;
      }
    }

    // Activity filter logic
    let matchesActivity = true;
    if (advancedFilters.activity && advancedFilters.activity !== 'all') {
      const lastActivityDate = new Date(client.lastActivity);
      const now = new Date();
      const daysSinceActivity = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (advancedFilters.activity) {
        case 'recent':
          matchesActivity = daysSinceActivity <= 7;
          break;
        case 'week':
          matchesActivity = daysSinceActivity > 7 && daysSinceActivity <= 30;
          break;
        case 'month':
          matchesActivity = daysSinceActivity > 30 && daysSinceActivity <= 90;
          break;
        case 'inactive':
          matchesActivity = daysSinceActivity > 90;
          break;
      }
    }

    // Team size filter logic
    let matchesTeamSize = true;
    if (advancedFilters.teamSize && advancedFilters.teamSize !== 'all') {
      switch (advancedFilters.teamSize) {
        case 'small':
          matchesTeamSize = client.usersCount! <= 5;
          break;
        case 'medium':
          matchesTeamSize = client.usersCount! > 5 && client.usersCount! <= 20;
          break;
        case 'large':
          matchesTeamSize = client.usersCount! > 20;
          break;
      }
    }

    // Subscription filter logic
    let matchesSubscription = true;
    if (advancedFilters.subscription && advancedFilters.subscription !== 'all') {
      const expiryDate = new Date(client.subscriptionExpiry);
      const now = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (advancedFilters.subscription) {
        case 'active':
          matchesSubscription = daysUntilExpiry > 30;
          break;
        case 'expiring':
          matchesSubscription = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
          break;
        case 'expired':
          matchesSubscription = daysUntilExpiry <= 0;
          break;
      }
    }

    // Call usage filter logic
    let matchesCallUsage = true;
    if (advancedFilters.callUsage && advancedFilters.callUsage !== 'all') {
      const usagePercent = (client.callMinutesUsed! / client.callMinutesLimit!) * 100;
      switch (advancedFilters.callUsage) {
        case 'low':
          matchesCallUsage = usagePercent <= 25;
          break;
        case 'medium':
          matchesCallUsage = usagePercent > 25 && usagePercent <= 75;
          break;
        case 'high':
          matchesCallUsage = usagePercent > 75 && usagePercent <= 100;
          break;
        case 'over':
          matchesCallUsage = usagePercent > 100;
          break;
      }
    }

    // Date range filter
    const matchesDateRange = !advancedFilters.dateRange.from && !advancedFilters.dateRange.to || 
      (advancedFilters.dateRange.from && client.createdAt >= advancedFilters.dateRange.from.toISOString()) &&
      (advancedFilters.dateRange.to && client.createdAt <= advancedFilters.dateRange.to.toISOString());

    // Revenue range filter
    const matchesRevenueRange = (!advancedFilters.revenueRange.min || client.monthlyRevenue >= parseFloat(advancedFilters.revenueRange.min)) &&
      (!advancedFilters.revenueRange.max || client.monthlyRevenue <= parseFloat(advancedFilters.revenueRange.max));

    // Users range filter
    const matchesUsersRange = (!advancedFilters.usersRange.min || client.usersCount! >= parseFloat(advancedFilters.usersRange.min)) &&
      (!advancedFilters.usersRange.max || client.usersCount! <= parseFloat(advancedFilters.usersRange.max));

    // Contacts range filter
    const matchesContactsRange = (!advancedFilters.contactsRange.min || client.contactsCount! >= parseFloat(advancedFilters.contactsRange.min)) &&
      (!advancedFilters.contactsRange.max || client.contactsCount! <= parseFloat(advancedFilters.contactsRange.max));

    // Storage range filter
    const matchesStorageRange = (!advancedFilters.storageRange.min || client.storageUsed! >= parseFloat(advancedFilters.storageRange.min)) &&
      (!advancedFilters.storageRange.max || client.storageUsed! <= parseFloat(advancedFilters.storageRange.max));

    // Call minutes range filter
    const matchesCallMinutesRange = (!advancedFilters.callMinutesRange.min || client.callMinutesUsed! >= parseFloat(advancedFilters.callMinutesRange.min)) &&
      (!advancedFilters.callMinutesRange.max || client.callMinutesUsed! <= parseFloat(advancedFilters.callMinutesRange.max));

    return matchesSearch && matchesStatus && matchesPackage && matchesSource &&
           matchesAdvancedStatus && matchesAdvancedPackage && matchesAdvancedSource &&
           matchesUsage && matchesActivity && matchesTeamSize && matchesSubscription && matchesCallUsage &&
           matchesDateRange && matchesRevenueRange && matchesUsersRange && matchesContactsRange && 
           matchesStorageRange && matchesCallMinutesRange;
  });

  // Calculate statistics
  const totalActiveClients = clients.filter(c => c.status === 'active').length;
  const totalTrialClients = clients.filter(c => c.status === 'trial').length;
  const totalSuspendedClients = clients.filter(c => c.status === 'suspended').length;
  const totalExpiredClients = clients.filter(c => c.status === 'expired').length;
  const totalUsers = clients.reduce((sum, c) => sum + (c.usersCount || 0), 0);
  const totalRevenue = clients.reduce((sum, c) => sum + (c.monthlyRevenue || 0), 0);
  const avgUsersPerClient = clients.length > 0 ? (totalUsers / clients.length).toFixed(1) : '0';

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all',
    packageFilter !== 'all',
    sourceFilter !== 'all',
    advancedFilters.dateRange.from || advancedFilters.dateRange.to,
    advancedFilters.revenueRange.min || advancedFilters.revenueRange.max,
    advancedFilters.usersRange.min || advancedFilters.usersRange.max,
    advancedFilters.contactsRange.min || advancedFilters.contactsRange.max,
    advancedFilters.storageRange.min || advancedFilters.storageRange.max,
    advancedFilters.callMinutesRange.min || advancedFilters.callMinutesRange.max,
    advancedFilters.status !== 'all',
    advancedFilters.packageId !== 'all',
    advancedFilters.usage !== 'all',
    advancedFilters.activity !== 'all',
    advancedFilters.teamSize !== 'all',
    advancedFilters.subscription !== 'all',
    advancedFilters.callUsage !== 'all',
    advancedFilters.source !== 'all'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPackageFilter('all');
    setSourceFilter('all');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      revenueRange: { min: '', max: '' },
      usersRange: { min: '', max: '' },
      contactsRange: { min: '', max: '' },
      storageRange: { min: '', max: '' },
      callMinutesRange: { min: '', max: '' },
      status: 'all',
      packageId: 'all',
      usage: 'all',
      activity: 'all',
      teamSize: 'all',
      subscription: 'all',
      callUsage: 'all',
      source: 'all'
    });
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsDrawerOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsDrawerOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    console.log('Delete client:', id);
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log('Bulk action:', action, 'for clients:', selectedIds);
  };

  const handleSaveClient = async (data: ClientFormData) => {
    setIsLoading(true);
    try {
      console.log('Save client:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="Client Management"
        description="Manage your CRM clients, monitor usage, and handle subscriptions"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Clients' },
        ]}
        badge={`${filteredClients.length} clients`}
        showAddButton={true}
        addButtonText="Add Client"
        onAddClick={handleAddClient}
        showExportButton={true}
        onExportClick={() => console.log('Export clients')}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Active Clients"
          value={totalActiveClients.toLocaleString()}
          icon={Building}
          gradient="from-green-500 to-green-600"
          change={{
            value: "+8.2% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Trial Clients"
          value={totalTrialClients.toLocaleString()}
          icon={TrendingUp}
          gradient="from-blue-500 to-blue-600"
          change={{
            value: "+12.5% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
          change={{
            value: `${avgUsersPerClient} avg per client`,
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-orange-500 to-orange-600"
          change={{
            value: "+15.3% from last month",
            trend: "up"
          }}
        />
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Client Filters
            </CardTitle>
            <CardDescription>
              Filter clients by various criteria
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
                <Badge variant="secondary" className="ml-2">
                  {filteredClients.length}
                </Badge>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Package */}
              <div className="space-y-2">
                <Label htmlFor="package">Package</Label>
                <Select value={packageFilter} onValueChange={setPackageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Packages</SelectItem>
                    <SelectItem value="1">Starter Plan</SelectItem>
                    <SelectItem value="2">Professional Plan</SelectItem>
                    <SelectItem value="3">Enterprise Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source */}
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Direct Sales">Direct Sales</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Partner Channel">Partner Channel</SelectItem>
                    <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <ClientAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />

      <ClientTable
        clients={filteredClients}
        selectedClients={selectedClients}
        onSelectionChange={setSelectedClients}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        onBulkAction={handleBulkAction}
      />

      <ClientDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveClient}
        client={editingClient}
        isLoading={isLoading}
      />
    </div>
  );
};
