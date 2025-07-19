import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Mail, Webhook, ExternalLink, Bell } from 'lucide-react';

interface FormAction {
  id: string;
  type: 'email' | 'webhook' | 'redirect' | 'notification';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

interface FormActionsConfigProps {
  actions: FormAction[];
  onChange: (actions: FormAction[]) => void;
}

export const FormActionsConfig: React.FC<FormActionsConfigProps> = ({
  actions,
  onChange
}) => {
  const [showAddAction, setShowAddAction] = useState(false);
  const [editingAction, setEditingAction] = useState<FormAction | null>(null);

  const actionTypes = [
    { value: 'email', label: 'Email Notification', icon: Mail },
    { value: 'webhook', label: 'Webhook', icon: Webhook },
    { value: 'redirect', label: 'Redirect', icon: ExternalLink },
    { value: 'notification', label: 'Show Notification', icon: Bell }
  ];

  const addAction = (type: string) => {
    const newAction: FormAction = {
      id: Date.now().toString(),
      type: type as FormAction['type'],
      name: `New ${type} action`,
      config: getDefaultConfig(type),
      enabled: true
    };
    onChange([...actions, newAction]);
    setEditingAction(newAction);
    setShowAddAction(false);
  };

  const updateAction = (actionId: string, updates: Partial<FormAction>) => {
    onChange(actions.map(action => 
      action.id === actionId ? { ...action, ...updates } : action
    ));
  };

  const removeAction = (actionId: string) => {
    onChange(actions.filter(action => action.id !== actionId));
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'email':
        return { 
          to: '', 
          subject: 'New form submission', 
          template: 'default' 
        };
      case 'webhook':
        return { 
          url: '', 
          method: 'POST', 
          headers: {} 
        };
      case 'redirect':
        return { 
          url: '', 
          delay: 0 
        };
      case 'notification':
        return { 
          message: 'Thank you for your submission!' 
        };
      default:
        return {};
    }
  };

  const renderActionConfig = (action: FormAction) => {
    switch (action.type) {
      case 'email':
        return (
          <div className="space-y-3">
            <div>
              <Label>To Email</Label>
              <Input
                value={action.config.to || ''}
                onChange={(e) => updateAction(action.id, {
                  config: { ...action.config, to: e.target.value }
                })}
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={action.config.subject || ''}
                onChange={(e) => updateAction(action.id, {
                  config: { ...action.config, subject: e.target.value }
                })}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Template</Label>
              <Select
                value={action.config.template || 'default'}
                onValueChange={(value) => updateAction(action.id, {
                  config: { ...action.config, template: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  <SelectItem value="detailed">Detailed Template</SelectItem>
                  <SelectItem value="minimal">Minimal Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-3">
            <div>
              <Label>Webhook URL</Label>
              <Input
                value={action.config.url || ''}
                onChange={(e) => updateAction(action.id, {
                  config: { ...action.config, url: e.target.value }
                })}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Select
                value={action.config.method || 'POST'}
                onValueChange={(value) => updateAction(action.id, {
                  config: { ...action.config, method: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Headers (JSON)</Label>
              <Textarea
                value={JSON.stringify(action.config.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    updateAction(action.id, {
                      config: { ...action.config, headers }
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"Authorization": "Bearer token"}'
                rows={3}
              />
            </div>
          </div>
        );

      case 'redirect':
        return (
          <div className="space-y-3">
            <div>
              <Label>Redirect URL</Label>
              <Input
                value={action.config.url || ''}
                onChange={(e) => updateAction(action.id, {
                  config: { ...action.config, url: e.target.value }
                })}
                placeholder="https://example.com/thank-you"
              />
            </div>
            <div>
              <Label>Delay (seconds)</Label>
              <Input
                type="number"
                value={action.config.delay || 0}
                onChange={(e) => updateAction(action.id, {
                  config: { ...action.config, delay: parseInt(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
          </div>
        );

      case 'notification':
        return (
          <div>
            <Label>Message</Label>
            <Textarea
              value={action.config.message || ''}
              onChange={(e) => updateAction(action.id, {
                config: { ...action.config, message: e.target.value }
              })}
              placeholder="Thank you for your submission!"
              rows={3}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Form Actions</h3>
          <p className="text-sm text-muted-foreground">
            Configure what happens when someone submits this form
          </p>
        </div>
        <Button onClick={() => setShowAddAction(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>

      {showAddAction && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Action</CardTitle>
            <CardDescription>Choose what should happen when the form is submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {actionTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => addAction(type.value)}
                >
                  <type.icon className="h-6 w-6" />
                  <span className="text-sm">{type.label}</span>
                </Button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowAddAction(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {actions.map((action) => {
          const ActionIcon = actionTypes.find(t => t.value === action.type)?.icon || Bell;
          const isEditing = editingAction?.id === action.id;

          return (
            <Card key={action.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ActionIcon className="h-5 w-5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={action.name}
                          onChange={(e) => updateAction(action.id, { name: e.target.value })}
                          className="h-8 font-medium"
                        />
                        <Badge variant={action.enabled ? "default" : "secondary"}>
                          {action.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={action.enabled}
                      onCheckedChange={(enabled) => updateAction(action.id, { enabled })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingAction(isEditing ? null : action)}
                    >
                      {isEditing ? 'Done' : 'Configure'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(action.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isEditing && (
                <CardContent className="pt-0">
                  {renderActionConfig(action)}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {actions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No actions configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add actions to define what happens when someone submits this form
            </p>
            <Button onClick={() => setShowAddAction(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Action
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};