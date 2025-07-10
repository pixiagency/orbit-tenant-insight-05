import React, { useState } from 'react';
import { Key, Users, CheckCircle, Clock, Filter, Search, X } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { ActivationCodeTable } from '../../components/activation-codes/ActivationCodeTable';
import { ActivationCodeDrawerForm } from '../../components/activation-codes/ActivationCodeDrawerForm';
import { ActivationCodeAdvancedFilters } from '../../components/activation-codes/ActivationCodeAdvancedFilters';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { ActivationCode } from '../../types/superadmin';
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

const MOCK_ACTIVATION_CODES: ActivationCode[] = [
  {
    id: '1',
    code: 'STARTER-ABC123',
    packageId: '1',
    packageName: 'Starter Plan',
    usageType: 'one-time',
    usageLimit: 1,
    usageCount: 0,
    usersLimit: 5,
    validityDays: 365,
    expirationDate: '2024-12-31T23:59:59Z',
    status: 'active',
    usedBy: [],
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin@company.com',
    type: 'activation'
  },
  {
    id: '2',
    code: 'PRO-XYZ789',
    packageId: '2',
    packageName: 'Professional Plan',
    usageType: 'one-time',
    usageLimit: 1,
    usageCount: 1,
    usersLimit: 15,
    validityDays: 365,
    expirationDate: '2024-12-31T23:59:59Z',
    status: 'used',
    usedBy: ['TechCorp Inc.'],
    createdAt: '2024-01-10T10:00:00Z',
    createdBy: 'admin@company.com',
    type: 'activation'
  },
  {
    id: '3',
    code: 'ENT-DEF456',
    packageId: '3',
    packageName: 'Enterprise Plan',
    usageType: 'multi-use',
    usageLimit: 5,
    usageCount: 0,
    usersLimit: 50,
    validityDays: 180,
    expirationDate: '2024-06-30T23:59:59Z',
    status: 'expired',
    usedBy: [],
    createdAt: '2024-01-05T10:00:00Z',
    createdBy: 'admin@company.com',
    type: 'activation'
  }
];

