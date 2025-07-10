
import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Target, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  Brain,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { CampaignManagementPage } from './ads-ai/CampaignManagementPage';
import { AudienceManagementPage } from './ads-ai/AudienceManagementPage';
import { ProgrammaticAdsPage } from './ads-ai/ProgrammaticAdsPage';
import { AdsReportsPage } from './ads-ai/AdsReportsPage';

const AdsAIPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { 
      id: 'campaigns', 
      label: 'Campaign Management', 
      icon: Target, 
      path: '/admin/ads-ai/campaigns',
      badge: '12'
    },
    { 
      id: 'audiences', 
      label: 'Audience Management', 
      icon: Users, 
      path: '/admin/ads-ai/audiences',
      badge: '5'
    },
    { 
      id: 'programmatic', 
      label: 'AI Programmatic Ads', 
      icon: Brain, 
      path: '/admin/ads-ai/programmatic'
    },
    { 
      id: 'reports', 
      label: 'Performance Reports', 
      icon: BarChart3, 
      path: '/admin/ads-ai/reports'
    }
  ];

  const kpiData = [
    { label: 'Active Campaigns', value: '24', change: '+12%', positive: true },
    { label: 'Total Reach', value: '127K', change: '+25%', positive: true },
    { label: 'Cost Per Lead', value: '$12.50', change: '-8%', positive: true },
    { label: 'Conversion Rate', value: '3.2%', change: '+15%', positive: true },
  ];

  if (location.pathname !== '/admin/ads-ai') {
    return (
      <Routes>
        <Route path="/campaigns" element={<CampaignManagementPage />} />
        <Route path="/audiences" element={<AudienceManagementPage />} />
        <Route path="/programmatic" element={<ProgrammaticAdsPage />} />
        <Route path="/reports" element={<AdsReportsPage />} />
      </Routes>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Zap className="h-8 w-8 mr-3 text-blue-600" />
            Smart Campaign Engine
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered multi-channel marketing campaigns with advanced targeting
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  kpi.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {kpi.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <NavLink key={item.id} to={item.path}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <item.icon className="h-8 w-8 text-blue-600" />
                  {item.badge && (
                    <Badge variant="secondary">{item.badge}</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-sm text-gray-600">
                  {item.id === 'campaigns' && 'Create and manage multi-channel campaigns'}
                  {item.id === 'audiences' && 'Segment and target your audience'}
                  {item.id === 'programmatic' && 'AI-driven automated advertising'}
                  {item.id === 'reports' && 'Performance analytics and insights'}
                </p>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Campaign Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Facebook Campaign "Summer Sale" launched', time: '2h ago', status: 'success' },
                { action: 'WhatsApp audience sync completed', time: '4h ago', status: 'success' },
                { action: 'Google Ads budget optimization triggered', time: '6h ago', status: 'info' },
                { action: 'Email campaign "Newsletter" completed', time: '1d ago', status: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Black Friday Promo', date: 'Nov 24, 2024', channels: ['Facebook', 'Google'], status: 'scheduled' },
                { name: 'Product Launch', date: 'Dec 1, 2024', channels: ['WhatsApp', 'Email'], status: 'draft' },
                { name: 'Year End Campaign', date: 'Dec 15, 2024', channels: ['TikTok', 'SMS'], status: 'scheduled' },
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-xs text-gray-500">{campaign.date}</p>
                    <div className="flex space-x-1 mt-1">
                      {campaign.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={campaign.status === 'scheduled' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdsAIPage;
