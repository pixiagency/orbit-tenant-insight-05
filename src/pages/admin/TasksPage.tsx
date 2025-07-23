import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdvancedFilters } from '../../components/shared/AdvancedFilters';
import { TaskTable } from '../../components/tasks/TaskTable';
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

// Filter configuration for tasks
const taskFilterConfig = {
  searchPlaceholder: "Search tasks by title or description...",
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const,
      placeholder: 'Search tasks by title or description...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ],
      defaultValue: 'all'
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Assignees' },
        { value: 'Sarah Johnson', label: 'Sarah Johnson' },
        { value: 'Mike Chen', label: 'Mike Chen' },
        { value: 'Emily Rodriguez', label: 'Emily Rodriguez' }
      ],
      defaultValue: 'all',
      isAdvanced: true
    },
    {
      key: 'dateRange',
      label: 'Due Date Range',
      type: 'date-range' as const,
      isAdvanced: true
    }
  ],
  defaultFilters: {
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    dateRange: { from: undefined, to: undefined }
  }
};

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

const filterTasks = (tasks: Task[], filters: Record<string, any>) => {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchValue = filters.search.toLowerCase();
      const searchFields = [
        task.title,
        task.description,
        task.relatedTo
      ].filter(Boolean);
      
      if (!searchFields.some(field => field.toLowerCase().includes(searchValue))) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Assigned to filter
    if (filters.assignedTo !== 'all' && task.assignedTo !== filters.assignedTo) {
      return false;
    }

    // Date range filter (using due date)
    if (filters.dateRange?.from || filters.dateRange?.to) {
      const taskDate = new Date(task.dueDate);
      if (filters.dateRange.from && taskDate < new Date(filters.dateRange.from)) {
        return false;
      }
      if (filters.dateRange.to && taskDate > new Date(filters.dateRange.to)) {
        return false;
      }
    }

    return true;
  });
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [filters, setFilters] = useState(taskFilterConfig.defaultFilters);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredTasks = filterTasks(tasks, filters);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    overdue: tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== 'completed';
    }).length
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (selectedTask) {
      // Edit existing task
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData, id: task.id }
          : task
      ));
      toast.success('Task updated successfully');
    } else {
      // Add new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created successfully');
    }
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };

  const handleStatusChange = (taskId: string, status: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    ));
    toast.success('Task status updated');
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleSelectAllTasks = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(paginatedTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks</p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernKPICard
          title="Total Tasks"
          value={taskStats.total.toString()}
          icon={Calendar}
          change={{ value: "+15%", trend: "up" }}
        />
        <ModernKPICard
          title="Completed"
          value={taskStats.completed.toString()}
          icon={CheckCircle}
          change={{ value: "+22%", trend: "up" }}
        />
        <ModernKPICard
          title="In Progress"
          value={taskStats.inProgress.toString()}
          icon={Clock}
          change={{ value: "+8%", trend: "up" }}
        />
        <ModernKPICard
          title="Overdue"
          value={taskStats.overdue.toString()}
          icon={AlertCircle}
          change={{ value: "-12%", trend: "down" }}
        />
      </div>

      {/* Filters */}
      <AdvancedFilters
        config={taskFilterConfig}
        filters={filters}
        onFiltersChange={setFilters}
        title="Task Filters"
        filteredCount={filteredTasks.length}
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTasks.length)} of {filteredTasks.length} records
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
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
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TaskTable
            tasks={paginatedTasks}
            selectedTasks={selectedTasks}
            onSelectTask={(id) => handleSelectTask(id, true)}
            onSelectAllTasks={() => handleSelectAllTasks(true)}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tasks found matching your filters</p>
              <Button onClick={() => setFilters(taskFilterConfig.defaultFilters)} variant="outline" className="mt-2">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Form */}
      {showTaskForm && (
        <EnhancedTaskForm
          isOpen={showTaskForm}
          task={selectedTask}
          onClose={() => {
            setShowTaskForm(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default TasksPage;