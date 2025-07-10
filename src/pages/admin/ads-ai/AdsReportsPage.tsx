
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Target,
  DollarSign,
  Users,
  MousePointer
} from 'lucide-react';

export const AdsReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [reportType, setReportType] = useState('overview');

  const performanceData = {
    totalSpend: 15750,
    totalLeads: 324,
    avgCPL: 48.61,
    conversionRate: 3.2,
    totalImpressions: 245000,
    totalClicks: 7840,
    ctr: 3.2
  };

  const channelPerformance = [
    { channel: 'Facebook', spend: 6200, leads: 145, cpl: 42.76, conversions: 2.8 },
    { channel: 'Google Ads', spend: 5500, leads: 98, cpl: 56.12, conversions: 3.5 },
    { channel: 'TikTok', spend: 2800, leads: 56, cpl: 50, conversions: 2.1 },
    { channel: 'WhatsApp', spend: 1250, leads: 25, cpl: 50, conversions: 4.2 }
  ];

  const campaignPerformance = [
    { name: 'Summer Sale Campaign', type: 'Facebook', leads: 87, spend: 3200, cpl: 36.78, status: 'active' },
    { name: 'Google Search Ads', type: 'Google', leads: 65, spend: 2800, cpl: 43.08, status: 'active' },
    { name: 'TikTok Brand Awareness', type: 'TikTok', leads: 42, spend: 1800, cpl: 42.86, status: 'paused' },
    { name: 'WhatsApp Follow-up', type: 'WhatsApp', leads: 23, spend: 800, cpl: 34.78, status: 'active' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            Performance Reports
          </h1>
          <p className="text-gray-600">Comprehensive analytics and insights for all campaigns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-2xl font-bold">${performanceData.totalSpend.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </div>
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
                <p className="text-2xl font-bold">{performanceData.totalLeads}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +25%
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. CPL</p>
                <p className="text-2xl font-bold">${performanceData.avgCPL}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -8%
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{performanceData.conversionRate}%</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15%
                </div>
              </div>
              <MousePointer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channel Performance</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Analysis</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Performance chart would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lead Source Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {channelPerformance.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{channel.channel}</p>
                        <p className="text-sm text-gray-600">{channel.leads} leads</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${channel.cpl}</p>
                        <p className="text-sm text-gray-600">CPL</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Channel</th>
                      <th className="text-right p-3">Spend</th>
                      <th className="text-right p-3">Leads</th>
                      <th className="text-right p-3">CPL</th>
                      <th className="text-right p-3">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelPerformance.map((channel, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{channel.channel}</td>
                        <td className="p-3 text-right">${channel.spend.toLocaleString()}</td>
                        <td className="p-3 text-right">{channel.leads}</td>
                        <td className="p-3 text-right">${channel.cpl}</td>
                        <td className="p-3 text-right">{channel.conversions}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Campaign Name</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-right p-3">Leads</th>
                      <th className="text-right p-3">Spend</th>
                      <th className="text-right p-3">CPL</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignPerformance.map((campaign, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{campaign.name}</td>
                        <td className="p-3">{campaign.type}</td>
                        <td className="p-3 text-right">{campaign.leads}</td>
                        <td className="p-3 text-right">${campaign.spend.toLocaleString()}</td>
                        <td className="p-3 text-right">${campaign.cpl}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            campaign.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Attribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Attribution analysis and conversion tracking would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
