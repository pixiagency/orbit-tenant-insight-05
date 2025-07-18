import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Download, 
  RefreshCw, 
  Search, 
  Filter, 
  X,
  DollarSign,
  CreditCard,
  TrendingUp,
  FileText
} from 'lucide-react';
import { BillingLogTable } from '../../components/billing-logs/BillingLogTable';
import { BillingLog } from '../../types/superadmin';
import { BillingLogFilters } from '../../types/superadmin';
import { PageHeader } from '../../components/layout/PageHeader';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { BillingInvoiceModal } from '../../components/billing/BillingInvoiceModal';
import { useToast } from '@/hooks/use-toast';

const MOCK_BILLING_LOGS: BillingLog[] = [
  {
    id: '1',
    clientId: 'client-1',
    clientName: 'Tech Solutions Inc.',
    type: 'payment',
    description: 'Subscription payment for March 2024',
    amount: 299.00,
    currency: 'USD',
    status: 'success',
    paymentMethod: 'Credit Card',
    transactionId: 'txn-12345',
    subscriptionId: 'sub-67890',
    processedAt: '2024-03-15T12:00:00Z',
    notes: 'Payment processed successfully.',
    invoiceNumber: 'INV-2024-001',
    retryCount: 0,
    billingDate: '2024-03-01T00:00:00Z',
    dueDate: '2024-03-15T00:00:00Z',
    paidAt: '2024-03-15T12:00:00Z',
  },
  {
    id: '2',
    clientId: 'client-2',
    clientName: 'Global Corp',
    type: 'refund',
    description: 'Partial refund for service downtime',
    amount: 50.00,
    currency: 'USD',
    status: 'success',
    paymentMethod: 'Credit Card',
    transactionId: 'txn-67890',
    subscriptionId: 'sub-12345',
    processedAt: '2024-03-10T15:30:00Z',
    notes: 'Refund processed due to service interruption.',
    invoiceNumber: 'INV-2024-002',
    retryCount: 0,
    billingDate: '2024-02-01T00:00:00Z',
    dueDate: '2024-02-15T00:00:00Z',
    paidAt: '2024-02-14T18:00:00Z',
  },
  {
    id: '3',
    clientId: 'client-3',
    clientName: 'Innovate Solutions',
    type: 'charge',
    description: 'Additional storage charge for February 2024',
    amount: 25.00,
    currency: 'USD',
    status: 'success',
    paymentMethod: 'Credit Card',
    transactionId: 'txn-23456',
    subscriptionId: 'sub-23456',
    processedAt: '2024-03-05T09:45:00Z',
    notes: 'Extra storage fee applied.',
    invoiceNumber: 'INV-2024-003',
    retryCount: 0,
    billingDate: '2024-02-01T00:00:00Z',
    dueDate: '2024-02-15T00:00:00Z',
    paidAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '4',
    clientId: 'client-4',
    clientName: 'Sunrise Marketing',
    type: 'payment',
    description: 'Subscription payment for February 2024',
    amount: 199.00,
    currency: 'USD',
    status: 'success',
    paymentMethod: 'Credit Card',
    transactionId: 'txn-34567',
    subscriptionId: 'sub-34567',
    processedAt: '2024-02-15T14:20:00Z',
    notes: 'Recurring payment processed.',
    invoiceNumber: 'INV-2024-004',
    retryCount: 0,
    billingDate: '2024-02-01T00:00:00Z',
    dueDate: '2024-02-15T00:00:00Z',
    paidAt: '2024-02-15T14:20:00Z',
  },
  {
    id: '5',
    clientId: 'client-5',
    clientName: 'Apex Solutions',
    type: 'charge',
    description: 'Overage charge for exceeding API calls in January 2024',
    amount: 35.00,
    currency: 'USD',
    status: 'success',
    paymentMethod: 'Credit Card',
    transactionId: 'txn-45678',
    subscriptionId: 'sub-45678',
    processedAt: '2024-02-05T11:10:00Z',
    notes: 'Additional charge for API usage.',
    invoiceNumber: 'INV-2024-005',
    retryCount: 0,
    billingDate: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-15T00:00:00Z',
    paidAt: '2024-02-05T11:10:00Z',
  },
];

const initialFilters: BillingLogFilters = {
  search: '',
  type: '',
  status: '',
  clientId: '',
  dateRange: {}
};

