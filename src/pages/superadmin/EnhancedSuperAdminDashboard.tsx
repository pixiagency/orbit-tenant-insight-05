import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { 
  Building2, 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp,
  Bell,
  Search,
  Package,
  Target,
  Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const revenueData = [
  { month: 'Jan', monthly: 45000, yearly: 120000 },
  { month: 'Feb', monthly: 52000, yearly: 135000 },
  { month: 'Mar', monthly: 48000, yearly: 128000 },
  { month: 'Apr', monthly: 61000, yearly: 155000 },
  { month: 'May', monthly: 55000, yearly: 142000 },
  { month: 'Jun', monthly: 67000, yearly: 175000 },
];

const clientsData = [
  { month: 'Jan', new: 12, total: 180 },
  { month: 'Feb', new: 19, total: 199 },
  { month: 'Mar', new: 15, total: 214 },
  { month: 'Apr', new: 25, total: 239 },
  { month: 'May', new: 18, total: 257 },
  { month: 'Jun', new: 22, total: 279 },
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

const usageMetrics = [
  { metric: 'Call Minutes', used: 850000, total: 1200000 },
  { metric: 'Active Users', used: 1843, total: 2500 },
  { metric: 'Storage (GB)', used: 245, total: 500 },
  { metric: 'API Calls', used: 125000, total: 200000 },
];

export const EnhancedSuperAdminDashboard = () => {
  const notifications = [
    { id: 1, message: "5 subscriptions expiring this week", type: "warning" },
    { id: 2, message: "New client signup: TechCorp Inc.", type: "success" },
    { id: 3, message: "High usage alert: DataFlow Ltd", type: "alert" },
    { id: 4, message: "Payment received: $12,500", type: "success" },
  ];

  const recentActivity = [
    { action: "Client registered", client: "TechStart Inc.", time: "2 hours ago" },
    { action: "Package upgraded", client: "BigCorp Ltd", time: "4 hours ago" },
    { action: "Subscription renewed", client: "StartupXYZ", time: "6 hours ago" },
    { action: "Feature enabled", client: "DataFlow Ltd", time: "8 hours ago" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Super Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive platform analytics and metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input placeholder="Search clients..." className="pl-10 w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Clients"
          value="279"
          icon={Building2}
          change={{ value: "+22 this month", trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Monthly Revenue"
          value="$167,500"
          icon={DollarSign}
          change={{ value: "+12.3% vs last month", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Active Users"
          value="1,843"
          icon={Users}
          change={{ value: "+156 today", trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="Active Subscriptions"
          value="269"
          icon={CreditCard}
          change={{ value: "96.4% retention", trend: "up" }}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Revenue & Clients Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                monthly: { label: "Monthly", color: "#3b82f6" },
                yearly: { label: "Yearly", color: "#10b981" }
              }}
            >
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="monthly" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="yearly" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Client Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                new: { label: "New Clients", color: "#8b5cf6" },
                total: { label: "Total Clients", color: "#06b6d4" }
              }}
            >
              <LineChart data={clientsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="new" stroke="#8b5cf6" strokeWidth={3} />
                <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={3} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Package Distribution & Feature Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Package Distribution</CardTitle>
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
                    outerRadius={100}
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">{pkg.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{pkg.count} clients</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                usage: { label: "Usage %", color: "#3b82f6" }
              }}
            >
              <BarChart data={featureUsage} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis type="number" className="text-gray-600 dark:text-gray-400" />
                <YAxis dataKey="feature" type="category" width={120} className="text-gray-600 dark:text-gray-400" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="usage" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Usage Metrics */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Resource Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageMetrics.map((metric) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.metric}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {((metric.used / metric.total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(metric.used / metric.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{metric.used.toLocaleString()}</span>
                  <span>{metric.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</span>
                  <Badge variant={notification.type === 'success' ? 'default' : notification.type === 'warning' ? 'secondary' : 'destructive'}>
                    {notification.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.client}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
