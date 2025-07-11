
import React, { useState, useEffect } from 'react';
import { ModernDashboardLayout } from '../../components/layout/ModernDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Upload, 
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Grid3X3,
  List,
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { PRSRDrawerForm } from '../../components/pr-sr/PRSRDrawerForm';
import { PRSRTable } from '../../components/pr-sr/PRSRTable';
import { PRSRGrid } from '../../components/pr-sr/PRSRGrid';
import { PRSR } from '@/types/pr-sr';

export const PRSRPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [showPRSRForm, setShowPRSRForm] = useState(false);
  const [selectedPRSR, setSelectedPRSR] = useState<PRSR | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleAddPRSR = () => {
    setSelectedPRSR(null);
    setShowPRSRForm(true);
  };

  const handleEditPRSR = (prsr: PRSR) => {
    setSelectedPRSR(prsr);
    setShowPRSRForm(true);
  };

  const handleSavePRSR = (prsrData: any) => {
    console.log('Saving PR/SR:', prsrData);
    setShowPRSRForm(false);
    setSelectedPRSR(null);
    toast.success(selectedPRSR ? 'PR/SR updated successfully!' : 'PR/SR created successfully!');
  };

  const kpiData = [
    { 
      title: 'Total PR/SRs', 
      value: '1,234', 
      change: { value: '+12.5%', trend: 'up' as const }, 
      icon: Users 
    },
    { 
      title: 'Active PR/SRs', 
      value: '892', 
      change: { value: '+8.2%', trend: 'up' as const }, 
      icon: TrendingUp 
    },
    { 
      title: 'Qualified PRs', 
      value: '456', 
      change: { value: '+15.3%', trend: 'up' as const }, 
      icon: Target 
    },
    { 
      title: 'Conversion Rate', 
      value: '37.2%', 
      change: { value: '+2.8%', trend: 'up' as const }, 
      icon: DollarSign 
    }
  ];

  return (
    <ModernDashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">PR / SR Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage public relations and social responsibility contacts</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddPRSR} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add PR/SR Contact
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <ModernKPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search PR/SR contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Contacts</TabsTrigger>
                <TabsTrigger value="pr">PR Contacts</TabsTrigger>
                <TabsTrigger value="sr">SR Contacts</TabsTrigger>
                <TabsTrigger value="qualified">Qualified</TabsTrigger>
                <TabsTrigger value="unqualified">Unqualified</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {viewMode === 'table' ? (
                  <PRSRTable 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter={statusFilter}
                    onEdit={handleEditPRSR}
                  />
                ) : (
                  <PRSRGrid 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter={statusFilter}
                    onEdit={handleEditPRSR}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="pr" className="mt-6">
                {viewMode === 'table' ? (
                  <PRSRTable 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter={statusFilter}
                    typeFilter="pr"
                    onEdit={handleEditPRSR}
                  />
                ) : (
                  <PRSRGrid 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter={statusFilter}
                    typeFilter="pr"
                    onEdit={handleEditPRSR}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="sr" className="mt-6">
                {viewMode === 'table' ? (
                  <PRSRTable 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter={statusFilter}
                    typeFilter="sr"
                    onEdit={handleEditPRSR}
                  />
                ) : (
                  <PRSRGrid 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter={statusFilter}
                    typeFilter="sr"
                    onEdit={handleEditPRSR}
                  />
                )}
              </TabsContent>

              <TabsContent value="qualified" className="mt-6">
                {viewMode === 'table' ? (
                  <PRSRTable 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter="qualified"
                    onEdit={handleEditPRSR}
                  />
                ) : (
                  <PRSRGrid 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter="qualified"
                    onEdit={handleEditPRSR}
                  />
                )}
              </TabsContent>

              <TabsContent value="unqualified" className="mt-6">
                {viewMode === 'table' ? (
                  <PRSRTable 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter="unqualified"
                    onEdit={handleEditPRSR}
                  />
                ) : (
                  <PRSRGrid 
                    searchTerm={searchTerm}
                    sourceFilter={sourceFilter}
                    statusFilter="unqualified"
                    onEdit={handleEditPRSR}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* PR/SR Drawer Form */}
      <PRSRDrawerForm 
        isOpen={showPRSRForm} 
        onClose={() => {
          setShowPRSRForm(false);
          setSelectedPRSR(null);
        }} 
        onSubmit={handleSavePRSR} 
        prsr={selectedPRSR} 
      />
    </ModernDashboardLayout>
  );
};
