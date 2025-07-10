
import React from 'react';
import { X, Download, Mail, FileText, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InvoiceTemplate } from './InvoiceTemplate';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  description: string;
  packageName: string;
  paymentMethod?: string;
  paidAt?: string;
}

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  if (!invoice) return null;

  // Transform to invoice template format
  const invoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.date,
    dueDate: invoice.dueDate,
    clientName: 'TechCorp Inc.',
    clientEmail: 'john@techcorp.com',
    clientAddress: '123 Tech Street, Silicon Valley, CA',
    items: [
      {
        description: invoice.description,
        quantity: 1,
        rate: invoice.amount,
        amount: invoice.amount,
      }
    ],
    subtotal: invoice.amount,
    taxRate: 0,
    taxAmount: 0,
    total: invoice.amount,
    status: invoice.status,
    paymentTerms: 'Payment due within 30 days',
    notes: undefined,
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleDownload = () => {
    console.log('Download invoice:', invoice.invoiceNumber);
  };

  const handleSendEmail = () => {
    console.log('Send invoice email:', invoice.invoiceNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <div className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                  <FileText className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                    Invoice {invoice.invoiceNumber}
                  </DialogTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{formatDate(invoice.date)}</span>
                    <span>•</span>
                    <span className="font-medium">${invoice.amount}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`${getStatusBadge(invoice.status)} border font-medium px-4 py-2 text-sm`}>
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* Enhanced Action Bar */}
          <div className="flex items-center justify-between mt-6 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleDownload} size="sm" className="shadow-sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleSendEmail} size="sm" className="shadow-sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Due: {formatDate(invoice.dueDate)}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-8 bg-gray-50">
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <InvoiceTemplate invoice={invoiceData} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
