
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Users, Mail, Shield, User as UserIcon, Building, Phone, Eye, EyeOff, RefreshCw, Paperclip } from 'lucide-react';
import { DrawerForm } from '../layout/DrawerForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { User, UserFormData } from '../../types/users';

interface UserDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  user?: User | null;
  isLoading?: boolean;
}

const MOCK_CLIENTS = [
  { id: '1', name: 'TechCorp Inc.' },
  { id: '2', name: 'StartupXYZ' },
  { id: '3', name: 'Enterprise Solutions' },
  { id: '4', name: 'InnovateNow Corp' },
  { id: '5', name: 'Future Systems Ltd' },
];

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const UserDrawerForm: React.FC<UserDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading = false,
}) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectAllClients, setSelectAllClients] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        permissions: [],
        sendInviteEmail: false,
        notes: user.notes,
      });
      // Set selected clients if user has clientId
      if (user.clientId) {
        setSelectedClients([user.clientId]);
      }
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
      
      // Update select all state
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

  const onSubmit = (data: UserFormData) => {
    onSave({
      ...data,
      clientIds: selectedClients,
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
      <form className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <UserIcon className="inline h-4 w-4 mr-2" />
            Basic Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Full Name *
              </Label>
              <Input
                {...register('name', { required: 'Name is required' })}
                placeholder="John Doe"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
              {errors.name && (
                <span className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
              {errors.email && (
                <span className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Phone Number
              </Label>
              <Input
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Job Title
              </Label>
              <Input
                {...register('jobTitle')}
                placeholder="Sales Manager"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Department
            </Label>
            <Select onValueChange={(value) => setValue('department', value)} defaultValue={watch('department')}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="management">Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Role and Access */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Shield className="inline h-4 w-4 mr-2" />
            Role & Access
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Role *
              </Label>
              <Select onValueChange={(value) => setValue('role', value as any)} defaultValue={watch('role')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
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
              <Label htmlFor="status" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Status
              </Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={watch('status')}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
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
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Clients (Optional)
            </Label>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700 max-h-40 overflow-y-auto">
              <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-600">
                <Checkbox
                  id="select-all-clients"
                  checked={selectAllClients}
                  onCheckedChange={handleSelectAllClients}
                />
                <Label htmlFor="select-all-clients" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select All Clients
                </Label>
              </div>
              
              <div className="space-y-2">
                {MOCK_CLIENTS.map((client) => (
                  <div key={client.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`client-${client.id}`}
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => handleClientToggle(client.id)}
                    />
                    <Label htmlFor={`client-${client.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                      {client.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Security Settings */}
        {!user && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              <Mail className="inline h-4 w-4 mr-2" />
              Account Setup
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Send Invite Email
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Send account setup instructions to the user's email
                </p>
              </div>
              <Switch
                checked={watch('sendInviteEmail')}
                onCheckedChange={(checked) => setValue('sendInviteEmail', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temporaryPassword" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Temporary Password (Optional)
              </Label>
              <div className="relative">
                <Input
                  {...register('temporaryPassword')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Leave empty for auto-generated"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 pr-20"
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If empty, a secure password will be generated automatically
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Attachments */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Paperclip className="inline h-4 w-4 mr-2" />
            Attachments
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="attachments" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Upload Files
            </Label>
            <Input
              id="attachments"
              type="file"
              multiple
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload documents, images, or other relevant files
            </p>
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Notes (Optional)
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="Additional notes about this user..."
            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            rows={3}
          />
        </div>
      </form>
    </DrawerForm>
  );
};