export const ActivationCodesPage = () => {
  const [codes, setCodes] = useState<ActivationCode[]>(MOCK_ACTIVATION_CODES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [usageTypeFilter, setUsageTypeFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    usageRange: { min: '', max: '' },
    status: 'all',
    packageId: 'all',
    createdBy: 'all',
    usageType: 'all',
    validityPeriod: 'all',
    source: 'all'
  });

  // Calculate activation code statistics
  const totalCodes = codes.length;
  const activeCodes = codes.filter(c => c.status === 'active').length;
  const usedCodes = codes.filter(c => c.status === 'used').length;
  const expiredCodes = codes.filter(c => c.status === 'expired').length;
  const activeRate = totalCodes > 0 ? (activeCodes / totalCodes * 100).toFixed(1) : '0';

  // Filter codes based on current filters
  const filteredCodes = codes.filter(code => {
    // Basic filters
    const matchesSearch = !searchTerm || 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || code.status === statusFilter;
    const matchesUsageType = usageTypeFilter === 'all' || code.usageType === usageTypeFilter;
    const matchesPackage = packageFilter === 'all' || code.packageId === packageFilter;

    // Advanced filters
    const matchesAdvancedStatus = advancedFilters.status === 'all' || code.status === advancedFilters.status;
    const matchesAdvancedPackage = advancedFilters.packageId === 'all' || code.packageId === advancedFilters.packageId;
    const matchesAdvancedUsageType = advancedFilters.usageType === 'all' || code.usageType === advancedFilters.usageType;
    const matchesCreatedBy = advancedFilters.createdBy === 'all' || code.createdBy === advancedFilters.createdBy;
    const matchesSource = advancedFilters.source === 'all' || code.type === advancedFilters.source;

    // Date range filter
    const matchesDateRange = !advancedFilters.dateRange.from && !advancedFilters.dateRange.to || 
      (advancedFilters.dateRange.from && code.createdAt >= advancedFilters.dateRange.from.toISOString()) &&
      (advancedFilters.dateRange.to && code.createdAt <= advancedFilters.dateRange.to.toISOString());

    // Usage range filter
    const matchesUsageRange = (!advancedFilters.usageRange.min || code.usageCount >= parseInt(advancedFilters.usageRange.min)) &&
      (!advancedFilters.usageRange.max || code.usageCount <= parseInt(advancedFilters.usageRange.max));

    // Validity period filter
    const matchesValidityPeriod = advancedFilters.validityPeriod === 'all' || 
      (advancedFilters.validityPeriod === '7-days' && code.validityDays === 7) ||
      (advancedFilters.validityPeriod === '30-days' && code.validityDays === 30) ||
      (advancedFilters.validityPeriod === '90-days' && code.validityDays === 90) ||
      (advancedFilters.validityPeriod === '1-year' && code.validityDays === 365) ||
      (advancedFilters.validityPeriod === 'unlimited' && code.validityDays === 0);

    return matchesSearch && matchesStatus && matchesUsageType && matchesPackage &&
           matchesAdvancedStatus && matchesAdvancedPackage && matchesAdvancedUsageType &&
           matchesCreatedBy && matchesSource && matchesDateRange && matchesUsageRange && matchesValidityPeriod;
  });

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all',
    usageTypeFilter !== 'all',
    packageFilter !== 'all',
    showAdvancedFilters && (
      advancedFilters.status !== 'all' ||
      advancedFilters.packageId !== 'all' ||
      advancedFilters.usageType !== 'all' ||
      advancedFilters.createdBy !== 'all' ||
      advancedFilters.source !== 'all' ||
      advancedFilters.validityPeriod !== 'all' ||
      advancedFilters.dateRange.from ||
      advancedFilters.dateRange.to ||
      advancedFilters.usageRange.min ||
      advancedFilters.usageRange.max
    )
  ].filter(Boolean).length;

  const handleClearAll = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setUsageTypeFilter('all');
    setPackageFilter('all');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      usageRange: { min: '', max: '' },
      status: 'all',
      packageId: 'all',
      createdBy: 'all',
      usageType: 'all',
      validityPeriod: 'all',
      source: 'all'
    });
    setShowAdvancedFilters(false);
  };

  const handleGenerateCodes = () => {
    setIsDrawerOpen(true);
  };

  const handleBulkDelete = () => {
    setCodes(prev => prev.filter(code => !selectedCodes.includes(code.id)));
    setSelectedCodes([]);
  };

  const handleBulkStatusChange = (status: 'active' | 'expired') => {
    setCodes(prev => prev.map(code => 
      selectedCodes.includes(code.id) ? { ...code, status } : code
    ));
    setSelectedCodes([]);
  };



  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="Activation Codes"
        description="Generate and manage activation codes for packages"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Activation Codes' },
        ]}
        addButtonText="Generate Codes"
        onAddClick={handleGenerateCodes}
        badge={`${filteredCodes.length} codes`}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Codes"
          value={totalCodes.toLocaleString()}
          icon={Key}
          gradient="from-blue-500 to-blue-600"
          change={{
            value: "+5 this month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Active Codes"
          value={activeCodes.toLocaleString()}
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
          change={{
            value: `${activeRate}% active`,
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Used Codes"
          value={usedCodes.toLocaleString()}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
          change={{
            value: "+2 this week",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Expired Codes"
          value={expiredCodes.toLocaleString()}
          icon={Clock}
          gradient="from-orange-500 to-orange-600"
          change={{
            value: "1 expiring soon",
            trend: "down"
          }}
        />
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Activation Code Filters
            </CardTitle>
            <CardDescription>
              Filter activation codes by various criteria
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
                  {filteredCodes.length}
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
                    placeholder="Search activation codes..."
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
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Usage Type */}
              <div className="space-y-2">
                <Label htmlFor="usageType">Usage Type</Label>
                <Select value={usageTypeFilter} onValueChange={setUsageTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select usage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="multi-use">Multi-use</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <ActivationCodeAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />

      {/* Activation Codes Table */}
      <ActivationCodeTable
        codes={filteredCodes}
        selectedCodes={selectedCodes}
        onSelectionChange={setSelectedCodes}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />

      {/* Generate Codes Drawer */}
      <ActivationCodeDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={(data) => {
          console.log('Generate codes:', data);
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};
