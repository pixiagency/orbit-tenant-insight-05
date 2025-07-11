import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2, Mail, Phone, Star } from 'lucide-react';
import { PRSR } from '@/types/pr-sr';

interface PRSRTableProps {
  searchTerm: string;
  sourceFilter: string;
  statusFilter: string;
  typeFilter?: string;
  onEdit: (prsr: PRSR) => void;
}

// Mock data for PR/SR contacts
const mockPRSRData: PRSR[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@mediahub.com',
    phone: '+1 (555) 123-4567',
    company: 'MediaHub Communications',
    job_title: 'PR Director',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Referral',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Email',
    do_not_call: false,
    priority: 'High',
    media_type: 'Digital',
    reach: 50000,
    influence_score: 85,
    created_date: '2024-01-15',
    modified_date: '2024-01-15'
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'm.chen@socialgood.org',
    phone: '+1 (555) 234-5678',
    company: 'Social Good Foundation',
    job_title: 'CSR Manager',
    type: 'sr',
    contact_status: 'Qualified',
    lead_source: 'Website',
    email_opt_in: true,
    phone_opt_in: false,
    preferred_contact_method: 'Email',
    do_not_call: true,
    priority: 'Medium',
    media_type: 'Social Media',
    reach: 25000,
    influence_score: 72,
    created_date: '2024-01-20',
    modified_date: '2024-01-20'
  }
];

export const PRSRTable: React.FC<PRSRTableProps> = ({
  searchTerm,
  sourceFilter,
  statusFilter,
  typeFilter,
  onEdit
}) => {
  const [data] = useState<PRSR[]>(mockPRSRData);

  const filteredData = data.filter(item => {
    const matchesSearch = !searchTerm || 
      `${item.first_name} ${item.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || item.lead_source.toLowerCase() === sourceFilter;
    const matchesStatus = statusFilter === 'all' || item.contact_status.toLowerCase() === statusFilter;
    const matchesType = !typeFilter || item.type === typeFilter;
    
    return matchesSearch && matchesSource && matchesStatus && matchesType;
  });

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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Reach</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((prsr) => (
            <TableRow key={prsr.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <TableCell>
                <div className="flex flex-col">
                  <div className="font-medium">{prsr.first_name} {prsr.last_name}</div>
                  <div className="text-sm text-gray-500">{prsr.email}</div>
                  <div className="text-sm text-gray-500">{prsr.job_title}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{prsr.company}</div>
              </TableCell>
              <TableCell>
                <Badge variant={prsr.type === 'pr' ? 'default' : 'secondary'}>
                  {prsr.type === 'pr' ? 'Public Relations' : 'Social Responsibility'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(prsr.contact_status)}>
                  {prsr.contact_status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityColor(prsr.priority || 'Medium')}>
                  {prsr.priority || 'Medium'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{prsr.reach?.toLocaleString() || 'N/A'}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{prsr.influence_score || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(prsr)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No PR/SR contacts found matching your criteria.
        </div>
      )}
    </div>
  );
};