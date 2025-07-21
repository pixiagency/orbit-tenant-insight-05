
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Eye, Edit, Trash2, MoreHorizontal, FileText } from 'lucide-react';
import { DealViewModal } from './DealViewModal';
import { DealInvoiceModal } from './DealInvoiceModal';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  closeDate: string;
  assignedTo: string;
  source: string;
  description: string;
  lastActivity: string;
  payment_status?: 'paid' | 'pending' | 'partial';
  partial_amount?: number;
  due_amount?: number;
}

interface DealTableProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
  onView?: (deal: Deal) => void;
  selectedDeals: string[];
  onSelectDeal: (dealId: string) => void;
  onSelectAllDeals: () => void;
}

const getStageColor = (stage: string): string => {
  switch (stage) {
    case 'prospecting':
      return 'bg-blue-100 text-blue-800';
    case 'qualification':
      return 'bg-yellow-100 text-yellow-800';
    case 'proposal':
      return 'bg-purple-100 text-purple-800';
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

const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'partial':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const DealTable: React.FC<DealTableProps> = ({
  deals,
  onEdit,
  onDelete,
  onView,
  selectedDeals,
  onSelectDeal,
  onSelectAllDeals
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedDeals.length === deals.length && deals.length > 0}
              onCheckedChange={onSelectAllDeals}
            />
          </TableHead>
          <TableHead>Deal</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Close Date</TableHead>
          <TableHead>Assigned To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deals.map((deal) => (
          <TableRow key={deal.id}>
            <TableCell>
              <Checkbox
                checked={selectedDeals.includes(deal.id)}
                onCheckedChange={() => onSelectDeal(deal.id)}
              />
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center justify-between">
                <span>{deal.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DealViewModal deal={deal}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                    </DealViewModal>
                    {(deal.payment_status === 'paid' || deal.payment_status === 'partial') && (
                      <DealInvoiceModal deal={deal}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Invoice
                        </DropdownMenuItem>
                      </DealInvoiceModal>
                    )}
                    <DropdownMenuItem onClick={() => onEdit(deal)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(deal.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
            <TableCell>{deal.company}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>${deal.value.toLocaleString()}</div>
                {deal.payment_status === 'partial' && deal.due_amount && (
                  <div className="text-xs text-orange-600">
                    Due: ${deal.due_amount.toLocaleString()}
                  </div>
                )}
                {deal.payment_status === 'pending' && (
                  <div className="text-xs text-yellow-600">
                    Due: ${deal.value.toLocaleString()}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={getStageColor(deal.stage)}>
                {deal.stage}
              </Badge>
            </TableCell>
            <TableCell>
              {deal.payment_status && (
                <Badge variant="secondary" className={getPaymentStatusColor(deal.payment_status)}>
                  {deal.payment_status === 'partial' && deal.partial_amount 
                    ? `Partial ($${deal.partial_amount.toLocaleString()})`
                    : deal.payment_status.charAt(0).toUpperCase() + deal.payment_status.slice(1)
                  }
                </Badge>
              )}
            </TableCell>
            <TableCell>{deal.closeDate}</TableCell>
            <TableCell>{deal.assignedTo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
