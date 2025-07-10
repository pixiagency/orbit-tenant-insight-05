
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IntegrationTable } from '../../../components/integrations/IntegrationTable';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface IntegrationSettings {
  google: {
    enabled: boolean;
    apiKey: string;
    clientId: string;
    clientSecret: string;
  };
  meta: {
    enabled: boolean;
    appId: string;
    appSecret: string;
    accessToken: string;
  };
  tiktok: {
    enabled: boolean;
    appId: string;
    appSecret: string;
    accessToken: string;
  };
}

interface Integration {
  id: string;
  name: string;
  platform: 'google' | 'meta' | 'tiktok';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  enabled: boolean;
  apiCalls: number;
  errorCount: number;
}

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: '1',
    name: 'Google Ads Campaign Sync',
    platform: 'google',
    status: 'connected',
    lastSync: '2024-01-20T10:30:00Z',
    enabled: true,
    apiCalls: 1250,
    errorCount: 0,
  },
  {
    id: '2',
    name: 'Meta Business Integration',
    platform: 'meta',
    status: 'error',
    lastSync: '2024-01-19T15:45:00Z',
    enabled: false,
    apiCalls: 890,
    errorCount: 3,
  },
  {
    id: '3',
    name: 'TikTok Ads Analytics',
    platform: 'tiktok',
    status: 'disconnected',
    lastSync: '2024-01-18T09:20:00Z',
    enabled: false,
    apiCalls: 450,
    errorCount: 1,
  },
];

