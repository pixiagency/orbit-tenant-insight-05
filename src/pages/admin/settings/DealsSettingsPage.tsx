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
  Target, 
  DollarSign, 
  Calendar, 
  Users, 
  Settings,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface DealStage {
  id: string;
  name: string;
  color: string;
  probability: number;
  isDefault: boolean;
}

interface DealSettings {
  // General Settings
  autoAssignment: boolean;
  requireApproval: boolean;
  approvalThreshold: number;
  defaultCurrency: string;
  taxRate: number;
  defaultPaymentTerms: number;
  
  // Deal Features
  enableDiscounts: boolean;
  maxDiscountPercentage: number;
  enableAttachments: boolean;
  attachmentSizeLimit: number;
  enableItemization: boolean;
  
  // Payment Settings
  paymentMethods: string[];
  defaultPaymentMethod: string;
  enablePartialPayments: boolean;
  
  // Deal Sources
  dealSources: string[];
  
  // Assignment Settings
  defaultAssignees: string[];
  
  // Reminder Settings
  reminderSettings: {
    followUpDays: number;
    closeDateReminder: number;
    enableNotifications: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
  };
  
  // Deal Types
  dealTypes: Array<{
    id: string;
    name: string;
    requiresItems: boolean;
    defaultFields: string[];
  }>;
  
  // Pipeline Stages
  stages: DealStage[];
}

