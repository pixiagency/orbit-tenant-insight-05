import React, { useState } from 'react';
import { Package } from '../../types/packages';
import { PageHeader } from '../../components/layout/PageHeader';
import { PackageTable } from '../../components/packages/PackageTable';
import { PackageDrawerForm } from '../../components/packages/PackageDrawerForm';
import { ExportModal } from '../../components/packages/ExportModal';
import { DeletePackageModal } from '../../components/packages/DeletePackageModal';
import { PackageAdvancedFilters } from '../../components/packages/PackageAdvancedFilters';
import { exportPackages } from '../../utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Filter, 
  Search, 
  Download,
  Upload,
  Trash2,
  X,
  Package as PackageIcon,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';

// Mock data for demonstration
const MOCK_PACKAGES: Package[] = [
  {
    id: '1',
    name: 'Starter Plan',
    description: 'Perfect for small teams getting started with CRM',
    pricing: {
      amount: 29,
      currency: 'USD',
      duration: 1,
      durationUnit: 'months'
    },
    limits: {
      maxUsers: 3,
      maxLeads: 1000,
      maxStorageGB: 5,
      maxContacts: 2000,
      smsSendingLimit: 100,
      monthlyWhatsAppMessages: 200,
      monthlyEmailMessages: 1000,
      monthlyCallMinutes: 120,
      monthlyAiAutomations: 10,
      monthlySmartRecommendations: 50,
      monthlyAiAssistantQueries: 100
    },
    modules: ['contacts', 'leads', 'email'],
    aiOptions: {
      enabled: false,
      features: []
    },
    isPublic: true,
    status: 'active',
    usersCount: 45,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    refundPeriodDays: 30
  },
  {
    id: '2',
    name: 'Professional Plan',
    description: 'Advanced features for growing businesses',
    pricing: {
      amount: 99,
      currency: 'USD',
      duration: 1,
      durationUnit: 'months'
    },
    limits: {
      maxUsers: 10,
      maxLeads: 5000,
      maxStorageGB: 25,
      maxContacts: 10000,
      smsSendingLimit: 500,
      monthlyWhatsAppMessages: 1000,
      monthlyEmailMessages: 5000,
      monthlyCallMinutes: 600,
      monthlyAiAutomations: 50,
      monthlySmartRecommendations: 200,
      monthlyAiAssistantQueries: 500
    },
    modules: ['contacts', 'leads', 'deals', 'whatsapp', 'email', 'analytics'],
    aiOptions: {
      enabled: true,
      features: ['assistant', 'insights', 'scoring']
    },
    isPublic: true,
    status: 'active',
    usersCount: 128,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    createdBy: 'admin',
    refundPeriodDays: 14
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    description: 'Complete solution for large organizations',
    pricing: {
      amount: 299,
      currency: 'USD',
      duration: 1,
      durationUnit: 'years'
    },
    limits: {
      maxUsers: 50,
      maxLeads: 50000,
      maxStorageGB: 500,
      maxContacts: 100000,
      smsSendingLimit: 2000,
      monthlyWhatsAppMessages: 5000,
      monthlyEmailMessages: 25000,
      monthlyCallMinutes: 3000,
      monthlyAiAutomations: 200,
      monthlySmartRecommendations: 1000,
      monthlyAiAssistantQueries: 2000
    },
    modules: ['contacts', 'leads', 'deals', 'whatsapp', 'email', 'sms', 'analytics', 'reports'],
    aiOptions: {
      enabled: true,
      features: ['assistant', 'insights', 'automation', 'scoring', 'recommendations']
    },
    isPublic: true,
    status: 'active',
    usersCount: 67,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    createdBy: 'admin',
    refundPeriodDays: 7
  },
];

