
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MoreHorizontal, Edit, Eye, Trash2, Mail, Phone, Star, Package, ShoppingCart, ChevronDown } from 'lucide-react';
import { PRSR } from '@/types/pr-sr';

interface RegeneratedPRSRTableProps {
  searchTerm: string;
  sourceFilter: string;
  statusFilter: string;
  typeFilter?: string;
  onEdit: (prsr: PRSR) => void;
}

// Enhanced mock data for product/service PR/SR contacts
const mockProductServiceData: PRSR[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@techsolutions.com',
    phone: '+1 (555) 123-4567',
    company: 'TechSolutions Inc.',
    job_title: 'Product Marketing Director',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Website',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Email',
    do_not_call: false,
    priority: 'High',
    media_type: 'Digital',
    reach: 75000,
    influence_score: 88,
    created_date: '2024-01-15',
    modified_date: '2024-01-15',
    campaign_interests: ['Software Solutions', 'Enterprise Tech', 'Cloud Services'],
    notes: 'Key decision maker for enterprise software purchases'
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Rodriguez',
    email: 'm.rodriguez@retailplus.com',
    phone: '+1 (555) 234-5678',
    company: 'RetailPlus Corporation',
    job_title: 'Service Excellence Manager',
    type: 'sr',
    contact_status: 'Qualified',
    lead_source: 'Referral',
    email_opt_in: true,
    phone_opt_in: false,
    preferred_contact_method: 'Email',
    do_not_call: true,
    priority: 'Medium',
    media_type: 'Social Media',
    reach: 35000,
    influence_score: 76,
    created_date: '2024-01-20',
    modified_date: '2024-01-20',
    campaign_interests: ['Customer Service', 'Retail Solutions', 'Training Services'],
    notes: 'Focuses on service improvement initiatives'
  },
  {
    id: '3',
    first_name: 'Emily',
    last_name: 'Chen',
    email: 'emily.chen@healthcareservices.org',
    phone: '+1 (555) 345-6789',
    company: 'HealthCare Services Group',
    job_title: 'Product Development Lead',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Event',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Phone',
    do_not_call: false,
    priority: 'High',
    media_type: 'Print',
    reach: 45000,
    influence_score: 82,
    created_date: '2024-01-25',
    modified_date: '2024-01-25',
    campaign_interests: ['Healthcare Products', 'Medical Devices', 'Patient Care'],
    notes: 'Specializes in healthcare product launches'
  },
  // Add more mock data to test pagination
  {
    id: '4',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@manufacturing.com',
    phone: '+1 (555) 456-7890',
    company: 'Manufacturing Solutions',
    job_title: 'Operations Manager',
    type: 'sr',
    contact_status: 'Active',
    lead_source: 'Trade Show',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Phone',
    do_not_call: false,
    priority: 'Medium',
    media_type: 'TV',
    reach: 25000,
    influence_score: 65,
    created_date: '2024-01-30',
    modified_date: '2024-01-30',
    campaign_interests: ['Manufacturing Services', 'Equipment Maintenance'],
    notes: 'Interested in operational efficiency solutions'
  },
  {
    id: '5',
    first_name: 'Lisa',
    last_name: 'Anderson',
    email: 'lisa.anderson@fintech.com',
    phone: '+1 (555) 567-8901',
    company: 'FinTech Innovations',
    job_title: 'Product Manager',
    type: 'pr',
    contact_status: 'Inactive',
    lead_source: 'Website',
    email_opt_in: false,
    phone_opt_in: false,
    preferred_contact_method: 'Email',
    do_not_call: true,
    priority: 'Low',
    media_type: 'Blog',
    reach: 15000,
    influence_score: 45,
    created_date: '2024-02-01',
    modified_date: '2024-02-01',
    campaign_interests: ['Financial Products', 'Payment Solutions'],
    notes: 'Currently inactive but high potential'
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
      `${item.first_name} ${item.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    // Implement bulk actions here
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'pr' ? Package : ShoppingCart;
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between">
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
            <span className="text-sm text-gray-600 dark:text-gray-400">
              of {filteredData.length} entries
            </span>
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

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
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
              <TableHead className="font-semibold">Contact Details</TableHead>
              <TableHead className="font-semibold">Company & Role</TableHead>
              <TableHead className="font-semibold">Type & Focus</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Reach & Score</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((prsr) => {
              const TypeIcon = getTypeIcon(prsr.type);
              return (
                <TableRow key={prsr.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(prsr.id!)}
                      onCheckedChange={(checked) => handleSelectRow(prsr.id!, checked as boolean)}
                    />
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {prsr.first_name} {prsr.last_name}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        {prsr.email}
                      </div>
                      {prsr.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {prsr.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {prsr.company}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {prsr.job_title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Source: {prsr.lead_source}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-gray-500" />
                        <Badge variant={prsr.type === 'pr' ? 'default' : 'secondary'} className="text-xs">
                          {prsr.type === 'pr' ? 'Product Relations' : 'Service Relations'}
                        </Badge>
                      </div>
                      {prsr.campaign_interests && prsr.campaign_interests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {prsr.campaign_interests.slice(0, 2).map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                              {interest}
                            </Badge>
                          ))}
                          {prsr.campaign_interests.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{prsr.campaign_interests.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <Badge variant={getStatusColor(prsr.contact_status)} className="text-xs">
                      {prsr.contact_status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <Badge variant={getPriorityColor(prsr.priority || 'Medium')} className="text-xs">
                      {prsr.priority || 'Medium'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {prsr.reach?.toLocaleString() || 'N/A'} reach
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {prsr.influence_score || 0}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20">
                        <Phone className="h-4 w-4 text-green-600" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onEdit(prsr)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {paginatedData.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">No product/service contacts found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
