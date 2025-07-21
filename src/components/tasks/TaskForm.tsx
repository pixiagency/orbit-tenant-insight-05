
import React, { useState, useEffect } from 'react';
import { Calendar, User, Flag, Clock, Tag, Phone, Mail, Users, FileText, Check, ChevronsUpDown, Building2, UserCheck, Target, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DrawerForm } from '@/components/layout/DrawerForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { UserSearchSelect } from './UserSearchSelect';
import { TaskUser } from '@/types/users';

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

interface TaskFormProps {
  isOpen: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (data: any) => void;
  preSelectedOpportunities?: string[];
}

// Mock user data
const mockUsers: TaskUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Sales Manager',
    department: 'Sales',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'Account Executive',
    department: 'Sales',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'David Brown',
    email: 'david@company.com',
    role: 'Sales Representative',
    department: 'Sales',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'Marketing Manager',
    department: 'Marketing',
    avatar: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'alex@company.com',
    role: 'Product Manager',
    department: 'Product',
    avatar: '/placeholder.svg'
  }
];

// Mock data for related items based on type
const mockRelatedData = {
  lead: [{
    id: '1',
    name: 'John Smith - TechCorp'
  }, {
    id: '2',
    name: 'Sarah Johnson - DesignCo'
  }, {
    id: '3',
    name: 'Mike Chen - StartupLtd'
  }],
  opportunity: [{
    id: '1',
    name: 'Website Redesign Project'
  }, {
    id: '2',
    name: 'Mobile App Development'
  }, {
    id: '3',
    name: 'SEO Optimization Campaign'
  }],
  contact: [{
    id: '1',
    name: 'Alice Brown'
  }, {
    id: '2',
    name: 'David Wilson'
  }, {
    id: '3',
    name: 'Emily Davis'
  }],
  deal: [{
    id: '1',
    name: 'Q1 Software License Deal'
  }, {
    id: '2',
    name: 'Annual Consulting Contract'
  }, {
    id: '3',
    name: 'Hardware Purchase Agreement'
  }]
};

