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
  Target,
  Mail,
  Phone,
  X
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
import { TaskAdvancedFilters } from '../../components/tasks/TaskAdvancedFilters';
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

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [appliedFilters, setAppliedFilters] = useState<Array<{id: string, label: string, type: string}>>([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    dueDateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    priorityFilter: 'all',
    assignedTo: 'all',
    status: 'all',
    lastActivity: 'all',
    operator: 'AND' as 'AND' | 'OR',
    textCondition: 'contains' as 'contains' | 'equals' | 'not_contains' | 'not_equals'
  });

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAllTasks = () => {
    if (selectedTasks.length === paginatedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(paginatedTasks.map(task => task.id));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const handleStatusChange = (taskId: string, status: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
    toast.success('Task status updated');
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(prev => prev.filter(task => task.id !== taskToDelete));
      toast.success('Task deleted successfully');
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (priorityFilter !== 'all') count++;
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) count++;
    if (advancedFilters.dueDateRange.from || advancedFilters.dueDateRange.to) count++;
    if (advancedFilters.priorityFilter !== 'all') count++;
    if (advancedFilters.assignedTo !== 'all') count++;
    if (advancedFilters.status !== 'all') count++;
    if (advancedFilters.lastActivity !== 'all') count++;
    return count;
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      dueDateRange: { from: undefined, to: undefined },
      priorityFilter: 'all',
      assignedTo: 'all',
      status: 'all',
      lastActivity: 'all',
      operator: 'AND',
      textCondition: 'contains'
    });
    setAppliedFilters([]);
  };

  const applyAdvancedFilters = () => {
    const newAppliedFilters = [];
    
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) {
      newAppliedFilters.push({
        id: 'dateRange',
        label: `Created: ${advancedFilters.dateRange.from?.toLocaleDateString() || 'Any'} - ${advancedFilters.dateRange.to?.toLocaleDateString() || 'Any'}`,
        type: 'dateRange'
      });
    }
    
    if (advancedFilters.dueDateRange.from || advancedFilters.dueDateRange.to) {
      newAppliedFilters.push({
        id: 'dueDateRange',
        label: `Due: ${advancedFilters.dueDateRange.from?.toLocaleDateString() || 'Any'} - ${advancedFilters.dueDateRange.to?.toLocaleDateString() || 'Any'}`,
        type: 'dueDateRange'
      });
    }
    
    if (advancedFilters.priorityFilter !== 'all') {
      newAppliedFilters.push({
        id: 'priorityFilter',
        label: `Priority: ${advancedFilters.priorityFilter}`,
        type: 'priorityFilter'
      });
    }
    
    if (advancedFilters.assignedTo !== 'all') {
      newAppliedFilters.push({
        id: 'assignedTo',
        label: `Assigned: ${advancedFilters.assignedTo}`,
        type: 'assignedTo'
      });
    }
    
    if (advancedFilters.status !== 'all') {
      newAppliedFilters.push({
        id: 'status',
        label: `Status: ${advancedFilters.status}`,
        type: 'status'
      });
    }
    
    if (advancedFilters.lastActivity !== 'all') {
      newAppliedFilters.push({
        id: 'lastActivity',
        label: `Activity: ${advancedFilters.lastActivity}`,
        type: 'lastActivity'
      });
    }
    
    setAppliedFilters(newAppliedFilters);
    setShowAdvancedFilters(false);
  };

  const removeAppliedFilter = (filterId: string) => {
    const updatedAdvancedFilters = { ...advancedFilters };
    
    switch (filterId) {
      case 'dateRange':
        updatedAdvancedFilters.dateRange = { from: undefined, to: undefined };
        break;
      case 'dueDateRange':
        updatedAdvancedFilters.dueDateRange = { from: undefined, to: undefined };
        break;
      case 'priorityFilter':
        updatedAdvancedFilters.priorityFilter = 'all';
        break;
      case 'assignedTo':
        updatedAdvancedFilters.assignedTo = 'all';
        break;
      case 'status':
        updatedAdvancedFilters.status = 'all';
        break;
      case 'lastActivity':
        updatedAdvancedFilters.lastActivity = 'all';
        break;
    }
    
    setAdvancedFilters(updatedAdvancedFilters);
    setAppliedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Tasks"
          value={tasks.length.toString()}
          change={{ value: "+15%", trend: "up" }}
          icon={Calendar}
        />
        <ModernKPICard
          title="Completed"
          value={tasks.filter(t => t.status === 'completed').length.toString()}
          change={{ value: "+22%", trend: "up" }}
          icon={CheckCircle}
        />
        <ModernKPICard
          title="In Progress"
          value={tasks.filter(t => t.status === 'in-progress').length.toString()}
          change={{ value: "+8%", trend: "up" }}
          icon={Clock}
        />
        <ModernKPICard
          title="Overdue"
          value={tasks.filter(t => t.status === 'overdue').length.toString()}
          change={{ value: "-12%", trend: "down" }}
          icon={AlertCircle}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Task Filters</CardTitle>
              <CardDescription>Filter and search your tasks</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              {getActiveFiltersCount() > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters ({getActiveFiltersCount()})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search tasks..." className="pl-10" />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Chen</SelectItem>
                <SelectItem value="emily">Emily Rodriguez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {appliedFilters.map((filter) => (
                <div key={filter.id} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  <span>{filter.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-primary/20"
                    onClick={() => removeAppliedFilter(filter.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedTasks.length} selected
              </span>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Make Call
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">entries</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTasks.length)} of {filteredTasks.length} records
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <TaskTable
            tasks={paginatedTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            selectedTasks={selectedTasks}
            onSelectTask={handleSelectTask}
            onSelectAllTasks={handleSelectAllTasks}
          />
        </CardContent>
      </Card>

      <TaskAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onApplyFilters={applyAdvancedFilters}
        onClearFilters={() => {
          setAdvancedFilters({
            dateRange: { from: undefined, to: undefined },
            dueDateRange: { from: undefined, to: undefined },
            priorityFilter: 'all',
            assignedTo: 'all',
            status: 'all',
            lastActivity: 'all',
            operator: 'AND',
            textCondition: 'contains'
          });
          setAppliedFilters([]);
        }}
      />

      {/* Task Form */}
      <EnhancedTaskForm
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingTask(null);
        }}
        onSave={(taskData) => {
          if (editingTask) {
            setTasks(prev => prev.map(task =>
              task.id === editingTask.id ? { ...task, ...taskData } : task
            ));
            toast.success('Task updated successfully');
          } else {
            const newTask = {
              id: Date.now().toString(),
              ...taskData,
              createdAt: new Date().toISOString()
            };
            setTasks(prev => [...prev, newTask]);
            toast.success('Task created successfully');
          }
          setIsDrawerOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TasksPage;