export const BillingLogsPage: React.FC = () => {
  const { toast } = useToast();
  const [billingLogs, setBillingLogs] = useState<BillingLog[]>(MOCK_BILLING_LOGS);
  const [filters, setFilters] = useState<BillingLogFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingLog | null>(null);

  // Calculate statistics
  const totalLogs = billingLogs.length;
  const successfulPayments = billingLogs.filter(log => log.status === 'success').length;
  const totalRevenue = billingLogs.reduce((sum, log) => sum + log.amount, 0);
  const pendingPayments = billingLogs.filter(log => log.status === 'pending').length;
  const failedPayments = billingLogs.filter(log => log.status === 'failed').length;
  const refunds = billingLogs.filter(log => log.type === 'refund').length;
  const charges = billingLogs.filter(log => log.type === 'charge').length;

  const handleFiltersChange = (newFilters: BillingLogFilters) => {
      setFilters(newFilters);
      // Apply filters to billing logs
      let filteredLogs = MOCK_BILLING_LOGS;

      if (newFilters.search) {
          filteredLogs = filteredLogs.filter(log =>
              log.clientName.toLowerCase().includes(newFilters.search.toLowerCase()) ||
              log.description.toLowerCase().includes(newFilters.search.toLowerCase())
          );
      }

      if (newFilters.type) {
          filteredLogs = filteredLogs.filter(log => log.type === newFilters.type);
      }

      if (newFilters.status) {
          filteredLogs = filteredLogs.filter(log => log.status === newFilters.status);
      }

      if (newFilters.clientId) {
          filteredLogs = filteredLogs.filter(log => log.clientId === newFilters.clientId);
      }

      if (newFilters.dateRange.from && newFilters.dateRange.to) {
          const fromDate = new Date(newFilters.dateRange.from);
          const toDate = new Date(newFilters.dateRange.to);
          filteredLogs = filteredLogs.filter(log => {
              const processedAt = new Date(log.processedAt);
              return processedAt >= fromDate && processedAt <= toDate;
          });
      }

      setBillingLogs(filteredLogs);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your invoice data is being exported to CSV format.",
    });
    console.log('Exporting billing logs...');
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Invoice data has been updated successfully.",
    });
    console.log('Refreshing billing logs...');
  };

  const handleDownloadInvoice = (log: BillingLog) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${log.invoiceNumber} as PDF`,
    });
    console.log('Downloading invoice for:', log.invoiceNumber);
  };

  const handleViewInvoice = (log: BillingLog) => {
    console.log('Viewing invoice for:', log.invoiceNumber);
    setSelectedInvoice(log);
  };

  const handleSendInvoice = (log: BillingLog) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${log.invoiceNumber} has been sent to ${log.clientName}`,
    });
    console.log('Sending invoice for:', log.invoiceNumber);
  };

  // Filter logs based on current filters
  const filteredLogs = billingLogs.filter(log => {
    const matchesSearch = log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesClient = clientFilter === 'all' || log.clientId === clientFilter;

    return matchesSearch && matchesType && matchesStatus && matchesClient;
  });

  const activeFiltersCount = [
    searchTerm,
    typeFilter !== 'all',
    statusFilter !== 'all',
    clientFilter !== 'all'
  ].filter(Boolean).length;

  const handleClearAll = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setClientFilter('all');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="Invoices"
        description="Monitor and manage all billing transactions, payments, and invoices"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Invoices' },
        ]}
        badge={`${filteredLogs.length} invoices`}
        showExportButton={true}
        onExportClick={handleExport}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Transactions"
          value={totalLogs.toLocaleString()}
          icon={FileText}
          gradient="from-blue-500 to-blue-600"
          change={{
            value: "+12.5% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Successful Payments"
          value={successfulPayments.toLocaleString()}
          icon={CreditCard}
          gradient="from-green-500 to-green-600"
          change={{
            value: `${Math.round((successfulPayments / totalLogs) * 100)}% success rate`,
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-purple-500 to-purple-600"
          change={{
            value: "+8.2% from last month",
            trend: "up"
          }}
        />
        <ModernKPICard
          title="Pending Payments"
          value={pendingPayments.toLocaleString()}
          icon={TrendingUp}
          gradient="from-orange-500 to-orange-600"
          change={{
            value: `${failedPayments} failed payments`,
            trend: "down"
          }}
        />
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Billing Log Filters</CardTitle>
              <CardDescription>Filter and search your billing logs</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search billing logs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="charge">Charge</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="client-1">Tech Solutions Inc.</SelectItem>
                <SelectItem value="client-2">Global Corp</SelectItem>
                <SelectItem value="client-3">Innovate Solutions</SelectItem>
                <SelectItem value="client-4">Sunrise Marketing</SelectItem>
                <SelectItem value="client-5">Apex Solutions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                </CardTitle>
                <CardDescription>
                  Apply detailed filters to narrow down billing logs
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Amount Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Min amount" type="number" />
                  <Input placeholder="Max amount" type="number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="charge">Charge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <BillingLogTable 
        logs={filteredLogs}
        onDownloadInvoice={handleDownloadInvoice}
        onViewInvoice={handleViewInvoice}
        onSendInvoice={handleSendInvoice}
      />

      {/* Invoice Modal */}
      {selectedInvoice && (
        <BillingInvoiceModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={{
            id: selectedInvoice.id,
            date: selectedInvoice.billingDate,
            amount: selectedInvoice.amount,
            status: selectedInvoice.status,
            invoiceNumber: selectedInvoice.invoiceNumber || '',
            description: selectedInvoice.description,
            dueDate: selectedInvoice.dueDate,
          }}
          clientName={selectedInvoice.clientName}
          clientEmail={`${selectedInvoice.clientName.toLowerCase().replace(/\s+/g, '.')}@example.com`}
        />
      )}
    </div>
  );
};
