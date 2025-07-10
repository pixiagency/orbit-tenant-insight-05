import React from 'react';
import { KPICard } from '../../components/shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { 
  Building2, 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp,
  Bell,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
];

const clientsData = [
  { month: 'Jan', newClients: 12, totalClients: 180 },
  { month: 'Feb', newClients: 19, totalClients: 199 },
  { month: 'Mar', newClients: 15, totalClients: 214 },
  { month: 'Apr', newClients: 25, totalClients: 239 },
  { month: 'May', newClients: 18, totalClients: 257 },
  { month: 'Jun', newClients: 22, totalClients: 279 },
];

const packageDistribution = [
  { name: 'Starter', value: 45, count: 120 },
  { name: 'Professional', value: 35, count: 95 },
  { name: 'Enterprise', value: 20, count: 54 },
];

const featureUsage = [
  { feature: 'Lead Management', usage: 95 },
  { feature: 'WhatsApp Integration', usage: 78 },
  { feature: 'Email Marketing', usage: 65 },
  { feature: 'Advanced Reporting', usage: 58 },
  { feature: 'AI Assistant', usage: 42 },
  { feature: 'Call Recording', usage: 38 },
];

const usageData = [
  { metric: 'API Calls', usage: 85 },
  { metric: 'Storage', usage: 62 },
  { metric: 'Bandwidth', usage: 78 },
  { metric: 'Database', usage: 45 },
];

export const SuperAdminDashboard = () => {
  const notifications = [
    { id: 1, message: "5 subscriptions expiring this week", type: "warning" },
    { id: 2, message: "New client signup: TechCorp Inc.", type: "success" },
    { id: 3, message: "High usage alert: DataFlow Ltd", type: "alert" },
  ];

  const recentClients = [
    { name: "TechCorp Inc.", plan: "Enterprise", status: "Active", revenue: "$2,499" },
    { name: "StartupXYZ", plan: "Pro", status: "Trial", revenue: "$499" },
    { name: "BigCorp Ltd", plan: "Enterprise", status: "Active", revenue: "$2,499" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your SaaS platform and monitor global metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search clients..." className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Clients"
          value="247"
          icon={Building2}
          change={{ value: "+12 this month", trend: "up" }}
        />
        <KPICard
          title="Monthly Revenue"
          value="$124,750"
          icon={DollarSign}
          change={{ value: "+8.2% vs last month", trend: "up" }}
        />
        <KPICard
          title="Active Users"
          value="1,843"
          icon={Users}
          change={{ value: "+23 today", trend: "up" }}
        />
        <KPICard
          title="Active Subscriptions"
          value="189"
          icon={CreditCard}
          change={{ value: "94% retention rate", trend: "up" }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Revenue Growth</CardTitle>
            <p className="text-sm text-gray-600">Monthly recurring revenue trends</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "#3b82f6" }
              }}
            >
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="month" className="text-gray-600" />
                <YAxis className="text-gray-600" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">New Clients Over Time</CardTitle>
            <p className="text-sm text-gray-600">Client acquisition metrics</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                newClients: { label: "New Clients", color: "#10b981" },
                totalClients: { label: "Total Clients", color: "#f59e0b" }
              }}
            >
              <LineChart data={clientsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="month" className="text-gray-600" />
                <YAxis className="text-gray-600" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="newClients" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="totalClients" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Package Distribution</CardTitle>
            <p className="text-sm text-gray-600">Subscription plan breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ChartContainer
                config={{
                  starter: { label: "Starter", color: "#3b82f6" },
                  professional: { label: "Professional", color: "#10b981" },
                  enterprise: { label: "Enterprise", color: "#f59e0b" }
                }}
              >
                <PieChart>
                  <Pie
                    data={packageDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {packageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="mt-4 space-y-2">
              {packageDistribution.map((pkg, index) => (
                <div key={pkg.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-sm text-gray-600">{pkg.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{pkg.count} clients</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Used Features</CardTitle>
            <p className="text-sm text-gray-600">Feature adoption rates</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                usage: { label: "Usage %", color: "#3b82f6" }
              }}
            >
              <BarChart data={featureUsage} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis type="number" className="text-gray-600" />
                <YAxis dataKey="feature" type="category" width={120} className="text-gray-600" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="usage" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Usage Overview</CardTitle>
            <p className="text-sm text-gray-600">Platform usage statistics</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                usage: { label: "Usage %", color: "#8b5cf6" }
              }}
            >
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="metric" className="text-gray-600" />
                <YAxis className="text-gray-600" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="usage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Notifications & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{notification.message}</span>
                  <Badge variant={notification.type === 'success' ? 'default' : 'destructive'}>
                    {notification.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Recent Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.plan} Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{client.revenue}</p>
                    <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
