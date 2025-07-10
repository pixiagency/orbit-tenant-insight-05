
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  MessageSquare,
  Brain,
  Eye
} from 'lucide-react';
import { CampaignForm } from './components/CampaignForm';

interface Campaign {
  id: string;
  name: string;
  type: 'ad' | 'messaging' | 'follow-up' | 'automated';
  channels: string[];
  status: 'active' | 'paused' | 'scheduled' | 'completed';
  audience: string;
  goal: 'leads' | 'traffic' | 'conversions' | 'awareness';
  budget: number;
  spent: number;
  leads: number;
  cpl: number;
  startDate: string;
  endDate: string;
  team: string;
  dailyFrequency: number;
  openRate?: number;
  ctr?: number;
  messagesSent?: number;
  campaignScore?: number;
}

export const CampaignManagementPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Summer Sale Facebook Campaign',
      type: 'ad',
      channels: ['Facebook', 'Instagram'],
      status: 'active',
      audience: 'Young Professionals',
      goal: 'leads',
      budget: 5000,
      spent: 2340,
      leads: 187,
      cpl: 12.51,
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      team: 'Marketing Team A',
      dailyFrequency: 3,
      openRate: 65,
      ctr: 3.2,
      messagesSent: 12450,
      campaignScore: 85
    },
    {
      id: '2',
      name: 'WhatsApp Follow-up Sequence',
      type: 'messaging',
      channels: ['WhatsApp'],
      status: 'active',
      audience: 'Existing Leads',
      goal: 'conversions',
      budget: 0,
      spent: 0,
      leads: 45,
      cpl: 0,
      startDate: '2024-06-15',
      endDate: '2024-07-15',
      team: 'Sales Team',
      dailyFrequency: 2,
      openRate: 89,
      ctr: 15.4,
      messagesSent: 890,
      campaignScore: 92
    },
    {
      id: '3',
      name: 'Google Ads Product Launch',
      type: 'ad',
      channels: ['Google Ads'],
      status: 'scheduled',
      audience: 'Tech Enthusiasts',
      goal: 'awareness',
      budget: 10000,
      spent: 0,
      leads: 0,
      cpl: 0,
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      team: 'Marketing Team B',
      dailyFrequency: 5,
      campaignScore: 78
    },
    {
      id: '4',
      name: 'Automated Email Nurture',
      type: 'automated',
      channels: ['Email', 'SMS'],
      status: 'active',
      audience: 'Cold Leads',
      goal: 'leads',
      budget: 500,
      spent: 234,
      leads: 67,
      cpl: 3.49,
      startDate: '2024-06-10',
      endDate: '2024-12-31',
      team: 'Marketing Team A',
      dailyFrequency: 1,
      openRate: 45,
      ctr: 8.7,
      messagesSent: 5670,
      campaignScore: 73
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ad': return 'bg-purple-100 text-purple-800';
      case 'messaging': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      case 'automated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'leads': return 'bg-indigo-100 text-indigo-800';
      case 'traffic': return 'bg-cyan-100 text-cyan-800';
      case 'conversions': return 'bg-emerald-100 text-emerald-800';
      case 'awareness': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCampaignCreate = (newCampaign: any) => {
    const campaign: Campaign = {
      id: (campaigns.length + 1).toString(),
      ...newCampaign,
      spent: 0,
      leads: 0,
      cpl: 0,
      status: 'scheduled',
      campaignScore: Math.floor(Math.random() * 40) + 60 // Random score for demo
    };
    setCampaigns([...campaigns, campaign]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Target className="h-6 w-6 mr-2" />
            Campaign Management
          </h1>
          <p className="text-gray-600">Create and manage multi-channel marketing campaigns</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <CampaignForm onSubmit={handleCampaignCreate} onCancel={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold">
                  ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.leads, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. CPL</p>
                <p className="text-2xl font-bold">
                  ${(campaigns.filter(c => c.cpl > 0).reduce((sum, c) => sum + c.cpl, 0) / campaigns.filter(c => c.cpl > 0).length).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold">
                  {(campaigns.reduce((sum, c) => sum + (c.messagesSent || 0), 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Campaign Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Best Performance Time</p>
              <p className="text-xs text-blue-700">WhatsApp campaigns perform 34% better between 2-4 PM</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Budget Optimization</p>
              <p className="text-xs text-green-700">Reallocate $1,200 from Google to Facebook for better ROI</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Audience Suggestion</p>
              <p className="text-xs text-purple-700">"Tech Enthusiasts" audience shows 45% higher conversion rates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ad">Ad Campaigns</SelectItem>
                <SelectItem value="messaging">Messaging</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="automated">Automated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(campaign.type)}>
                      {campaign.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGoalColor(campaign.goal)}>
                      {campaign.goal}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {campaign.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.audience}</TableCell>
                  <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                  <TableCell>{campaign.leads}</TableCell>
                  <TableCell>{campaign.openRate ? `${campaign.openRate}%` : '-'}</TableCell>
                  <TableCell>{campaign.ctr ? `${campaign.ctr}%` : '-'}</TableCell>
                  <TableCell>
                    {campaign.campaignScore && (
                      <span className={`font-semibold ${getScoreColor(campaign.campaignScore)}`}>
                        {campaign.campaignScore}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
