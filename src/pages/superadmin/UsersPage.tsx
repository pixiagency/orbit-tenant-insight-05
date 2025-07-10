import React, { useState } from 'react';
import { Plus, Users, UserCheck, UserX, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '../../components/users/UserTable';
import { UserDrawerForm } from '../../components/users/UserDrawerForm';
import { UserFilters } from '../../components/users/UserFilters';
import { UserExportModal } from '../../components/users/UserExportModal';
import { useToast } from '@/hooks/use-toast';
import { User, UserFormData, UserFilters as UserFiltersType } from '../../types/users';

// Mock data for demonstration - complete User objects
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    role: 'admin',
    status: 'active',
    clientId: '1',
    clientName: 'TechCorp Inc.',
    lastLogin: '2024-01-20T09:15:00Z',
    createdAt: '2023-12-15T10:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    loginCount: 45,
    permissions: ['view_dashboard', 'manage_leads', 'manage_contacts'],
    isEmailVerified: true,
    isTwoFactorEnabled: true,
    createdBy: 'system',
    jobTitle: 'Sales Manager',
    department: 'sales',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@startupxyz.com',
    role: 'user',
    status: 'active',
    clientId: '2',
    clientName: 'StartupXYZ',
    lastLogin: '2024-01-19T16:45:00Z',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    loginCount: 23,
    permissions: ['view_dashboard'],
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdBy: '1',
    jobTitle: 'Sales Representative',
    department: 'sales',
  },
];

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [filters, setFilters] = useState<UserFiltersType>({
    search: '',
    role: 'all',
    status: 'all',
    clientId: 'all',
    department: 'all',
    isEmailVerified: 'all',
    isTwoFactorEnabled: 'all',
    lastLoginRange: 'all',
    dateRange: {}
  });
  const { toast } = useToast();

  const totalActiveUsers = users.filter(user => user.status === 'active').length;
  const totalAdminUsers = users.filter(user => user.role === 'admin').length;
  const totalInactiveUsers = users.filter(user => user.status === 'inactive').length;

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormMode('create');
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormMode('edit');
    setIsDrawerOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted.",
    });
  };

  const handleSaveUser = (userData: UserFormData) => {
    if (formMode === 'create') {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        clientId: userData.clientId,
        clientIds: userData.clientIds,
        phone: userData.phone,
        department: userData.department,
        jobTitle: userData.jobTitle,
        permissions: userData.permissions,
        loginCount: 0,
        isEmailVerified: false,
        isTwoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        notes: userData.notes,
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "User Created",
        description: "User has been successfully created.",
      });
    } else if (selectedUser) {
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id ? { 
            ...user, 
            ...userData,
            updatedAt: new Date().toISOString()
          } : user
        )
      );
      toast({
        title: "User Updated",
        description: "User has been successfully updated.",
      });
    }
    setIsDrawerOpen(false);
  };

  const handleExport = (format: string, fields: string[], language: string) => {
    console.log('Exporting users:', { format, fields, language, count: users.length });
    toast({
      title: "Export Started",
      description: `Exporting ${users.length} users in ${format.toUpperCase()} format.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Users Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system users and their permissions
          </p>
        </div>
        <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdminUsers}</div>
            <p className="text-xs text-muted-foreground">Admin privileges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInactiveUsers}</div>
            <p className="text-xs text-muted-foreground">Not active</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExport={() => setIsExportModalOpen(true)}
      />

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable 
            users={users}
            onView={() => {}}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={() => {}}
            onResendInvite={() => {}}
            onResetPassword={() => {}}
          />
        </CardContent>
      </Card>

      {/* Drawer Form */}
      <UserDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        isLoading={false}
      />

      {/* Export Modal */}
      <UserExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        users={users}
        onExport={handleExport}
      />
    </div>
  );
};
