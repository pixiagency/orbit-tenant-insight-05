import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, User, Mail, Phone, Globe, MapPin, Package, Calendar, Users, HardDrive, Phone as PhoneIcon, Clock, Shield, ExternalLink, Key, CreditCard, Repeat, Activity, FileText, LogIn, Plus, Power, PowerOff } from 'lucide-react';
import { Client } from '../../types/superadmin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BillingInvoiceModal } from '../../components/billing/BillingInvoiceModal';
import { AssignPackageModal, RenewSubscriptionModal, SendPasswordResetModal } from '../../components/clients/ClientSubscriptionModals';

// Mock data - same as in ClientsPage
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
    monthlyRevenue: 99,
    totalUsers: 8,
    storageUsed: 15.5,
    usersCount: 8,
    usersLimit: 10,
    contactsCount: 2500,
    contactsLimit: 5000,
    storageLimit: 50,
    callMinutesUsed: 3500,
    callMinutesLimit: 5000,
    lastActivity: '2024-01-15T14:30:00Z',
    registrationDate: '2023-06-15T10:00:00Z',
    subscriptionStartDate: '2023-06-15T10:00:00Z',
    subscriptionEndDate: '2024-06-15T10:00:00Z',
    subdomain: 'techcorp',
    loginUrl: 'https://techcorp.mycrm.com',
    notes: 'High-value client, excellent communication',
    createdAt: '2023-06-15T10:00:00Z',
  },
  // Add other mock clients here...
];

// Mock modules data with more detailed structure
const MOCK_MODULES = [
  { id: '1', name: 'CRM', status: 'active', lastUsed: '2024-01-15T14:30:00Z', description: 'Customer Relationship Management' },
  { id: '2', name: 'Sales Pipeline', status: 'active', lastUsed: '2024-01-15T12:15:00Z', description: 'Sales tracking and forecasting' },
  { id: '3', name: 'Email Marketing', status: 'inactive', lastUsed: '2024-01-10T09:00:00Z', description: 'Automated email campaigns' },
  { id: '4', name: 'Reports & Analytics', status: 'active', lastUsed: '2024-01-15T16:45:00Z', description: 'Business intelligence and reporting' },
];

// Mock available modules for adding
const AVAILABLE_MODULES = [
  { id: '5', name: 'Inventory Management', description: 'Track products and stock levels' },
  { id: '6', name: 'Task Management', description: 'Project and task tracking' },
  { id: '7', name: 'Document Management', description: 'File storage and sharing' },
];

// Mock activity logs
const MOCK_ACTIVITY_LOGS = [
  { id: '1', action: 'User Login', user: 'john@techcorp.com', timestamp: '2024-01-15T14:30:00Z', details: 'Successful login from 192.168.1.100' },
  { id: '2', action: 'Contact Created', user: 'jane@techcorp.com', timestamp: '2024-01-15T13:15:00Z', details: 'New contact: ABC Company' },
  { id: '3', action: 'Deal Updated', user: 'bob@techcorp.com', timestamp: '2024-01-15T12:00:00Z', details: 'Deal status changed to Closed Won' },
];

// Mock billing history
const MOCK_BILLING_HISTORY = [
  { id: '1', date: '2024-01-01', amount: 99, status: 'paid', invoiceNumber: 'INV-2024-001', description: 'Professional Plan - Monthly' },
  { id: '2', date: '2023-12-01', amount: 99, status: 'paid', invoiceNumber: 'INV-2023-012', description: 'Professional Plan - Monthly' },
  { id: '3', date: '2023-11-01', amount: 99, status: 'paid', invoiceNumber: 'INV-2023-011', description: 'Professional Plan - Monthly' },
];

// Mock package history
const MOCK_PACKAGE_HISTORY = [
  { id: '1', packageName: 'Professional Plan', startDate: '2023-06-15T10:00:00Z', endDate: null, status: 'active', price: 99 },
  { id: '2', packageName: 'Starter Plan', startDate: '2023-01-15T10:00:00Z', endDate: '2023-06-15T10:00:00Z', status: 'ended', price: 49 },
];

