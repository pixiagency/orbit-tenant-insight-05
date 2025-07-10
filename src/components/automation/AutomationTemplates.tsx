
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft,  Users, MessageSquare, Clock, Target, Phone, Mail, Bell } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  trigger: string;
  actions: string[];
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  icon: React.ComponentType<any>;
}

interface AutomationTemplatesProps {
  onSelectTemplate: (template: any) => void;
  onBack: () => void;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'New Lead Welcome Series',
    description: 'Automatically welcome new leads and assign them to the appropriate team member',
    category: 'Lead Management',
    trigger: 'New Lead Created',
    actions: ['Send Welcome Message', 'Assign to Team', 'Create Follow-up Task'],
    difficulty: 'Easy',
    icon: Users
  },
  {
    id: '2',
    name: 'Deal Stage Notifications',
    description: 'Notify team members when deals progress through different stages',
    category: 'Sales Process',
    trigger: 'Deal Status Updated',
    actions: ['Send Notification', 'Update Team Calendar'],
    difficulty: 'Easy',
    icon: Target
  },
  {
    id: '3',
    name: 'Follow-up Reminder System',
    description: 'Send automated reminders if no contact is made within specified timeframes',
    category: 'Communication',
    trigger: 'Scheduled Time',
    actions: ['Check Last Contact', 'Send Reminder', 'Escalate if Needed'],
    difficulty: 'Medium',
    icon: Clock
  },
  {
    id: '4',
    name: 'Call Logging Automation',
    description: 'Automatically log calls and trigger follow-up actions based on call outcomes',
    category: 'Communication',
    trigger: 'Call Logged',
    actions: ['Analyze Call Result', 'Update Lead Status', 'Schedule Follow-up'],
    difficulty: 'Medium',
    icon: Phone
  },
  {
    id: '5',
    name: 'Email Engagement Tracker',
    description: 'Track email opens and clicks, then trigger personalized follow-up sequences',
    category: 'Email Marketing',
    trigger: 'Email Opened',
    actions: ['Record Engagement', 'Send Follow-up', 'Update Lead Score'],
    difficulty: 'Advanced',
    icon: Mail
  },
  {
    id: '6',
    name: 'Subscription Expiry Alerts',
    description: 'Alert customers and sales team about upcoming subscription renewals',
    category: 'Customer Success',
    trigger: 'Scheduled Time',
    actions: ['Check Expiry Dates', 'Send Customer Alert', 'Notify Sales Team'],
    difficulty: 'Medium',
    icon: Bell
  }
];

const categories = ['All', 'Lead Management', 'Sales Process', 'Communication', 'Email Marketing', 'Customer Success'];

export const AutomationTemplates: React.FC<AutomationTemplatesProps> = ({ onSelectTemplate, onBack }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectTemplate = (template: Template) => {
    // Convert template to workflow format
    const workflowTemplate = {
      name: template.name,
      description: template.description,
      trigger: template.trigger,
      actions: template.actions.length,
      status: 'draft',
      totalRuns: 0,
      successRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      tags: [template.category.toLowerCase().replace(' ', '-')]
    };
    onSelectTemplate(workflowTemplate);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Automation Templates</h1>
            <p className="text-gray-600">Choose from pre-built automation workflows</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <template.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {template.description}
              </CardDescription>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Trigger:</p>
                  <Badge variant="outline" className="text-xs">
                    {template.trigger}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Actions:</p>
                  <div className="space-y-1">
                    {template.actions.map((action, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={() => handleSelectTemplate(template)}
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
