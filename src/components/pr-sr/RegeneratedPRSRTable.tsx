
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit, Eye, Trash2, Mail, Phone, Star, Package, ShoppingCart, ChevronDown, MapPin, Calendar, Users, Building } from 'lucide-react';
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
    mobile_phone: '+1 (555) 123-4568',
    company: 'TechSolutions Inc.',
    job_title: 'Product Marketing Director',
    department: 'Marketing',
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
    notes: 'Key decision maker for enterprise software purchases',
    website: 'https://techsolutions.com',
    industry: 'Technology',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    last_contact_date: '2024-01-20',
    next_follow_up_date: '2024-02-15',
    contact_owner: 'John Smith',
    social_media_handles: {
      linkedin: 'sarahjohnson',
      twitter: '@sjohnson_tech'
    }
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Rodriguez',
    email: 'm.rodriguez@retailplus.com',
    phone: '+1 (555) 234-5678',
    company: 'RetailPlus Corporation',
    job_title: 'Service Excellence Manager',
    department: 'Customer Service',
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
    notes: 'Focuses on service improvement initiatives',
    website: 'https://retailplus.com',
    industry: 'Retail',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    last_contact_date: '2024-01-25',
    next_follow_up_date: '2024-02-20',
    contact_owner: 'Jane Doe'
  },
  {
    id: '3',
    first_name: 'Emily',
    last_name: 'Chen',
    email: 'emily.chen@healthcareservices.org',
    phone: '+1 (555) 345-6789',
    mobile_phone: '+1 (555) 345-6790',
    company: 'HealthCare Services Group',
    job_title: 'Product Development Lead',
    department: 'R&D',
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
    notes: 'Specializes in healthcare product launches',
    industry: 'Healthcare',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    last_contact_date: '2024-01-30',
    contact_owner: 'Mike Wilson'
  },
  {
    id: '4',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@manufacturing.com',
    phone: '+1 (555) 456-7890',
    company: 'Manufacturing Solutions',
    job_title: 'Operations Manager',
    department: 'Operations',
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
    notes: 'Interested in operational efficiency solutions',
    industry: 'Manufacturing',
    city: 'Detroit',
    state: 'MI',
    country: 'USA',
    next_follow_up_date: '2024-02-25',
    contact_owner: 'Sarah Lee'
  },
  {
    id: '5',
    first_name: 'Lisa',
    last_name: 'Anderson',
    email: 'lisa.anderson@fintech.com',
    phone: '+1 (555) 567-8901',
    company: 'FinTech Innovations',
    job_title: 'Product Manager',
    department: 'Product',
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
    notes: 'Currently inactive but high potential',
    industry: 'Financial Services',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    contact_owner: 'Alex Brown'
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

  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case 'Digital': return 'bg-blue-100 text-blue-800';
      case 'Print': return 'bg-green-100 text-green-800';
      case 'TV': return 'bg-purple-100 text-purple-800';
      case 'Radio': return 'bg-orange-100 text-orange-800';
      case 'Social Media': return 'bg-pink-100 text-pink-800';
      case 'Blog': return 'bg-yellow-100 text-yellow-800';
      case 'Podcast': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <TableHead className="font-semibold">Contact Information</TableHead>
              <TableHead className="font-semibold">Company & Position</TableHead>
              <TableHead className="font-semibold">Type & Category</TableHead>
              <TableHead className="font-semibold">Contact Details</TableHead>
              <TableHead className="font-semibold">Performance</TableHead>
              <TableHead className="font-semibold">Follow-up</TableHead>
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
                  
                  {/* Contact Information */}
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {prsr.first_name} {prsr.last_name}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        {prsr.email}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {prsr.phone && (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {prsr.phone}
                          </span>
                        )}
                        {prsr.mobile_phone && (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {prsr.mobile_phone}
                          </span>
                        )}
                      </div>
                      {(prsr.city || prsr.state || prsr.country) && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {[prsr.city, prsr.state, prsr.country].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Company & Position */}
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {prsr.company}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {prsr.job_title}
                      </div>
                      {prsr.department && (
                        <div className="text-xs text-gray-500">
                          <Building className="h-3 w-3 inline mr-1" />
                          {prsr.department}
                        </div>
                      )}
                      {prsr.industry && (
                        <Badge variant="outline" className="text-xs w-fit">
                          {prsr.industry}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Type & Category */}
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-gray-500" />
                        <Badge variant={prsr.type === 'pr' ? 'default' : 'secondary'} className="text-xs">
                          {prsr.type === 'pr' ? 'PR' : 'SR'}
                        </Badge>
                      </div>
                      {prsr.media_type && (
                        <Badge variant="outline" className={`text-xs ${getMediaTypeColor(prsr.media_type)}`}>
                          {prsr.media_type}
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        <Badge variant={getStatusColor(prsr.contact_status)} className="text-xs">
                          {prsr.contact_status}
                        </Badge>
                        <Badge variant={getPriorityColor(prsr.priority || 'Medium')} className="text-xs">
                          {prsr.priority || 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Contact Details */}
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-gray-600">
                        Source: <span className="font-medium">{prsr.lead_source}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Preferred: <span className="font-medium">{prsr.preferred_contact_method}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className={`px-1 py-0.5 rounded ${prsr.email_opt_in ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          Email: {prsr.email_opt_in ? 'Yes' : 'No'}
                        </span>
                        <span className={`px-1 py-0.5 rounded ${prsr.phone_opt_in ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          Phone: {prsr.phone_opt_in ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {prsr.do_not_call && (
                        <Badge variant="destructive" className="text-xs w-fit">
                          Do Not Call
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Performance */}
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        <Users className="h-4 w-4 inline mr-1" />
                        {prsr.reach?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {prsr.influence_score || 0}
                        </span>
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
                  
                  {/* Follow-up */}
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      {prsr.last_contact_date && (
                        <div className="text-xs text-gray-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Last: {new Date(prsr.last_contact_date).toLocaleDateString()}
                        </div>
                      )}
                      {prsr.next_follow_up_date && (
                        <div className="text-xs text-green-600 font-medium">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Next: {new Date(prsr.next_follow_up_date).toLocaleDateString()}
                        </div>
                      )}
                      {prsr.contact_owner && (
                        <div className="text-xs text-gray-600">
                          Owner: <span className="font-medium">{prsr.contact_owner}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Actions */}
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
            <p className="text-gray-500 text-lg font-medium">No contacts found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