export const IntegrationsPage: React.FC = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [settings, setSettings] = useState<IntegrationSettings>({
    google: {
      enabled: false,
      apiKey: '',
      clientId: '',
      clientSecret: '',
    },
    meta: {
      enabled: false,
      appId: '',
      appSecret: '',
      accessToken: '',
    },
    tiktok: {
      enabled: false,
      appId: '',
      appSecret: '',
      accessToken: '',
    },
  });

  const handleToggle = (platform: keyof IntegrationSettings) => {
    setSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        enabled: !prev[platform].enabled,
      },
    }));
  };

  const handleInputChange = (platform: keyof IntegrationSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const handleSave = (platform: keyof IntegrationSettings) => {
    toast({
      title: "Settings Saved",
      description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} integration settings have been saved successfully.`,
    });
  };

  const testConnection = (platform: keyof IntegrationSettings) => {
    toast({
      title: "Connection Test",
      description: `Testing ${platform.charAt(0).toUpperCase() + platform.slice(1)} connection...`,
    });
  };

  const handleEditIntegration = (integration: Integration) => {
    toast({
      title: "Edit Integration",
      description: `Editing ${integration.name}...`,
    });
  };

  const handleDeleteIntegration = (integration: Integration) => {
    setIntegrations(prev => prev.filter(i => i.id !== integration.id));
    toast({
      title: "Integration Deleted",
      description: `${integration.name} has been deleted.`,
    });
  };

  const handleToggleIntegration = (integration: Integration) => {
    setIntegrations(prev => 
      prev.map(i => 
        i.id === integration.id ? { ...i, enabled: !i.enabled } : i
      )
    );
    toast({
      title: integration.enabled ? "Integration Disabled" : "Integration Enabled",
      description: `${integration.name} has been ${integration.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleTestIntegration = (integration: Integration) => {
    toast({
      title: "Testing Connection",
      description: `Testing connection for ${integration.name}...`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Third-Party Integrations</h1>
          <p className="text-gray-600">Connect with social media platforms and external services</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Integrations</CardTitle>
          <CardDescription>Manage your connected integrations and monitor their status</CardDescription>
        </CardHeader>
        <CardContent>
          <IntegrationTable
            integrations={integrations}
            onEdit={handleEditIntegration}
            onDelete={handleDeleteIntegration}
            onToggle={handleToggleIntegration}
            onTest={handleTestIntegration}
          />
        </CardContent>
      </Card>

      {/* Platform Settings */}
      <Tabs defaultValue="google" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="meta">Meta (Facebook)</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
        </TabsList>

        <TabsContent value="google">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Google Integration
                    <Badge variant={settings.google.enabled ? "default" : "secondary"}>
                      {settings.google.enabled ? "Connected" : "Disconnected"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Connect with Google Ads, Analytics, and other Google services
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.google.enabled}
                  onCheckedChange={() => handleToggle('google')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="google-api-key">API Key</Label>
                  <Input
                    id="google-api-key"
                    type="password"
                    placeholder="Enter Google API Key"
                    value={settings.google.apiKey}
                    onChange={(e) => handleInputChange('google', 'apiKey', e.target.value)}
                    disabled={!settings.google.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="google-client-id">Client ID</Label>
                  <Input
                    id="google-client-id"
                    placeholder="Enter Client ID"
                    value={settings.google.clientId}
                    onChange={(e) => handleInputChange('google', 'clientId', e.target.value)}
                    disabled={!settings.google.enabled}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="google-client-secret">Client Secret</Label>
                <Input
                  id="google-client-secret"
                  type="password"
                  placeholder="Enter Client Secret"
                  value={settings.google.clientSecret}
                  onChange={(e) => handleInputChange('google', 'clientSecret', e.target.value)}
                  disabled={!settings.google.enabled}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('google')}
                  disabled={!settings.google.enabled}
                >
                  Save Settings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('google')}
                  disabled={!settings.google.enabled}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Meta (Facebook) Integration
                    <Badge variant={settings.meta.enabled ? "default" : "secondary"}>
                      {settings.meta.enabled ? "Connected" : "Disconnected"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Connect with Facebook Ads, Instagram, and Meta Business tools
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.meta.enabled}
                  onCheckedChange={() => handleToggle('meta')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meta-app-id">App ID</Label>
                  <Input
                    id="meta-app-id"
                    placeholder="Enter Meta App ID"
                    value={settings.meta.appId}
                    onChange={(e) => handleInputChange('meta', 'appId', e.target.value)}
                    disabled={!settings.meta.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="meta-app-secret">App Secret</Label>
                  <Input
                    id="meta-app-secret"
                    type="password"
                    placeholder="Enter App Secret"
                    value={settings.meta.appSecret}
                    onChange={(e) => handleInputChange('meta', 'appSecret', e.target.value)}
                    disabled={!settings.meta.enabled}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="meta-access-token">Access Token</Label>
                <Input
                  id="meta-access-token"
                  type="password"
                  placeholder="Enter Access Token"
                  value={settings.meta.accessToken}
                  onChange={(e) => handleInputChange('meta', 'accessToken', e.target.value)}
                  disabled={!settings.meta.enabled}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('meta')}
                  disabled={!settings.meta.enabled}
                >
                  Save Settings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('meta')}
                  disabled={!settings.meta.enabled}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiktok">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    TikTok Integration
                    <Badge variant={settings.tiktok.enabled ? "default" : "secondary"}>
                      {settings.tiktok.enabled ? "Connected" : "Disconnected"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Connect with TikTok Ads and TikTok for Business
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.tiktok.enabled}
                  onCheckedChange={() => handleToggle('tiktok')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiktok-app-id">App ID</Label>
                  <Input
                    id="tiktok-app-id"
                    placeholder="Enter TikTok App ID"
                    value={settings.tiktok.appId}
                    onChange={(e) => handleInputChange('tiktok', 'appId', e.target.value)}
                    disabled={!settings.tiktok.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok-app-secret">App Secret</Label>
                  <Input
                    id="tiktok-app-secret"
                    type="password"
                    placeholder="Enter App Secret"
                    value={settings.tiktok.appSecret}
                    onChange={(e) => handleInputChange('tiktok', 'appSecret', e.target.value)}
                    disabled={!settings.tiktok.enabled}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tiktok-access-token">Access Token</Label>
                <Input
                  id="tiktok-access-token"
                  type="password"
                  placeholder="Enter Access Token"
                  value={settings.tiktok.accessToken}
                  onChange={(e) => handleInputChange('tiktok', 'accessToken', e.target.value)}
                  disabled={!settings.tiktok.enabled}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('tiktok')}
                  disabled={!settings.tiktok.enabled}
                >
                  Save Settings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('tiktok')}
                  disabled={!settings.tiktok.enabled}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
