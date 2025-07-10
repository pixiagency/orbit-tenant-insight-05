
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Shield, 
  Zap,
  Settings,
  Key,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AutomationPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // General Settings
    automationEnabled: true,
    maxConcurrentFlows: 10,
    defaultTimeout: 300,
    retryAttempts: 3,
    logLevel: 'info',
    
    // Rate Limiting
    rateLimitEnabled: true,
    maxExecutionsPerMinute: 100,
    maxExecutionsPerHour: 1000,
    
    // Webhook Settings
    webhookTimeout: 30,
    webhookRetries: 2,
    webhookSecretKey: '',
    
    // External Integrations
    zapierEnabled: false,
    zapierWebhookUrl: '',
    makeEnabled: false,
    makeWebhookUrl: '',
    n8nEnabled: false,
    n8nWebhookUrl: '',
    
    // Security
    requireApproval: false,
    approvalThreshold: 100,
    allowExternalTriggers: true,
    ipWhitelist: '',
    
    // Monitoring
    enableMetrics: true,
    enableLogging: true,
    alertOnFailure: true,
    alertEmail: '',
    
    // Performance
    queueEnabled: true,
    maxQueueSize: 1000,
    workerThreads: 4,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulate API call
    toast({
      title: "Settings Saved",
      description: "Automation settings have been updated successfully.",
    });
  };

  const testWebhook = async (type: 'zapier' | 'make' | 'n8n') => {
    const urls = {
      zapier: settings.zapierWebhookUrl,
      make: settings.makeWebhookUrl,
      n8n: settings.n8nWebhookUrl
    };

    const url = urls[type];
    if (!url) {
      toast({
        title: "Error",
        description: `Please enter a ${type} webhook URL first.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString() }),
        mode: 'no-cors'
      });
      
      toast({
        title: "Test Sent",
        description: `Test webhook sent to ${type}. Check your ${type} dashboard.`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: `Failed to send test webhook to ${type}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Settings</h1>
          <p className="text-gray-600 mt-1">Configure automation engine and integration settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic automation engine configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="automation-enabled">Enable Automation Engine</Label>
                    <p className="text-sm text-gray-600">Turn on/off the entire automation system</p>
                  </div>
                  <Switch
                    id="automation-enabled"
                    checked={settings.automationEnabled}
                    onCheckedChange={(checked) => handleSettingChange('automationEnabled', checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-concurrent">Max Concurrent Workflows</Label>
                    <Input
                      id="max-concurrent"
                      type="number"
                      value={settings.maxConcurrentFlows}
                      onChange={(e) => handleSettingChange('maxConcurrentFlows', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default-timeout">Default Timeout (seconds)</Label>
                    <Input
                      id="default-timeout"
                      type="number"
                      value={settings.defaultTimeout}
                      onChange={(e) => handleSettingChange('defaultTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retry-attempts">Retry Attempts</Label>
                    <Input
                      id="retry-attempts"
                      type="number"
                      value={settings.retryAttempts}
                      onChange={(e) => handleSettingChange('retryAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="log-level">Log Level</Label>
                    <Select 
                      value={settings.logLevel} 
                      onValueChange={(value) => handleSettingChange('logLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Rate Limiting
                </CardTitle>
                <CardDescription>Control execution rates to prevent system overload</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rate-limit-enabled">Enable Rate Limiting</Label>
                    <p className="text-sm text-gray-600">Limit the number of workflow executions</p>
                  </div>
                  <Switch
                    id="rate-limit-enabled"
                    checked={settings.rateLimitEnabled}
                    onCheckedChange={(checked) => handleSettingChange('rateLimitEnabled', checked)}
                  />
                </div>

                {settings.rateLimitEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-per-minute">Max Executions per Minute</Label>
                      <Input
                        id="max-per-minute"
                        type="number"
                        value={settings.maxExecutionsPerMinute}
                        onChange={(e) => handleSettingChange('maxExecutionsPerMinute', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-per-hour">Max Executions per Hour</Label>
                      <Input
                        id="max-per-hour"
                        type="number"
                        value={settings.maxExecutionsPerHour}
                        onChange={(e) => handleSettingChange('maxExecutionsPerHour', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* Zapier Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Zapier Integration
                </CardTitle>
                <CardDescription>Connect with Zapier for external automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="zapier-enabled">Enable Zapier Integration</Label>
                    <p className="text-sm text-gray-600">Allow workflows to trigger Zapier zaps</p>
                  </div>
                  <Switch
                    id="zapier-enabled"
                    checked={settings.zapierEnabled}
                    onCheckedChange={(checked) => handleSettingChange('zapierEnabled', checked)}
                  />
                </div>

                {settings.zapierEnabled && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="zapier-webhook">Zapier Webhook URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="zapier-webhook"
                          value={settings.zapierWebhookUrl}
                          onChange={(e) => handleSettingChange('zapierWebhookUrl', e.target.value)}
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => testWebhook('zapier')}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Make Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Make (Integromat) Integration
                </CardTitle>
                <CardDescription>Connect with Make for advanced automation scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="make-enabled">Enable Make Integration</Label>
                    <p className="text-sm text-gray-600">Allow workflows to trigger Make scenarios</p>
                  </div>
                  <Switch
                    id="make-enabled"
                    checked={settings.makeEnabled}
                    onCheckedChange={(checked) => handleSettingChange('makeEnabled', checked)}
                  />
                </div>

                {settings.makeEnabled && (
                  <div>
                    <Label htmlFor="make-webhook">Make Webhook URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="make-webhook"
                        value={settings.makeWebhookUrl}
                        onChange={(e) => handleSettingChange('makeWebhookUrl', e.target.value)}
                        placeholder="https://hook.eu1.make.com/..."
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => testWebhook('make')}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* n8n Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  n8n Integration
                </CardTitle>
                <CardDescription>Connect with n8n for workflow automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="n8n-enabled">Enable n8n Integration</Label>
                    <p className="text-sm text-gray-600">Allow workflows to trigger n8n workflows</p>
                  </div>
                  <Switch
                    id="n8n-enabled"
                    checked={settings.n8nEnabled}
                    onCheckedChange={(checked) => handleSettingChange('n8nEnabled', checked)}
                  />
                </div>

                {settings.n8nEnabled && (
                  <div>
                    <Label htmlFor="n8n-webhook">n8n Webhook URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="n8n-webhook"
                        value={settings.n8nWebhookUrl}
                        onChange={(e) => handleSettingChange('n8nWebhookUrl', e.target.value)}
                        placeholder="https://your-n8n-instance.com/webhook/..."
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => testWebhook('n8n')}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and approval settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require-approval">Require Approval</Label>
                    <p className="text-sm text-gray-600">Require manual approval for certain workflows</p>
                  </div>
                  <Switch
                    id="require-approval"
                    checked={settings.requireApproval}
                    onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
                  />
                </div>

                {settings.requireApproval && (
                  <div>
                    <Label htmlFor="approval-threshold">Approval Threshold</Label>
                    <Input
                      id="approval-threshold"
                      type="number"
                      value={settings.approvalThreshold}
                      onChange={(e) => handleSettingChange('approvalThreshold', parseInt(e.target.value))}
                      placeholder="Number of executions before requiring approval"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="external-triggers">Allow External Triggers</Label>
                    <p className="text-sm text-gray-600">Allow workflows to be triggered from external sources</p>
                  </div>
                  <Switch
                    id="external-triggers"
                    checked={settings.allowExternalTriggers}
                    onCheckedChange={(checked) => handleSettingChange('allowExternalTriggers', checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="webhook-secret">Webhook Secret Key</Label>
                    <Input
                      id="webhook-secret"
                      type="password"
                      value={settings.webhookSecretKey}
                      onChange={(e) => handleSettingChange('webhookSecretKey', e.target.value)}
                      placeholder="Secret key for webhook validation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                    <Textarea
                      id="ip-whitelist"
                      value={settings.ipWhitelist}
                      onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
                      placeholder="One IP address per line"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Monitoring & Alerts
                </CardTitle>
                <CardDescription>Configure monitoring and alert settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-metrics">Enable Metrics</Label>
                      <p className="text-sm text-gray-600">Collect performance metrics</p>
                    </div>
                    <Switch
                      id="enable-metrics"
                      checked={settings.enableMetrics}
                      onCheckedChange={(checked) => handleSettingChange('enableMetrics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-logging">Enable Logging</Label>
                      <p className="text-sm text-gray-600">Log workflow executions</p>
                    </div>
                    <Switch
                      id="enable-logging"
                      checked={settings.enableLogging}
                      onCheckedChange={(checked) => handleSettingChange('enableLogging', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="alert-failure">Alert on Failure</Label>
                      <p className="text-sm text-gray-600">Send alerts when workflows fail</p>
                    </div>
                    <Switch
                      id="alert-failure"
                      checked={settings.alertOnFailure}
                      onCheckedChange={(checked) => handleSettingChange('alertOnFailure', checked)}
                    />
                  </div>
                </div>

                {settings.alertOnFailure && (
                  <div>
                    <Label htmlFor="alert-email">Alert Email</Label>
                    <Input
                      id="alert-email"
                      type="email"
                      value={settings.alertEmail}
                      onChange={(e) => handleSettingChange('alertEmail', e.target.value)}
                      placeholder="admin@company.com"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Performance Settings
                </CardTitle>
                <CardDescription>Configure performance and queue settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="queue-enabled">Enable Queue System</Label>
                    <p className="text-sm text-gray-600">Use queue for better performance</p>
                  </div>
                  <Switch
                    id="queue-enabled"
                    checked={settings.queueEnabled}
                    onCheckedChange={(checked) => handleSettingChange('queueEnabled', checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-queue-size">Max Queue Size</Label>
                    <Input
                      id="max-queue-size"
                      type="number"
                      value={settings.maxQueueSize}
                      onChange={(e) => handleSettingChange('maxQueueSize', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="worker-threads">Worker Threads</Label>
                    <Input
                      id="worker-threads"
                      type="number"
                      value={settings.workerThreads}
                      onChange={(e) => handleSettingChange('workerThreads', parseInt(e.target.value))}
                      min="1"
                      max="16"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-900">Performance Tips</h4>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep worker threads between 2-8 for optimal performance</li>
                    <li>• Monitor queue size during peak hours</li>
                    <li>• Enable rate limiting to prevent system overload</li>
                    <li>• Use delays in workflows to reduce concurrent executions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
