import React, { useState, useRef } from 'react';
import { DollarSign, CreditCard, Users, TrendingUp, Filter, Search, X } from 'lucide-react';
import { Subscription, SubscriptionFormData } from '../../types/superadmin';
import { PageHeader } from '../../components/layout/PageHeader';
import { SubscriptionTable, SubscriptionTableHandles } from '../../components/subscriptions/SubscriptionTable';
import { SubscriptionDrawerForm } from '../../components/subscriptions/SubscriptionDrawerForm';
import { SubscriptionDetailsModal } from '../../components/subscriptions/SubscriptionDetailsModal';
import { SubscriptionRenewModal } from '../../components/subscriptions/SubscriptionRenewModal';
import { SubscriptionCancelDialog } from '../../components/subscriptions/SubscriptionCancelDialog';
import { SubscriptionBulkActionsDialog } from '../../components/subscriptions/SubscriptionBulkActionsDialog';
import { SubscriptionAdvancedFilters } from '../../components/subscriptions/SubscriptionAdvancedFilters';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Enhanced mock data with all required fields
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'TechCorp Inc.',
    packageId: '2',
    packageName: 'Professional Plan',
    activationMethod: 'stripe',
    source: 'Direct Sale',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-01T00:00:00Z',
    autoRenew: true,
    amount: 99,
    currency: 'USD',
    paymentStatus: 'paid',
    lastUpdated: '2024-01-15T10:30:00Z',
    nextBilling: '2024-02-01T00:00:00Z',
    createdAt: '2023-12-15T00:00:00Z',
    notes: 'Enterprise client with custom requirements',
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'StartupXYZ',
    packageId: '1',
    packageName: 'Starter Plan',
    activationMethod: 'activation-code',
    source: 'Partner Referral',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-07-01T00:00:00Z',
    autoRenew: false,
    amount: 29,
    currency: 'USD',
    paymentStatus: 'paid',
    lastUpdated: '2024-01-10T14:20:00Z',
    nextBilling: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'GlobalTech Solutions',
    packageId: '3',
    packageName: 'Enterprise Plan',
    activationMethod: 'manual',
    source: 'Direct Sale',
    status: 'expired',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2024-01-01T00:00:00Z',
    autoRenew: true,
    amount: 2990,
    currency: 'USD',
    paymentStatus: 'unpaid',
    lastUpdated: '2024-01-05T09:15:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    notes: 'Renewal pending - contact required',
  },
  {
    id: '4',
    clientId: '4',
    clientName: 'InnovateNow Corp',
    packageId: '2',
    packageName: 'Professional Plan',
    activationMethod: 'stripe',
    source: 'Website',
    status: 'suspended',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-06-15T00:00:00Z',
    autoRenew: true,
    amount: 99,
    currency: 'USD',
    paymentStatus: 'unpaid',
    lastUpdated: '2024-01-20T16:45:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    isReadOnly: true,
    externalBillingUrl: 'https://billing.stripe.com/session/123',
  },
  {
    id: '5',
    clientId: '5',
    clientName: 'Future Systems Ltd',
    packageId: '1',
    packageName: 'Starter Plan',
    activationMethod: 'api',
    source: 'API Integration',
    status: 'active',
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2025-01-10T00:00:00Z',
    autoRenew: true,
    amount: 290,
    currency: 'USD',
    paymentStatus: 'paid',
    lastUpdated: '2024-01-12T11:30:00Z',
    createdAt: '2024-01-10T00:00:00Z',
  },
];

