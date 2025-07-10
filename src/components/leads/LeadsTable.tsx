
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Eye,
  TrendingUp,
  Star 
} from 'lucide-react';
import { Lead } from '@/types/leads';

interface LeadsTableProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertLead: (leadId: string) => void;
  selectedLeads: string[];
  onSelectLead: (leadId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onEditLead,
  onDeleteLead,
  onConvertLead,
  selectedLeads,
  onSelectLead,
  onSelectAll
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(leads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-700 border-green-200';
      case 'unqualified': return 'bg-red-100 text-red-700 border-red-200';
      case 'converted': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Header with entries selector and pagination */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 font-medium">Show</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700 font-medium">entries</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, leads.length)} of {leads.length} records
          </div>
          {/* Top Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3 text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedLeads.length === leads.length}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="w-80">Lead Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Assigned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => onSelectLead(lead.id)}
                  />
                </TableCell>
                <TableCell className="w-80">
                  <div className="flex items-center justify-between">
                     <div className="flex-1 min-w-0">
                       <div className="font-semibold text-gray-900 truncate">
                         {lead.first_name || lead.firstName} {lead.last_name || lead.lastName}
                       </div>
                       <div className="text-sm text-gray-500 truncate">{lead.job_title || lead.title}</div>
                     </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => console.log('View lead', lead.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditLead(lead)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Call lead', lead.id)}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Email lead', lead.id)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onConvertLead(lead.id)}>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Convert to Opportunity
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => onDeleteLead(lead.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{lead.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{lead.company}</div>
                </TableCell>
                 <TableCell>
                   <Badge variant="outline" className={getStatusColor(lead.contact_status || lead.status)}>
                     {lead.contact_status || lead.status}
                   </Badge>
                 </TableCell>
                 <TableCell>
                   <div className={`flex items-center space-x-1 px-2 py-1 rounded-full w-fit ${getScoreColor(lead.score || 0)}`}>
                     <Star className="h-3 w-3" />
                     <span className="text-xs font-medium">{lead.score || 0}</span>
                   </div>
                 </TableCell>
                 <TableCell>
                   <span className="text-sm">{lead.lead_source || lead.source}</span>
                 </TableCell>
                 <TableCell>
                   <span className="font-semibold text-green-600">
                     ${(lead.value || 0).toLocaleString()}
                   </span>
                 </TableCell>
                 <TableCell>
                   <span className="text-sm">{lead.contact_owner || lead.assignedTo}</span>
                 </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};
