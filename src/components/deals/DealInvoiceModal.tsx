import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Mail, 
  Printer,
  Building,
  Calendar,
  DollarSign,
  User,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  closeDate: string;
  assignedTo: string;
  source: string;
  description: string;
  lastActivity: string;
  payment_status?: 'paid' | 'pending' | 'partial';
  partial_amount?: number;
  due_amount?: number;
}

interface DealInvoiceModalProps {
  deal: Deal;
  children: React.ReactNode;
}

export const DealInvoiceModal: React.FC<DealInvoiceModalProps> = ({ deal, children }) => {
  const handleDownloadPDF = () => {
    // Simulate PDF download
    toast.success('Invoice PDF downloaded successfully');
  };

  const handleSendToCustomer = () => {
    // Simulate sending email
    toast.success('Invoice sent to customer successfully');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Invoice printed');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice - {deal.title}
          </DialogTitle>
          <DialogDescription>
            View and manage invoice for this deal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2 print:hidden">
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleSendToCustomer}>
              <Mail className="h-4 w-4 mr-2" />
              Send to Customer
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Invoice Content */}
          <Card className="print:shadow-none print:border-none">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">INVOICE</CardTitle>
                  <p className="text-muted-foreground mt-1">#{deal.id}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-lg">Your Company Name</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Business Street<br />
                    City, State 12345<br />
                    contact@company.com
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Bill To:
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium">{deal.company}</p>
                    <p className="text-sm text-muted-foreground">{deal.contact}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Invoice Details:
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Invoice Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>{deal.closeDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales Rep:</span>
                      <span>{deal.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Payment Status:</span>
                </div>
                {deal.payment_status && (
                  <Badge className={getPaymentStatusColor(deal.payment_status)}>
                    {deal.payment_status === 'partial' && deal.partial_amount 
                      ? `Partial (${formatCurrency(deal.partial_amount)})`
                      : deal.payment_status.charAt(0).toUpperCase() + deal.payment_status.slice(1)
                    }
                  </Badge>
                )}
              </div>

              {/* Invoice Items */}
              <div>
                <h4 className="font-semibold mb-4">Invoice Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3 text-right">Quantity</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{deal.title}</p>
                            <p className="text-sm text-muted-foreground">{deal.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">1</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(deal.value)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(deal.value)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <Separator />
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(deal.value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%):</span>
                      <span>$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(deal.value)}</span>
                    </div>
                    {deal.payment_status === 'partial' && deal.partial_amount && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span>Paid:</span>
                          <span>{formatCurrency(deal.partial_amount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-orange-600">
                          <span>Due:</span>
                          <span>{formatCurrency(deal.due_amount || deal.value - deal.partial_amount)}</span>
                        </div>
                      </>
                    )}
                    {deal.payment_status === 'pending' && (
                      <div className="flex justify-between font-bold text-yellow-600">
                        <span>Amount Due:</span>
                        <span>{formatCurrency(deal.value)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Payment Terms & Notes</h4>
                <p className="text-sm text-muted-foreground">
                  Payment is due within 30 days of invoice date. Late payments may incur additional fees.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Thank you for your business!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};