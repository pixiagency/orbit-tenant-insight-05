import React, { useState, useRef } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { UserTable, UserTableHandles } from '../../components/users/UserTable';
import { UserDrawerForm } from '../../components/users/UserDrawerForm';
import { UserAdvancedFilters } from '../../components/users/UserAdvancedFilters';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { User, UserFormData } from '../../types/users';
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
import { Filter, Search, X, Users, UserCheck, UserX, Clock } from 'lucide-react';

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john@admin.com',
    role: 'super-admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    loginCount: 45,
    permissions: ['view_dashboard', 'manage_users', 'manage_settings'],
    jobTitle: 'System Administrator',
    department: 'management',
    isEmailVerified: true,
    isTwoFactorEnabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'system',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@techcorp.com',
    role: 'admin',
    status: 'active',
    clientId: '1',
    clientName: 'TechCorp Inc.',
    lastLogin: '2024-01-14T15:20:00Z',
    loginCount: 123,
    permissions: ['view_dashboard', 'manage_leads', 'manage_contacts'],
    jobTitle: 'Sales Manager',
    department: 'sales',
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
    createdBy: '1',
  },
  {
    id: '3',
    name: 'Mike User',
    email: 'mike@startup.com',
    role: 'user',
    status: 'pending',
    clientId: '2',
    clientName: 'StartupXYZ',
    loginCount: 0,
    permissions: ['view_dashboard'],
    jobTitle: 'Sales Representative',
    department: 'sales',
    isEmailVerified: false,
    isTwoFactorEnabled: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    createdBy: '1',
  },
];

export const UsersManagementPage = () => {
  const tableRef = useRef<UserTableHandles>(null);
  const [users] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    lastLoginRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    status: 'all',
    role: 'all',
    department: 'all',
    location: 'all',
    emailVerified: 'all',
    twoFactorEnabled: 'all',
    source: 'all'
  });

  // Calculate user statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const verifiedUsers = users.filter(u => u.isEmailVerified).length;
  const activeRate = totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(1) : '0';

  const filteredUsers = users.filter(user => {
    // Basic filters
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesClient = clientFilter === 'all' || user.clientId === clientFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;

    // Advanced filters
    const matchesAdvancedStatus = advancedFilters.status === 'all' || user.status === advancedFilters.status;
    const matchesAdvancedRole = advancedFilters.role === 'all' || user.role === advancedFilters.role;
    const matchesAdvancedDepartment = advancedFilters.department === 'all' || user.department === advancedFilters.department;
    const matchesEmailVerified = advancedFilters.emailVerified === 'all' || 
      (advancedFilters.emailVerified === 'verified' && user.isEmailVerified) ||
      (advancedFilters.emailVerified === 'unverified' && !user.isEmailVerified);
    const matches2FA = advancedFilters.twoFactorEnabled === 'all' ||
      (advancedFilters.twoFactorEnabled === 'enabled' && user.isTwoFactorEnabled) ||
      (advancedFilters.twoFactorEnabled === 'disabled' && !user.isTwoFactorEnabled);
    const matchesSource = advancedFilters.source === 'all' || user.createdBy === advancedFilters.source;

    // Date range filter
    const matchesDateRange = !advancedFilters.dateRange.from && !advancedFilters.dateRange.to || 
      (advancedFilters.dateRange.from && user.createdAt >= advancedFilters.dateRange.from.toISOString()) &&
      (advancedFilters.dateRange.to && user.createdAt <= advancedFilters.dateRange.to.toISOString());

    // Last login range filter
    const matchesLastLoginRange = !advancedFilters.lastLoginRange.from && !advancedFilters.lastLoginRange.to || 
      (advancedFilters.lastLoginRange.from && user.lastLogin && user.lastLogin >= advancedFilters.lastLoginRange.from.toISOString()) &&
      (advancedFilters.lastLoginRange.to && user.lastLogin && user.lastLogin <= advancedFilters.lastLoginRange.to.toISOString());

    return matchesSearch && matchesRole && matchesStatus && matchesClient && matchesDepartment &&
           matchesAdvancedStatus && matchesAdvancedRole && matchesAdvancedDepartment &&
           matchesEmailVerified && matches2FA && matchesSource && matchesDateRange && matchesLastLoginRange;
  });

  const activeFiltersCount = [
    searchTerm,
    roleFilter !== 'all',
    statusFilter !== 'all',
    clientFilter !== 'all',
    departmentFilter !== 'all',
    showAdvancedFilters && (
      advancedFilters.status !== 'all' ||
      advancedFilters.role !== 'all' ||
      advancedFilters.department !== 'all' ||
      advancedFilters.emailVerified !== 'all' ||
      advancedFilters.twoFactorEnabled !== 'all' ||
      advancedFilters.source !== 'all' ||
      advancedFilters.dateRange.from ||
      advancedFilters.dateRange.to ||
      advancedFilters.lastLoginRange.from ||
      advancedFilters.lastLoginRange.to
    )
  ].filter(Boolean).length;

  const handleClearAll = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setClientFilter('all');
    setDepartmentFilter('all');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      lastLoginRange: { from: undefined, to: undefined },
      status: 'all',
      role: 'all',
      department: 'all',
      location: 'all',
      emailVerified: 'all',
      twoFactorEnabled: 'all',
      source: 'all'
    });
    setShowAdvancedFilters(false);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleViewUser = (user: User) => {
    console.log('View user:', user);
  };

  const handleDeleteUser = (user: User) => {
    console.log('Delete user:', user);
  };

  const handleToggleStatus = (user: User) => {
    console.log('Toggle status:', user);
  };

  const handleResendInvite = (user: User) => {
    console.log('Resend invite:', user);
  };

  const handleResetPassword = (user: User) => {
    console.log('Reset password:', user);
  };

  const handleSaveUser = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      console.log('Save user:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    tableRef.current?.openExportModal(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="Users Management"
        description="Manage user accounts, roles, and permissions across the system"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Users Management' },
        ]}
        badge={`${filteredUsers.length} users`}
        showAddButton={true}
        addButtonText="Add User"
        onAddClick={handleCreateUser}
        showImportButton={true}
        onImportClick={() => console.log('Import users')}
        showExportButton={true}
        onExportClick={handleExport}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
          change={{
            value: "+3 this month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Active Users"
          value={activeUsers.toLocaleString()}
          icon={UserCheck}
          gradient="from-green-500 to-green-600"
          change={{
            value: `${activeRate}% active`,
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Pending Users"
          value={pendingUsers.toLocaleString()}
          icon={Clock}
          gradient="from-orange-500 to-orange-600"
          change={{
            value: "+1 this week",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Verified Users"
          value={verifiedUsers.toLocaleString()}
          icon={UserX}
          gradient="from-purple-500 to-purple-600"
          change={{
            value: `${Math.round((verifiedUsers / totalUsers) * 100)}% verified`,
            trend: "up"
          }}
        />
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Filters</CardTitle>
              <CardDescription>Filter and search your users</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
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
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="1">TechCorp Inc.</SelectItem>
                <SelectItem value="2">StartupXYZ</SelectItem>
                <SelectItem value="3">Enterprise Solutions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <UserAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />

      <UserTable
        ref={tableRef}
        users={filteredUsers}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onResendInvite={handleResendInvite}
        onResetPassword={handleResetPassword}
      />

      <UserDrawerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        isLoading={isLoading}
      />
    </div>
  );
};
