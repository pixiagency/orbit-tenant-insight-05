import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Search, Users, TrendingUp, UserPlus, Download, Grid3X3, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { ContactDrawerForm } from '../../components/contacts/ContactDrawerForm';
import { ContactTable } from '../../components/contacts/ContactTable';
import { toast } from 'sonner';

// Sample contact data
const contactsData = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    title: 'IT Director',
    type: 'lead' as const,
    status: 'active' as const,
    assignedTo: 'Sarah Johnson',
    createdDate: '2024-01-15',
    lastContact: '2024-01-18',
    notes: 'Key decision maker for IT solutions'
  },
  {
    id: '2',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@startup.com',
    phone: '+1 (555) 987-6543',
    company: 'StartupXYZ',
    title: 'CEO',
    type: 'customer' as const,
    status: 'active' as const,
    assignedTo: 'Mike Chen',
    createdDate: '2024-01-18',
    lastContact: '2024-01-20',
    notes: 'CEO of growing startup'
  },
];

export const ContactsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [view, setView] = useState('table');

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsDrawerOpen(true);
  };

  const handleEditContact = (contact: any) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  const handleSaveContact = (contactData: any) => {
    if (selectedContact) {
      toast.success('Contact updated successfully');
    } else {
      toast.success('Contact created successfully');
    }
    setIsDrawerOpen(false);
    setSelectedContact(null);
  };

  const filteredContacts = contactsData.filter(contact =>
    `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.company}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: contactsData.length,
    active: contactsData.filter(c => c.status === 'active').length,
    leads: contactsData.filter(c => c.type === 'lead').length,
    customers: contactsData.filter(c => c.type === 'customer').length,
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage and organize all your business contacts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddContact}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ModernKPICard
          title="Total Contacts"
          value={stats.total.toString()}
          description="All contacts in system"
          icon={Users}
          change={{ value: '+12%', trend: 'up' }}
        />
        <ModernKPICard
          title="Active Contacts"
          value={stats.active.toString()}
          description="Currently active contacts"
          icon={UserPlus}
          change={{ value: '+8%', trend: 'up' }}
        />
        <ModernKPICard
          title="Leads"
          value={stats.leads.toString()}
          description="Potential customers"
          icon={TrendingUp}
          change={{ value: '+15%', trend: 'up' }}
        />
        <ModernKPICard
          title="Customers"
          value={stats.customers.toString()}
          description="Converted customers"
          icon={Users}
          change={{ value: '+5%', trend: 'up' }}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Contacts</CardTitle>
              <CardDescription>
                Manage your contact database with advanced filtering and search
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('table')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Contact Table */}
          <ContactTable 
            contacts={filteredContacts}
            onEditContact={handleEditContact}
          />
        </CardContent>
      </Card>

      {/* Contact Form Drawer */}
      <ContactDrawerForm
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </div>
  );
};