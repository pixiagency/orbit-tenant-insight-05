
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation, Settings, Key } from 'lucide-react';
import { toast } from 'sonner';

export const MapsLocationPage: React.FC = () => {
  const [googleMapsEnabled, setGoogleMapsEnabled] = useState(true);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [autoCheckIn, setAutoCheckIn] = useState(false);
  const [locationRadius, setLocationRadius] = useState(100);

  const handleSaveApiKey = () => {
    if (!googleMapsApiKey.trim()) {
      toast.error('Please enter a valid Google Maps API key');
      return;
    }
    toast.success('Google Maps API key saved successfully');
  };

  const handleSaveLocationSettings = () => {
    toast.success('Location settings updated successfully');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Maps & Location Settings</h1>
        </div>
      </div>
      <p className="text-gray-600">
        Configure location tracking, maps integration, and geolocation features
      </p>

      <Tabs defaultValue="google-maps" className="space-y-6">
        <TabsList>
          <TabsTrigger value="google-maps">Google Maps</TabsTrigger>
          <TabsTrigger value="location-tracking">Location Tracking</TabsTrigger>
          <TabsTrigger value="geofencing">Geofencing</TabsTrigger>
        </TabsList>

        <TabsContent value="google-maps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Google Maps Integration
              </CardTitle>
              <CardDescription>
                Configure Google Maps API for location services and mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Google Maps</Label>
                  <p className="text-sm text-gray-600">Use Google Maps for location services</p>
                </div>
                <Switch
                  checked={googleMapsEnabled}
                  onCheckedChange={setGoogleMapsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">Google Maps API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your Google Maps API key..."
                    value={googleMapsApiKey}
                    onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                    disabled={!googleMapsEnabled}
                  />
                  <Button onClick={handleSaveApiKey} disabled={!googleMapsEnabled}>
                    Save
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Get your API key from the Google Cloud Console
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location-tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Location Tracking
              </CardTitle>
              <CardDescription>
                Configure location tracking for field teams and mobile users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Location Tracking</Label>
                  <p className="text-sm text-gray-600">Track user locations for field activities</p>
                </div>
                <Switch
                  checked={trackingEnabled}
                  onCheckedChange={setTrackingEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto Check-in</Label>
                  <p className="text-sm text-gray-600">Automatically check in when arriving at locations</p>
                </div>
                <Switch
                  checked={autoCheckIn}
                  onCheckedChange={setAutoCheckIn}
                  disabled={!trackingEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="radius">Location Accuracy Radius (meters)</Label>
                <Input
                  id="radius"
                  type="number"
                  min="10"
                  max="1000"
                  value={locationRadius}
                  onChange={(e) => setLocationRadius(parseInt(e.target.value))}
                  disabled={!trackingEnabled}
                />
                <p className="text-xs text-gray-500">
                  Minimum radius for location-based actions
                </p>
              </div>

              <Button onClick={handleSaveLocationSettings} className="w-full">
                Save Location Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geofencing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Geofencing
              </CardTitle>
              <CardDescription>
                Set up virtual boundaries for automated actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Geofencing Setup</p>
                <p className="text-sm">Coming soon - Set up virtual boundaries for your locations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
