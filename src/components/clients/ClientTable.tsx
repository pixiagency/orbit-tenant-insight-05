import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, Edit, Trash2, Eye, UserX, Building, Phone, Mail, Clock, Users, ChevronUp, ChevronDown, 
  UserCheck, UserPlus, Key, Download, RefreshCw, Package, Play, TrendingUp, TrendingDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Client } from '../../types/superadmin';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../contexts/LanguageContext';

interface ClientTableProps {
  clients: Client[];
  selectedClients: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
}

export interface ClientTableHandles {
  // Remove export modal methods since we're handling export at page level
}

type SortField = 'companyName' | 'contactName' | 'status' | 'packageName' | 'monthlyRevenue' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const ClientTable = forwardRef<ClientTableHandles, ClientTableProps>(({
  clients,
  selectedClients,
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkAction,
}, ref) => {
  const navigate = useNavigate();
  const { isRTL, translate } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useImperativeHandle(ref, () => ({}));

  // Sort clients
  const sortedClients = [...clients].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'companyName':
        aValue = a.companyName.toLowerCase();
        bValue = b.companyName.toLowerCase();
        break;
      case 'contactName':
        aValue = a.contactName.toLowerCase();
        bValue = b.contactName.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'packageName':
        aValue = (a.packageName || '').toLowerCase();
        bValue = (b.packageName || '').toLowerCase();
        break;
      case 'monthlyRevenue':
        aValue = a.monthlyRevenue || 0;
        bValue = b.monthlyRevenue || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalItems = sortedClients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = sortedClients.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? currentClients.map(client => client.id) : []);
  };

  const handleSelectClient = (clientId: string, checked: boolean) => {
    onSelectionChange(
      checked
        ? [...selectedClients, clientId]
        : selectedClients.filter(id => id !== clientId)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onSelectionChange([]);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    onSelectionChange([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge 
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-150"
          >
            {translate('Active')}
          </Badge>
        );
      case 'trial':
        return (
          <Badge 
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150"
          >
            {translate('Trial')}
          </Badge>
        );
      case 'suspended':
        return (
          <Badge 
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-150"
          >
            {translate('Suspended')}
          </Badge>
        );
      case 'expired':
        return (
          <Badge 
            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-150"
          >
            {translate('Expired')}
          </Badge>
        );
      default:
        return (
          <Badge 
            className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150"
          >
            {translate(status)}
          </Badge>
        );
    }
  };

  const canAddTrialDays = (client: Client) => {
    return (client.status === 'active' || client.status === 'trial') && !client.hasTrialDays;
  };

  const handleLoginAsCustomer = (client: Client) => {
    const loginUrl = client.loginUrl || `https://${client.subdomain}.mycrm.com`;
    window.open(loginUrl, '_blank');
  };

  const handleBulkExport = () => {
    onBulkAction?.('export', selectedClients);
  };

  const handleBulkNewSubscription = () => {
    onBulkAction?.('new-subscription', selectedClients);
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
        {selectedClients.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}> 
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedClients.length} {translate('client(s) selected')}
              </span>
              <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}> 
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBulkNewSubscription}
                >
                  <Package className={isRTL ? 'ml-2' : 'mr-2'} />
                  {translate('New Subscription')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBulkExport}
                >
                  <Download className={isRTL ? 'ml-2' : 'mr-2'} />
                  {translate('Export Selected')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectionChange([])}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className={isRTL ? 'ml-2' : 'mr-2'} />
                  {translate('Clear Selection')}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className={`bg-gray-50 dark:bg-gray-900/50 h-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TableHead className="w-16 h-12 px-4">
                  <Checkbox
                    checked={selectedClients.length === currentClients.length && currentClients.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('companyName')}
                >
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {translate('Company Details')}
                    {renderSortIcon('companyName')}
                  </div>
                </TableHead>
                <TableHead 
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('contactName')}
                >
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {translate('Contact')}
                    {renderSortIcon('contactName')}
                  </div>
                </TableHead>
                <TableHead 
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('packageName')}
                >
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {translate('Package')}
                    {renderSortIcon('packageName')}
                  </div>
                </TableHead>
                <TableHead 
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('status')}
                >
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {translate('Status')}
                    {renderSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead>{translate('Subscription')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TableCell className="h-16 px-4">
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="h-16">
                    <div className={`flex items-center justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{client.companyName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {client.subdomain}.mycrm.com
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
                          <DropdownMenuItem onClick={() => navigate(`/super-admin/clients/${client.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleLoginAsCustomer(client)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Login as Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => console.log('Assign package', client)}>
                            <Package className="mr-2 h-4 w-4" />
                            Assign Package
                          </DropdownMenuItem>
                          {client.status === 'active' && (
                            <DropdownMenuItem onClick={() => console.log('Upgrade/Downgrade', client)}>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Upgrade/Downgrade
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => console.log('Add activation code', client)}>
                            <Key className="mr-2 h-4 w-4" />
                            Add Activation Code
                          </DropdownMenuItem>
                          {canAddTrialDays(client) && (
                            <DropdownMenuItem onClick={() => console.log('Add trial days', client)}>
                              <Clock className="mr-2 h-4 w-4" />
                              Add Trial Days
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => console.log('Renew subscription', client)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Renew Subscription
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => console.log('Send password reset', client)}>
                            <Key className="mr-2 h-4 w-4" />
                            Send Password Reset
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {client.status === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => console.log('Suspend client', client)}
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-400"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend Client
                            </DropdownMenuItem>
                          )}
                          {client.status === 'suspended' && (
                            <DropdownMenuItem 
                              onClick={() => console.log('Activate client', client)}
                              className="text-green-600 dark:text-green-400 hover:text-green-600 dark:hover:text-green-400"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate Client
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => onDelete(client.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {client.contactName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client.contactEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    {client.packageName ? (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {client.packageName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPrice(client.monthlyRevenue)}/{translate('month')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{translate('No package')}</span>
                    )}
                  </TableCell>
                  <TableCell className="h-16">
                    {getStatusBadge(client.status)}
                  </TableCell>
                  <TableCell className="h-16">
                    {client.subscriptionEndDate ? (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {translate('Expires')}: {formatDate(client.subscriptionEndDate)}
                        </div>
                        {client.hasTrialDays && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            {translate('Trial days applied')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{translate('No subscription')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {clients.length === 0 && (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{translate('No clients found')}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {translate('Clients will appear here when they are added to the system.')}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {clients.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className={`flex flex-col items-center xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 ${isRTL ? 'xs:flex-row-reverse' : ''}`}>
              {/* LEFT: Info section */}
              <div className={`flex flex-col items-center xs:flex-row xs:items-center ${isRTL ? 'xs:space-x-reverse' : 'xs:space-x-4'} space-y-1 xs:space-y-0`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{translate('Rows per page:')}</span>
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
                  {translate('Showing')} {startIndex + 1} {translate('to')} {Math.min(endIndex, totalItems)} {translate('of')} {totalItems} {translate('results')}
                </span>
              </div>
              {/* RIGHT: Compact Pagination controls */}
              <div className={`flex justify-center xs:justify-end ${isRTL ? 'xs:justify-start' : ''}`}>
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
    </div>
  );
});
