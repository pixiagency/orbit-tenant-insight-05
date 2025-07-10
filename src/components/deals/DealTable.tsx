
import React from 'react';
import { MoreHorizontal, DollarSign, Calendar, User } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Deal {
  id: string;
  name: string;
  company: string;
  contact: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  createdAt: string;
}

interface DealTableProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

const getStageColor = (stage: string) => {
  const colors = {
    'prospecting': 'bg-blue-100 text-blue-800',
    'qualification': 'bg-yellow-100 text-yellow-800',
    'proposal': 'bg-purple-100 text-purple-800',
    'negotiation': 'bg-orange-100 text-orange-800',
    'closed-won': 'bg-green-100 text-green-800',
    'closed-lost': 'bg-red-100 text-red-800',
  };
  return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const DealTable: React.FC<DealTableProps> = ({ deals, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Deal</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Probability</TableHead>
            <TableHead>Close Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900">{deal.name}</div>
                  <div className="text-sm text-gray-500">{deal.source}</div>
                </div>
              </TableCell>
              <TableCell>{deal.company}</TableCell>
              <TableCell>{deal.contact}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStageColor(deal.stage)}>
                  {deal.stage.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  {deal.value.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${deal.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{deal.probability}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {new Date(deal.expectedCloseDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {deal.assignedTo}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => onEdit(deal)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(deal.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
