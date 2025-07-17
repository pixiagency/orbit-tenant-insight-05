import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit, Trash2, Eye, MessageSquare, Mail, Phone, Activity, UserCheck, BarChart3, Zap } from 'lucide-react';
import { OpportunityCommunicationDialog } from './OpportunityCommunicationDialog';
import { OpportunityStatusDialog } from './OpportunityStatusDialog';
import { OpportunityActivityDialog } from './OpportunityActivityDialog';
import { OpportunityDetailsModal } from './OpportunityDetailsModal';
import { AutomationApplyDialog } from './AutomationApplyDialog';
import { EnhancedDealDrawerForm } from '../deals/EnhancedDealDrawerForm';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  description?: string;
  competitorInfo?: string;
  decisionMakers?: string;
  budget?: number;
  timeline?: string;
  painPoints?: string;
  proposalSent?: boolean;
  contractSent?: boolean;
  status?: 'active' | 'abandon' | 'won' | 'lost';
  activities?: Array<{
    type: 'whatsapp' | 'email' | 'call' | 'activity';
    title: string;
    timestamp: string;
    count: number;
  }>;
  createdAt: string;
  lastActivity: string;
}

interface OpportunityTableProps {
  opportunities: Opportunity[];
  selectedOpportunities: string[];
  onSelectOpportunity: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'prospecting':
      return 'bg-gray-100 text-gray-800';
    case 'qualification':
      return 'bg-blue-100 text-blue-800';
    case 'proposal':
      return 'bg-yellow-100 text-yellow-800';
    case 'negotiation':
      return 'bg-orange-100 text-orange-800';
    case 'closed-won':
      return 'bg-green-100 text-green-800';
    case 'closed-lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'abandon':
      return 'bg-yellow-100 text-yellow-800';
    case 'won':
      return 'bg-green-100 text-green-800';
    case 'lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const OpportunityTable = ({
  opportunities,
  selectedOpportunities,
  onSelectOpportunity,
  onSelectAll,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: OpportunityTableProps) => {
  const [communicationDialog, setCommunicationDialog] = useState<{
    isOpen: boolean;
    type: 'whatsapp' | 'email' | 'call' | 'activity';
    opportunityIds: string[];
  }>({
    isOpen: false,
    type: 'whatsapp',
    opportunityIds: []
  });

  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    opportunityId: string | null;
    currentStatus: string;
  }>({
    isOpen: false,
    opportunityId: null,
    currentStatus: 'active'
  });

  const [activityDialog, setActivityDialog] = useState<{
    isOpen: boolean;
    opportunityId: string | null;
    opportunityName: string;
  }>({
    isOpen: false,
    opportunityId: null,
    opportunityName: ''
  });

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    opportunity: Opportunity | null;
  }>({
    isOpen: false,
    opportunity: null
  });

  const [showDealForm, setShowDealForm] = useState(false);

  const [automationDialog, setAutomationDialog] = useState<{
    isOpen: boolean;
    opportunityIds: string[];
  }>({
    isOpen: false,
    opportunityIds: []
  });

  const allSelected = opportunities.length > 0 && opportunities.every(opp => selectedOpportunities.includes(opp.id));
  const someSelected = selectedOpportunities.length > 0 && !allSelected;

  const handleCommunication = (type: 'whatsapp' | 'email' | 'call' | 'activity', opportunityIds: string[]) => {
    setCommunicationDialog({
      isOpen: true,
      type,
      opportunityIds
    });
  };

  const handleStatusChange = (opportunityId: string, currentStatus: string) => {
    setStatusDialog({
      isOpen: true,
      opportunityId,
      currentStatus
    });
  };

  const handleViewActivity = (opportunityId: string, opportunityName: string) => {
    setActivityDialog({
      isOpen: true,
      opportunityId,
      opportunityName
    });
  };

  const handleViewDetails = (opportunity: Opportunity) => {
    setDetailsModal({
      isOpen: true,
      opportunity
    });
  };

  const handleCommunicationSend = (type: string, data: any) => {
    console.log('Communication sent:', { type, data });
    // Here you would implement the actual communication logic
  };

  const handleStatusUpdate = (status: string, reason?: string, description?: string) => {
    console.log('Status updated:', { opportunityId: statusDialog.opportunityId, status, reason, description });
    // Here you would implement the actual status update logic
  };

  const handleApplyAutomation = (opportunityIds: string[]) => {
    setAutomationDialog({
      isOpen: true,
      opportunityIds
    });
  };

  const handleAutomationApply = (automationId: string, action: 'apply' | 'pause_and_apply' | 'cancel') => {
    console.log('Automation action:', { automationId, action, opportunityIds: automationDialog.opportunityIds });
    // Here you would implement the actual automation logic
  };

  const getOpportunityActivities = (opportunityId: string) => {
    return [
      {
        id: '1',
        type: 'whatsapp' as const,
        title: 'Follow-up message sent',
        description: 'Hi {name}, I wanted to check if you had a chance to review our proposal...',
        timestamp: new Date().toISOString(),
        template: 'Follow-up Template'
      },
      {
        id: '2',
        type: 'email' as const,
        title: 'Proposal sent',
        description: 'Detailed proposal document sent via email',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        template: 'Proposal Email Template'
      },
      {
        id: '3',
        type: 'call' as const,
        title: 'Discovery call completed',
        description: 'Discussed requirements and pain points',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      }
    ];
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedOpportunities.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-800">
            {selectedOpportunities.length} opportunity(ies) selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCommunication('whatsapp', selectedOpportunities)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCommunication('email', selectedOpportunities)}
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCommunication('call', selectedOpportunities)}
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCommunication('activity', selectedOpportunities)}
            >
              <Activity className="h-4 w-4 mr-1" />
              Activity
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyAutomation(selectedOpportunities)}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Zap className="h-4 w-4 mr-1" />
              Apply Automation
            </Button>
          </div>
        </div>
      )}

      {/* Header with entries selector and pagination */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 font-medium">Show</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700 font-medium">entries</span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} records
          </div>
        </div>
        <div className="flex items-center space-x-6">
          {/* Top Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3 text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Deal Value</TableHead>
              <TableHead>Win Probability</TableHead>
              <TableHead>Expected Close</TableHead>
              <TableHead>Sales Rep</TableHead>
              <TableHead>Activities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOpportunities.includes(opportunity.id)}
                    onCheckedChange={(checked) => onSelectOpportunity(opportunity.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{opportunity.name}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => handleViewDetails(opportunity)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewActivity(opportunity.id, opportunity.name)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Activity
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(opportunity)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(opportunity.id, opportunity.status || 'active')}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleApplyAutomation([opportunity.id])}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Apply Automation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleCommunication('whatsapp', [opportunity.id])}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleCommunication('email', [opportunity.id])}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleCommunication('call', [opportunity.id])}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Log Call
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleCommunication('activity', [opportunity.id])}
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          Add Activity
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDelete(opportunity.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell>{opportunity.company}</TableCell>
                <TableCell>{opportunity.contact}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(opportunity.status || 'active')}>
                    {(opportunity.status || 'active').charAt(0).toUpperCase() + (opportunity.status || 'active').slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStageColor(opportunity.stage)}>
                    {opportunity.stage.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-green-600">
                    ${opportunity.value.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${opportunity.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{opportunity.probability}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`text-sm ${
                    new Date(opportunity.expectedCloseDate) < new Date() 
                      ? 'text-red-600 font-medium' 
                      : 'text-gray-600'
                  }`}>
                    {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>{opportunity.assignedTo}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {opportunity.activities?.map((activity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {activity.type === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                        {activity.type === 'email' && <Mail className="h-3 w-3 mr-1" />}
                        {activity.type === 'call' && <Phone className="h-3 w-3 mr-1" />}
                        {activity.type === 'activity' && <Activity className="h-3 w-3 mr-1" />}
                        {activity.count}
                      </Badge>
                    ))}
                    {(!opportunity.activities || opportunity.activities.length === 0) && (
                      <span className="text-xs text-gray-400">No activities</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OpportunityCommunicationDialog
        isOpen={communicationDialog.isOpen}
        onClose={() => setCommunicationDialog(prev => ({ ...prev, isOpen: false }))}
        type={communicationDialog.type}
        opportunityIds={communicationDialog.opportunityIds}
        onSend={handleCommunicationSend}
      />

      <OpportunityStatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        currentStatus={statusDialog.currentStatus}
        onStatusChange={handleStatusUpdate}
        onOpenDealForm={() => setShowDealForm(true)}
      />

      <OpportunityActivityDialog
        isOpen={activityDialog.isOpen}
        onClose={() => setActivityDialog(prev => ({ ...prev, isOpen: false }))}
        opportunityId={activityDialog.opportunityId || ''}
        opportunityName={activityDialog.opportunityName}
        activities={activityDialog.opportunityId ? getOpportunityActivities(activityDialog.opportunityId) : []}
      />

      <OpportunityDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal(prev => ({ ...prev, isOpen: false }))}
        opportunity={detailsModal.opportunity}
      />

      <EnhancedDealDrawerForm
        isOpen={showDealForm}
        onClose={() => setShowDealForm(false)}
        onSave={(dealData) => {
          console.log('Deal created:', dealData);
          setShowDealForm(false);
        }}
      />

      <AutomationApplyDialog
        isOpen={automationDialog.isOpen}
        onClose={() => setAutomationDialog(prev => ({ ...prev, isOpen: false }))}
        opportunityIds={automationDialog.opportunityIds}
        onApply={handleAutomationApply}
      />
    </div>
  );
};
