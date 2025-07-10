
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Play, 
  Save,
  Zap,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Users,
  Target,
  Globe,
  Bell,
  FileText,
  CheckSquare
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  title: string;
  config: any;
}

interface WorkflowBuilderProps {
  flow?: any;
  onSave: (flow: any) => void;
  onCancel: () => void;
}

const triggerTypes = [
  { value: 'lead_created', label: 'New Lead Created', icon: Users },
  { value: 'lead_updated', label: 'Lead Status Updated', icon: Target },
  { value: 'lead_score_changed', label: 'Lead Score Changed', icon: Target },
  { value: 'lead_source_match', label: 'Lead Source Match', icon: Globe },
  { value: 'deal_updated', label: 'Deal Status Updated', icon: FileText },
  { value: 'deal_value_threshold', label: 'Deal Value Threshold', icon: FileText },
  { value: 'call_logged', label: 'Call Logged', icon: Phone },
  { value: 'call_missed', label: 'Missed Call', icon: Phone },
  { value: 'message_sent', label: 'Message Sent', icon: MessageSquare },
  { value: 'message_opened', label: 'Message Opened', icon: Mail },
  { value: 'message_replied', label: 'Message Replied', icon: MessageSquare },
  { value: 'no_activity', label: 'No Activity Period', icon: Clock },
  { value: 'scheduled_time', label: 'Scheduled Time', icon: Clock },
  { value: 'geographic_match', label: 'Geographic Match', icon: Globe },
  { value: 'language_match', label: 'Language Match', icon: MessageSquare },
  { value: 'webhook', label: 'External Webhook', icon: Globe },
];

