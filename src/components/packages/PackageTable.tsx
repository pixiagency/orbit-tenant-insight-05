import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash, Eye, Users, ChevronUp, ChevronDown, Copy, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Package, AVAILABLE_MODULES } from '../../types/packages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { useLanguage } from '../../contexts/LanguageContext';

interface PackageTableProps {
  packages: Package[];
  selectedPackages: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (pkg: Package) => void;
  onClone: (pkg: Package) => void;
  onDelete: (pkg: Package) => void;
  onView: (pkg: Package) => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: 'active' | 'inactive') => void;
}

type SortField = 'name' | 'price' | 'duration' | 'maxUsers' | 'usersCount' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  selectedPackages,
  onSelectionChange,
  onEdit,
  onClone,
  onDelete,
  onView,
  onBulkDelete,
  onBulkStatusChange,
}) => {
  const { isRTL, translate } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sort packages
  const sortedPackages = [...packages].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.pricing.amount;
        bValue = b.pricing.amount;
        break;
      case 'duration':
        aValue = a.pricing.duration;
        bValue = b.pricing.duration;
        break;
      case 'maxUsers':
        aValue = a.limits.maxUsers;
        bValue = b.limits.maxUsers;
        break;
      case 'usersCount':
        aValue = a.usersCount;
        bValue = b.usersCount;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
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
  const totalItems = sortedPackages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPackages = sortedPackages.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? currentPackages.map(pkg => pkg.id) : []);
  };

  const handleSelectPackage = (packageId: string, checked: boolean) => {
    onSelectionChange(
      checked
        ? [...selectedPackages, packageId]
        : selectedPackages.filter(id => id !== packageId)
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

  const formatPrice = (price: number) => `${price.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (duration: number, unit: string) => {
    return `${duration} ${unit}${duration !== 1 ? 's' : ''}`;
  };

  const getModuleColor = (moduleId: string) => {
    const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
    return module?.color || 'bg-gray-100 text-gray-800';
  };

  const getModuleName = (moduleId: string) => {
    const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
    return module?.name || moduleId;
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
        {selectedPackages.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}> 
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedPackages.length} {translate('package(s) selected')}
              </span>
              <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}> 
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onBulkStatusChange('active')}
                >
                  {translate('Activate')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onBulkStatusChange('inactive')}
                >
                  {translate('Deactivate')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onBulkDelete}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash className={isRTL ? 'ml-2' : 'mr-2'} />
                  {translate('Delete Selected')}
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
                    checked={selectedPackages.length === currentPackages.length && currentPackages.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{translate('Package Details')}</TableHead>
                <TableHead>{translate('Price')}</TableHead>
                <TableHead>{translate('Duration')}</TableHead>
                <TableHead>{translate('Limits')}</TableHead>
                <TableHead>{translate('Modules')}</TableHead>
                <TableHead>{translate('Users')}</TableHead>
                <TableHead>{translate('Status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPackages.map((pkg) => (
               <TableRow key={pkg.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TableCell className="h-16 px-4">
                    <Checkbox
                      checked={selectedPackages.includes(pkg.id)}
                      onCheckedChange={(checked) => handleSelectPackage(pkg.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="h-16">
                    <div className={`flex items-center justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{pkg.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {pkg.description || translate('No description')}
                        </div>
                      <div className={`flex items-center mt-1 ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}> 
                          {pkg.isPublic && (
                            <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150">{translate('Public')}</Badge>
                          )}
                          {pkg.aiOptions?.enabled && (
                            <Badge className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-150">{translate('AI Enabled')}</Badge>
                          )}
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
                          <DropdownMenuItem onClick={() => onView(pkg)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(pkg)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Package
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onClone(pkg)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Clone Package
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(pkg)}
                            className="text-red-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Package
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                     <div className={`flex items-center text-gray-900 dark:text-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'ml-1' : 'mr-1'} />
                      {formatPrice(pkg.pricing.amount)}
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <div className="text-gray-900 dark:text-gray-100">
                      {formatDuration(pkg.pricing.duration, pkg.pricing.durationUnit)}
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-900 dark:text-gray-100">{translate('Users')}: {pkg.limits.maxUsers}</div>
                      <div className="text-gray-500 dark:text-gray-400">{translate('Leads')}: {pkg.limits.maxLeads.toLocaleString()}</div>
                      <div className="text-gray-500 dark:text-gray-400">{translate('Storage')}: {pkg.limits.maxStorageGB}GB</div>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <div className="flex flex-wrap gap-1 max-w-48">
                      {pkg.modules.slice(0, 3).map((moduleId) => {
                        const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
                        const colorClass = module?.color || 'bg-gray-100';
                        let hoverClass = '';
                        if (colorClass.includes('bg-blue-100')) hoverClass = 'hover:bg-blue-200';
                        else if (colorClass.includes('bg-green-100')) hoverClass = 'hover:bg-green-200';
                        else if (colorClass.includes('bg-purple-100')) hoverClass = 'hover:bg-purple-200';
                        else if (colorClass.includes('bg-orange-100')) hoverClass = 'hover:bg-orange-200';
                        else if (colorClass.includes('bg-red-100')) hoverClass = 'hover:bg-red-200';
                        else if (colorClass.includes('bg-indigo-100')) hoverClass = 'hover:bg-indigo-200';
                        else if (colorClass.includes('bg-pink-100')) hoverClass = 'hover:bg-pink-200';
                        else if (colorClass.includes('bg-teal-100')) hoverClass = 'hover:bg-teal-200';
                        else if (colorClass.includes('bg-yellow-100')) hoverClass = 'hover:bg-yellow-200';
                        else if (colorClass.includes('bg-cyan-100')) hoverClass = 'hover:bg-cyan-200';
                        else if (colorClass.includes('bg-emerald-100')) hoverClass = 'hover:bg-emerald-200';
                        else if (colorClass.includes('bg-violet-100')) hoverClass = 'hover:bg-violet-200';
                        else if (colorClass.includes('bg-rose-100')) hoverClass = 'hover:bg-rose-200';
                        else if (colorClass.includes('bg-amber-100')) hoverClass = 'hover:bg-amber-200';
                        else if (colorClass.includes('bg-slate-100')) hoverClass = 'hover:bg-slate-200';
                        return (
                          <Badge 
                            key={moduleId} 
                             className={`text-xs ${colorClass} border-0 ${hoverClass} transition-colors duration-150`}
                          >
                            {getModuleName(moduleId)}
                          </Badge>
                        );
                      })}
                      {pkg.modules.length > 3 && (
                        <Badge className="text-xs bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150">
                          +{pkg.modules.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                     <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
                      <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">{pkg.usersCount}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-base">/</span>
                      <span className="text-gray-500 dark:text-gray-400 text-base">{pkg.limits.maxUsers}</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            (pkg.usersCount / pkg.limits.maxUsers) > 0.8 
                              ? 'bg-red-500 dark:bg-red-400' 
                              : (pkg.usersCount / pkg.limits.maxUsers) > 0.6 
                                ? 'bg-yellow-500 dark:bg-yellow-400'
                                : 'bg-green-500 dark:bg-green-400'
                          }`}
                          style={{ 
                             width: `${Math.min((pkg.usersCount / pkg.limits.maxUsers) * 100, 100)}%`  
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Math.round((pkg.usersCount / pkg.limits.maxUsers) * 100)}% {translate('used')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="h-16">
                    <Badge 
                      className={pkg.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-150' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors duration-150'
                      }
                    >
                      {translate(pkg.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {packages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">{translate('No packages found')}</div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {packages.length > 0 && (
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
};
