import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Filter, 
  Search, 
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Eye,
  Download,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Form {
  id: string;
  name: string;
  description: string;
  type: 'contact' | 'lead-capture' | 'survey' | 'feedback';
  status: 'active' | 'inactive' | 'draft';
  submissions: number;
  conversionRate: number;
  lastSubmission?: string;
  createdAt: string;
}

interface FormSubmission {
  id: string;
  formName: string;
  submitterName: string;
  submitterEmail: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  submittedAt: string;
  assignedTo?: string;
}

const formsData: Form[] = [
  {
    id: '1',
    name: 'Contact Us Form',
    description: 'General contact form for website visitors',
    type: 'contact',
    status: 'active',
    submissions: 156,
    conversionRate: 23,
    lastSubmission: '2024-01-18T10:30:00',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Product Demo Request',
    description: 'Lead capture for product demonstrations',
    type: 'lead-capture',
    status: 'active',
    submissions: 89,
    conversionRate: 45,
    lastSubmission: '2024-01-18T09:15:00',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Customer Feedback Survey',
    description: 'Post-purchase customer satisfaction survey',
    type: 'survey',
    status: 'active',
    submissions: 234,
    conversionRate: 67,
    lastSubmission: '2024-01-18T08:45:00',
    createdAt: '2024-01-05'
  }
];

const submissionsData: FormSubmission[] = [
  {
    id: '1',
    formName: 'Contact Us Form',
    submitterName: 'John Smith',
    submitterEmail: 'john.smith@email.com',
    company: 'TechCorp Inc.',
    status: 'new',
    submittedAt: '2024-01-18T10:30:00'
  },
  {
    id: '2',
    formName: 'Product Demo Request',
    submitterName: 'Sarah Johnson',
    submitterEmail: 'sarah.j@startup.com',
    company: 'StartupXYZ',
    status: 'contacted',
    submittedAt: '2024-01-18T09:15:00',
    assignedTo: 'Mike Chen'
  },
  {
    id: '3',
    formName: 'Customer Feedback Survey',
    submitterName: 'Robert Wilson',
    submitterEmail: 'r.wilson@company.com',
    status: 'converted',
    submittedAt: '2024-01-18T08:45:00'
  }
];

export const FormsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'qualified': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'converted': return 'bg-green-100 text-green-700 border-green-200';
      case 'lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFormTypeColor = (type: string) => {
    switch (type) {
      case 'contact': return 'bg-blue-100 text-blue-600';
      case 'lead-capture': return 'bg-green-100 text-green-600';
      case 'survey': return 'bg-purple-100 text-purple-600';
      case 'feedback': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredForms = formsData.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSubmissions = submissionsData.filter(submission => {
    const matchesSearch = submission.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.submitterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.formName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formStats = {
    total: formsData.length,
    active: formsData.filter(f => f.status === 'active').length,
    totalSubmissions: formsData.reduce((sum, f) => sum + f.submissions, 0),
    avgConversionRate: Math.round(formsData.reduce((sum, f) => sum + f.conversionRate, 0) / formsData.length)
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms & Submissions</h1>
          <p className="text-gray-600 mt-1">Manage your forms and track submission analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernKPICard
          title="Total Forms"
          value={formStats.total.toString()}
          icon={FileText}
          change={{ value: `${formStats.active} active`, trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Total Submissions"
          value={formStats.totalSubmissions.toString()}
          icon={Users}
          change={{ value: "+12 today", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Avg Conversion Rate"
          value={`${formStats.avgConversionRate}%`}
          icon={TrendingUp}
          change={{ value: "+5% this month", trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="New Submissions"
          value={submissionsData.filter(s => s.status === 'new').length.toString()}
          icon={Calendar}
          change={{ value: "Needs attention", trend: "neutral" }}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Forms Management</CardTitle>
              <CardDescription>Monitor form performance and manage submissions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search forms or submissions..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="forms" className="space-y-4">
            <TabsList>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="forms" className="space-y-4">
              <div className="space-y-4">
                {filteredForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{form.name}</h3>
                          <Badge variant="outline" className={getFormTypeColor(form.type)}>
                            {form.type}
                          </Badge>
                          <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                            {form.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{form.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{form.submissions} submissions</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{form.conversionRate}% conversion</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Form
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Form
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Form
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submitter</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.submitterName}</div>
                          <div className="text-sm text-gray-500">{submission.submitterEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{submission.formName}</TableCell>
                      <TableCell>{submission.company || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{submission.assignedTo || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Form analytics and insights coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 