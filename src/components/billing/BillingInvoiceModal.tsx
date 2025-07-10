import React, { useState } from 'react';
import { Download, Mail, FileText, Calendar, DollarSign, Eye, Edit, Printer, Send, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { InvoiceTemplate } from './InvoiceTemplate';

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

interface BillingInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: BillingRecord | null;
  clientName: string;
  clientEmail: string;
}

export const BillingInvoiceModal: React.FC<BillingInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  clientName,
  clientEmail,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(false);

  if (!invoice) return null;

  // Transform billing record to invoice data
  const invoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.date,
    dueDate: invoice.dueDate || invoice.date,
    clientName,
    clientEmail,
    clientAddress: invoice.clientAddress,
    items: [
      {
        description: invoice.description,
        quantity: 1,
        rate: invoice.amount,
        amount: invoice.amount,
      }
    ],
    subtotal: invoice.amount,
    taxRate: invoice.taxRate || 0,
    taxAmount: (invoice.amount * (invoice.taxRate || 0)),
    total: invoice.amount * (1 + (invoice.taxRate || 0)),
    status: invoice.status as 'draft' | 'sent' | 'paid' | 'overdue',
    paymentTerms: invoice.paymentTerms || 'Payment due within 30 days',
    notes: invoice.notes,
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Invoice Sent Successfully",
        description: `Invoice ${invoice.invoiceNumber} has been sent to ${clientEmail}`,
      });
    } catch (error) {
      toast({
        title: "Failed to Send Invoice",
        description: "There was an error sending the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoice.invoiceNumber} as PDF`,
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: `Invoice ${invoice.invoiceNumber} ready for printing`,
    });
  };

  const handleCopyLink = () => {
    const invoiceUrl = `${window.location.origin}/invoice/${invoice.invoiceNumber}`;
    navigator.clipboard.writeText(invoiceUrl);
    toast({
      title: "Link Copied",
      description: "Invoice link has been copied to clipboard",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${invoice.invoiceNumber}`,
        text: `View invoice from ${clientName}`,
        url: `${window.location.origin}/invoice/${invoice.invoiceNumber}`,
      });
    } else {
      handleCopyLink();
    }
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
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div> 
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Invoice {invoice.invoiceNumber}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {clientName} • {formatDate(invoice.date)}
                </p>
              </div> 
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusBadge(invoice.status)} border font-medium px-3 py-1`}>
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b flex-shrink-0">
          <div className="flex items-center space-x-2"> 
            <Button variant="outline" onClick={handlePrint} size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleCopyLink} size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" onClick={handleShare} size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <Button 
            onClick={handleSendEmail} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send to Customer'}
          </Button>
        </div>

        {/* Tabs Container */}
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0 mx-6 mt-4">
              <TabsTrigger value="preview" className="flex items-center gap-2"> 
                <Eye className="h-4 w-4" />
                Invoice Preview
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Invoice Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 overflow-hidden p-6 pt-4">
              <ScrollArea className="h-full w-full">
                <div className="print:shadow-none">
                  <InvoiceTemplate invoice={invoiceData} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="details" className="flex-1 overflow-auto p-6 pt-4">
              <div className="space-y-6 bg-white rounded-lg border p-6">
                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    Client Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Client Name</label>
                        <p className="text-gray-900 font-medium">{clientName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <p className="text-gray-900">{clientEmail}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div> 
                          <Badge className={`${getStatusBadge(invoice.status)} border font-medium`}>
                            {invoice.status.toUpperCase()}
                          </Badge>
                        </div> 
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                        <p className="text-2xl font-bold text-blue-600">
                          ${invoiceData.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />
                
                {/* Invoice Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Invoice Details
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                      <p className="text-gray-900 font-mono">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Issue Date</label>
                      <p className="text-gray-900">{formatDate(invoice.date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Due Date</label>
                      <p className="text-gray-900">{formatDate(invoice.dueDate || invoice.date)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Service Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-500">Description</label>
                        <p className="text-gray-900 mt-1">{invoice.description}</p>
                      </div>
                      <div> 
                        <label className="font-medium text-gray-500">Quantity</label>
                        <p className="text-gray-900 mt-1">1</p>
                      </div> 
                      <div>
                        <label className="font-medium text-gray-500">Rate</label>
                        <p className="text-gray-900 mt-1">${invoice.amount.toFixed(2)}</p>
                      </div> 
                      <div>
                        <label className="font-medium text-gray-500">Amount</label>
                        <p className="text-gray-900 font-semibold mt-1">${invoice.amount.toFixed(2)}</p>
                      </div> 
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                {invoice.paymentTerms && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Payment Terms</h3>
                      <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        {invoice.paymentTerms}
                      </p>
                    </div>
                  </>
                )}
             
                {/* Notes */}
                {invoice.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Notes</h3>
                      <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        {invoice.notes}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
