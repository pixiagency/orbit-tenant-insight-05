
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit, Eye, Trash2, Package, ShoppingCart, ChevronDown, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { PRSR } from '@/types/pr-sr';

interface RegeneratedPRSRTableProps {
  searchTerm: string;
  sourceFilter: string;
  statusFilter: string;
  typeFilter?: string;
  onEdit: (prsr: PRSR) => void;
}

// Enhanced mock data for products/services
const mockProductServiceData: PRSR[] = [
  {
    id: '1',
    first_name: 'Premium Software Suite',
    last_name: '',
    email: 'software@company.com',
    phone: '',
    company: 'TechSolutions Inc.',
    job_title: 'Enterprise Software',
    department: 'Software',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Website',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Email',
    do_not_call: false,
    priority: 'High',
    media_type: 'Digital',
    reach: 2500,
    influence_score: 88,
    created_date: '2024-01-15',
    modified_date: '2024-01-15',
    campaign_interests: ['Software Solutions', 'Enterprise Tech'],
    notes: 'Best-selling enterprise software package',
    website: 'https://techsolutions.com',
    industry: 'Technology',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    price: 299.99,
    category: 'Software',
    sku: 'SOFT-001',
    inventory_quantity: 150,
    sales_count: 2500
  },
  {
    id: '2',
    first_name: 'Customer Service Training',
    last_name: '',
    email: 'training@retailplus.com',
    company: 'RetailPlus Corporation',
    job_title: 'Training Service',
    department: 'Services',
    type: 'sr',
    contact_status: 'Active',
    lead_source: 'Referral',
    email_opt_in: true,
    phone_opt_in: false,
    preferred_contact_method: 'Email',
    do_not_call: true,
    priority: 'Medium',
    media_type: 'Service',
    reach: 1200,
    influence_score: 76,
    created_date: '2024-01-20',
    modified_date: '2024-01-20',
    campaign_interests: ['Customer Service', 'Training'],
    notes: 'Comprehensive customer service training program',
    industry: 'Education',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    price: 1499.99,
    category: 'Training',
    sku: 'TRAIN-002',
    inventory_quantity: 0,
    sales_count: 1200
  },
  {
    id: '3',
    first_name: 'Healthcare Analytics Platform',
    last_name: '',
    email: 'analytics@healthcare.com',
    company: 'HealthCare Services Group',
    job_title: 'Analytics Software',
    department: 'Healthcare',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Event',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Phone',
    do_not_call: false,
    priority: 'High',
    media_type: 'Digital',
    reach: 800,
    influence_score: 82,
    created_date: '2024-01-25',
    modified_date: '2024-01-25',
    campaign_interests: ['Healthcare', 'Analytics'],
    notes: 'Advanced healthcare data analytics solution',
    industry: 'Healthcare',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    price: 4999.99,
    category: 'Healthcare',
    sku: 'HLTH-003',
    inventory_quantity: 25,
    sales_count: 800
  },
  {
    id: '4',
    first_name: 'Manufacturing Consulting',
    last_name: '',
    email: 'consulting@manufacturing.com',
    company: 'Manufacturing Solutions',
    job_title: 'Consulting Service',
    department: 'Services',
    type: 'sr',
    contact_status: 'Inactive',
    lead_source: 'Trade Show',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Phone',
    do_not_call: false,
    priority: 'Low',
    media_type: 'Service',
    reach: 350,
    influence_score: 65,
    created_date: '2024-01-30',
    modified_date: '2024-01-30',
    campaign_interests: ['Manufacturing', 'Consulting'],
    notes: 'Operational efficiency consulting services',
    industry: 'Manufacturing',
    city: 'Detroit',
    state: 'MI',
    country: 'USA',
    price: 2500.00,
    category: 'Consulting',
    sku: 'CONS-004',
    inventory_quantity: 0,
    sales_count: 350
  },
  {
    id: '5',
    first_name: 'Financial Planning Tool',
    last_name: '',
    email: 'planning@fintech.com',
    company: 'FinTech Innovations',
    job_title: 'Planning Software',
    department: 'Financial',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Website',
    email_opt_in: false,
    phone_opt_in: false,
    preferred_contact_method: 'Email',
    do_not_call: true,
    priority: 'Medium',
    media_type: 'Digital',
    reach: 600,
    influence_score: 45,
    created_date: '2024-02-01',
    modified_date: '2024-02-01',
    campaign_interests: ['Financial Planning', 'Software'],
    notes: 'Comprehensive financial planning and analysis tool',
    industry: 'Financial Services',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    price: 199.99,
    category: 'Financial',
    sku: 'FIN-005',
    inventory_quantity: 500,
    sales_count: 600
  }
];

