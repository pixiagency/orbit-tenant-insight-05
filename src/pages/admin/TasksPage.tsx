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
  Phone
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
import { FilterDrawer } from '../../components/shared/FilterDrawer';
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your team's tasks and activities</p>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Tasks"
          value={tasks.length.toString()}
          change="+15%"
          trend="up"
          icon={<Calendar className="h-6 w-6" />}
          color="blue"
        />
        <ModernKPICard
          title="Completed"
          value={tasks.filter(t => t.status === 'completed').length.toString()}
          change="+22%"
          trend="up"
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <ModernKPICard
          title="In Progress"
          value={tasks.filter(t => t.status === 'in-progress').length.toString()}
          change="+8%"
          trend="up"
          icon={<Clock className="h-6 w-6" />}
          color="orange"
        />
        <ModernKPICard
          title="Overdue"
          value={tasks.filter(t => t.status === 'overdue').length.toString()}
          change="-12%"
          trend="down"
          icon={<AlertCircle className="h-6 w-6" />}
          color="red"
        />
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(true)}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          
          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-2">
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
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsDrawerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

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

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <FilterDrawer
          isOpen={showAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
          title="Advanced Filters"
          onApply={() => setShowAdvancedFilters(false)}
          onClear={() => setShowAdvancedFilters(false)}
        />
      )}

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