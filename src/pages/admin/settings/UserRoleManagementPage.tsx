import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types/settings';
import { User, UserFormData } from '@/types/users';
import { EnhancedUserTable } from '@/components/users/EnhancedUserTable';
import { EnhancedUserDrawerForm } from '@/components/users/EnhancedUserDrawerForm';
import { Plus, Edit, Trash2, Users, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const UserRoleManagementPage: React.FC = () => {
  // User Management State
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      clientId: 'client-1',
      clientName: 'Acme Corp',
      lastLogin: '2024-01-15T10:30:00Z',
      loginCount: 45,
      permissions: ['dashboard', 'leads', 'deals', 'contacts', 'reports'],
      phone: '+1-555-0123',
      department: 'Sales',
      jobTitle: 'Sales Manager',
      isEmailVerified: true,
      isTwoFactorEnabled: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      createdBy: 'system',
      notes: 'Senior sales manager with team lead responsibilities'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
      clientId: 'client-1',
      clientName: 'Acme Corp',
      lastLogin: '2024-01-14T15:45:00Z',
      loginCount: 23,
      permissions: ['dashboard', 'leads', 'contacts'],
      phone: '+1-555-0124',
      department: 'Marketing',
      jobTitle: 'Marketing Specialist',
      isEmailVerified: true,
      isTwoFactorEnabled: true,
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      createdBy: '1',
      notes: 'Handles lead generation and qualification'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'viewer',
      status: 'inactive',
      clientId: 'client-2',
      clientName: 'Tech Solutions Inc',
      lastLogin: '2024-01-10T09:00:00Z',
      loginCount: 12,
      permissions: ['dashboard'],
      phone: '+1-555-0125',
      department: 'Support',
      jobTitle: 'Support Agent',
      isEmailVerified: false,
      isTwoFactorEnabled: false,
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
      createdBy: '1',
      notes: 'Recently hired, pending email verification'
    }
  ]);

  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const userTableRef = useRef<{ openExportModal: () => void }>(null);

  // Role Management State
  const [roles, setRoles] = useState<UserRole[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with ability to manage all users, roles, and system settings',
      permissions: ['all'],
      isDefault: false,
      canExport: true,
      canImport: true,
      canAssignTasks: true,
      canAssignLeads: true,
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access with user management and system configuration capabilities',
      permissions: ['dashboard', 'leads', 'deals', 'contacts', 'reports', 'users', 'settings'],
      isDefault: false,
      canExport: true,
      canImport: true,
      canAssignTasks: true,
      canAssignLeads: true,
    },
    {
      id: '3',
      name: 'Team Leader',
      description: 'Team management and oversight with ability to assign tasks and manage team performance',
      permissions: ['dashboard', 'leads', 'deals', 'contacts', 'team_reports', 'tasks'],
      isDefault: false,
      canExport: true,
      canImport: false,
      canAssignTasks: true,
      canAssignLeads: true,
    },
    {
      id: '4',
      name: 'Sales Agent',
      description: 'Standard sales activities with access to leads, deals, and customer management',
      permissions: ['dashboard', 'leads', 'deals', 'contacts'],
      isDefault: true,
      canExport: false,
      canImport: false,
      canAssignTasks: false,
      canAssignLeads: false,
    },
    {
      id: '5',
      name: 'Support Agent',
      description: 'Customer support access with ticket management and knowledge base',
      permissions: ['dashboard', 'contacts', 'support_tickets'],
      isDefault: false,
      canExport: false,
      canImport: false,
      canAssignTasks: false,
      canAssignLeads: false,
    },
  ]);

  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const availablePermissions = [
    'dashboard', 'leads', 'deals', 'contacts', 'tasks', 'calendar', 
    'reports', 'team_reports', 'settings', 'users', 'integrations',
    'support_tickets', 'billing', 'analytics', 'automations'
  ];

  // User Management Handlers
  const handleCreateUser = () => {
    setEditingUser(null);
    setIsUserDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserDrawerOpen(true);
  };

  const handleSaveUser = (userData: UserFormData) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      ));
      toast.success('User updated successfully');
    } else {
      // Create new user
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        loginCount: 0,
        isEmailVerified: false,
        isTwoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user-id',
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
    }
    setIsUserDrawerOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    toast.success('User deleted successfully');
  };

  const handleToggleUserStatus = (user: User) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { 
            ...u, 
            status: u.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          }
        : u
    ));
    toast.success('User status updated');
  };

  const handleResendInvite = (user: User) => {
    toast.success('Invitation email sent successfully');
  };

  const handleResetPassword = (user: User) => {
    toast.success('Password reset email sent');
  };

  const handleBulkAction = (action: string, userIds: string[]) => {
    switch (action) {
      case 'activate':
        setUsers(prev => prev.map(user => 
          userIds.includes(user.id) 
            ? { ...user, status: 'active' as const, updatedAt: new Date().toISOString() }
            : user
        ));
        toast.success(`${userIds.length} users activated`);
        break;
      case 'deactivate':
        setUsers(prev => prev.map(user => 
          userIds.includes(user.id) 
            ? { ...user, status: 'inactive' as const, updatedAt: new Date().toISOString() }
            : user
        ));
        toast.success(`${userIds.length} users deactivated`);
        break;
      case 'delete':
        setUsers(prev => prev.filter(user => !userIds.includes(user.id)));
        toast.success(`${userIds.length} users deleted`);
        break;
      case 'resend-invite':
        toast.success(`Invitations sent to ${userIds.length} users`);
        break;
    }
  };

  // Role Management Handlers
  const handleCreateRole = () => {
    setEditingRole({
      id: '',
      name: '',
      description: '',
      permissions: [],
      isDefault: false,
      canExport: false,
      canImport: false,
      canAssignTasks: false,
      canAssignLeads: false,
    });
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: UserRole) => {
    setEditingRole({ ...role });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingRole) return;

    if (editingRole.id) {
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      toast.success('Role updated successfully');
    } else {
      const newRole = { ...editingRole, id: Date.now().toString() };
      setRoles(prev => [...prev, newRole]);
      toast.success('Role created successfully');
    }
    
    setIsRoleDialogOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    const roleInUse = users.some(user => user.role === roles.find(r => r.id === roleId)?.name.toLowerCase().replace(' ', '-'));
    
    if (roleInUse) {
      toast.error('Cannot delete role that is currently assigned to users');
      return;
    }
    
    setRoles(prev => prev.filter(role => role.id !== roleId));
    toast.success('Role deleted successfully');
  };

  const togglePermission = (permission: string) => {
    if (!editingRole) return;
    
    const newPermissions = editingRole.permissions.includes(permission)
      ? editingRole.permissions.filter(p => p !== permission)
      : [...editingRole.permissions, permission];
    
    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  const getRoleUsageCount = (roleName: string) => {
    return users.filter(user => user.role === roleName.toLowerCase().replace(' ', '-')).length;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User & Role Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions for your organization</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-sm text-muted-foreground">
                Manage user accounts, access levels, and profile information
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => userTableRef.current?.openExportModal()}
              >
                Export Users
              </Button>
              <Button onClick={handleCreateUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          <EnhancedUserTable
            ref={userTableRef}
            users={users}
            onView={(user) => console.log('View user:', user)}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
            onResendInvite={handleResendInvite}
            onResetPassword={handleResetPassword}
            onBulkAction={handleBulkAction}
          />

          <EnhancedUserDrawerForm
            isOpen={isUserDrawerOpen}
            onClose={() => setIsUserDrawerOpen(false)}
            onSave={handleSaveUser}
            user={editingUser}
          />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Roles & Permissions</h2>
              <p className="text-sm text-muted-foreground">
                Define roles with specific permissions and access levels
              </p>
            </div>
            <Button onClick={handleCreateRole}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid gap-4">
            {roles.map((role) => {
              const usageCount = getRoleUsageCount(role.name);
              return (
                <Card key={role.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {role.name}
                          <div className="flex gap-1">
                            {role.isDefault && <Badge variant="secondary">Default</Badge>}
                            {usageCount > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {usageCount} user{usageCount !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </CardTitle>
                        <CardDescription className="max-w-2xl">{role.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={usageCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Module Permissions</h4>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.includes('all') ? (
                            <Badge variant="default" className="bg-primary">All Permissions</Badge>
                          ) : (
                            role.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="capitalize">
                                {permission.replace('_', ' ')}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={role.canExport ? 'text-green-600' : 'text-muted-foreground'}>
                            {role.canExport ? '✓' : '✗'}
                          </span>
                          Export Data
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={role.canImport ? 'text-green-600' : 'text-muted-foreground'}>
                            {role.canImport ? '✓' : '✗'}
                          </span>
                          Import Data
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={role.canAssignTasks ? 'text-green-600' : 'text-muted-foreground'}>
                            {role.canAssignTasks ? '✓' : '✗'}
                          </span>
                          Assign Tasks
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={role.canAssignLeads ? 'text-green-600' : 'text-muted-foreground'}>
                            {role.canAssignLeads ? '✓' : '✗'}
                          </span>
                          Assign Leads
                        </div>
                      </div>

                      {usageCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                          <AlertTriangle className="h-4 w-4" />
                          This role is currently assigned to {usageCount} user{usageCount !== 1 ? 's' : ''} and cannot be deleted.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Role Editor Dialog */}
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRole?.id ? 'Edit Role' : 'Create New Role'}
                </DialogTitle>
              </DialogHeader>
              
              {editingRole && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input
                        id="roleName"
                        value={editingRole.name}
                        onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                        placeholder="e.g., Sales Manager"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={editingRole.isDefault}
                        onCheckedChange={(checked) => setEditingRole({ ...editingRole, isDefault: checked })}
                      />
                      <Label>Default Role for New Users</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      value={editingRole.description}
                      onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                      placeholder="Describe the responsibilities and scope of this role..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Module Permissions</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select which modules and features this role can access
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {availablePermissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch
                            checked={editingRole.permissions.includes(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <Label className="capitalize text-sm">
                            {permission.replace('_', ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Additional Capabilities</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure advanced permissions and capabilities
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingRole.canExport}
                          onCheckedChange={(checked) => setEditingRole({ ...editingRole, canExport: checked })}
                        />
                        <Label>Can Export Data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingRole.canImport}
                          onCheckedChange={(checked) => setEditingRole({ ...editingRole, canImport: checked })}
                        />
                        <Label>Can Import Data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingRole.canAssignTasks}
                          onCheckedChange={(checked) => setEditingRole({ ...editingRole, canAssignTasks: checked })}
                        />
                        <Label>Can Assign Tasks</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingRole.canAssignLeads}
                          onCheckedChange={(checked) => setEditingRole({ ...editingRole, canAssignLeads: checked })}
                        />
                        <Label>Can Assign Leads</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveRole}>
                      {editingRole.id ? 'Update Role' : 'Create Role'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};