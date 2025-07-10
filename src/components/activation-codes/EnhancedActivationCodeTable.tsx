import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  RefreshCw,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  Key,
  Users,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActivationCode, ActivationCodeFilters } from '../../types/superadmin';

interface EnhancedActivationCodeTableProps {
  codes: ActivationCode[];
  selectedCodes: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onEdit: (code: ActivationCode) => void;
  onDelete: (codeId: string) => void;
  onView: (code: ActivationCode) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  filters: ActivationCodeFilters;
  onFiltersChange: (filters: ActivationCodeFilters) => void;
  onAdvancedFilters: () => void;
  onExport: () => void;
  onRefresh: () => void;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalCount: number;
}

export const EnhancedActivationCodeTable: React.FC<EnhancedActivationCodeTableProps> = ({
  codes,
  selectedCodes,
  onSelectionChange,
  onEdit,
  onDelete,
  onView,
  onBulkAction,
  filters,
  onFiltersChange,
  onAdvancedFilters,
  onExport,
  onRefresh,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  totalCount
}) => {
  const handleFilterChange = (key: keyof ActivationCodeFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(codes.map(code => code.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectCode = (codeId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedCodes, codeId]);
    } else {
      onSelectionChange(selectedCodes.filter(id => id !== codeId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'used': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUsageTypeColor = (type: string) => {
    switch (type) {
      case 'one-time': return 'bg-orange-100 text-orange-700';
      case 'multi-use': return 'bg-blue-100 text-blue-700';
      case 'unlimited': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== 'all' && !(typeof value === 'object' && Object.keys(value).length === 0)
  ).length;

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search activation codes..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.usageType || 'all'} onValueChange={(value) => handleFilterChange('usageType', value === 'all' ? '' : value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Usage Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="one-time">One-time</SelectItem>
            <SelectItem value="multi-use">Multi-use</SelectItem>
            <SelectItem value="unlimited">Unlimited</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onAdvancedFilters} className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Advanced
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Actions */}
      {selectedCodes.length > 0 && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-700">
            {selectedCodes.length} code(s) selected
          </span>
          <Button size="sm" variant="outline" onClick={() => onBulkAction('deactivate', selectedCodes)}>
            Deactivate
          </Button>
          <Button size="sm" variant="outline" onClick={() => onBulkAction('delete', selectedCodes)}>
            Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onSelectionChange([])}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {startIndex + 1}-{Math.min(startIndex + pageSize, totalCount)} of {totalCount} codes
        </div>
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCodes.length === codes.length && codes.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Users Limit</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedCodes.includes(code.id)}
                    onCheckedChange={(checked) => handleSelectCode(code.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-medium">{code.code}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(code.code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(code)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(code)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(code.code)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => onDelete(code.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{code.packageName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getUsageTypeColor(code.usageType)}>
                    {code.usageType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(code.status)}>
                    {code.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {code.status === 'expired' && <XCircle className="h-3 w-3 mr-1" />}
                    {code.status === 'used' && <Key className="h-3 w-3 mr-1" />}
                    {code.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {code.usageCount}/{code.usageType === 'unlimited' ? '∞' : code.usageLimit}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span>{code.usersLimit}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {code.expirationDate 
                        ? new Date(code.expirationDate).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-gray-500">
                    {new Date(code.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(code)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
