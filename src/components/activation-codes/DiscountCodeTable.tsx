import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash, Copy, CheckCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Percent } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ActivationCode } from '../../types/superadmin';

interface DiscountCodeTableProps {
  codes: ActivationCode[];
  selectedCodes: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: 'active' | 'expired') => void;
}

type SortField = 'code' | 'packageName' | 'status' | 'expirationDate' | 'createdAt' | 'usageCount' | 'discountPercentage';
type SortDirection = 'asc' | 'desc';

export const DiscountCodeTable: React.FC<DiscountCodeTableProps> = ({
  codes,
  selectedCodes,
  onSelectionChange,
  onBulkDelete,
  onBulkStatusChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sort codes
  const sortedCodes = [...codes].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'code':
        aValue = a.code.toLowerCase();
        bValue = b.code.toLowerCase();
        break;
      case 'packageName':
        aValue = a.packageName.toLowerCase();
        bValue = b.packageName.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'expirationDate':
        aValue = a.expirationDate ? new Date(a.expirationDate).getTime() : 0;
        bValue = b.expirationDate ? new Date(b.expirationDate).getTime() : 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'usageCount':
        aValue = a.usageCount;
        bValue = b.usageCount;
        break;
      case 'discountPercentage':
        aValue = a.discountPercentage || 0;
        bValue = b.discountPercentage || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedCodes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCodes = sortedCodes.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? currentCodes.map(code => code.id) : []);
  };

  const handleSelectCode = (codeId: string, checked: boolean) => {
    onSelectionChange(
      checked
        ? [...selectedCodes, codeId]
        : selectedCodes.filter(id => id !== codeId)
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

  const handleEdit = (code: ActivationCode) => {
    console.log('Edit code:', code);
  };

  const handleDelete = (id: string) => {
    console.log('Delete code:', id);
  };

  const handleView = (code: ActivationCode) => {
    console.log('View code:', code);
  };

  const handleCopy = (codeString: string) => {
    navigator.clipboard.writeText(codeString);
    console.log('Copied code:', codeString);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-150',
      used: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150',
      expired: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-150',
    };

    return (
      <Badge className={variants[status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPackageBadge = (packageName: string) => {
    return (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150">
        {packageName}
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
        {selectedCodes.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedCodes.length} discount code(s) selected
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onBulkStatusChange('active')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Set Active
                </Button>
                <Button variant="outline" size="sm" onClick={() => onBulkStatusChange('expired')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Set Expired
                </Button>
                <Button variant="outline" size="sm" onClick={onBulkDelete}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900/50 h-12">
                <TableHead className="w-16 h-12 px-4">
                  <Checkbox
                    checked={selectedCodes.length === currentCodes.length && currentCodes.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none min-w-[200px]"
                  onClick={() => handleSort('code')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center">
                      Discount Code
                      {renderSortIcon('code')}
                    </div>
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('discountPercentage')}
                >
                  <div className="flex items-center">
                    Discount
                    {renderSortIcon('discountPercentage')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('packageName')}
                >
                  <div className="flex items-center">
                    Package
                    {renderSortIcon('packageName')}
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
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('usageCount')}
                >
                  <div className="flex items-center">
                    Times Used
                    {renderSortIcon('usageCount')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-900 dark:text-gray-100 h-12 cursor-pointer select-none"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    {renderSortIcon('createdAt')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCodes.map((code) => (
                <TableRow key={code.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-16">
                  <TableCell className="h-16 px-4">
                    <Checkbox
                      checked={selectedCodes.includes(code.id)}
                      onCheckedChange={(checked) => handleSelectCode(code.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="h-16">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded truncate font-medium">
                          {code.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(code.code)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleView(code)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(code)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopy(code.code)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(code.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {code.discountPercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    {getPackageBadge(code.packageName)}
                  </TableCell>
                  <TableCell className="h-16">
                    {getStatusBadge(code.status)}
                  </TableCell>
                  <TableCell className="h-16">
                    <div className="text-sm">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {code.usageCount} {code.usageCount === 1 ? 'time' : 'times'}
                      </span>
                      {code.usageLimit && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          of {code.usageLimit} max
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="h-16 text-gray-600 dark:text-gray-300">
                    {formatDate(code.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {codes.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No discount codes</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new discount code.
              </p>
            </div>
          )}
        </div>

        {codes.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col items-center xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
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
    </div>
  );
};
