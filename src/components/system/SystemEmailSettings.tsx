
import React, { useState } from 'react';
import { Save, TestTube, Eye, EyeOff, Mail, Server, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const SystemEmailSettings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null);
  const [emailSettings, setEmailSettings] = useState({
    provider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'CRM System',
    enableSSL: true,
    enableTLS: true,
    enableAuth: true,
    maxRetries: 3,
    timeoutSeconds: 30,
  });

  const [emailTemplates, setEmailTemplates] = useState({
    welcomeEmail: {
      subject: 'Welcome to CRM System',
      template: 'Hi {user_name}, welcome to our CRM system...',
      enabled: true,
    },
    passwordReset: {
      subject: 'Password Reset Request',
      template: 'Hello {user_name}, you requested a password reset...',
      enabled: true,
    },
    packageActivation: {
      subject: 'Package Activated Successfully',
      template: 'Your package {package_name} has been activated...',
      enabled: true,
    },
    invoiceGenerated: {
      subject: 'New Invoice Generated',
      template: 'Your invoice #{invoice_number} is ready...',
      enabled: true,
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTemplateChange = (templateKey: string, field: string, value: any) => {
    setEmailTemplates(prev => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    
    // Simulate API call
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.3 ? 'success' : 'error');
      setIsTestingConnection(false);
    }, 2000);
  };

  const handleSaveSettings = () => {
    console.log('Saving email settings:', emailSettings);
    console.log('Saving email templates:', emailTemplates);
    // TODO: Implement save functionality
  };

  return (
    <div className="space-y-6">
      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="h-5 w-5 mr-2" />
            SMTP Configuration
          </CardTitle>
          <CardDescription>
            Configure your SMTP server settings for sending emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider">Email Provider</Label>
              <Select value={emailSettings.provider} onValueChange={(value) => handleSettingChange('provider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">Custom SMTP</SelectItem>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="outlook">Outlook</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={emailSettings.smtpHost}
                onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={emailSettings.smtpPort}
                onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                placeholder="587"
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={emailSettings.username}
                onChange={(e) => handleSettingChange('username', e.target.value)}
                placeholder="your-email@domain.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={emailSettings.password}
                  onChange={(e) => handleSettingChange('password', e.target.value)}
                  placeholder="Your password or app password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                value={emailSettings.fromEmail}
                onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
                placeholder="noreply@yourcompany.com"
              />
            </div>

            <div>
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={emailSettings.fromName}
                onChange={(e) => handleSettingChange('fromName', e.target.value)}
                placeholder="CRM System"
              />
            </div>

            <div>
              <Label htmlFor="maxRetries">Max Retries</Label>
              <Input
                id="maxRetries"
                type="number"
                value={emailSettings.maxRetries}
                onChange={(e) => handleSettingChange('maxRetries', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>

            <div>
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={emailSettings.timeoutSeconds}
                onChange={(e) => handleSettingChange('timeoutSeconds', parseInt(e.target.value))}
                min="10"
                max="120"
              />
            </div>
          </div>

          {/* Security Options */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security Options
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSSL"
                  checked={emailSettings.enableSSL}
                  onCheckedChange={(checked) => handleSettingChange('enableSSL', checked)}
                />
                <Label htmlFor="enableSSL">Enable SSL</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableTLS"
                  checked={emailSettings.enableTLS}
                  onCheckedChange={(checked) => handleSettingChange('enableTLS', checked)}
                />
                <Label htmlFor="enableTLS">Enable TLS</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableAuth"
                  checked={emailSettings.enableAuth}
                  onCheckedChange={(checked) => handleSettingChange('enableAuth', checked)}
                />
                <Label htmlFor="enableAuth">Enable Authentication</Label>
              </div>
            </div>
          </div>

          {/* Test Connection */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <h4 className="font-medium">Test Connection</h4>
              <p className="text-sm text-gray-500">Verify your SMTP settings are working correctly</p>
            </div>
            <div className="flex items-center space-x-3">
              {connectionStatus === 'success' && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connection Successful
                </Badge>
              )}
              {connectionStatus === 'error' && (
                <Badge variant="destructive">
                  Connection Failed
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
              >
                {isTestingConnection ? (
                  <>Testing...</>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Configure automated email templates for different system events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(emailTemplates).map(([key, template]) => (
            <div key={key} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <Switch
                  checked={template.enabled}
                  onCheckedChange={(checked) => handleTemplateChange(key, 'enabled', checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor={`${key}-subject`}>Subject</Label>
                  <Input
                    id={`${key}-subject`}
                    value={template.subject}
                    onChange={(e) => handleTemplateChange(key, 'subject', e.target.value)}
                    disabled={!template.enabled}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`${key}-template`}>Template</Label>
                  <Textarea
                    id={`${key}-template`}
                    value={template.template}
                    onChange={(e) => handleTemplateChange(key, 'template', e.target.value)}
                    disabled={!template.enabled}
                    rows={3}
                    placeholder="Email template content..."
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Available variables: {'{user_name}'}, {'{package_name}'}, {'{invoice_number}'}, {'{company_name}'}, {'{date}'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="min-w-[120px]">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
