import React from 'react';
import { Calendar, DollarSign, Hash, MapPin, Phone, Mail, Building, Globe } from 'lucide-react';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentTerms?: string;
  notes?: string;
}

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  companyInfo = {
    name: 'CRM Platform',
    address: '123 Business St, Suite 100\nCity, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'billing@crm.com',
    website: 'www.crmplatform.com'
  }
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-700 bg-green-100 border-green-200';
      case 'sent': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'overdue': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
              <p className="text-blue-100 text-sm mt-1">Professional Services</p>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(invoice.status)}`}>
              {invoice.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Company and Invoice Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <Building className="h-4 w-4 mr-2 text-blue-600" />
                From
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="font-medium text-base">{companyInfo.name}</div>
                <div className="text-sm whitespace-pre-line">{companyInfo.address}</div>
                <div className="flex items-center text-sm mt-2 space-y-1">
                  <div className="flex items-center mr-4">
                    <Phone className="h-3 w-3 mr-1 text-blue-600" />
                    {companyInfo.phone}
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-3 w-3 mr-1 text-blue-600" />
                  {companyInfo.email}
                </div>
                {companyInfo.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-3 w-3 mr-1 text-blue-600" />
                    {companyInfo.website}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <Hash className="h-4 w-4 mr-2 text-blue-600" />
                Invoice Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Invoice Number:</span>
                  <span className="font-semibold text-gray-900">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Issue Date:</span>
                  <span className="font-semibold text-gray-900">{formatDate(invoice.date)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <span className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              Bill To
            </h3>
            <div className="text-gray-700">
              <div className="font-semibold text-lg text-gray-900 mb-1">{invoice.clientName}</div>
              <div className="text-sm text-gray-600 mb-1">{invoice.clientEmail}</div>
              {invoice.clientAddress && (
                <div className="text-sm text-gray-600 whitespace-pre-line">
                  {invoice.clientAddress}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 w-16">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 w-28">Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.rate)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-6">
          <div className="w-72">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Tax ({(invoice.taxRate * 100).toFixed(1)}%):</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between py-1">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms and Notes */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {invoice.paymentTerms && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-yellow-600" />
                Payment Terms
              </h4>
              <p className="text-gray-700 text-sm">{invoice.paymentTerms}</p>
            </div>
          )}

          {invoice.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700 text-sm">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-4">
              <h3 className="text-base font-semibold mb-2">Thank you for your business!</h3>
              <p className="text-blue-100 text-sm">
                Questions about this invoice? Contact us at {companyInfo.email} or {companyInfo.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
