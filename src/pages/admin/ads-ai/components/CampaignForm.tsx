
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarIcon } from 'lucide-react';

interface CampaignFormProps {
  onSubmit: (campaign: any) => void;
  onCancel: () => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    goal: '',
    audience: '',
    channels: [] as string[],
    budget: '',
    startDate: '',
    endDate: '',
    dailyFrequency: '',
    team: '',
    description: ''
  });

  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const availableChannels = [
    'WhatsApp', 'Email', 'SMS', 'Facebook', 'Instagram', 
    'Google Ads', 'TikTok', 'Snapchat', 'Twitter', 'LinkedIn'
  ];

  const availableAudiences = [
    'Young Professionals', 'Tech Enthusiasts', 'Existing Leads', 
    'Cold Leads', 'High-Value Customers', 'Cart Abandoners'
  ];

  const availableTeams = [
    'Marketing Team A', 'Marketing Team B', 'Sales Team', 'Growth Team'
  ];

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setSelectedChannels([...selectedChannels, channel]);
    } else {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      channels: selectedChannels,
      budget: parseFloat(formData.budget) || 0,
      dailyFrequency: parseInt(formData.dailyFrequency) || 1
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Setup</TabsTrigger>
          <TabsTrigger value="targeting">Targeting & Channels</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling & Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter campaign name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Campaign Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ad">Ad Campaign</SelectItem>
                      <SelectItem value="messaging">Messaging Campaign</SelectItem>
                      <SelectItem value="follow-up">Follow-up Campaign</SelectItem>
                      <SelectItem value="automated">Automated Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal">Campaign Goal *</Label>
                  <Select value={formData.goal} onValueChange={(value) => setFormData({...formData, goal: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leads">Generate Leads</SelectItem>
                      <SelectItem value="traffic">Drive Traffic</SelectItem>
                      <SelectItem value="conversions">Increase Conversions</SelectItem>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your campaign objectives and strategy"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targeting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Targeting & Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audience">Target Audience *</Label>
                <Select value={formData.audience} onValueChange={(value) => setFormData({...formData, audience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAudiences.map(audience => (
                      <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Marketing Channels *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableChannels.map(channel => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel}
                        checked={selectedChannels.includes(channel)}
                        onCheckedChange={(checked) => handleChannelChange(channel, checked as boolean)}
                      />
                      <Label htmlFor={channel} className="text-sm">{channel}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="dailyFrequency">Daily Contact Frequency</Label>
                <Input
                  id="dailyFrequency"
                  type="number"
                  value={formData.dailyFrequency}
                  onChange={(e) => setFormData({...formData, dailyFrequency: e.target.value})}
                  placeholder="Max contacts per day per user"
                  min="1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduling & Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Campaign Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="Enter budget amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="team">Responsible Team *</Label>
                  <Select value={formData.team} onValueChange={(value) => setFormData({...formData, team: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Campaign
        </Button>
      </div>
    </form>
  );
};
