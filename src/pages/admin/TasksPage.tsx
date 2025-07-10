
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { TaskTable } from '../../components/tasks/TaskTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: string;
  createdDate: string;
  category: string;
  relatedTo: string;
}

const tasksData: Task[] = [
  {
    id: '1',
    title: 'Follow up with John Smith',
    description: 'Call to discuss proposal details and next steps',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-01-20',
    createdDate: '2024-01-15',
    category: 'Sales',
    relatedTo: 'TechCorp Inc.'
  },
  {
    id: '2',
    title: 'Prepare quarterly report',
    description: 'Compile sales data and performance metrics for Q1',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Mike Chen',
    dueDate: '2024-01-25',
    createdDate: '2024-01-10',
    category: 'Reporting',
    relatedTo: 'Internal'
  },
  {
    id: '3',
    title: 'Send contract to Emily Davis',
    description: 'Finalize and send signed contract for review',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'David Brown',
    dueDate: '2024-01-18',
    createdDate: '2024-01-12',
    category: 'Legal',
    relatedTo: 'Global Industries'
  },
  {
    id: '4',
    title: 'Update CRM database',
    description: 'Import new leads from trade show and update contact information',
    status: 'overdue',
    priority: 'urgent',
    assignedTo: 'Emily Rodriguez',
    dueDate: '2024-01-17',
    createdDate: '2024-01-08',
    category: 'Data Management',
    relatedTo: 'Multiple Leads'
  },
  {
    id: '5',
    title: 'Schedule demo meeting',
    description: 'Coordinate demo session with prospect and technical team',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-01-22',
    createdDate: '2024-01-16',
    category: 'Sales',
    relatedTo: 'Innovation Labs'
  }
];

export const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Flag className="h-3 w-3" />;
      case 'high': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasksData.length,
    pending: tasksData.filter(t => t.status === 'pending').length,
    inProgress: tasksData.filter(t => t.status === 'in-progress').length,
    completed: tasksData.filter(t => t.status === 'completed').length,
    overdue: tasksData.filter(t => t.status === 'overdue').length
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks Management</h1>
          <p className="text-gray-600 mt-1">Organize and track your team's tasks and activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ModernKPICard
          title="Total Tasks"
          value={taskStats.total.toString()}
          icon={CheckCircle}
          change={{ value: "+5 this week", trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Pending"
          value={taskStats.pending.toString()}
          icon={Clock}
          change={{ value: "2 due today", trend: "neutral" }}
          gradient="from-yellow-500 to-yellow-600"
        />
        <ModernKPICard
          title="In Progress"
          value={taskStats.inProgress.toString()}
          icon={User}
          change={{ value: "Active", trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Completed"
          value={taskStats.completed.toString()}
          icon={CheckCircle}
          change={{ value: "+3 today", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Overdue"
          value={taskStats.overdue.toString()}
          icon={AlertCircle}
          change={{ value: "Needs attention", trend: "down" }}
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Task List</CardTitle>
              <CardDescription>Manage and track all tasks across your organization</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TaskTable 
            tasks={filteredTasks.map(task => ({
              ...task,
              relatedType: task.category,
              createdAt: task.createdDate
            }))}
            onEdit={(task) => console.log('Edit task:', task)}
            onDelete={(taskId) => console.log('Delete task:', taskId)}
            onStatusChange={(taskId, status) => console.log('Change status:', taskId, status)}
          />
        </CardContent>
      </Card>
    </div>
  );
};