export const PackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>(MOCK_PACKAGES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [cloningPackage, setCloningPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; package: Package | null }>({
    isOpen: false,
    package: null
  });
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    priceRange: { min: '', max: '' },
    maxUsersRange: { min: '', max: '' },
    status: 'all',
    durationUnit: 'all',
    aiEnabled: 'all',
    isPublic: 'all',
    modules: 'all'
  });
  const { toast } = useToast();

  // Calculate statistics
  const totalPackages = packages.length;
  const activePackages = packages.filter(pkg => pkg.status === 'active').length;
  const totalUsers = packages.reduce((sum, pkg) => sum + pkg.usersCount, 0);
  const totalRevenue = packages.reduce((sum, pkg) => sum + (pkg.pricing.amount * pkg.usersCount), 0);
  const aiEnabledPackages = packages.filter(pkg => pkg.aiOptions?.enabled).length;
  const publicPackages = packages.filter(pkg => pkg.isPublic).length;

  // Filter packages based on current filters
  const filteredPackages = packages.filter(pkg => {
    // Basic filters
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    const matchesDuration = durationFilter === 'all' || pkg.pricing.durationUnit === durationFilter;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && pkg.pricing.amount === 0) ||
                        (priceFilter === 'low' && pkg.pricing.amount > 0 && pkg.pricing.amount < 50) ||
                        (priceFilter === 'medium' && pkg.pricing.amount >= 50 && pkg.pricing.amount <= 200) ||
                        (priceFilter === 'high' && pkg.pricing.amount > 200 && pkg.pricing.amount <= 500) ||
                        (priceFilter === 'premium' && pkg.pricing.amount > 500);

    // Advanced filters
    const matchesAdvancedStatus = advancedFilters.status === 'all' || pkg.status === advancedFilters.status;
    const matchesAdvancedDuration = advancedFilters.durationUnit === 'all' || pkg.pricing.durationUnit === advancedFilters.durationUnit;
    const matchesAdvancedAI = advancedFilters.aiEnabled === 'all' || 
                             (advancedFilters.aiEnabled === 'enabled' && pkg.aiOptions?.enabled) ||
                             (advancedFilters.aiEnabled === 'disabled' && !pkg.aiOptions?.enabled);
    const matchesAdvancedVisibility = advancedFilters.isPublic === 'all' || 
                                     (advancedFilters.isPublic === 'public' && pkg.isPublic) ||
                                     (advancedFilters.isPublic === 'private' && !pkg.isPublic);
    const matchesAdvancedModules = advancedFilters.modules === 'all' || pkg.modules.includes(advancedFilters.modules);

    // Date range filter
    const matchesDateRange = !advancedFilters.dateRange.from && !advancedFilters.dateRange.to || 
                            (advancedFilters.dateRange.from && new Date(pkg.createdAt) >= advancedFilters.dateRange.from) &&
                            (advancedFilters.dateRange.to && new Date(pkg.createdAt) <= advancedFilters.dateRange.to);

    // Price range filter
    const matchesPriceRange = (!advancedFilters.priceRange.min && !advancedFilters.priceRange.max) ||
                             (advancedFilters.priceRange.min && pkg.pricing.amount >= parseFloat(advancedFilters.priceRange.min)) &&
                             (advancedFilters.priceRange.max && pkg.pricing.amount <= parseFloat(advancedFilters.priceRange.max));

    // Max users range filter
    const matchesMaxUsersRange = (!advancedFilters.maxUsersRange.min && !advancedFilters.maxUsersRange.max) ||
                                (advancedFilters.maxUsersRange.min && pkg.limits.maxUsers >= parseInt(advancedFilters.maxUsersRange.min)) &&
                                (advancedFilters.maxUsersRange.max && pkg.limits.maxUsers <= parseInt(advancedFilters.maxUsersRange.max));

    return matchesSearch && matchesStatus && matchesDuration && matchesPrice &&
           matchesAdvancedStatus && matchesAdvancedDuration && matchesAdvancedAI && 
           matchesAdvancedVisibility && matchesAdvancedModules && matchesDateRange &&
           matchesPriceRange && matchesMaxUsersRange;
  });

  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Count basic filters
    if (searchTerm && searchTerm !== '') count++;
    if (statusFilter && statusFilter !== 'all') count++;
    if (durationFilter && durationFilter !== 'all') count++;
    if (priceFilter && priceFilter !== 'all') count++;
    
    // Count advanced filters
    if (advancedFilters.dateRange?.from || advancedFilters.dateRange?.to) count++;
    if (advancedFilters.priceRange?.min || advancedFilters.priceRange?.max) count++;
    if (advancedFilters.maxUsersRange?.min || advancedFilters.maxUsersRange?.max) count++;
    if (advancedFilters.status && advancedFilters.status !== 'all') count++;
    if (advancedFilters.durationUnit && advancedFilters.durationUnit !== 'all') count++;
    if (advancedFilters.aiEnabled && advancedFilters.aiEnabled !== 'all') count++;
    if (advancedFilters.isPublic && advancedFilters.isPublic !== 'all') count++;
    if (advancedFilters.modules && advancedFilters.modules !== 'all') count++;
    
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const filteredResultsCount = filteredPackages.length;

  const clearFilters = () => {
    setStatusFilter('all');
    setDurationFilter('all');
    setPriceFilter('all');
    setSearchTerm('');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      priceRange: { min: '', max: '' },
      maxUsersRange: { min: '', max: '' },
      status: 'all',
      durationUnit: 'all',
      aiEnabled: 'all',
      isPublic: 'all',
      modules: 'all'
    });
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setCloningPackage(null);
    setIsDrawerOpen(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setCloningPackage(null);
    setIsDrawerOpen(true);
  };

  const handleClonePackage = (pkg: Package) => {
    setCloningPackage(pkg);
    setEditingPackage(null);
    setIsDrawerOpen(true);
  };

  const handleDeletePackage = (pkg: Package) => {
    setDeleteModal({ isOpen: true, package: pkg });
  };

  const confirmDeletePackage = (packageId: string, reassignPackageId?: string) => {
    console.log('Delete package:', packageId, 'Reassign to:', reassignPackageId);
    setPackages(prev => prev.filter(p => p.id !== packageId));
    setDeleteModal({ isOpen: false, package: null });
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete packages:', selectedPackages);
    setPackages(prev => prev.filter(p => !selectedPackages.includes(p.id)));
    setSelectedPackages([]);
  };

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    console.log('Bulk status change:', selectedPackages, 'to', status);
    setPackages(prev => prev.map(p => 
      selectedPackages.includes(p.id) ? { ...p, status } : p
    ));
    setSelectedPackages([]);
  };

  const handleViewPackage = (pkg: Package) => {
    console.log('View package:', pkg);
    // TODO: Implement view functionality
  };

  const handleSavePackage = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Save package:', data);
      // Implement save functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (editingPackage) {
        setPackages(prev => prev.map(p => p.id === editingPackage.id ? { ...p, ...data, id: p.id } : p));
        toast({ title: "Package updated successfully" });
      } else {
        const newPackage: Package = {
          ...data,
          id: (packages.length + 1).toString(),
          usersCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin'
        };
        setPackages(prev => [newPackage, ...prev]);
        toast({ title: "Package created successfully" });
      }
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error saving package:', error);
      toast({ title: "Error saving package", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = (format: string, fields: string[], language: string) => {
    try {
      console.log('Export packages:', { format, fields, language, packages: filteredPackages });
      exportPackages(filteredPackages, format as 'csv' | 'excel' | 'pdf' | 'json');
      
      toast({
        title: "Export completed",
        description: `Successfully exported ${filteredPackages.length} packages as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the packages. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="Package Management"
        description="Create and manage CRM packages with features and pricing"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Packages' },
        ]}
        addButtonText="Add Package"
        onAddClick={handleAddPackage}
        showExportButton
        onExportClick={() => setIsExportModalOpen(true)}
        badge={`${filteredPackages.length} packages`}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Packages"
          value={totalPackages.toLocaleString()}
          icon={PackageIcon}
          gradient="from-blue-500 to-blue-600"
          change={{
            value: "+2 this month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Active Packages"
          value={activePackages.toLocaleString()}
          icon={TrendingUp}
          gradient="from-green-500 to-green-600"
          change={{
            value: `${Math.round((activePackages / totalPackages) * 100)}% active`,
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
          change={{
            value: "+15.3% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-orange-500 to-orange-600"
          change={{
            value: "+8.2% from last month",
            trend: "up"
          }}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Package Filters</CardTitle>
              <CardDescription>Filter and search your packages</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                  <Badge variant="secondary" className="ml-2">
                    {filteredResultsCount}
                  </Badge>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search packages..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Durations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="low">Low (&lt; $50)</SelectItem>
                <SelectItem value="medium">Medium ($50 - $200)</SelectItem>
                <SelectItem value="high">High ($200 - $500)</SelectItem>
                <SelectItem value="premium">Premium (&gt; $500)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <PackageAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onApplyFilters={() => {
          console.log('Applying advanced filters:', advancedFilters);
          setShowAdvancedFilters(false);
        }}
        onClearFilters={() => {
          setAdvancedFilters({
            dateRange: { from: undefined, to: undefined },
            priceRange: { min: '', max: '' },
            maxUsersRange: { min: '', max: '' },
            status: 'all',
            durationUnit: 'all',
            aiEnabled: 'all',
            isPublic: 'all',
            modules: 'all'
          });
        }}
      />

      <PackageTable
        packages={filteredPackages}
        selectedPackages={selectedPackages}
        onSelectionChange={setSelectedPackages}
        onEdit={handleEditPackage}
        onClone={handleClonePackage}
        onDelete={handleDeletePackage}
        onView={handleViewPackage}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />

      <PackageDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSavePackage}
        package={editingPackage}
        cloningPackage={cloningPackage}
        isLoading={isLoading}
      />
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      <DeletePackageModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, package: null })}
        onConfirm={confirmDeletePackage}
        package={deleteModal.package}
        availablePackages={packages}
      />
    </div>
  );
};
