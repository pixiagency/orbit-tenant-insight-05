
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Play, 
  Download, 
  Eye, 
  Link2, 
  PhoneCall, 
  PhoneMissed, 
  PhoneIncoming,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CallLog {
  id: string;
  contactName: string;
  contactPhone: string;
  userId: string;
  userName: string;
  date: string;
  duration: string;
  type: 'outgoing' | 'incoming' | 'missed';
  status: 'completed' | 'not-answered' | 'on-hold' | 'voicemail';
  outcome: 'converted' | 'follow-up' | 'not-interested' | 'qualified' | 'scheduled';
  hasRecording: boolean;
  recordingUrl?: string;
  notes?: string;
  linkedEntity?: {
    type: 'lead' | 'deal' | 'contact' | 'task';
    id: string;
    name: string;
  };
  tags: string[];
}

interface CallLogTableProps {
  callLogs: CallLog[];
  selectedCalls: string[];
  onSelectionChange: (selected: string[]) => void;
  onPlayRecording: (recordingUrl: string) => void;
  onBulkExport: () => void;
  onBulkDelete: () => void;
}

export const CallLogTable: React.FC<CallLogTableProps> = ({
  callLogs,
  selectedCalls,
  onSelectionChange,
  onPlayRecording,
  onBulkExport,
  onBulkDelete
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(callLogs.map(call => call.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectCall = (callId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedCalls, callId]);
    } else {
      onSelectionChange(selectedCalls.filter(id => id !== callId));
    }
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'outgoing': return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case 'incoming': return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case 'missed': return <PhoneMissed className="h-4 w-4 text-red-500" />;
      default: return <PhoneCall className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'bg-green-100 text-green-700',
      'not-answered': 'bg-red-100 text-red-700',
      'on-hold': 'bg-yellow-100 text-yellow-700',
      'voicemail': 'bg-blue-100 text-blue-700'
    };
    return <Badge className={variants[status as keyof typeof variants] || ''}>{status}</Badge>;
  };

  const getOutcomeBadge = (outcome: string) => {
    const variants = {
      'converted': 'bg-green-100 text-green-700',
      'qualified': 'bg-blue-100 text-blue-700',
      'follow-up': 'bg-yellow-100 text-yellow-700',
      'not-interested': 'bg-red-100 text-red-700',
      'scheduled': 'bg-purple-100 text-purple-700'
    };
    return <Badge className={variants[outcome as keyof typeof variants] || ''}>{outcome}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedCalls.length > 0 && (
        <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedCalls.length} call(s) selected
          </span>
          <Button size="sm" variant="outline" onClick={onBulkExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline" onClick={onBulkDelete}>
            Delete
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedCalls.length === callLogs.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Recording</TableHead>
            <TableHead>Linked To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {callLogs.map((call) => (
            <TableRow key={call.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCalls.includes(call.id)}
                  onCheckedChange={(checked) => handleSelectCall(call.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{call.contactName}</div>
                  <div className="text-sm text-gray-500">{call.contactPhone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{call.userName}</div>
              </TableCell>
              <TableCell>
                <div>
                  <div>{new Date(call.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(call.date).toLocaleTimeString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono">{call.duration}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getCallTypeIcon(call.type)}
                  <span className="capitalize">{call.type}</span>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(call.status)}
              </TableCell>
              <TableCell>
                {getOutcomeBadge(call.outcome)}
              </TableCell>
              <TableCell>
                {call.hasRecording ? (
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => call.recordingUrl && onPlayRecording(call.recordingUrl)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-gray-400">No recording</span>
                )}
              </TableCell>
              <TableCell>
                {call.linkedEntity ? (
                  <div className="flex items-center space-x-1">
                    <Link2 className="h-3 w-3 text-blue-500" />
                    <span className="text-sm text-blue-600">
                      {call.linkedEntity.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link2 className="h-4 w-4 mr-2" />
                      Link to Entity
                    </DropdownMenuItem>
                    {call.hasRecording && (
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download Recording
                      </DropdownMenuItem>
                    )}
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