export const SubscriptionsPage = () => {
  const tableRef = useRef<SubscriptionTableHandles>(null);
  const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [activationMethodFilter, setActivationMethodFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    amountRange: { min: '', max: '' },
    status: 'all',
    packageId: 'all',
    activationMethod: 'all',
    paymentStatus: 'all',
    autoRenew: 'all',
    source: 'all'
  });
  
  // Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [viewingSubscription, setViewingSubscription] = useState<Subscription | null>(null);
  const [renewingSubscription, setRenewingSubscription] = useState<Subscription | null>(null);
  const [cancelingSubscription, setCancelingSubscription] = useState<Subscription | null>(null);
  
  // Bulk actions
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'cancel' | 'renew' | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    tableRef.current?.openExportModal(true);
  };

  // Enhanced filtering logic
  const filteredSubscriptions = subscriptions.filter(subscription => {
    // Basic filters
    const matchesSearch = !searchTerm || 
      subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.activationMethod.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    const matchesPackage = packageFilter === 'all' || subscription.packageId.toString() === packageFilter;
    const matchesActivationMethod = activationMethodFilter === 'all' || subscription.activationMethod === activationMethodFilter;

    // Advanced filters
    const matchesAdvancedStatus = advancedFilters.status === 'all' || subscription.status === advancedFilters.status;
    const matchesAdvancedPackage = advancedFilters.packageId === 'all' || subscription.packageId.toString() === advancedFilters.packageId;
    const matchesAdvancedActivationMethod = advancedFilters.activationMethod === 'all' || subscription.activationMethod === advancedFilters.activationMethod;
    const matchesPaymentStatus = advancedFilters.paymentStatus === 'all' || subscription.paymentStatus === advancedFilters.paymentStatus;
    const matchesAutoRenew = advancedFilters.autoRenew === 'all' || 
      (advancedFilters.autoRenew === 'yes' && subscription.autoRenew) ||
      (advancedFilters.autoRenew === 'no' && !subscription.autoRenew);
    const matchesSource = advancedFilters.source === 'all' || subscription.source === advancedFilters.source;

    // Date range filter
    const matchesDateRange = !advancedFilters.dateRange.from && !advancedFilters.dateRange.to || 
      (advancedFilters.dateRange.from && subscription.startDate >= advancedFilters.dateRange.from.toISOString()) &&
      (advancedFilters.dateRange.to && subscription.startDate <= advancedFilters.dateRange.to.toISOString());

    // Amount range filter
    const matchesAmountRange = (!advancedFilters.amountRange.min || subscription.amount >= parseFloat(advancedFilters.amountRange.min)) &&
      (!advancedFilters.amountRange.max || subscription.amount <= parseFloat(advancedFilters.amountRange.max));

    return matchesSearch && matchesStatus && matchesPackage && matchesActivationMethod &&
           matchesAdvancedStatus && matchesAdvancedPackage && matchesAdvancedActivationMethod &&
           matchesPaymentStatus && matchesAutoRenew && matchesSource && matchesDateRange && matchesAmountRange;
  });

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all',
    packageFilter !== 'all',
    activationMethodFilter !== 'all',
    showAdvancedFilters && (
      advancedFilters.status !== 'all' ||
      advancedFilters.packageId !== 'all' ||
      advancedFilters.activationMethod !== 'all' ||
      advancedFilters.paymentStatus !== 'all' ||
      advancedFilters.autoRenew !== 'all' ||
      advancedFilters.source !== 'all' ||
      advancedFilters.dateRange.from ||
      advancedFilters.dateRange.to ||
      advancedFilters.amountRange.min ||
      advancedFilters.amountRange.max
    )
  ].filter(Boolean).length;

  const handleClearAll = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPackageFilter('all');
    setActivationMethodFilter('all');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      amountRange: { min: '', max: '' },
      status: 'all',
      packageId: 'all',
      activationMethod: 'all',
      paymentStatus: 'all',
      autoRenew: 'all',
      source: 'all'
    });
    setShowAdvancedFilters(false);
  };

  const handleAddSubscription = () => {
    setEditingSubscription(null);
    setIsDrawerOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsDrawerOpen(true);
  };

  const handleViewSubscription = (subscription: Subscription) => {
    setViewingSubscription(subscription);
  };

  const handleRenewSubscription = (subscription: Subscription) => {
    setRenewingSubscription(subscription);
  };

  const handleCancelSubscription = (id: string) => {
    const subscription = subscriptions.find(s => s.id === id);
    if (subscription) {
      setCancelingSubscription(subscription);
    }
  };

  const handleBulkAction = (action: 'cancel' | 'renew', selectedIds: string[]) => {
    setSelectedSubscriptions(selectedIds);
    setBulkAction(action);
  };

  const handleSaveSubscription = async (data: SubscriptionFormData) => {
    setIsLoading(true);
    try {
      console.log('Save subscription:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsDrawerOpen(false);
      setEditingSubscription(null);
    } catch (error) {
      console.error('Error saving subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewConfirm = async (renewalData: any) => {
    setIsLoading(true);
    try {
      console.log('Renew subscription:', renewalData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRenewingSubscription(null);
    } catch (error) {
      console.error('Error renewing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirm = async (cancelData: any) => {
    setIsLoading(true);
    try {
      console.log('Cancel subscription:', cancelData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCancelingSubscription(null);
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkActionConfirm = async (action: string, actionData: any) => {
    setIsLoading(true);
    try {
      // Handle bulk actions
      if (action === 'cancel') {
        // Handle bulk cancel
        console.log('Bulk cancel:', selectedSubscriptions, actionData);
      } else if (action === 'renew') {
        // Handle bulk renew
        console.log('Bulk renew:', selectedSubscriptions, actionData);
      }
      
      setSelectedSubscriptions([]);
      setBulkAction(null);
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate subscription statistics
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const autoRenewCount = subscriptions.filter(s => s.autoRenew).length;
  const renewalRate = totalSubscriptions > 0 ? (autoRenewCount / totalSubscriptions * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="Subscription Management"
        description="Manage client subscriptions, billing cycles, and renewals across all accounts"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Subscriptions' },
        ]}
        badge={`${filteredSubscriptions.length} subscriptions`}
        showAddButton={true}
        addButtonText="Add Subscription"
        onAddClick={handleAddSubscription}
        showExportButton={true}
        onExportClick={handleExport}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Subscriptions"
          value={totalSubscriptions.toLocaleString()}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
          change={{
            value: "+12.5% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Active Subscriptions"
          value={activeSubscriptions.toLocaleString()}
          icon={CreditCard}
          gradient="from-green-500 to-green-600"
          change={{
            value: "+8.2% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-purple-500 to-purple-600"
          change={{
            value: "+15.3% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Renewal Rate"
          value={`${renewalRate}%`}
          icon={TrendingUp}
          gradient="from-orange-500 to-orange-600"
          change={{
            value: "+2.1% from last month",
            trend: "up"
          }}
        />
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Subscription Filters
            </CardTitle>
            <CardDescription>
              Filter subscriptions by various criteria
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
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <X className="h-4 w-4 mr-2" />
                Clear All
                <Badge variant="secondary" className="ml-2">
                  {filteredSubscriptions.length}
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
                    placeholder="Search subscriptions..."
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
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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

              {/* Activation Method */}
              <div className="space-y-2">
                <Label htmlFor="activationMethod">Activation Method</Label>
                <Select value={activationMethodFilter} onValueChange={setActivationMethodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="activation-code">Activation Code</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <SubscriptionAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />

      <SubscriptionTable
        ref={tableRef}
        subscriptions={filteredSubscriptions}
        onEdit={handleEditSubscription}
        onCancel={handleCancelSubscription}
        onRenew={handleRenewSubscription}
        onView={handleViewSubscription}
        onBulkAction={handleBulkAction}
      />

      {/* Drawer Form */}
      <SubscriptionDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingSubscription(null);
        }}
        onSave={handleSaveSubscription}
        subscription={editingSubscription}
        isLoading={isLoading}
      />

      {/* Details Modal */}
      <SubscriptionDetailsModal
        subscription={viewingSubscription}
        isOpen={!!viewingSubscription}
        onClose={() => setViewingSubscription(null)}
        onEdit={() => viewingSubscription && handleEditSubscription(viewingSubscription)}
        onRenew={() => viewingSubscription && handleRenewSubscription(viewingSubscription)}
        onCancel={() => viewingSubscription && handleCancelSubscription(viewingSubscription.id)}
      />

      {/* Renew Modal */}
      <SubscriptionRenewModal
        subscription={renewingSubscription}
        isOpen={!!renewingSubscription}
        onClose={() => setRenewingSubscription(null)}
        onConfirm={handleRenewConfirm}
        isLoading={isLoading}
      />

      {/* Cancel Dialog */}
      <SubscriptionCancelDialog
        subscription={cancelingSubscription}
        isOpen={!!cancelingSubscription}
        onClose={() => setCancelingSubscription(null)}
        onConfirm={handleCancelConfirm}
        isLoading={isLoading}
      />

      {/* Bulk Actions Dialog */}
      <SubscriptionBulkActionsDialog
        action={bulkAction}
        subscriptions={subscriptions}
        selectedIds={selectedSubscriptions}
        isOpen={!!bulkAction}
        onClose={() => {
          setBulkAction(null);
          setSelectedSubscriptions([]);
        }}
        onConfirm={handleBulkActionConfirm}
        isLoading={isLoading}
      />
    </div>
  );
};
