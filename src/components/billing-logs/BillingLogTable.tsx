import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MoreHorizontal, Download, FileText, Send, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BillingLogExportModal } from './BillingLogExportModal';
import { BillingLog } from '../../types/superadmin';

interface BillingLogTableProps {
  logs: BillingLog[];
  onDownloadInvoice: (log: BillingLog) => void;
  onViewInvoice: (log: BillingLog) => void;
  onSendInvoice: (log: BillingLog) => void;
}

export interface BillingLogTableHandles {
  openExportModal: (open: boolean) => void;
}

type SortField = 'invoiceNumber' | 'clientName' | 'amount' | 'status' | 'billingDate' | 'dueDate';
type SortDirection = 'asc' | 'desc';

export const BillingLogTable = forwardRef<BillingLogTableHandles, BillingLogTableProps>(({
  logs,
  onDownloadInvoice,
  onViewInvoice,
  onSendInvoice,
}, ref) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('billingDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openExportModal: setIsExportModalOpen,
  }));

  // Sort logs
  const sortedLogs = [...logs].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'invoiceNumber':
        aValue = a.invoiceNumber.toLowerCase();
        bValue = b.invoiceNumber.toLowerCase();
        break;
      case 'clientName':
        aValue = a.clientName.toLowerCase();
        bValue = b.clientName.toLowerCase();
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'billingDate':
        aValue = new Date(a.billingDate).getTime();
        bValue = new Date(b.billingDate).getTime();
        break;
      case 'dueDate':
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = sortedLogs.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-150',
      pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-150',
      failed: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-150',
    };

    return (
      <Badge className={variants[status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              currentPage === i
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      items.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            currentPage === 1
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        items.push(
          <span key="ellipsis1" className="px-2 py-1 text-xs text-gray-400">
            ...
          </span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              currentPage === i
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <span key="ellipsis2" className="px-2 py-1 text-xs text-gray-400">
            ...
          </span>
        );
      }

      if (totalPages > 1) {
        items.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              currentPage === totalPages
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return items;
  };

  const handleExport = (format: string, fields: string[], language: string) => {
    console.log('Exporting billing logs:', { format, fields, language, count: logs.length });
    // Here you would implement the actual export logic
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900/50 h-12">
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('invoiceNumber')}
                >
                  <div className="flex items-center">
                    Invoice #
                    {renderSortIcon('invoiceNumber')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('clientName')}
                >
                  <div className="flex items-center">
                    Client
                    {renderSortIcon('clientName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {renderSortIcon('amount')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {renderSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100 h-12">
                  Payment Method
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('billingDate')}
                >
                  <div className="flex items-center">
                    Billing Date
                    {renderSortIcon('billingDate')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">
                    Due Date
                    {renderSortIcon('dueDate')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-16">
                  <TableCell className="h-16">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {log.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {log.description}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onViewInvoice(log)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDownloadInvoice(log)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onSendInvoice(log)}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{log.clientName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{log.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <span className="font-medium">{formatCurrency(log.amount, log.currency)}</span>
                  </TableCell>
                  <TableCell className="h-16">
                    {getStatusBadge(log.status)}
                  </TableCell>
                  <TableCell className="h-16 text-gray-600 dark:text-gray-300">
                    {log.paymentMethod}
                  </TableCell>
                  <TableCell className="h-16 text-gray-600 dark:text-gray-300">
                    {formatDate(log.billingDate)}
                  </TableCell>
                  <TableCell className="h-16 text-gray-600 dark:text-gray-300">
                    {formatDate(log.dueDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {logs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No billing logs</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Billing logs will appear here once transactions are processed.
              </p>
            </div>
          )}
        </div>

        {logs.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col items-center xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
              {/* LEFT: Info section */}
              <div className="flex flex-col items-center xs:flex-row xs:items-center xs:space-x-4 space-y-1 xs:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Rows per page:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-16 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                </span>
              </div>
              {/* RIGHT: Compact Pagination controls */}
              <div className="flex justify-center xs:justify-end">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md text-sm transition-colors ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {renderPaginationItems()}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md text-sm transition-colors ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BillingLogExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        logs={logs}
        onExport={handleExport}
      />
    </div>
  );
});

BillingLogTable.displayName = 'BillingLogTable';
