import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ClientFiltersRefactored } from './ClientFiltersRefactored';
import { Client } from '../../types/superadmin';

// Sample client data for demonstration
const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    companyName: 'TechStart Inc',
    contactName: 'John Smith',
    contactEmail: 'john@techstart.com',
    contactPhone: '555-0101',
    subdomain: 'techstart',
    status: 'active',
    packageId: '1',
    packageName: 'Starter Plan',
    subscriptionStartDate: '2024-01-15',
    subscriptionEndDate: '2024-12-15',
    monthlyRevenue: 299,
    totalUsers: 8,
    storageUsed: 2.5,
    createdAt: '2024-01-15',
    lastLogin: '2024-02-25',
    website: 'https://techstart.com',
    address: '123 Tech Street, Silicon Valley',
    companySize: '10-50',
    industry: 'Technology',
    usersCount: 8,
    usersLimit: 10,
    contactsCount: 45,
    contactsLimit: 100,
    storageLimit: 5,
    callMinutesUsed: 1200,
    callMinutesLimit: 2000,
    lastActivity: '2024-02-25',
  },
  {
    id: '2',
    companyName: 'Marketing Pro',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@marketingpro.com',
    contactPhone: '555-0202',
    subdomain: 'marketingpro',
    status: 'trial',
    packageId: '2',
    packageName: 'Professional Plan',
    subscriptionStartDate: '2024-02-01',
    subscriptionEndDate: '2024-03-01',
    monthlyRevenue: 0,
    totalUsers: 15,
    storageUsed: 8.2,
    createdAt: '2024-02-01',
    lastLogin: '2024-02-24',
    website: 'https://marketingpro.com',
    address: '456 Marketing Ave, New York',
    companySize: '50-200',
    industry: 'Marketing',
    usersCount: 15,
    usersLimit: 20,
    contactsCount: 180,
    contactsLimit: 500,
    storageLimit: 10,
    callMinutesUsed: 2800,
    callMinutesLimit: 3000,
    lastActivity: '2024-02-24',
  },
  {
    id: '3',
    companyName: 'Global Enterprises',
    contactName: 'Michael Brown',
    contactEmail: 'michael@globalenterprises.com',
    contactPhone: '555-0303',
    subdomain: 'globalenterprises',
    status: 'active',
    packageId: '3',
    packageName: 'Enterprise Plan',
    subscriptionStartDate: '2023-11-01',
    subscriptionEndDate: '2024-10-31',
    monthlyRevenue: 999,
    totalUsers: 45,
    storageUsed: 25.8,
    createdAt: '2023-11-01',
    lastLogin: '2024-02-26',
    website: 'https://globalenterprises.com',
    address: '789 Enterprise Blvd, Chicago',
    companySize: '200+',
    industry: 'Finance',
    usersCount: 45,
    usersLimit: 50,
    contactsCount: 850,
    contactsLimit: 1000,
    storageLimit: 50,
    callMinutesUsed: 4500,
    callMinutesLimit: 5000,
    lastActivity: '2024-02-26',
  },
  {
    id: '4',
    companyName: 'Small Business Solutions',
    contactName: 'Lisa Davis',
    contactEmail: 'lisa@sbsolutions.com',
    contactPhone: '555-0404',
    subdomain: 'sbsolutions',
    status: 'inactive',
    packageId: '1',
    packageName: 'Starter Plan',
    subscriptionStartDate: '2023-08-01',
    subscriptionEndDate: '2024-01-31',
    monthlyRevenue: 0,
    totalUsers: 3,
    storageUsed: 1.2,
    createdAt: '2023-08-01',
    lastLogin: '2024-01-15',
    website: 'https://sbsolutions.com',
    address: '321 Small Business Lane, Austin',
    companySize: '1-10',
    industry: 'Consulting',
    usersCount: 3,
    usersLimit: 5,
    contactsCount: 25,
    contactsLimit: 50,
    storageLimit: 2,
    callMinutesUsed: 400,
    callMinutesLimit: 1000,
    lastActivity: '2024-01-15',
  },
  {
    id: '5',
    companyName: 'Innovation Labs',
    contactName: 'David Wilson',
    contactEmail: 'david@innovationlabs.com',
    contactPhone: '555-0505',
    subdomain: 'innovationlabs',
    status: 'active',
    packageId: '2',
    packageName: 'Professional Plan',
    subscriptionStartDate: '2024-01-01',
    subscriptionEndDate: '2024-12-31',
    monthlyRevenue: 599,
    totalUsers: 22,
    storageUsed: 12.5,
    createdAt: '2024-01-01',
    lastLogin: '2024-02-27',
    website: 'https://innovationlabs.com',
    address: '654 Innovation Drive, Seattle',
    companySize: '50-200',
    industry: 'Technology',
    usersCount: 22,
    usersLimit: 25,
    contactsCount: 320,
    contactsLimit: 500,
    storageLimit: 15,
    callMinutesUsed: 3200,
    callMinutesLimit: 3500,
    lastActivity: '2024-02-27',
  },
];

export const ClientFiltersDemo: React.FC = () => {
  const [filteredClients, setFilteredClients] = useState<Client[]>(SAMPLE_CLIENTS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage <= 25) return 'text-green-600';
    if (percentage <= 75) return 'text-yellow-600';
    if (percentage <= 100) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Filters Demo</h1>
        <p className="text-gray-600">
          This demo shows the ClientFiltersRefactored component in action with sample data.
        </p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Client Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientFiltersRefactored
            clients={SAMPLE_CLIENTS}
            onFilteredClientsChange={setFilteredClients}
            className="mb-4"
          />
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            Filtered Results ({filteredClients.length} of {SAMPLE_CLIENTS.length} clients)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{client.companyName}</h3>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Contact:</span> {client.contactName}
                        <br />
                        <span className="text-gray-600">{client.contactEmail}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Package:</span> {client.packageName}
                        <br />
                        <span className="text-gray-600">${client.monthlyRevenue}/month</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Usage:</span>
                        <br />
                        <span className={getUsageColor(getUsagePercentage(client.usersCount, client.usersLimit))}>
                          {client.usersCount}/{client.usersLimit} users ({getUsagePercentage(client.usersCount, client.usersLimit)}%)
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Industry:</span> {client.industry}
                        <br />
                        <span className="text-gray-600">{client.companySize}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Last Activity:</span>
                        <br />
                        <span className="text-gray-600">
                          {new Date(client.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Storage:</span>
                        <br />
                        <span className={getUsageColor(getUsagePercentage(client.storageUsed, client.storageLimit))}>
                          {client.storageUsed}GB/{client.storageLimit}GB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No clients match the current filters. Try adjusting your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