// Mock stored tags for autocomplete
const storedTags = ['follow-up', 'urgent', 'client-meeting', 'proposal', 'contract', 'support', 'sales-call', 'presentation', 'demo', 'negotiation', 'onboarding', 'training'];

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  task,
  onClose,
  onSave,
  preSelectedOpportunities = []
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: [] as string[],
    followers: [] as string[],
    dueDate: '',
    dueTime: '',
    reminders: [] as string[],
    opportunity: '',
    taskType: 'call',
    tags: [] as string[],
    notes: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [opportunityOpen, setOpportunityOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: [task.assignedTo],
        followers: [],
        dueDate: task.dueDate,
        dueTime: '',
        reminders: [],
        opportunity: task.relatedTo || '',
        taskType: 'call',
        tags: [],
        notes: ''
      });
    } else {
      // Pre-populate with opportunities if provided
      const selectedOpportunity = preSelectedOpportunities.length > 0 ? preSelectedOpportunities[0] : '';
      const opportunityName = selectedOpportunity ? 
        mockRelatedData.opportunity.find(opp => opp.id === selectedOpportunity)?.name || selectedOpportunity 
        : '';
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: [],
        followers: [],
        dueDate: '',
        dueTime: '',
        reminders: [],
        opportunity: opportunityName,
        taskType: 'call',
        tags: [],
        notes: ''
      });
    }
  }, [task, isOpen, preSelectedOpportunities]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpportunityChange = (opportunityName: string) => {
    setFormData(prev => ({
      ...prev,
      opportunity: opportunityName
    }));
    setOpportunityOpen(false);
  };

  const handleReminderToggle = (reminder: string) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.includes(reminder)
        ? prev.reminders.filter(r => r !== reminder)
        : [...prev.reminders, reminder]
    }));
  };

  const removeReminder = (reminder: string) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r !== reminder)
    }));
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    if (value.length >= 3) {
      const suggestions = storedTags.filter(tag => tag.toLowerCase().includes(value.toLowerCase()) && !formData.tags.includes(tag));
      setTagSuggestions(suggestions);
    } else {
      setTagSuggestions([]);
    }
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
    setTagSuggestions([]);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'meeting':
        return Users;
      case 'email':
        return Mail;
      case 'follow-up':
        return Clock;
      case 'presentation':
        return FileText;
      default:
        return FileText;
    }
  };

  const opportunities = mockRelatedData.opportunity;

  // Predefined reminder options
  const reminderOptions = [
    'On time',
    '5 minutes before',
    '15 minutes before',
    '30 minutes before',
    '1 hour before',
    '2 hours before',
    '1 day before',
    '2 days before',
    '1 week before'
  ];

  return (
    <DrawerForm 
      isOpen={isOpen} 
      onClose={onClose} 
      title={task ? 'Edit Task' : 'Add New Task'} 
      description="Enter the task details below" 
      onSave={handleSave} 
      saveText={task ? 'Update Task' : 'Create Task'}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Task Information</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => handleInputChange('title', e.target.value)} 
                placeholder="Enter task title" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => handleInputChange('description', e.target.value)} 
                placeholder="Enter task description..." 
                rows={3} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskType">Task Type</Label>
                <div className="relative">
                  {React.createElement(getTaskTypeIcon(formData.taskType), {
                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                  })}
                  <Select value={formData.taskType} onValueChange={value => handleInputChange('taskType', value)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={value => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Select value={formData.priority} onValueChange={value => handleInputChange('priority', value)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Assignment & Timeline</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <UserSearchSelect
                users={mockUsers}
                selectedUsers={formData.assignedTo}
                onSelectionChange={(users) => setFormData(prev => ({ ...prev, assignedTo: users }))}
                placeholder="Select assignee"
                multiple={false}
              />
            </div>

            <div className="space-y-2">
              <Label>Followers</Label>
              <UserSearchSelect
                users={mockUsers}
                selectedUsers={formData.followers}
                onSelectionChange={(users) => setFormData(prev => ({ ...prev, followers: users }))}
                placeholder="Select followers"
                multiple={true}
                excludeUsers={formData.assignedTo}
              />
            </div>
          </div>
            
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="dueDate" 
                  type="date" 
                  className="pl-10" 
                  value={formData.dueDate} 
                  onChange={e => handleInputChange('dueDate', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="dueTime" 
                  type="time" 
                  className="pl-10" 
                  value={formData.dueTime} 
                  onChange={e => handleInputChange('dueTime', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reminders</Label>
            <Popover open={remindersOpen} onOpenChange={setRemindersOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={remindersOpen}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <span className="truncate">
                      {formData.reminders.length === 0
                        ? 'Select reminders...'
                        : `${formData.reminders.length} reminder${formData.reminders.length > 1 ? 's' : ''} selected`
                      }
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search reminders..." />
                  <CommandList>
                    <CommandEmpty>No reminders found.</CommandEmpty>
                    <CommandGroup>
                      {reminderOptions.map((reminder) => (
                        <CommandItem
                          key={reminder}
                          value={reminder}
                          onSelect={() => handleReminderToggle(reminder)}
                          className="flex items-center gap-2"
                        >
                          <Bell className="h-4 w-4 text-gray-400" />
                          <span className="flex-1">{reminder}</span>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              formData.reminders.includes(reminder) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Display selected reminders */}
            {formData.reminders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.reminders.map((reminder) => (
                  <Badge
                    key={reminder}
                    variant="secondary"
                    className="flex items-center gap-1 py-1"
                  >
                    <Bell className="h-3 w-3" />
                    <span className="text-xs">{reminder}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeReminder(reminder)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Opportunity</h3>
          
          <div className="space-y-2">
            <Label>Related Opportunity</Label>
            <Popover open={opportunityOpen} onOpenChange={setOpportunityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={opportunityOpen}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="truncate">
                      {formData.opportunity || 'Select opportunity...'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search opportunities..." />
                  <CommandList>
                    <CommandEmpty>No opportunities found.</CommandEmpty>
                    <CommandGroup>
                      {opportunities.map((opportunity) => (
                        <CommandItem
                          key={opportunity.id}
                          value={opportunity.name}
                          onSelect={() => handleOpportunityChange(opportunity.name)}
                          className="flex items-center gap-2"
                        >
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="flex-1">{opportunity.name}</span>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              formData.opportunity === opportunity.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Tags & Notes</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="tags"
                  className="pl-10"
                  value={tagInput}
                  onChange={e => handleTagInputChange(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Type to add tags..."
                />
              </div>
              
              {/* Tag suggestions */}
              {tagSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tagSuggestions.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Selected tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                value={formData.notes} 
                onChange={e => handleInputChange('notes', e.target.value)} 
                placeholder="Enter any additional notes about this task..." 
                rows={4} 
              />
            </div>
          </div>
        </div>
      </div>
    </DrawerForm>
  );
};
