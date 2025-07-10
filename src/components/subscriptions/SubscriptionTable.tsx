import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MoreHorizontal, Eye, Edit, X, RotateCcw, Calendar, DollarSign, ChevronUp, ChevronDown, Download, ExternalLink, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Subscription } from '../../types/superadmin';
import { SubscriptionExportModal } from './SubscriptionExportModal';
import { exportSubscriptions } from '../../utils/exportUtils';
import { useToast } from '../../hooks/use-toast';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onCancel: (id: string) => void;
  onRenew: (subscription: Subscription) => void;
  onView: (subscription: Subscription) => void;
  onBulkAction?: (action: 'cancel' | 'renew', selectedIds: string[]) => void;
}

export interface SubscriptionTableHandles {
  openExportModal: (exportAll: boolean) => void;
}

type SortField = 'clientName' | 'packageName' | 'activationMethod' | 'status' | 'startDate' | 'endDate' | 'paymentStatus' | 'lastUpdated';
type SortDirection = 'asc' | 'desc';

export const SubscriptionTable = forwardRef<SubscriptionTableHandles, SubscriptionTableProps>(({
  subscriptions,
  onEdit,
  onCancel,
  onRenew,
  onView,
  onBulkAction,
}, ref) => {
  const { toast } = useToast();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('clientName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [exportModal, setExportModal] = useState<{
    isOpen: boolean;
    exportAll: boolean;
  }>({
    isOpen: false,
    exportAll: false,
  });

  // Sort subscriptions
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'clientName':
        aValue = a.clientName.toLowerCase();
        bValue = b.clientName.toLowerCase();
        break;
      case 'packageName':
        aValue = a.packageName.toLowerCase();
        bValue = b.packageName.toLowerCase();
        break;
      case 'activationMethod':
        aValue = a.activationMethod;
        bValue = b.activationMethod;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'paymentStatus':
        aValue = a.paymentStatus;
        bValue = b.paymentStatus;
        break;
      case 'startDate':
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
        break;
      case 'endDate':
        aValue = a.endDate ? new Date(a.endDate).getTime() : 0;
        bValue = b.endDate ? new Date(b.endDate).getTime() : 0;
        break;
      case 'lastUpdated':
        aValue = new Date(a.lastUpdated).getTime();
        bValue = new Date(b.lastUpdated).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedSubscriptions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubscriptions = sortedSubscriptions.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedSubscriptions(checked ? currentSubscriptions.map(sub => sub.id) : []);
  };

  const handleSelectSubscription = (subscriptionId: string, checked: boolean) => {
    setSelectedSubscriptions(prev =>
      checked
        ? [...prev, subscriptionId]
        : prev.filter(id => id !== subscriptionId)
    );
  };

  const handleBulkCancel = () => {
    if (onBulkAction) {
      onBulkAction('cancel', selectedSubscriptions);
    }
  };

  const handleBulkRenew = () => {
    if (onBulkAction) {
      onBulkAction('renew', selectedSubscriptions);
    }
  };

  const handleExport = (format: string, fields: string[], language: string) => {
    try {
      const subscriptionsToExport = exportModal.exportAll ? subscriptions : subscriptions.filter(sub => selectedSubscriptions.includes(sub.id));
      
      if (subscriptionsToExport.length === 0) {
        toast({
          title: "No Data to Export",
          description: "Please select subscriptions to export or use 'Export All' option.",
          variant: "destructive",
        });
        return;
      }

      exportSubscriptions(subscriptionsToExport, format as 'csv' | 'excel' | 'pdf' | 'json');
      
      toast({
        title: "Export Successful",
        description: `${subscriptionsToExport.length} subscription(s) exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      });
    }
  };

  const openExportModal = (exportAll: boolean = false) => {
    setExportModal({ isOpen: true, exportAll });
  };

  useImperativeHandle(ref, () => ({
    openExportModal,
  }));

  const closeExportModal = () => {
    setExportModal({ isOpen: false, exportAll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedSubscriptions([]);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    setSelectedSubscriptions([]);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-150',
      expired: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-150',
      cancelled: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150',
      suspended: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-150',
    };

    return (
      <Badge className={`cursor-pointer ${variants[status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-150',
      unpaid: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-150',
      'not-applicable': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150',
    };

    const labels: Record<string, string> = {
      paid: 'Paid',
      unpaid: 'Unpaid',
      'not-applicable': 'N/A',
    };

    return (
      <Badge className={`cursor-pointer ${variants[status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150'}`}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getActivationMethodBadge = (method: string) => {
    const variants: Record<string, string> = {
      manual: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150',
      'activation-code': 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors duration-150',
      stripe: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-150',
      api: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-150',
    };

    const labels: Record<string, string> = {
      manual: 'Manual',
      'activation-code': 'Code',
      stripe: 'Stripe',
      api: 'API',
    };

    return (
      <Badge className={`cursor-pointer ${variants[method] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150'}`}>
        {labels[method] || method}
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

  const getDaysUntilExpiration = (endDate?: string) => {
    if (!endDate) return null;
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Header with bulk actions */}
        {selectedSubscriptions.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedSubscriptions.length} subscription(s) selected
              </span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openExportModal(false)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel Selected
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkRenew}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Renew Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900/50 h-12">
                <TableHead className="w-16 h-12 px-4">
                  <Checkbox
                    checked={selectedSubscriptions.length === currentSubscriptions.length && currentSubscriptions.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none min-w-[250px]"
                  onClick={() => handleSort('clientName')}
                >
                  <div className="flex items-center">
                    Client
                    {renderSortIcon('clientName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none min-w-[150px]"
                  onClick={() => handleSort('packageName')}
                >
                  <div className="flex items-center">
                    Package
                    {renderSortIcon('packageName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('activationMethod')}
                >
                  <div className="flex items-center">
                    Activation
                    {renderSortIcon('activationMethod')}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100 h-12">
                  Source
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('startDate')}
                >
                  <div className="flex items-center">
                    Start Date
                    {renderSortIcon('startDate')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('endDate')}
                >
                  <div className="flex items-center">
                    End Date
                    {renderSortIcon('endDate')}
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
                  Auto Renew
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('paymentStatus')}
                >
                  <div className="flex items-center">
                    Payment
                    {renderSortIcon('paymentStatus')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('lastUpdated')}
                >
                  <div className="flex items-center">
                    Last Updated
                    {renderSortIcon('lastUpdated')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubscriptions.map((subscription) => {
                const daysUntilExpiry = getDaysUntilExpiration(subscription.endDate);
                const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                
                return (
                  <TableRow key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-16">
                    <TableCell className="h-16 px-4">
                      <Checkbox
                        checked={selectedSubscriptions.includes(subscription.id)}
                        onCheckedChange={(checked) => handleSelectSubscription(subscription.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="h-16">
                      <div className="flex items-center justify-between min-w-0">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {subscription.clientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            ID: {subscription.clientId}
                          </div>
                        </div>
                        <div className="ml-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => onView(subscription)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {!subscription.isReadOnly && (
                                <DropdownMenuItem onClick={() => onEdit(subscription)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {subscription.externalBillingUrl && (
                                <DropdownMenuItem onClick={() => window.open(subscription.externalBillingUrl, '_blank')}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Billing History
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onRenew(subscription)}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Renew
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onCancel(subscription.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="h-16">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {subscription.packageName}
                      </div>
                    </TableCell>
                    <TableCell className="h-16">
                      {getActivationMethodBadge(subscription.activationMethod)}
                    </TableCell>
                    <TableCell className="h-16 text-gray-600 dark:text-gray-300">
                      {subscription.source}
                    </TableCell>
                    <TableCell className="h-16 text-gray-600 dark:text-gray-300">
                      {formatDate(subscription.startDate)}
                    </TableCell>
                    <TableCell className="h-16">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 dark:text-gray-300">
                          {subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}
                        </span>
                        {isExpiringSoon && (
                          <div className="flex items-center text-orange-600 dark:text-orange-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span className="text-xs">{daysUntilExpiry}d</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="h-16 group">
                      <div className="group-hover:scale-105 transition-transform duration-200">
                        {getStatusBadge(subscription.status)}
                      </div>
                    </TableCell>
                    <TableCell className="h-16">
                      <Badge variant={subscription.autoRenew ? 'default' : 'secondary'}>
                        {subscription.autoRenew ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell className="h-16 group">
                      <div className="group-hover:scale-105 transition-transform duration-200">
                        {getPaymentStatusBadge(subscription.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell className="h-16 text-gray-600 dark:text-gray-300">
                      {formatDate(subscription.lastUpdated)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {subscriptions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No subscriptions</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new subscription.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {subscriptions.length > 0 && (
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

      <SubscriptionExportModal
        isOpen={exportModal.isOpen}
        onClose={closeExportModal}
        onExport={handleExport}
      />
    </div>
  );
});
