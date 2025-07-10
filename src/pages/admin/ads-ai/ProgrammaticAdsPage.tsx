
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  Play, 
  Pause, 
  Settings,
  DollarSign,
  Target,
  BarChart3,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const ProgrammaticAdsPage: React.FC = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [autoPause, setAutoPause] = useState(false);

  const aiCampaigns = [
    {
      id: '1',
      name: 'AI-Generated Facebook Campaign #1',
      platform: 'Facebook',
      status: 'active',
      performance: 'effective',
      budget: 2000,
      spent: 750,
      leads: 45,
      cpl: 16.67,
      optimization: 'Budget increased by 20%'
    },
    {
      id: '2',
      name: 'Google Ads Auto-Campaign',
      platform: 'Google',
      status: 'paused',
      performance: 'weak',
      budget: 1500,
      spent: 1200,
      leads: 12,
      cpl: 100,
      optimization: 'Auto-paused due to high CPL'
    },
    {
      id: '3',
      name: 'TikTok AI Lookalike Campaign',
      platform: 'TikTok',
      status: 'active',
      performance: 'needs-improvement',
      budget: 3000,
      spent: 1800,
      leads: 72,
      cpl: 25,
      optimization: 'Testing new creative variations'
    }
  ];

  const aiInsights = [
    {
      type: 'success',
      title: 'Budget Optimization Success',
      message: 'Reallocated $500 from underperforming Facebook ads to high-performing Google campaigns',
      time: '2h ago'
    },
    {
      type: 'warning',
      title: 'Performance Drop Detected',
      message: 'TikTok campaign CTR dropped by 15% - A/B testing new creatives',
      time: '4h ago'
    },
    {
      type: 'info',
      title: 'New Audience Identified',
      message: 'AI discovered high-converting segment: Tech workers aged 28-35 in urban areas',
      time: '6h ago'
    },
    {
      type: 'success',
      title: 'Goal Achieved',
      message: 'Facebook campaign exceeded lead generation target by 25%',
      time: '1d ago'
    }
  ];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'effective': return 'bg-green-100 text-green-800';
      case 'weak': return 'bg-red-100 text-red-800';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Brain className="h-5 w-5 text-blue-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            AI Programmatic Ads Engine
          </h1>
          <p className="text-gray-600">Automated campaign optimization powered by artificial intelligence</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={aiEnabled ? "default" : "secondary"} className="px-3 py-1">
            AI Engine: {aiEnabled ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* AI Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            AI Control Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">AI Engine</h3>
                <p className="text-sm text-gray-600">Enable/disable automatic campaigns</p>
              </div>
              <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Auto Optimization</h3>
                <p className="text-sm text-gray-600">Budget reallocation and optimization</p>
              </div>
              <Switch checked={autoOptimization} onCheckedChange={setAutoOptimization} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Auto Pause</h3>
                <p className="text-sm text-gray-600">Automatically pause failing ads</p>
              </div>
              <Switch checked={autoPause} onCheckedChange={setAutoPause} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Campaigns</p>
                <p className="text-2xl font-bold">{aiCampaigns.length}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total AI Budget</p>
                <p className="text-2xl font-bold">
                  ${aiCampaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
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
                <p className="text-sm text-gray-600">AI Generated Leads</p>
                <p className="text-2xl font-bold">
                  {aiCampaigns.reduce((sum, c) => sum + c.leads, 0)}
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
                <p className="text-sm text-gray-600">Optimization Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Active AI Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPerformanceColor(campaign.performance)}>
                        {campaign.performance}
                      </Badge>
                      <Badge variant="outline">{campaign.platform}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Budget: ${campaign.budget}</p>
                      <p className="text-gray-600">Spent: ${campaign.spent}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Leads: {campaign.leads}</p>
                      <p className="text-gray-600">CPL: ${campaign.cpl}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{campaign.optimization}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="ghost" size="sm">
                      {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Insights & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{insight.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            AI Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList>
              <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
              <TabsTrigger value="optimization">Optimization History</TabsTrigger>
              <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="mt-6">
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Performance charts and analytics would be implemented here</p>
              </div>
            </TabsContent>
            <TabsContent value="optimization" className="mt-6">
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Optimization history and trends would be implemented here</p>
              </div>
            </TabsContent>
            <TabsContent value="predictions" className="mt-6">
              <div className="text-center py-12 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>AI predictions and forecasts would be implemented here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