export const ClientProfilePage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [modules, setModules] = useState(MOCK_MODULES);
  
  // Modal states
  const [isAssignPackageModalOpen, setIsAssignPackageModalOpen] = useState(false);
  const [isRenewSubscriptionModalOpen, setIsRenewSubscriptionModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);

  // Find client by ID
  const client = MOCK_CLIENTS.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Client Not Found</h1>
          <Button onClick={() => navigate('/super-admin/clients')} className="mt-4">
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getStatusBadge = (status: Client['status']) => {
    const variants = {
      active: 'default',
      trial: 'secondary',
      suspended: 'destructive',
      expired: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  const handleLoginAsAdmin = () => {
    toast({
      title: "Login as Admin",
      description: `Logging in as admin for ${client.companyName}...`,
    });
    // Here you would typically redirect to the client's admin panel
    window.open(client.loginUrl || `https://${client.subdomain}.mycrm.com`, '_blank');
  };

  const handleInvoiceClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleToggleModule = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, status: module.status === 'active' ? 'inactive' : 'active' }
        : module
    ));
    
    const module = modules.find(m => m.id === moduleId);
    toast({
      title: "Module Updated",
      description: `${module?.name} has been ${module?.status === 'active' ? 'deactivated' : 'activated'}`,
    });
  };

  const handleAddModule = (moduleId: string) => {
    const availableModule = AVAILABLE_MODULES.find(m => m.id === moduleId);
    if (availableModule) {
      const newModule = {
        id: moduleId,
        name: availableModule.name,
        status: 'active' as const,
        lastUsed: new Date().toISOString(),
        description: availableModule.description,
      };
      setModules(prev => [...prev, newModule]);
      toast({
        title: "Module Added",
        description: `${availableModule.name} has been added and activated`,
      });
    }
  };

  const usersUsage = getUsagePercentage(client.usersCount, client.usersLimit);
  const contactsUsage = client.contactsCount && client.contactsLimit ? 
    getUsagePercentage(client.contactsCount, client.contactsLimit) : 0;
  const storageUsage = client.storageUsed && client.storageLimit ? 
    getUsagePercentage(client.storageUsed, client.storageLimit) : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Custom header with complex layout */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/super-admin/clients')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Building className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{client.companyName}</h1>
          <Badge variant={getStatusBadge(client.status) as any}>
            {client.status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Client profile and management for {client.companyName}
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleLoginAsAdmin}>
              <LogIn className="h-4 w-4 mr-2" />
              Login as Admin
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordResetModalOpen(true)}>
              <Key className="h-4 w-4 mr-2" />
              Send Password Reset
            </Button>
            <Button variant="outline" onClick={() => setIsAssignPackageModalOpen(true)}>
              <Package className="h-4 w-4 mr-2" />
              Assign Package
            </Button>
            <Button onClick={() => setIsRenewSubscriptionModalOpen(true)}>
              <Repeat className="h-4 w-4 mr-2" />
              Renew Subscription
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <span>Super Admin</span> / <span>Clients</span> / <span className="text-gray-900 dark:text-gray-100">{client.companyName}</span>
        </nav>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Stats</TabsTrigger>
          <TabsTrigger value="modules">Active Modules</TabsTrigger>
          <TabsTrigger value="activity">Activity & Audit</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</label>
                    <p className="text-gray-900 dark:text-gray-100">{client.companyName}</p>
                  </div>

                  {client.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </label>
                      <a 
                        href={client.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      >
                        {client.website}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}

                  {client.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Address
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">{client.address}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Date</label>
                    <p className="text-gray-900 dark:text-gray-100">{formatDate(client.registrationDate)}</p>
                  </div>

                  {client.subdomain && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subdomain</label>
                      <p className="text-gray-900 dark:text-gray-100">{client.subdomain}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 mr-2" />
                  Contact Person
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Name</label>
                    <p className="text-gray-900 dark:text-gray-100">{client.contactName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email Address
                    </label>
                    <a 
                      href={`mailto:${client.contactEmail}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {client.contactEmail}
                    </a>
                  </div>

                  {client.contactPhone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone Number
                      </label>
                      <a 
                        href={`tel:${client.contactPhone}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {client.contactPhone}
                      </a>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Last Activity
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{formatDate(client.lastActivity)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Package & Subscription History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="h-5 w-5 mr-2" />
                Package & Subscription History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_PACKAGE_HISTORY.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.packageName}</h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Current'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">${item.price}/month</p>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Users Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{client.usersCount}</span>
                    <span className="text-sm text-gray-500">of {client.usersLimit}</span>
                  </div>
                  <Progress value={usersUsage} className="h-3" />
                  <p className="text-sm text-gray-500">{usersUsage}% utilized</p>
                </div>
              </CardContent>
            </Card>

            {/* Contacts Usage */}
            {client.contactsCount && client.contactsLimit && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{client.contactsCount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">of {client.contactsLimit.toLocaleString()}</span>
                    </div>
                    <Progress value={contactsUsage} className="h-3" />
                    <p className="text-sm text-gray-500">{contactsUsage}% utilized</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Storage Usage */}
            {client.storageUsed && client.storageLimit && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <HardDrive className="h-5 w-5 mr-2" />
                    Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{client.storageUsed} GB</span>
                      <span className="text-sm text-gray-500">of {client.storageLimit} GB</span>
                    </div>
                    <Progress value={storageUsage} className="h-3" />
                    <p className="text-sm text-gray-500">{storageUsage}% utilized</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {/* Active Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="h-5 w-5 mr-2" />
                Active Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{module.name}</h3>
                      <p className="text-sm text-gray-500">{module.description}</p>
                      <p className="text-sm text-gray-500">Last used: {formatDate(module.lastUsed)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                        {module.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleModule(module.id)}
                      >
                        {module.status === 'active' ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Plus className="h-5 w-5 mr-2" />
                Available Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_MODULES.filter(am => !modules.find(m => m.id === am.id)).map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{module.name}</h3>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddModule(module.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity & Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_ACTIVITY_LOGS.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{log.action}</h4>
                        <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">by {log.user}</p>
                      <p className="text-sm text-gray-500 mt-1">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="h-5 w-5 mr-2" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_BILLING_HISTORY.map((bill) => (
                  <div 
                    key={bill.id} 
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleInvoiceClick(bill)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{bill.description}</h4>
                      <p className="text-sm text-gray-500">Invoice: {bill.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">{formatDate(bill.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">${bill.amount}</p>
                      <Badge variant={bill.status === 'paid' ? 'default' : 'destructive'}>
                        {bill.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BillingInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={selectedInvoice}
        clientName={client.companyName}
        clientEmail={client.contactEmail}
      />

      <AssignPackageModal
        isOpen={isAssignPackageModalOpen}
        onClose={() => setIsAssignPackageModalOpen(false)}
        client={client}
      />

      <RenewSubscriptionModal
        isOpen={isRenewSubscriptionModalOpen}
        onClose={() => setIsRenewSubscriptionModalOpen(false)}
        client={client}
      />

      <SendPasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
        client={client}
      />
    </div>
  );
};
