
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SystemSettingsFormProps {
  settings: any;
  activeTab: string;
  onSave: (settings: any) => void;
}

export const SystemSettingsForm: React.FC<SystemSettingsFormProps> = ({
  settings,
  activeTab,
  onSave,
}) => {
  const [formData, setFormData] = useState(settings);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderGeneralSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure basic system settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={formData.siteName || ''}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              value={formData.siteUrl || ''}
              onChange={(e) => handleInputChange('siteUrl', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmailSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>Configure SMTP settings for email delivery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              value={formData.smtpHost || ''}
              onChange={(e) => handleInputChange('smtpHost', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              type="number"
              value={formData.smtpPort || ''}
              onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input
              id="smtpUsername"
              value={formData.smtpUsername || ''}
              onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input
              id="smtpPassword"
              type="password"
              value={formData.smtpPassword || ''}
              onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="emailFrom">From Email Address</Label>
          <Input
            id="emailFrom"
            type="email"
            value={formData.emailFrom || ''}
            onChange={(e) => handleInputChange('emailFrom', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Configure security and authentication settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
            <Input
              id="passwordMinLength"
              type="number"
              value={formData.passwordMinLength || ''}
              onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={formData.sessionTimeout || ''}
              onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="loginAttempts">Max Login Attempts</Label>
            <Input
              id="loginAttempts"
              type="number"
              value={formData.loginAttempts || ''}
              onChange={(e) => handleInputChange('loginAttempts', parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="twoFactorAuth"
            checked={formData.twoFactorAuth || false}
            onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
          />
          <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderListSettings = (title: string, description: string, key: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={(formData[key] || []).join('\n')}
          onChange={(e) => handleInputChange(key, e.target.value.split('\n').filter(item => item.trim()))}
          placeholder="Enter one item per line"
          rows={6}
        />
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'sources':
        return renderListSettings('Lead Sources', 'Manage available lead sources', 'leadSources');
      case 'departments':
        return renderListSettings('Departments', 'Manage company departments', 'departments');
      case 'industries':
        return renderListSettings('Industries', 'Manage industry categories', 'industries');
      default:
        return <div>Select a tab to configure settings</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderContent()}
      
      <div className="flex justify-end">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
};
