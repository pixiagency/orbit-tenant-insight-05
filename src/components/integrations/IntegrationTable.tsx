
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { MoreVertical, Settings, TestTube, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  platform: 'google' | 'meta' | 'tiktok';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  enabled: boolean;
  apiCalls: number;
  errorCount: number;
}

interface IntegrationTableProps {
  integrations: Integration[];
  onEdit: (integration: Integration) => void;
  onDelete: (integration: Integration) => void;
  onToggle: (integration: Integration) => void;
  onTest: (integration: Integration) => void;
}

export const IntegrationTable: React.FC<IntegrationTableProps> = ({
  integrations,
  onEdit,
  onDelete,
  onToggle,
  onTest,
}) => {
  const { toast } = useToast();

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPlatformColor = (platform: Integration['platform']) => {
    switch (platform) {
      case 'google':
        return 'text-blue-600';
      case 'meta':
        return 'text-blue-700';
      case 'tiktok':
        return 'text-black';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Integration</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead>API Calls</TableHead>
            <TableHead>Errors</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                No integrations configured yet
              </TableCell>
            </TableRow>
          ) : (
            integrations.map((integration) => (
              <TableRow key={integration.id}>
                <TableCell className="font-medium">{integration.name}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getPlatformColor(integration.platform)}`}>
                    {integration.platform.charAt(0).toUpperCase() + integration.platform.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(integration.status)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(integration.lastSync).toLocaleDateString()}
                </TableCell>
                <TableCell>{integration.apiCalls.toLocaleString()}</TableCell>
                <TableCell>
                  {integration.errorCount > 0 ? (
                    <span className="text-red-600 font-medium">{integration.errorCount}</span>
                  ) : (
                    <span className="text-green-600">0</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => onToggle(integration)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(integration)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTest(integration)}>
                        <TestTube className="mr-2 h-4 w-4" />
                        Test Connection
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(integration)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
