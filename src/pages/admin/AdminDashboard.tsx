
import React, { useState } from 'react';
import { KPICard } from '../../components/shared/KPICard';
import { ChartPlaceholder } from '../../components/shared/ChartPlaceholder';
import { 
  Target, 
  FileText, 
  CheckSquare, 
  Phone, 
  TrendingUp,
  Calendar,
  Users,
  Bell,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const recentActivity = [
    { id: 1, type: "Call", description: "Call with John Smith completed", time: "2 hours ago" },
    { id: 2, type: "Deal", description: "Deal 'Enterprise Solution' moved to negotiation", time: "4 hours ago" },
    { id: 3, type: "Lead", description: "New lead from website form", time: "6 hours ago" },
    { id: 4, type: "Task", description: "Follow-up email sent to prospect", time: "1 day ago" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Demo with TechStart", time: "2:00 PM", type: "Demo" },
    { id: 2, title: "Follow-up call", time: "3:30 PM", type: "Call" },
    { id: 3, title: "Team meeting", time: "4:00 PM", type: "Meeting" },
  ];

  const topPerformers = [
    { name: "Sarah Johnson", deals: 23, revenue: "$87,500" },
    { name: "Mike Chen", deals: 19, revenue: "$65,200" },
    { name: "Emily Davis", deals: 17, revenue: "$58,900" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Leads"
          value="156"
          icon={Target}
          change={{ value: "+12 this week", trend: "up" }}
        />
        <KPICard
          title="Active Deals"
          value="23"
          icon={FileText}
          change={{ value: "$145,600 in pipeline", trend: "up" }}
        />
        <KPICard
          title="Tasks Due Today"
          value="8"
          icon={CheckSquare}
          change={{ value: "6 completed", trend: "up" }}
        />
        <KPICard
          title="Calls Made Today"
          value="14"
          icon={Phone}
          change={{ value: "85% connect rate", trend: "up" }}
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KPICard
          title="Conversion Rate"
          value="24.5%"
          icon={TrendingUp}
          change={{ value: "+2.1% vs last month", trend: "up" }}
          description="Lead to customer conversion"
        />
        <KPICard
          title="Avg Response Time"
          value="2.4 hrs"
          icon={Clock}
          change={{ value: "-0.5 hrs improvement", trend: "up" }}
          description="Time to respond to leads"
        />
        <KPICard
          title="Revenue This Month"
          value="$89,240"
          icon={DollarSign}
          change={{ value: "+15% vs last month", trend: "up" }}
          description="Monthly revenue target: $100k"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder 
          title="Leads by Source" 
          description="Track lead generation channels"
        />
        <ChartPlaceholder 
          title="Deals by Stage" 
          description="Pipeline progression analysis"
        />
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder 
          title="Sales Performance" 
          height="300px"
          description="Monthly sales trends and forecasting"
        />
        <ChartPlaceholder 
          title="Pipeline Health" 
          height="300px"
          description="Deal progression and conversion rates"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Sales Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">$245,680</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">34</p>
              <p className="text-sm text-gray-600">Deals Closed</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">$7,225</p>
              <p className="text-sm text-gray-600">Average Deal Size</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-600">{performer.deals} deals closed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{performer.revenue}</p>
                    <Badge variant="default">#{index + 1}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder 
          title="Team Activity" 
          height="300px"
          description="Individual performance tracking"
        />
        <ChartPlaceholder 
          title="Goal Achievement" 
          height="300px"
          description="Team vs individual goals"
        />
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant="secondary">{activity.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.time}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your sales performance and manage your pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          {renderSales()}
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          {renderTeam()}
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          {renderActivity()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
