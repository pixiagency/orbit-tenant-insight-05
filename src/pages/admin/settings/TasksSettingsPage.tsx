import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckSquare, 
  Clock, 
  Users, 
  Settings,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Bell,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface TaskPriority {
  id: string;
  name: string;
  color: string;
  level: number;
  isDefault: boolean;
}

interface TaskStatus {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  isFinal: boolean;
}

interface TaskSettings {
  autoAssignment: boolean;
  allowSelfAssignment: boolean;
  requireDueDate: boolean;
  defaultDuration: number;
  enableSubtasks: boolean;
  enableTimeTracking: boolean;
  enableRecurring: boolean;
  reminderSettings: {
    enableReminders: boolean;
    defaultReminderTime: number;
    escalationHours: number;
    enableOverdueNotifications: boolean;
  };
  priorities: TaskPriority[];
  statuses: TaskStatus[];
}

export const TasksSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<TaskSettings>({
    autoAssignment: false,
    allowSelfAssignment: true,
    requireDueDate: false,
    defaultDuration: 60,
    enableSubtasks: true,
    enableTimeTracking: true,
    enableRecurring: true,
    reminderSettings: {
      enableReminders: true,
      defaultReminderTime: 30,
      escalationHours: 24,
      enableOverdueNotifications: true,
    },
    priorities: [
      { id: '1', name: 'Low', color: 'green', level: 1, isDefault: true },
      { id: '2', name: 'Medium', color: 'yellow', level: 2, isDefault: true },
      { id: '3', name: 'High', color: 'orange', level: 3, isDefault: true },
      { id: '4', name: 'Urgent', color: 'red', level: 4, isDefault: true },
    ],
    statuses: [
      { id: '1', name: 'To Do', color: 'gray', isDefault: true, isFinal: false },
      { id: '2', name: 'In Progress', color: 'blue', isDefault: true, isFinal: false },
      { id: '3', name: 'Review', color: 'purple', isDefault: true, isFinal: false },
      { id: '4', name: 'Completed', color: 'green', isDefault: true, isFinal: true },
      { id: '5', name: 'Cancelled', color: 'red', isDefault: true, isFinal: true },
    ]
  });

  const [newPriority, setNewPriority] = useState({ name: '', color: 'blue', level: 1 });
  const [newStatus, setNewStatus] = useState({ name: '', color: 'blue', isFinal: false });

  const handleSaveSettings = () => {
    // Save settings logic here
    toast.success('Task settings saved successfully!');
  };

  const handleAddPriority = () => {
    if (!newPriority.name.trim()) {
      toast.error('Priority name is required');
      return;
    }

    const priority: TaskPriority = {
      id: Date.now().toString(),
      name: newPriority.name,
      color: newPriority.color,
      level: newPriority.level,
      isDefault: false
    };

    setSettings(prev => ({
      ...prev,
      priorities: [...prev.priorities, priority].sort((a, b) => a.level - b.level)
    }));

    setNewPriority({ name: '', color: 'blue', level: 1 });
    toast.success('Priority added successfully!');
  };

  const handleAddStatus = () => {
    if (!newStatus.name.trim()) {
      toast.error('Status name is required');
      return;
    }

    const status: TaskStatus = {
      id: Date.now().toString(),
      name: newStatus.name,
      color: newStatus.color,
      isDefault: false,
      isFinal: newStatus.isFinal
    };

    setSettings(prev => ({
      ...prev,
      statuses: [...prev.statuses, status]
    }));

    setNewStatus({ name: '', color: 'blue', isFinal: false });
    toast.success('Status added successfully!');
  };

  const handleDeletePriority = (priorityId: string) => {
    const priority = settings.priorities.find(p => p.id === priorityId);
    if (priority?.isDefault) {
      toast.error('Cannot delete default priorities');
      return;
    }

    setSettings(prev => ({
      ...prev,
      priorities: prev.priorities.filter(p => p.id !== priorityId)
    }));
    toast.success('Priority deleted successfully!');
  };

  const handleDeleteStatus = (statusId: string) => {
    const status = settings.statuses.find(s => s.id === statusId);
    if (status?.isDefault) {
      toast.error('Cannot delete default statuses');
      return;
    }

    setSettings(prev => ({
      ...prev,
      statuses: prev.statuses.filter(s => s.id !== statusId)
    }));
    toast.success('Status deleted successfully!');
  };

  const getColorBadge = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      gray: 'bg-gray-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      teal: 'bg-teal-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            Tasks Settings
          </h1>
          <p className="text-muted-foreground">Configure task management settings and workflows</p>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="priorities">Priorities</TabsTrigger>
          <TabsTrigger value="statuses">Statuses</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Task Settings
              </CardTitle>
              <CardDescription>
                Configure basic task management preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultDuration">Default Task Duration (minutes)</Label>
                  <Input
                    id="defaultDuration"
                    type="number"
                    min="15"
                    step="15"
                    value={settings.defaultDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultDuration: parseInt(e.target.value) || 60 }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-assign Tasks</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign new tasks to available team members</p>
                  </div>
                  <Switch
                    checked={settings.autoAssignment}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAssignment: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Self-Assignment</Label>
                    <p className="text-sm text-muted-foreground">Allow team members to assign tasks to themselves</p>
                  </div>
                  <Switch
                    checked={settings.allowSelfAssignment}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowSelfAssignment: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Due Date</Label>
                    <p className="text-sm text-muted-foreground">Make due date mandatory when creating tasks</p>
                  </div>
                  <Switch
                    checked={settings.requireDueDate}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireDueDate: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Subtasks</Label>
                    <p className="text-sm text-muted-foreground">Allow tasks to have subtasks</p>
                  </div>
                  <Switch
                    checked={settings.enableSubtasks}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSubtasks: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Time Tracking</Label>
                    <p className="text-sm text-muted-foreground">Allow time tracking on tasks</p>
                  </div>
                  <Switch
                    checked={settings.enableTimeTracking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableTimeTracking: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Recurring Tasks</Label>
                    <p className="text-sm text-muted-foreground">Allow tasks to be set as recurring</p>
                  </div>
                  <Switch
                    checked={settings.enableRecurring}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRecurring: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priorities" className="space-y-6">
          {/* Task Priorities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Task Priorities
              </CardTitle>
              <CardDescription>
                Manage task priority levels and their appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Priorities */}
              <div className="space-y-3">
                {settings.priorities.map((priority) => (
                  <div key={priority.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getColorBadge(priority.color)}`} />
                      <div>
                        <div className="font-medium">{priority.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Level {priority.level}
                          {priority.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!priority.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePriority(priority.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Add New Priority */}
              <div className="space-y-4">
                <h4 className="font-medium">Add New Priority</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Priority Name</Label>
                    <Input
                      placeholder="Enter priority name"
                      value={newPriority.name}
                      onChange={(e) => setNewPriority(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select 
                      value={newPriority.color} 
                      onValueChange={(value) => setNewPriority(prev => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="indigo">Indigo</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="teal">Teal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newPriority.level}
                      onChange={(e) => setNewPriority(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                <Button onClick={handleAddPriority} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Priority
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statuses" className="space-y-6">
          {/* Task Statuses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Task Statuses
              </CardTitle>
              <CardDescription>
                Manage task workflow statuses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Statuses */}
              <div className="space-y-3">
                {settings.statuses.map((status) => (
                  <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getColorBadge(status.color)}`} />
                      <div>
                        <div className="font-medium">{status.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {status.isFinal ? 'Final status' : 'Active status'}
                          {status.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!status.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteStatus(status.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Add New Status */}
              <div className="space-y-4">
                <h4 className="font-medium">Add New Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status Name</Label>
                    <Input
                      placeholder="Enter status name"
                      value={newStatus.name}
                      onChange={(e) => setNewStatus(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select 
                      value={newStatus.color} 
                      onValueChange={(value) => setNewStatus(prev => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="indigo">Indigo</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="teal">Teal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFinal"
                    checked={newStatus.isFinal}
                    onCheckedChange={(checked) => setNewStatus(prev => ({ ...prev, isFinal: checked }))}
                  />
                  <Label htmlFor="isFinal">Final status (task completion)</Label>
                </div>
                <Button onClick={handleAddStatus} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          {/* Reminder Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Reminder Settings
              </CardTitle>
              <CardDescription>
                Configure task reminders and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send reminders for upcoming tasks</p>
                </div>
                <Switch
                  checked={settings.reminderSettings.enableReminders}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      reminderSettings: { ...prev.reminderSettings, enableReminders: checked }
                    }))
                  }
                />
              </div>

              {settings.reminderSettings.enableReminders && (
                <div className="space-y-4 ml-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultReminder">Default Reminder Time (minutes before)</Label>
                      <Input
                        id="defaultReminder"
                        type="number"
                        min="5"
                        step="5"
                        value={settings.reminderSettings.defaultReminderTime}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            reminderSettings: { 
                              ...prev.reminderSettings, 
                              defaultReminderTime: parseInt(e.target.value) || 30 
                            }
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="escalationHours">Escalation Time (hours after due)</Label>
                      <Input
                        id="escalationHours"
                        type="number"
                        min="1"
                        value={settings.reminderSettings.escalationHours}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            reminderSettings: { 
                              ...prev.reminderSettings, 
                              escalationHours: parseInt(e.target.value) || 24 
                            }
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Overdue Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications for overdue tasks</p>
                    </div>
                    <Switch
                      checked={settings.reminderSettings.enableOverdueNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          reminderSettings: { 
                            ...prev.reminderSettings, 
                            enableOverdueNotifications: checked 
                          }
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};