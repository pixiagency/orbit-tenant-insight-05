
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Video, 
  Download, 
  Shield, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  RefreshCw as Sync
} from 'lucide-react';
import { toast } from 'sonner';

export const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState({
    googleCalendar: {
      enabled: false,
      connected: false,
      syncBidirectional: true,
      lastSync: null as Date | null,
    },
    appleCalendar: {
      enabled: false,
      connected: false,
      icsUrl: '',
    },
    zoom: {
      enabled: true,
      connected: true,
      apiKey: 'sk_live_***********',
      autoGenerate: true,
    },
  });

  const handleGoogleConnect = async () => {
    // Simulate OAuth flow
    toast.loading('Connecting to Google Calendar...');
    
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        googleCalendar: {
          ...prev.googleCalendar,
          connected: true,
          enabled: true,
          lastSync: new Date(),
        }
      }));
      toast.success('Google Calendar connected successfully!');
    }, 2000);
  };

  const handleGoogleDisconnect = () => {
    setIntegrations(prev => ({
      ...prev,
      googleCalendar: {
        ...prev.googleCalendar,
        connected: false,
        enabled: false,
        lastSync: null,
      }
    }));
    toast.success('Google Calendar disconnected');
  };

  const handleZoomConnect = () => {
    // Simulate Zoom connection
    toast.loading('Connecting to Zoom...');
    
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        zoom: {
          ...prev.zoom,
          connected: true,
          enabled: true,
        }
      }));
      toast.success('Zoom integration connected!');
    }, 1500);
  };

  const generateICSUrl = () => {
    const baseUrl = window.location.origin;
    const icsUrl = `${baseUrl}/api/calendar/export.ics?token=abc123`;
    setIntegrations(prev => ({
      ...prev,
      appleCalendar: {
        ...prev.appleCalendar,
        icsUrl,
        enabled: true,
      }
    }));
    toast.success('ICS URL generated for Apple Calendar');
  };

  const syncGoogleCalendar = async () => {
    if (!integrations.googleCalendar.connected) return;
    
    toast.loading('Syncing with Google Calendar...');
    
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        googleCalendar: {
          ...prev.googleCalendar,
          lastSync: new Date(),
        }
      }));
      toast.success('Calendar synced successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Google Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Google Calendar Integration
            </div>
            <Badge 
              variant={integrations.googleCalendar.connected ? "default" : "secondary"}
              className={integrations.googleCalendar.connected ? "bg-green-100 text-green-700" : ""}
            >
              {integrations.googleCalendar.connected ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Not Connected</>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Google Calendar Sync</Label>
              <p className="text-sm text-gray-500">
                Two-way sync between CRM and Google Calendar
              </p>
            </div>
            <Switch
              checked={integrations.googleCalendar.enabled}
              onCheckedChange={(checked) => setIntegrations(prev => ({
                ...prev,
                googleCalendar: { ...prev.googleCalendar, enabled: checked }
              }))}
              disabled={!integrations.googleCalendar.connected}
            />
          </div>

          {integrations.googleCalendar.connected && (
            <div className="flex items-center justify-between">
              <div>
                <Label>Bidirectional Sync</Label>
                <p className="text-sm text-gray-500">
                  Events created in Google Calendar will appear in CRM
                </p>
              </div>
              <Switch
                checked={integrations.googleCalendar.syncBidirectional}
                onCheckedChange={(checked) => setIntegrations(prev => ({
                  ...prev,
                  googleCalendar: { ...prev.googleCalendar, syncBidirectional: checked }
                }))}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            {integrations.googleCalendar.connected ? (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={syncGoogleCalendar}>
                  <Sync className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline" size="sm" onClick={handleGoogleDisconnect}>
                  Disconnect
                </Button>
                {integrations.googleCalendar.lastSync && (
                  <span className="text-sm text-gray-500">
                    Last sync: {integrations.googleCalendar.lastSync.toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <Button onClick={handleGoogleConnect} className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Connect Google Calendar
              </Button>
            )}
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              OAuth-based secure connection. Your Google credentials are never stored on our servers.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Apple Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              Apple Calendar Integration
            </div>
            <Badge 
              variant={integrations.appleCalendar.enabled ? "default" : "secondary"}
              className={integrations.appleCalendar.enabled ? "bg-green-100 text-green-700" : ""}
            >
              {integrations.appleCalendar.enabled ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Enabled</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Disabled</>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Apple Calendar Sync</Label>
              <p className="text-sm text-gray-500">
                Sync via iCloud or CalDAV protocol
              </p>
            </div>
            <Switch
              checked={integrations.appleCalendar.enabled}
              onCheckedChange={(checked) => setIntegrations(prev => ({
                ...prev,
                appleCalendar: { ...prev.appleCalendar, enabled: checked }
              }))}
            />
          </div>

          {integrations.appleCalendar.icsUrl ? (
            <div className="space-y-2">
              <Label>Calendar Subscription URL</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                  {integrations.appleCalendar.icsUrl}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(integrations.appleCalendar.icsUrl)}
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Add this URL to your Apple Calendar app under "Add Calendar" → "Add Subscription Calendar"
              </p>
            </div>
          ) : (
            <Button onClick={generateICSUrl} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate ICS Subscription URL
            </Button>
          )}

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Read-only subscription. Events will appear in Apple Calendar but cannot be edited from there.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Zoom Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-blue-500" />
              Zoom Integration
            </div>
            <Badge 
              variant={integrations.zoom.connected ? "default" : "secondary"}
              className={integrations.zoom.connected ? "bg-green-100 text-green-700" : ""}
            >
              {integrations.zoom.connected ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Not Connected</>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Zoom Integration</Label>
              <p className="text-sm text-gray-500">
                Auto-generate Zoom meeting links for meetings
              </p>
            </div>
            <Switch
              checked={integrations.zoom.enabled}
              onCheckedChange={(checked) => setIntegrations(prev => ({
                ...prev,
                zoom: { ...prev.zoom, enabled: checked }
              }))}
              disabled={!integrations.zoom.connected}
            />
          </div>

          {integrations.zoom.connected && (
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-generate Meeting Links</Label>
                <p className="text-sm text-gray-500">
                  Automatically create Zoom links when meeting type is selected
                </p>
              </div>
              <Switch
                checked={integrations.zoom.autoGenerate}
                onCheckedChange={(checked) => setIntegrations(prev => ({
                  ...prev,
                  zoom: { ...prev.zoom, autoGenerate: checked }
                }))}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            {integrations.zoom.connected ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  API Key: {integrations.zoom.apiKey}
                </span>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage on Zoom
                </Button>
              </div>
            ) : (
              <Button onClick={handleZoomConnect} className="bg-blue-500 hover:bg-blue-600">
                <Video className="h-4 w-4 mr-2" />
                Connect Zoom Account
              </Button>
            )}
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Requires Zoom Pro, Business, or Enterprise account with API access enabled.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
