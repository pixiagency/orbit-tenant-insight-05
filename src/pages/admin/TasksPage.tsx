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
  Flag,
  Download,
  Upload,
  Eye,
  FileText,
  TrendingUp,
  Star,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { TaskTable } from '../../components/tasks/TaskTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EnhancedTaskForm } from '../../components/tasks/EnhancedTaskForm';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  relatedTo: string;
  relatedType: string;
  createdAt: string;
  completedAt?: string;
}

const tasksData: Task[] = [
  {
    id: '1',
    title: 'Follow up with John Smith',
    description: 'Call to discuss proposal details and next steps',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-02-15',
    relatedTo: 'TechCorp Deal',
    relatedType: 'deal',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Prepare quarterly report',
    description: 'Compile sales data and performance metrics for Q1',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Mike Chen',
    dueDate: '2024-02-28',
    relatedTo: 'Q1 Review',
    relatedType: 'project',
    createdAt: '2024-01-20T14:20:00Z'
  },
  {
    id: '3',
    title: 'Update CRM system',
    description: 'Import new leads and update contact information',
    status: 'completed',
    priority: 'low',
    assignedTo: 'Emily Rodriguez',
    dueDate: '2024-02-10',
    relatedTo: 'CRM Maintenance',
    relatedType: 'system',
    createdAt: '2024-01-25T11:45:00Z',
    completedAt: '2024-02-08T16:30:00Z'
  }
];

export const TasksPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // KPI Calculations
  const totalTasks = tasksData.length;
  const completedTasks = tasksData.filter(task => task.status === 'completed').length;
  const overdueTasks = tasksData.filter(task => task.status === 'overdue').length;
  const pendingTasks = tasksData.filter(task => task.status === 'pending').length;

  // Filtered data
  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.relatedType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      toast.success(`Task "${taskToDelete.title}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleFormSubmit = (taskData: any) => {
    if (selectedTask) {
      toast.success('Task updated successfully');
    } else {
      toast.success('New task created successfully');
    }
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleExport = () => {
    toast.success('Tasks exported successfully');
  };

  const handleImport = () => {
    toast.success('Tasks imported successfully');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage your team's activities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-900">{totalTasks}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8 this week
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  High quality work
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Overdue</p>
                <p className="text-2xl font-bold text-purple-900">{overdueTasks}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  Great results!
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pending</p>
                <p className="text-2xl font-bold text-orange-900">{pendingTasks}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Strong pipeline
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-600 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Filters */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Task Filters</h2>
          <p className="text-sm text-muted-foreground">Filter and search your tasks</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="deal">Deal</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                  <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                  <SelectItem value="David Brown">David Brown</SelectItem>
                  <SelectItem value="Lisa Park">Lisa Park</SelectItem>
                  <SelectItem value="Jennifer Lee">Jennifer Lee</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80-100)</SelectItem>
                  <SelectItem value="medium">Medium (50-79)</SelectItem>
                  <SelectItem value="low">Low (0-49)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="reporting">Reporting</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relatedTo">Related To</Label>
              <Input placeholder="Search related items..." />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(false)}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tasks ({filteredTasks.length})</h2>
            <p className="text-sm text-muted-foreground">Manage and track your team's tasks</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Show</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center border rounded-md">
              <Button 
                variant="default" 
                size="sm"
                className="rounded-r-none"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-l-none"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border">
          <TaskTable
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={(taskId) => {
              const task = filteredTasks.find(t => t.id === taskId);
              if (task) handleDeleteTask(task);
            }}
            onStatusChange={() => {}}
            searchTerm=""
            onSearchChange={() => {}}
            statusFilter="all"
            onStatusFilterChange={() => {}}
            priorityFilter="all"
            onPriorityFilterChange={() => {}}
          />
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1 to {Math.min(10, filteredTasks.length)} of {filteredTasks.length} records
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm">Page</span>
                <span className="font-medium">1</span>
                <span className="text-sm">of</span>
                <span className="font-medium">6</span>
              </div>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      <EnhancedTaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleFormSubmit}
        task={selectedTask}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};