
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CallSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CallSettingsModal: React.FC<CallSettingsModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    recording: {
      autoRecord: true,
      manualRecord: false,
      saveVoicemails: true,
      storageLocation: 'local',
      retentionDays: '90',
      quality: 'high'
    },
    voip: {
      provider: 'twilio',
      apiKey: '',
      accountSid: '',
      authToken: '',
      phoneNumbers: '+1-555-0100\n+1-555-0101\n+1-555-0102'
    },
    notifications: {
      newCall: true,
      missedCall: true,
      recordingReady: false,
      dailySummary: true
    },
    permissions: {
      listenRecordings: 'admin',
      deleteCallLogs: 'admin',
      linkEntities: 'all',
      exportData: 'manager'
    },
    reminders: {
      enabled: true,
      beforeMinutes: 15,
      followUpHours: 24
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Call settings have been updated successfully.",
    });
    onOpenChange(false);
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Call & Recording Settings</DialogTitle>
          <DialogDescription>
            Configure call recording, VoIP integration, and system preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="recording" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recording">Recording</TabsTrigger>
            <TabsTrigger value="voip">VoIP Setup</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          {/* Recording Settings */}
          <TabsContent value="recording" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recording Configuration</CardTitle>
                <CardDescription>Control how calls are recorded and stored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoRecord">Auto-record all calls</Label>
                      <Switch
                        id="autoRecord"
                        checked={settings.recording.autoRecord}
                        onCheckedChange={(checked) => updateSetting('recording', 'autoRecord', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="manualRecord">Manual recording option</Label>
                      <Switch
                        id="manualRecord"
                        checked={settings.recording.manualRecord}
                        onCheckedChange={(checked) => updateSetting('recording', 'manualRecord', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="saveVoicemails">Save voicemails</Label>
                      <Switch
                        id="saveVoicemails"
                        checked={settings.recording.saveVoicemails}
                        onCheckedChange={(checked) => updateSetting('recording', 'saveVoicemails', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="storageLocation">Storage Location</Label>
                      <Select
                        value={settings.recording.storageLocation}
                        onValueChange={(value) => updateSetting('recording', 'storageLocation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Storage</SelectItem>
                          <SelectItem value="aws">AWS S3</SelectItem>
                          <SelectItem value="gcp">Google Cloud</SelectItem>
                          <SelectItem value="azure">Azure Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="retentionDays">Auto-delete after (days)</Label>
                      <Select
                        value={settings.recording.retentionDays}
                        onValueChange={(value) => updateSetting('recording', 'retentionDays', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                          <SelectItem value="never">Never delete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quality">Recording Quality</Label>
                      <Select
                        value={settings.recording.quality}
                        onValueChange={(value) => updateSetting('recording', 'quality', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (16kbps)</SelectItem>
                          <SelectItem value="medium">Medium (32kbps)</SelectItem>
                          <SelectItem value="high">High (64kbps)</SelectItem>
                          <SelectItem value="lossless">Lossless</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VoIP Settings */}
          <TabsContent value="voip" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>VoIP Integration</CardTitle>
                <CardDescription>Connect with your VoIP provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="provider">VoIP Provider</Label>
                  <Select
                    value={settings.voip.provider}
                    onValueChange={(value) => updateSetting('voip', 'provider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="3cx">3CX</SelectItem>
                      <SelectItem value="plivo">Plivo</SelectItem>
                      <SelectItem value="vonage">Vonage</SelectItem>
                      <SelectItem value="custom">Custom SIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={settings.voip.apiKey}
                      onChange={(e) => updateSetting('voip', 'apiKey', e.target.value)}
                      placeholder="Enter API key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountSid">Account SID</Label>
                    <Input
                      id="accountSid"
                      value={settings.voip.accountSid}
                      onChange={(e) => updateSetting('voip', 'accountSid', e.target.value)}
                      placeholder="Enter Account SID"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneNumbers">Allowed Phone Numbers</Label>
                  <Textarea
                    id="phoneNumbers"
                    value={settings.voip.phoneNumbers}
                    onChange={(e) => updateSetting('voip', 'phoneNumbers', e.target.value)}
                    placeholder="Enter phone numbers (one per line)"
                    rows={5}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter one phone number per line. These numbers will be available for making calls.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose when to receive call-related notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newCall">New Call Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when new calls are received</p>
                    </div>
                    <Switch
                      id="newCall"
                      checked={settings.notifications.newCall}
                      onCheckedChange={(checked) => updateSetting('notifications', 'newCall', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="missedCall">Missed Call Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about missed calls</p>
                    </div>
                    <Switch
                      id="missedCall"
                      checked={settings.notifications.missedCall}
                      onCheckedChange={(checked) => updateSetting('notifications', 'missedCall', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="recordingReady">Recording Ready</Label>
                      <p className="text-sm text-gray-500">Get notified when recordings are processed</p>
                    </div>
                    <Switch
                      id="recordingReady"
                      checked={settings.notifications.recordingReady}
                      onCheckedChange={(checked) => updateSetting('notifications', 'recordingReady', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dailySummary">Daily Summary</Label>
                      <p className="text-sm text-gray-500">Receive daily call activity summary</p>
                    </div>
                    <Switch
                      id="dailySummary"
                      checked={settings.notifications.dailySummary}
                      onCheckedChange={(checked) => updateSetting('notifications', 'dailySummary', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Permissions</CardTitle>
                <CardDescription>Control who can perform specific call-related actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="listenRecordings">Listen to Recordings</Label>
                    <Select
                      value={settings.permissions.listenRecordings}
                      onValueChange={(value) => updateSetting('permissions', 'listenRecordings', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin Only</SelectItem>
                        <SelectItem value="manager">Manager & Above</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deleteCallLogs">Delete Call Logs</Label>
                    <Select
                      value={settings.permissions.deleteCallLogs}
                      onValueChange={(value) => updateSetting('permissions', 'deleteCallLogs', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin Only</SelectItem>
                        <SelectItem value="manager">Manager & Above</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="linkEntities">Link to Entities</Label>
                    <Select
                      value={settings.permissions.linkEntities}
                      onValueChange={(value) => updateSetting('permissions', 'linkEntities', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin Only</SelectItem>
                        <SelectItem value="manager">Manager & Above</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="exportData">Export Call Data</Label>
                    <Select
                      value={settings.permissions.exportData}
                      onValueChange={(value) => updateSetting('permissions', 'exportData', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin Only</SelectItem>
                        <SelectItem value="manager">Manager & Above</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders */}
          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Reminders</CardTitle>
                <CardDescription>Set up automatic reminders for scheduled calls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remindersEnabled">Enable Call Reminders</Label>
                  <Switch
                    id="remindersEnabled"
                    checked={settings.reminders.enabled}
                    onCheckedChange={(checked) => updateSetting('reminders', 'enabled', checked)}
                  />
                </div>

                {settings.reminders.enabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                    <div>
                      <Label htmlFor="beforeMinutes">Remind before (minutes)</Label>
                      <Select
                        value={settings.reminders.beforeMinutes.toString()}
                        onValueChange={(value) => updateSetting('reminders', 'beforeMinutes', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="followUpHours">Follow-up reminder after (hours)</Label>
                      <Select
                        value={settings.reminders.followUpHours.toString()}
                        onValueChange={(value) => updateSetting('reminders', 'followUpHours', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="48">48 hours</SelectItem>
                          <SelectItem value="168">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
