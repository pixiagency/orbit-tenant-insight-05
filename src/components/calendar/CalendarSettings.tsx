
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, Palette, Bell, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const CalendarSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    workingHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'America/New_York',
    },
    defaultDurations: {
      task: 30,
      call: 60,
      meeting: 60,
      appointment: 90,
      'follow-up': 30,
    },
    reminders: {
      default: [15, 60],
      enabled: true,
    },
    colorCoding: {
      byEventType: true,
      byUser: false,
      byTeam: false,
    },
    weekStart: 'monday',
    timeFormat: '12h',
  });

  const handleSave = () => {
    toast.success('Calendar settings saved successfully');
  };

  const eventTypes = [
    { key: 'task', label: 'Scheduled Task', color: '#6b7280' },
    { key: 'call', label: 'Timed Call', color: '#3b82f6' },
    { key: 'meeting', label: 'Meeting', color: '#10b981' },
    { key: 'appointment', label: 'Sales Appointment', color: '#f59e0b' },
    { key: 'follow-up', label: 'Follow-up', color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Clock className="h-4 w-4 mr-2" />
            Working Hours & Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => setSettings({
                  ...settings,
                  workingHours: { ...settings.workingHours, start: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => setSettings({
                  ...settings,
                  workingHours: { ...settings.workingHours, end: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={settings.workingHours.timezone}
                onValueChange={(value) => setSettings({
                  ...settings,
                  workingHours: { ...settings.workingHours, timezone: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Week Starts On</Label>
              <Select
                value={settings.weekStart}
                onValueChange={(value) => setSettings({ ...settings, weekStart: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select
                value={settings.timeFormat}
                onValueChange={(value) => setSettings({ ...settings, timeFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Durations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Event Durations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {eventTypes.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: eventTypes.find(e => e.key === key)?.color }}
                  />
                  <Label className="text-sm">{label}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={settings.defaultDurations[key as keyof typeof settings.defaultDurations]}
                    onChange={(e) => setSettings({
                      ...settings,
                      defaultDurations: {
                        ...settings.defaultDurations,
                        [key]: parseInt(e.target.value) || 30
                      }
                    })}
                    className="w-16 h-8"
                    min="15"
                    step="15"
                  />
                  <span className="text-sm text-gray-500">min</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Coding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Palette className="h-4 w-4 mr-2" />
            Color Coding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Color by Event Type</Label>
                <p className="text-sm text-gray-500">Use different colors for each event type</p>
              </div>
              <Switch
                checked={settings.colorCoding.byEventType}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  colorCoding: { ...settings.colorCoding, byEventType: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Color by User</Label>
                <p className="text-sm text-gray-500">Use different colors for each assignee</p>
              </div>
              <Switch
                checked={settings.colorCoding.byUser}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  colorCoding: { ...settings.colorCoding, byUser: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Color by Team</Label>
                <p className="text-sm text-gray-500">Use different colors for each team</p>
              </div>
              <Switch
                checked={settings.colorCoding.byTeam}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  colorCoding: { ...settings.colorCoding, byTeam: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Bell className="h-4 w-4 mr-2" />
            Default Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Reminders</Label>
              <p className="text-sm text-gray-500">Send reminder notifications for events</p>
            </div>
            <Switch
              checked={settings.reminders.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                reminders: { ...settings.reminders, enabled: checked }
              })}
            />
          </div>

          {settings.reminders.enabled && (
            <div className="space-y-2">
              <Label>Default Reminder Times</Label>
              <div className="flex flex-wrap gap-2">
                {[5, 15, 30, 60, 120, 1440].map(minutes => (
                  <Badge
                    key={minutes}
                    variant={settings.reminders.default.includes(minutes) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newDefaults = settings.reminders.default.includes(minutes)
                        ? settings.reminders.default.filter(r => r !== minutes)
                        : [...settings.reminders.default, minutes];
                      setSettings({
                        ...settings,
                        reminders: { ...settings.reminders, default: newDefaults }
                      });
                    }}
                  >
                    {minutes < 60 ? `${minutes}m` : minutes === 60 ? '1h' : minutes === 120 ? '2h' : '1d'}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};
