
import React, { useState } from 'react';
import { MoreHorizontal, Eye, User, Settings, Database, Shield } from 'lucide-react';
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'data' | 'system' | 'security';
}

interface AuditLogTableProps {
  logs: AuditLog[];
  onView: (log: AuditLog) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs,
  onView,
}) => {
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedLogs(checked ? logs.map(log => log.id) : []);
  };

  const handleSelectLog = (logId: string, checked: boolean) => {
    setSelectedLogs(prev =>
      checked
        ? [...prev, logId]
        : prev.filter(id => id !== logId)
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <Badge className={variants[severity] || 'bg-gray-100 text-gray-800'}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      auth: <User className="h-4 w-4" />,
      data: <Database className="h-4 w-4" />,
      system: <Settings className="h-4 w-4" />,
      security: <Shield className="h-4 w-4" />,
    };

    return icons[category] || <Settings className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {selectedLogs.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {selectedLogs.length} audit log(s) selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedLogs.length === logs.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium">Timestamp</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium">User</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium">Action</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium">Resource</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium">Category</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium">Severity</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium">IP Address</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100 font-medium w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <TableCell>
                <Checkbox
                  checked={selectedLogs.includes(log.id)}
                  onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-300">
                {formatDate(log.timestamp)}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {log.userName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {log.userRole}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {log.action}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {log.resource}
                  </div>
                  {log.resourceId && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {log.resourceId}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {getCategoryIcon(log.category)}
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 capitalize">
                    {log.category}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getSeverityBadge(log.severity)}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-300 font-mono text-sm">
                {log.ipAddress}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(log)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {logs.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No audit logs</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            System activities will be logged here.
          </p>
        </div>
      )}
    </div>
  );
};