export const RegeneratedPRSRTable: React.FC<RegeneratedPRSRTableProps> = ({
  searchTerm,
  sourceFilter,
  statusFilter,
  typeFilter,
  onEdit
}) => {
  const [data] = useState<PRSR[]>(mockProductServiceData);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = data.filter(item => {
    const matchesSearch = !searchTerm || 
      item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || item.lead_source.toLowerCase() === sourceFilter;
    const matchesStatus = statusFilter === 'all' || item.contact_status.toLowerCase() === statusFilter;
    const matchesType = !typeFilter || item.type === typeFilter;
    
    return matchesSearch && matchesSource && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(item => item.id!));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for rows:`, selectedRows);
    setSelectedRows([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Qualified': return 'secondary';
      case 'Inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'pr' ? Package : ShoppingCart;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Software': return 'bg-blue-100 text-blue-800';
      case 'Training': return 'bg-green-100 text-green-800';
      case 'Healthcare': return 'bg-purple-100 text-purple-800';
      case 'Consulting': return 'bg-orange-100 text-orange-800';
      case 'Financial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'destructive', text: 'Out of Stock', icon: AlertTriangle };
    if (quantity < 50) return { color: 'secondary', text: 'Low Stock', icon: AlertTriangle };
    return { color: 'default', text: 'In Stock', icon: CheckCircle };
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
          </div>

          {selectedRows.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedRows.length} selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                    Activate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                    Deactivate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600"
                  >
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center space-x-1">
            {totalPages > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-sm"
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="text-sm font-medium text-gray-900">{currentPage}</span>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 text-sm"
                >
                  Next
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Inventory</TableHead>
              <TableHead className="font-semibold">Sales</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((product) => {
              const TypeIcon = getTypeIcon(product.type);
              const inventoryStatus = getInventoryStatus(product.inventory_quantity || 0);
              const InventoryIcon = inventoryStatus.icon;
              
              return (
                <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(product.id!)}
                      onCheckedChange={(checked) => handleSelectRow(product.id!, checked as boolean)}
                    />
                  </TableCell>
                  
                  {/* Product */}
                  <TableCell className="py-4">
                    <div className="flex items-start space-x-3">
                      <TypeIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div className="flex flex-col space-y-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {product.first_name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {product.sku}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.job_title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Category */}
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`${getCategoryColor(product.category || 'Other')}`}>
                      {product.category || 'Other'}
                    </Badge>
                  </TableCell>
                  
                  {/* Price */}
                  <TableCell className="py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                    </div>
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell className="py-4">
                    <Badge variant={getStatusColor(product.contact_status)} className="text-xs">
                      {product.contact_status}
                    </Badge>
                  </TableCell>
                  
                  {/* Inventory */}
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <InventoryIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {product.inventory_quantity || 0}
                        </span>
                      </div>
                      <Badge variant={inventoryStatus.color as any} className="text-xs w-fit">
                        {inventoryStatus.text}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  {/* Sales */}
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {product.sales_count?.toLocaleString() || 0}
                      </span>
                    </div>
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {paginatedData.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">No products found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
