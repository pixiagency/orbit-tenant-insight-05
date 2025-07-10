import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Zap,
  Clock,
  Users,
  Target,
  BarChart3
} from 'lucide-react';
import { WorkflowBuilder } from '../../components/automation/WorkflowBuilder';
import { AutomationTemplates } from '../../components/automation/AutomationTemplates';

interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: string;
  actions: number;
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  createdAt: string;
  tags: string[];
}

const mockFlows: AutomationFlow[] = [
  {
    id: '1',
    name: 'New Lead Welcome Sequence',
    description: 'Send welcome message and assign to team when new lead is created',
    status: 'active',
    trigger: 'New Lead Created',
    actions: 3,
    lastRun: '2 hours ago',
    totalRuns: 156,
    successRate: 94,
    createdAt: '2024-01-15',
    tags: ['leads', 'welcome']
  },
  {
    id: '2',
    name: 'Deal Stage Notifications',
    description: 'Notify team when deal moves to closing stage',
    status: 'active',
    trigger: 'Deal Status Updated',
    actions: 2,
    lastRun: '1 day ago',
    totalRuns: 89,
    successRate: 98,
    createdAt: '2024-01-10',
    tags: ['deals', 'notifications']
  },
  {
    id: '3',
    name: 'Follow-up Reminder System',
    description: 'Send reminders if no contact made within 24 hours',
    status: 'inactive',
    trigger: 'Scheduled Time',
    actions: 4,
    totalRuns: 234,
    successRate: 87,
    createdAt: '2024-01-05',
    tags: ['follow-up', 'reminders']
  }
];

export const AutomationPage: React.FC = () => {
  const [flows, setFlows] = useState<AutomationFlow[]>(mockFlows);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<AutomationFlow | null>(null);

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || flow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (flowId: string) => {
    setFlows(flows.map(flow => 
      flow.id === flowId 
        ? { ...flow, status: flow.status === 'active' ? 'inactive' : 'active' as const }
        : flow
    ));
  };

  const handleEditFlow = (flow: AutomationFlow) => {
    setSelectedFlow(flow);
    setShowBuilder(true);
  };

  const handleCreateNew = () => {
    setSelectedFlow(null);
    setShowBuilder(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'inactive': return <Pause className="h-4 w-4 text-gray-600" />;
      default: return <Edit className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (showBuilder) {
    return (
      <WorkflowBuilder 
        flow={selectedFlow}
        onSave={(flow) => {
          if (selectedFlow) {
            setFlows(flows.map(f => f.id === selectedFlow.id ? { ...f, ...flow } : f));
          } else {
            setFlows([...flows, { ...flow, id: Date.now().toString() }]);
          }
          setShowBuilder(false);
        }}
        onCancel={() => setShowBuilder(false)}
      />
    );
  }

  if (showTemplates) {
    return (
      <AutomationTemplates 
        onSelectTemplate={(template) => {
          setSelectedFlow(template);
          setShowTemplates(false);
          setShowBuilder(true);
        }}
        onBack={() => setShowTemplates(false)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation Workflows</h1>
          <p className="text-gray-600 mt-1">Create and manage automated workflows to streamline your processes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowTemplates(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">
                  {flows.filter(f => f.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {flows.reduce((sum, f) => sum + f.totalRuns, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(flows.reduce((sum, f, _, arr) => sum + f.successRate / arr.length, 0))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                <p className="text-2xl font-bold text-gray-900">48h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <div className="grid gap-6">
        {filteredFlows.map((flow) => (
          <Card key={flow.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(flow.status)}
                  <div>
                    <CardTitle className="text-lg">{flow.name}</CardTitle>
                    <CardDescription>{flow.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(flow.status)}>
                    {flow.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(flow.id)}
                  >
                    {flow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditFlow(flow)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Trigger</p>
                  <p className="font-medium">{flow.trigger}</p>
                </div>
                <div>
                  <p className="text-gray-600">Actions</p>
                  <p className="font-medium">{flow.actions} steps</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Runs</p>
                  <p className="font-medium">{flow.totalRuns}</p>
                </div>
                <div>
                  <p className="text-gray-600">Success Rate</p>
                  <p className="font-medium">{flow.successRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Run</p>
                  <p className="font-medium">{flow.lastRun || 'Never'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {flow.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFlows.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first automation workflow to get started.'}
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomationPage;
