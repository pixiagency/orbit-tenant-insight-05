
import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { AuditLogTable } from '../../components/audit-logs/AuditLogTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

// Mock data
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    userId: 'admin-1',
    userName: 'Admin User',
    userRole: 'Super Admin',
    action: 'Created Package',
    resource: 'Package',
    resourceId: 'pkg-123',
    details: 'Created new Professional Plan package',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-01-15T10:30:00Z',
    severity: 'medium',
    category: 'data',
  },
  {
    id: '2',
    userId: 'admin-2',
    userName: 'Security Admin',
    userRole: 'Admin',
    action: 'Failed Login Attempt',
    resource: 'Authentication',
    details: 'Multiple failed login attempts detected',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    timestamp: '2024-01-15T09:15:00Z',
    severity: 'high',
    category: 'security',
  },
];

export const AuditLogsPage = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.ipAddress.includes(searchQuery);
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleViewLog = (log: AuditLog) => {
    console.log('View audit log:', log);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="Audit Logs"
        description="Monitor system activities, user actions, and security events"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Audit Logs' },
        ]}
        showExportButton
        badge={`${filteredLogs.length} logs`}
      />

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Audit Log Filters
            </CardTitle>
            <CardDescription>
              Filter audit logs by various criteria
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by user, action, resource, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setSeverityFilter('all');
            setDateFilter('all');
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          </div>
        </CardContent>
      </Card>

      <AuditLogTable
        logs={filteredLogs}
        onView={handleViewLog}
      />
    </div>
  );
};
