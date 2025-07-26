import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Users, Mail, Shield, User as UserIcon, Building, Phone, Eye, EyeOff, RefreshCw, Paperclip, Calendar, MapPin, Settings } from 'lucide-react';
import { DrawerForm } from '../layout/DrawerForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserFormData } from '../../types/users';

interface EnhancedUserDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  user?: User | null;
  isLoading?: boolean;
}

const MOCK_CLIENTS = [
  { id: '1', name: 'TechCorp Inc.', status: 'active', package: 'Enterprise' },
  { id: '2', name: 'StartupXYZ', status: 'active', package: 'Professional' },
  { id: '3', name: 'Enterprise Solutions', status: 'trial', package: 'Enterprise' },
  { id: '4', name: 'InnovateNow Corp', status: 'active', package: 'Business' },
  { id: '5', name: 'Future Systems Ltd', status: 'inactive', package: 'Basic' },
];

const DEPARTMENTS = [
  'Sales', 'Marketing', 'Support', 'Development', 'Management', 
  'Operations', 'Finance', 'HR', 'IT', 'Legal'
];

const TIMEZONES = [
  'UTC', 'EST', 'PST', 'CET', 'JST', 'GMT', 'IST', 'CST', 'MST', 'AST'
];

const PERMISSIONS = [
  { id: 'users.view', name: 'View Users', category: 'User Management' },
  { id: 'users.create', name: 'Create Users', category: 'User Management' },
  { id: 'users.edit', name: 'Edit Users', category: 'User Management' },
  { id: 'users.delete', name: 'Delete Users', category: 'User Management' },
  { id: 'leads.view', name: 'View Leads', category: 'Lead Management' },
  { id: 'leads.create', name: 'Create Leads', category: 'Lead Management' },
  { id: 'leads.edit', name: 'Edit Leads', category: 'Lead Management' },
  { id: 'leads.delete', name: 'Delete Leads', category: 'Lead Management' },
  { id: 'deals.view', name: 'View Deals', category: 'Deal Management' },
  { id: 'deals.create', name: 'Create Deals', category: 'Deal Management' },
  { id: 'deals.edit', name: 'Edit Deals', category: 'Deal Management' },
  { id: 'deals.delete', name: 'Delete Deals', category: 'Deal Management' },
  { id: 'reports.view', name: 'View Reports', category: 'Reporting' },
  { id: 'reports.export', name: 'Export Reports', category: 'Reporting' },
  { id: 'settings.system', name: 'System Settings', category: 'Administration' },
  { id: 'settings.integration', name: 'Integration Settings', category: 'Administration' },
];

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const EnhancedUserDrawerForm: React.FC<EnhancedUserDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading = false,
}) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectAllClients, setSelectAllClients] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      permissions: [],
      sendInviteEmail: true,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  const selectedRole = watch('role');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        department: user.department,
        jobTitle: user.jobTitle,
        permissions: user.permissions || [],
        sendInviteEmail: false,
        notes: user.notes,
      });
      
      if (user.clientIds) {
        setSelectedClients(user.clientIds);
      } else if (user.clientId) {
        setSelectedClients([user.clientId]);
      }
      
      setSelectedPermissions(user.permissions || []);
    } else {
      reset({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        permissions: [],
        sendInviteEmail: true,
      });
      setSelectedClients([]);
      setSelectedPermissions([]);
    }
  }, [user, reset]);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setValue('temporaryPassword', newPassword);
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => {
      const newSelection = prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId];
      
      setSelectAllClients(newSelection.length === MOCK_CLIENTS.length);
      return newSelection;
    });
  };

  const handleSelectAllClients = (checked: boolean) => {
    setSelectAllClients(checked);
    if (checked) {
      setSelectedClients(MOCK_CLIENTS.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => {
      const newSelection = prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId];
      
      setValue('permissions', newSelection);
      return newSelection;
    });
  };

  const groupedPermissions = PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof PERMISSIONS>);

  const onSubmit = (data: UserFormData) => {
    onSave({
      ...data,
      clientIds: selectedClients,
      permissions: selectedPermissions,
    });
  };

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Create New User'}
      description={user ? 'Update user details and permissions' : 'Add a new user to the system'}
      onSave={handleSubmit(onSubmit)}
      isLoading={isLoading}
      saveText={user ? 'Update User' : 'Create User'}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="access">Access & Role</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                <UserIcon className="inline h-4 w-4 mr-2" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    {...register('name', { required: 'Name is required' })}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <span className="text-sm text-red-600">{errors.name.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <span className="text-sm text-red-600">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    {...register('phone')}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-medium">
                    Job Title
                  </Label>
                  <Input
                    {...register('jobTitle')}
                    placeholder="Sales Manager"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department
                  </Label>
                  <Select onValueChange={(value) => setValue('department', value)} defaultValue={watch('department')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Timezone
                  </Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Work Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                <Building className="inline h-4 w-4 mr-2" />
                Work Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Employee ID
                  </Label>
                  <Input placeholder="EMP001" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Hire Date
                  </Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Manager
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager1">John Smith</SelectItem>
                      <SelectItem value="manager2">Sarah Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Work Location
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              <Shield className="inline h-4 w-4 mr-2" />
              Role & Access Control
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role *
                </Label>
                <Select onValueChange={(value) => setValue('role', value as any)} defaultValue={watch('role')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={watch('status')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Multi-select Clients */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Assigned Clients
              </Label>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-clients"
                      checked={selectAllClients}
                      onCheckedChange={handleSelectAllClients}
                    />
                    <Label htmlFor="select-all-clients" className="text-sm font-medium">
                      Select All Clients ({MOCK_CLIENTS.length})
                    </Label>
                  </div>
                </CardHeader>
                <CardContent className="max-h-48 overflow-y-auto">
                  <div className="space-y-3">
                    {MOCK_CLIENTS.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`client-${client.id}`}
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={() => handleClientToggle(client.id)}
                          />
                          <div>
                            <Label htmlFor={`client-${client.id}`} className="text-sm font-medium">
                              {client.name}
                            </Label>
                            <div className="text-xs text-gray-500">
                              {client.package} Package
                            </div>
                          </div>
                        </div>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Setup */}
            {!user && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Account Setup
                </h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Send Invite Email
                    </Label>
                    <p className="text-xs text-gray-500">
                      Send account setup instructions to the user's email
                    </p>
                  </div>
                  <Switch
                    checked={watch('sendInviteEmail')}
                    onCheckedChange={(checked) => setValue('sendInviteEmail', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temporaryPassword" className="text-sm font-medium">
                    Temporary Password (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('temporaryPassword')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Leave empty for auto-generated"
                      className="pr-20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGeneratePassword}
                        className="h-6 w-6 p-0"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-6 w-6 p-0"
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              <Settings className="inline h-4 w-4 mr-2" />
              Detailed Permissions
            </h4>

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              <Settings className="inline h-4 w-4 mr-2" />
              Additional Settings
            </h4>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">Require 2FA for this user</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Force Password Reset</Label>
                    <p className="text-xs text-gray-500">User must change password on next login</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Session Timeout</Label>
                    <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Email Notifications</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">SMS Notifications</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Push Notifications</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                {...register('notes')}
                placeholder="Additional notes about this user..."
                rows={4}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DrawerForm>
  );
};