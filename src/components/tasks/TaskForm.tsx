
import React, { useState, useEffect } from 'react';
import { Calendar, User, Flag, Clock, Tag, Phone, Mail, Users, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DrawerForm } from '@/components/layout/DrawerForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

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

// Mock data for related items based on type
const mockRelatedData = {
  lead: [
    { id: '1', name: 'John Smith - TechCorp' },
    { id: '2', name: 'Sarah Johnson - DesignCo' },
    { id: '3', name: 'Mike Chen - StartupLtd' }
  ],
  opportunity: [
    { id: '1', name: 'Website Redesign Project' },
    { id: '2', name: 'Mobile App Development' },
    { id: '3', name: 'SEO Optimization Campaign' }
  ],
  contact: [
    { id: '1', name: 'Alice Brown' },
    { id: '2', name: 'David Wilson' },
    { id: '3', name: 'Emily Davis' }
  ],
  deal: [
    { id: '1', name: 'Q1 Software License Deal' },
    { id: '2', name: 'Annual Consulting Contract' },
    { id: '3', name: 'Hardware Purchase Agreement' }
  ]
};

// Mock stored tags for autocomplete
const storedTags = [
  'follow-up', 'urgent', 'client-meeting', 'proposal', 'contract', 'support',
  'sales-call', 'presentation', 'demo', 'negotiation', 'onboarding', 'training'
];

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
    assignedTo: '',
    dueDate: '',
    dueTime: '',
    relatedTo: [] as string[],
    relatedType: 'opportunity',
    taskType: 'call',
    tags: [] as string[],
    notes: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        dueTime: '',
        relatedTo: Array.isArray(task.relatedTo) ? task.relatedTo : [task.relatedTo],
        relatedType: task.relatedType,
        taskType: 'call',
        tags: [],
        notes: ''
      });
    } else {
      // Pre-populate with opportunities if provided
      const selectedOpportunityNames = preSelectedOpportunities.map(oppId => {
        const opportunity = mockRelatedData.opportunity.find(opp => opp.id === oppId);
        return opportunity ? opportunity.name : oppId;
      });
      
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        dueTime: '',
        relatedTo: selectedOpportunityNames,
        relatedType: 'opportunity',
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

  const handleRelatedTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      relatedType: value,
      relatedTo: [] // Reset related to when type changes
    }));
  };

  const handleRelatedToChange = (selectedItems: string[]) => {
    setFormData(prev => ({
      ...prev,
      relatedTo: selectedItems
    }));
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    
    if (value.length >= 3) {
      const suggestions = storedTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase()) &&
        !formData.tags.includes(tag)
      );
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
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
                  <Select value={formData.taskType} onValueChange={(value) => handleInputChange('taskType', value)}>
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
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
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
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="David Brown">David Brown</SelectItem>
                    <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
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
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
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
                    onChange={(e) => handleInputChange('dueTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Related Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relatedType">Related To Type</Label>
                <Select value={formData.relatedType} onValueChange={handleRelatedTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="opportunity">Opportunity</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="deal">Deal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related To (Multiple Selection)</Label>
                <div className="space-y-2">
                  {formData.relatedTo.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.relatedTo.map((item) => (
                        <Badge key={item} variant="outline" className="flex items-center gap-1">
                          {item}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => {
                              const updated = formData.relatedTo.filter(i => i !== item);
                              handleRelatedToChange(updated);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                    {mockRelatedData[formData.relatedType as keyof typeof mockRelatedData]?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`related-${item.id}`}
                          checked={formData.relatedTo.includes(item.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleRelatedToChange([...formData.relatedTo, item.name]);
                            } else {
                              handleRelatedToChange(formData.relatedTo.filter(i => i !== item.name));
                            }
                          }}
                        />
                        <Label htmlFor={`related-${item.id}`} className="text-sm font-normal cursor-pointer">
                          {item.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => handleTagInputChange(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Type at least 3 characters to see suggestions..."
                  />
                  {tagSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-32 overflow-y-auto">
                      {tagSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => addTag(suggestion)}
                        >
                          <Tag className="h-3 w-3" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Enter any additional notes about this task..."
            rows={4}
          />
        </div>
      </div>
    </DrawerForm>
  );
};
