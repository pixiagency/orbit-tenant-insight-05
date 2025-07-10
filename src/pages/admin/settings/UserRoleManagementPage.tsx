
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserRole } from '@/types/settings';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const UserRoleManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<UserRole[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access',
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
      description: 'Administrative access',
      permissions: ['dashboard', 'leads', 'deals', 'contacts', 'reports'],
      isDefault: false,
      canExport: true,
      canImport: true,
      canAssignTasks: true,
      canAssignLeads: true,
    },
    {
      id: '3',
      name: 'Team Leader',
      description: 'Team management and oversight',
      permissions: ['dashboard', 'leads', 'deals', 'contacts', 'team_reports'],
      isDefault: false,
      canExport: true,
      canImport: false,
      canAssignTasks: true,
      canAssignLeads: true,
    },
    {
      id: '4',
      name: 'Sales Agent',
      description: 'Sales activities',
      permissions: ['dashboard', 'leads', 'deals', 'contacts'],
      isDefault: true,
      canExport: false,
      canImport: false,
      canAssignTasks: false,
      canAssignLeads: false,
    },
  ]);

  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availablePermissions = [
    'dashboard', 'leads', 'deals', 'contacts', 'tasks', 'calendar', 
    'reports', 'team_reports', 'settings', 'users', 'integrations'
  ];

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
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: UserRole) => {
    setEditingRole({ ...role });
    setIsDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingRole) return;

    if (editingRole.id) {
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
    } else {
      const newRole = { ...editingRole, id: Date.now().toString() };
      setRoles(prev => [...prev, newRole]);
    }
    
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
  };

  const togglePermission = (permission: string) => {
    if (!editingRole) return;
    
    const newPermissions = editingRole.permissions.includes(permission)
      ? editingRole.permissions.filter(p => p !== permission)
      : [...editingRole.permissions, permission];
    
    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User & Role Management</h1>
          <p className="text-gray-500">Manage user roles and permissions</p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {role.name}
                    {role.isDefault && <Badge variant="secondary">Default</Badge>}
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteRole(role.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={role.canExport ? 'text-green-600' : 'text-gray-400'}>
                      {role.canExport ? '✓' : '✗'}
                    </span>
                    Export Data
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={role.canImport ? 'text-green-600' : 'text-gray-400'}>
                      {role.canImport ? '✓' : '✗'}
                    </span>
                    Import Data
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={role.canAssignTasks ? 'text-green-600' : 'text-gray-400'}>
                      {role.canAssignTasks ? '✓' : '✗'}
                    </span>
                    Assign Tasks
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={role.canAssignLeads ? 'text-green-600' : 'text-gray-400'}>
                      {role.canAssignLeads ? '✓' : '✗'}
                    </span>
                    Assign Leads
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole?.id ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
          </DialogHeader>
          
          {editingRole && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={editingRole.isDefault}
                    onCheckedChange={(checked) => setEditingRole({ ...editingRole, isDefault: checked })}
                  />
                  <Label>Default Role</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea
                  id="roleDescription"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                />
              </div>

              <div>
                <Label>Module Permissions</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Switch
                        checked={editingRole.permissions.includes(permission)}
                        onCheckedChange={() => togglePermission(permission)}
                      />
                      <Label className="capitalize">{permission.replace('_', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>

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

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRole}>
                  Save Role
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