const actionTypes = [
  { value: 'send_message', label: 'Send Message', icon: MessageSquare },
  { value: 'send_email', label: 'Send Email', icon: Mail },
  { value: 'send_notification', label: 'Send Notification', icon: Bell },
  { value: 'assign_lead', label: 'Assign Lead', icon: Users },
  { value: 'assign_multiple', label: 'Assign to Multiple Agents', icon: Users },
  { value: 'smart_assign', label: 'Smart Assignment', icon: Target },
  { value: 'update_status', label: 'Update Status', icon: Target },
  { value: 'update_score', label: 'Update Lead Score', icon: Target },
  { value: 'create_task', label: 'Create Task', icon: CheckSquare },
  { value: 'schedule_followup', label: 'Schedule Follow-up', icon: Clock },
  { value: 'add_to_campaign', label: 'Add to Campaign', icon: MessageSquare },
  { value: 'send_webhook', label: 'Send Webhook', icon: Globe },
];

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ flow, onSave, onCancel }) => {
  const [workflowName, setWorkflowName] = useState(flow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(flow?.description || '');
  const [steps, setSteps] = useState<WorkflowStep[]>(flow?.steps || []);
  const [selectedTrigger, setSelectedTrigger] = useState(flow?.trigger || '');

  const addStep = (type: 'condition' | 'action' | 'delay') => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type,
      title: `New ${type}`,
      config: {}
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleSave = () => {
    const workflowData = {
      name: workflowName,
      description: workflowDescription,
      trigger: selectedTrigger,
      steps,
      status: 'draft',
      actions: steps.filter(s => s.type === 'action').length,
      totalRuns: 0,
      successRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      tags: ['custom']
    };
    onSave(workflowData);
  };

  const renderStepConfig = (step: WorkflowStep) => {
    switch (step.type) {
      case 'action':
        return (
          <div className="space-y-4">
            <Select 
              value={step.config.actionType || ''} 
              onValueChange={(value) => updateStep(step.id, { 
                config: { ...step.config, actionType: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map(action => (
                  <SelectItem key={action.value} value={action.value}>
                    <div className="flex items-center">
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {step.config.actionType === 'send_message' && (
              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea 
                  placeholder="Enter your message..."
                  value={step.config.message || ''}
                  onChange={(e) => updateStep(step.id, {
                    config: { ...step.config, message: e.target.value }
                  })}
                />
              </div>
            )}
            
            {step.config.actionType === 'assign_lead' && (
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select 
                  value={step.config.assignTo || ''} 
                  onValueChange={(value) => updateStep(step.id, {
                    config: { ...step.config, assignTo: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="mike-chen">Mike Chen</SelectItem>
                    <SelectItem value="emily-rodriguez">Emily Rodriguez</SelectItem>
                    <SelectItem value="sales-team">Sales Team</SelectItem>
                    <SelectItem value="support-team">Support Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step.config.actionType === 'assign_multiple' && (
              <div className="space-y-2">
                <Label>Select Multiple Agents</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['John Doe', 'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez'].map(agent => (
                    <div key={agent} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={agent}
                        checked={step.config.selectedAgents?.includes(agent) || false}
                        onChange={(e) => {
                          const currentAgents = step.config.selectedAgents || [];
                          const updatedAgents = e.target.checked
                            ? [...currentAgents, agent]
                            : currentAgents.filter((a: string) => a !== agent);
                          updateStep(step.id, {
                            config: { ...step.config, selectedAgents: updatedAgents }
                          });
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={agent} className="text-sm">{agent}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.config.actionType === 'smart_assign' && (
              <div className="space-y-4">
                <Label>Assignment Rules</Label>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Product/Service</Label>
                    <Select 
                      value={step.config.productRule || ''} 
                      onValueChange={(value) => updateStep(step.id, {
                        config: { ...step.config, productRule: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product rule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software">Software Products → Tech Team</SelectItem>
                        <SelectItem value="consulting">Consulting → Senior Agents</SelectItem>
                        <SelectItem value="hardware">Hardware → Technical Specialists</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Region</Label>
                    <Select 
                      value={step.config.regionRule || ''} 
                      onValueChange={(value) => updateStep(step.id, {
                        config: { ...step.config, regionRule: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region rule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north-america">North America → Local Team</SelectItem>
                        <SelectItem value="europe">Europe → European Team</SelectItem>
                        <SelectItem value="asia">Asia → APAC Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Language</Label>
                    <Select 
                      value={step.config.languageRule || ''} 
                      onValueChange={(value) => updateStep(step.id, {
                        config: { ...step.config, languageRule: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language rule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English → All Agents</SelectItem>
                        <SelectItem value="spanish">Spanish → Spanish Speakers</SelectItem>
                        <SelectItem value="french">French → French Speakers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Agent Capacity & Performance</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="capacity"
                          checked={step.config.considerCapacity || false}
                          onChange={(e) => updateStep(step.id, {
                            config: { ...step.config, considerCapacity: e.target.checked }
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="capacity" className="text-xs">Consider Capacity</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="performance"
                          checked={step.config.considerPerformance || false}
                          onChange={(e) => updateStep(step.id, {
                            config: { ...step.config, considerPerformance: e.target.checked }
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="performance" className="text-xs">Consider Performance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="response-time"
                          checked={step.config.considerResponseTime || false}
                          onChange={(e) => updateStep(step.id, {
                            config: { ...step.config, considerResponseTime: e.target.checked }
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="response-time" className="text-xs">Response Time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="closing-rate"
                          checked={step.config.considerClosingRate || false}
                          onChange={(e) => updateStep(step.id, {
                            config: { ...step.config, considerClosingRate: e.target.checked }
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="closing-rate" className="text-xs">Closing Rate</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'condition':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Select 
                value={step.config.field || ''} 
                onValueChange={(value) => updateStep(step.id, {
                  config: { ...step.config, field: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_source">Lead Source</SelectItem>
                  <SelectItem value="lead_status">Lead Status</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="industry">Industry</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={step.config.operator || ''} 
                onValueChange={(value) => updateStep(step.id, {
                  config: { ...step.config, operator: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                placeholder="Value"
                value={step.config.value || ''}
                onChange={(e) => updateStep(step.id, {
                  config: { ...step.config, value: e.target.value }
                })}
              />
            </div>
          </div>
        );
        
      case 'delay':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="number"
              placeholder="Duration"
              value={step.config.duration || ''}
              onChange={(e) => updateStep(step.id, {
                config: { ...step.config, duration: e.target.value }
              })}
            />
            <Select 
              value={step.config.unit || ''} 
              onValueChange={(value) => updateStep(step.id, {
                config: { ...step.config, unit: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {flow ? 'Edit Workflow' : 'Create New Workflow'}
            </h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Describe what this workflow does"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addStep('condition')}
              >
                <Target className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addStep('action')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Add Action
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addStep('delay')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Add Delay
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Builder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Design</CardTitle>
              <CardDescription>Design your automation workflow step by step</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trigger */}
              <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Badge className="bg-blue-600 text-white mr-2">TRIGGER</Badge>
                    <span className="font-medium">When this happens...</span>
                  </div>
                </div>
                <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map(trigger => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        <div className="flex items-center">
                          <trigger.icon className="h-4 w-4 mr-2" />
                          {trigger.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Steps */}
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 z-10">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Badge 
                          className={
                            step.type === 'condition' ? 'bg-yellow-600 text-white' :
                            step.type === 'action' ? 'bg-green-600 text-white' :
                            'bg-purple-600 text-white'
                          }
                        >
                          {step.type.toUpperCase()}
                        </Badge>
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(step.id, { title: e.target.value })}
                          className="ml-2 border-none p-0 h-auto font-medium"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {renderStepConfig(step)}
                  </div>
                </div>
              ))}

              {/* Add Step Button */}
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">Add more steps to your workflow</p>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => addStep('condition')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Condition
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addStep('action')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Action
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addStep('delay')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Delay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