export const DealsSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<DealSettings>({
    // General Settings
    autoAssignment: true,
    requireApproval: false,
    approvalThreshold: 10000,
    defaultCurrency: 'USD',
    taxRate: 0,
    defaultPaymentTerms: 30,
    
    // Deal Features
    enableDiscounts: true,
    maxDiscountPercentage: 20,
    enableAttachments: true,
    attachmentSizeLimit: 10,
    enableItemization: true,
    
    // Payment Settings
    paymentMethods: ['cash', 'card', 'bank_transfer', 'check'],
    defaultPaymentMethod: 'card',
    enablePartialPayments: true,
    
    // Deal Sources
    dealSources: ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Trade Show', 'Phone Call'],
    
    // Assignment Settings
    defaultAssignees: ['Sarah Johnson', 'Mike Chen', 'David Brown', 'Emily Rodriguez'],
    
    // Reminder Settings
    reminderSettings: {
      followUpDays: 7,
      closeDateReminder: 3,
      enableNotifications: true,
      reminderFrequency: 'weekly',
    },
    
    // Deal Types
    dealTypes: [
      { id: '1', name: 'Product Sale', requiresItems: true, defaultFields: ['deal_name', 'customer', 'items', 'payment_status'] },
      { id: '2', name: 'Service Sale', requiresItems: true, defaultFields: ['deal_name', 'customer', 'items', 'payment_status'] },
      { id: '3', name: 'Subscription', requiresItems: false, defaultFields: ['deal_name', 'customer', 'recurring_amount', 'billing_cycle'] },
    ],
    
    // Pipeline Stages
    stages: [
      { id: '1', name: 'Prospecting', color: 'blue', probability: 10, isDefault: true },
      { id: '2', name: 'Qualification', color: 'yellow', probability: 25, isDefault: true },
      { id: '3', name: 'Proposal', color: 'purple', probability: 50, isDefault: true },
      { id: '4', name: 'Negotiation', color: 'orange', probability: 75, isDefault: true },
      { id: '5', name: 'Closed Won', color: 'green', probability: 100, isDefault: true },
      { id: '6', name: 'Closed Lost', color: 'red', probability: 0, isDefault: true },
    ]
  });

  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [newStage, setNewStage] = useState({ name: '', color: 'blue', probability: 50 });

  const handleSaveSettings = () => {
    // Save settings logic here
    toast.success('Deal settings saved successfully!');
  };

  const handleAddStage = () => {
    if (!newStage.name.trim()) {
      toast.error('Stage name is required');
      return;
    }

    const stage: DealStage = {
      id: Date.now().toString(),
      name: newStage.name,
      color: newStage.color,
      probability: newStage.probability,
      isDefault: false
    };

    setSettings(prev => ({
      ...prev,
      stages: [...prev.stages, stage]
    }));

    setNewStage({ name: '', color: 'blue', probability: 50 });
    toast.success('Stage added successfully!');
  };

  const handleDeleteStage = (stageId: string) => {
    const stage = settings.stages.find(s => s.id === stageId);
    if (stage?.isDefault) {
      toast.error('Cannot delete default stages');
      return;
    }

    setSettings(prev => ({
      ...prev,
      stages: prev.stages.filter(s => s.id !== stageId)
    }));
    toast.success('Stage deleted successfully!');
  };

  const updateStage = (stageId: string, updates: Partial<DealStage>) => {
    setSettings(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId ? { ...stage, ...updates } : stage
      )
    }));
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
            <Target className="h-6 w-6" />
            Deals Settings
          </h1>
          <p className="text-muted-foreground">Configure deal management settings and workflows</p>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="stages">Stages</TabsTrigger>
          <TabsTrigger value="types">Deal Types</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Deal Settings
              </CardTitle>
              <CardDescription>
                Configure basic deal management preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select 
                    value={settings.defaultCurrency} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, defaultCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Default Payment Terms (days)</Label>
                  <Input
                    id="paymentTerms"
                    type="number"
                    min="1"
                    value={settings.defaultPaymentTerms}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultPaymentTerms: parseInt(e.target.value) || 30 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachmentLimit">Attachment Size Limit (MB)</Label>
                  <Input
                    id="attachmentLimit"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.attachmentSizeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, attachmentSizeLimit: parseInt(e.target.value) || 10 }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-assign Deals</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign new deals to team members</p>
                  </div>
                  <Switch
                    checked={settings.autoAssignment}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAssignment: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Discounts</Label>
                    <p className="text-sm text-muted-foreground">Allow discounts to be applied to deals</p>
                  </div>
                  <Switch
                    checked={settings.enableDiscounts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableDiscounts: checked }))}
                  />
                </div>

                {settings.enableDiscounts && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="maxDiscount">Maximum Discount Percentage</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.maxDiscountPercentage}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxDiscountPercentage: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Attachments</Label>
                    <p className="text-sm text-muted-foreground">Allow file attachments on deals</p>
                  </div>
                  <Switch
                    checked={settings.enableAttachments}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAttachments: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          {/* Deal Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Deal Stages
              </CardTitle>
              <CardDescription>
                Manage your deal pipeline stages and probabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Stages */}
              <div className="space-y-3">
                {settings.stages.map((stage) => (
                  <div key={stage.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getColorBadge(stage.color)}`} />
                      <div>
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {stage.probability}% probability
                          {stage.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingStage(stage.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!stage.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteStage(stage.id)}
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

              {/* Add New Stage */}
              <div className="space-y-4">
                <h4 className="font-medium">Add New Stage</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Stage Name</Label>
                    <Input
                      placeholder="Enter stage name"
                      value={newStage.name}
                      onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select 
                      value={newStage.color} 
                      onValueChange={(value) => setNewStage(prev => ({ ...prev, color: value }))}
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
                    <Label>Probability (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newStage.probability}
                      onChange={(e) => setNewStage(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <Button onClick={handleAddStage} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Stage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          {/* Deal Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Deal Types Configuration
              </CardTitle>
              <CardDescription>
                Configure different types of deals and their default settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {settings.dealTypes.map((type) => (
                  <div key={type.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{type.name}</h4>
                      <Badge variant={type.requiresItems ? "default" : "secondary"}>
                        {type.requiresItems ? "Requires Items" : "Simple Deal"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Default fields: {type.defaultFields.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Item Breakdown</Label>
                    <p className="text-sm text-muted-foreground">Allow detailed item-level breakdown in deals</p>
                  </div>
                  <Switch
                    checked={settings.enableItemization}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableItemization: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Configuration
              </CardTitle>
              <CardDescription>
                Configure payment methods and payment-related settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Available Payment Methods</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['cash', 'card', 'bank_transfer', 'check', 'crypto', 'paypal'].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={method}
                          checked={settings.paymentMethods.includes(method)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSettings(prev => ({
                              ...prev,
                              paymentMethods: checked 
                                ? [...prev.paymentMethods, method]
                                : prev.paymentMethods.filter(m => m !== method)
                            }));
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={method} className="text-sm capitalize cursor-pointer">
                          {method.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default Payment Method</Label>
                  <Select 
                    value={settings.defaultPaymentMethod} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, defaultPaymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Partial Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to make partial payments</p>
                  </div>
                  <Switch
                    checked={settings.enablePartialPayments}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enablePartialPayments: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Deal Sources</h4>
                <div className="space-y-2">
                  <Label>Available Deal Sources</Label>
                  <div className="flex flex-wrap gap-2">
                    {settings.dealSources.map((source, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {source}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => {
                            setSettings(prev => ({
                              ...prev,
                              dealSources: prev.dealSources.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add new source"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !settings.dealSources.includes(value)) {
                            setSettings(prev => ({
                              ...prev,
                              dealSources: [...prev.dealSources, value]
                            }));
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          {/* Approval Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Approval Settings
              </CardTitle>
              <CardDescription>
                Configure approval workflows for high-value deals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Approval for High-Value Deals</Label>
                  <p className="text-sm text-muted-foreground">Require manager approval for deals above threshold</p>
                </div>
                <Switch
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireApproval: checked }))}
                />
              </div>

              {settings.requireApproval && (
                <div className="space-y-4 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor="approvalThreshold">Approval Threshold Amount</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{settings.defaultCurrency}</span>
                      <Input
                        id="approvalThreshold"
                        type="number"
                        min="0"
                        step="100"
                        value={settings.approvalThreshold}
                        onChange={(e) => setSettings(prev => ({ ...prev, approvalThreshold: parseFloat(e.target.value) || 0 }))}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          {/* Reminder Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reminder Settings
              </CardTitle>
              <CardDescription>
                Configure automatic reminders and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email and in-app notifications</p>
                </div>
                <Switch
                  checked={settings.reminderSettings.enableNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      reminderSettings: { ...prev.reminderSettings, enableNotifications: checked }
                    }))
                  }
                />
              </div>

              {settings.reminderSettings.enableNotifications && (
                <div className="space-y-4 ml-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="followUpDays">Follow-up Reminder (days)</Label>
                      <Input
                        id="followUpDays"
                        type="number"
                        min="1"
                        value={settings.reminderSettings.followUpDays}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            reminderSettings: { 
                              ...prev.reminderSettings, 
                              followUpDays: parseInt(e.target.value) || 1 
                            }
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closeDateReminder">Close Date Reminder (days before)</Label>
                      <Input
                        id="closeDateReminder"
                        type="number"
                        min="1"
                        value={settings.reminderSettings.closeDateReminder}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            reminderSettings: { 
                              ...prev.reminderSettings, 
                              closeDateReminder: parseInt(e.target.value) || 1 
                            }
                          }))
                        }
                      />
                    </div>
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