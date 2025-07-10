
import React, { useState } from 'react';
import { X, Eye, Download, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BillingInvoiceModal } from '../billing/BillingInvoiceModal';

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: string;
  invoiceNumber: string;
  description: string;
  dueDate?: string;
  clientAddress?: string;
  taxRate?: number;
  paymentTerms?: string;
  notes?: string;
}

interface ClientBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  clientEmail: string;
}

export const ClientBillingModal: React.FC<ClientBillingModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientEmail,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<BillingRecord | null>(null);

  // Mock billing history
  const billingHistory: BillingRecord[] = [
    {
      id: '1',
      date: '2024-01-01T00:00:00Z',
      amount: 99,
      status: 'paid',
      invoiceNumber: 'INV-2024-001',
      description: 'Professional Plan - Monthly',
      dueDate: '2024-01-15T00:00:00Z',
      paymentTerms: 'Payment due within 15 days',
    },
    {
      id: '2',
      date: '2023-12-01T00:00:00Z',
      amount: 99,
      status: 'paid',
      invoiceNumber: 'INV-2023-012',
      description: 'Professional Plan - Monthly',
      dueDate: '2023-12-15T00:00:00Z',
      paymentTerms: 'Payment due within 15 days',
    },
    {
      id: '3',
      date: '2023-11-01T00:00:00Z',
      amount: 99,
      status: 'overdue',
      invoiceNumber: 'INV-2023-011',
      description: 'Professional Plan - Monthly',
      dueDate: '2023-11-15T00:00:00Z',
      paymentTerms: 'Payment due within 15 days',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      cancelled: 'outline',
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const handleViewInvoice = (record: BillingRecord) => {
    setSelectedInvoice(record);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg">
              <CreditCard className="h-5 w-5 mr-2" />
              Billing History - {clientName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead>Invoice</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="font-medium">
                      {record.invoiceNumber}
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(record.amount)}
                    </TableCell>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.dueDate ? formatDate(record.dueDate) : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(record.status) as any}>
                        {record.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {billingHistory.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No billing history
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Billing records will appear here once transactions are made.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Modal */}
      <BillingInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        clientName={clientName}
        clientEmail={clientEmail}
      />
    </>
  );
};
