
import React from 'react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
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
  Plus,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ModernAdminDashboard = () => {
  const recentActivity = [
    { 
      id: 1, 
      type: "Call", 
      description: "Call with John Smith completed", 
      time: "2 hours ago",
      status: "completed"
    },
    { 
      id: 2, 
      type: "Deal", 
      description: "Deal 'Enterprise Solution' moved to negotiation", 
      time: "4 hours ago",
      status: "in-progress"
    },
    { 
      id: 3, 
      type: "Lead", 
      description: "New lead from website form", 
      time: "6 hours ago",
      status: "new"
    },
    { 
      id: 4, 
      type: "Task", 
      description: "Follow-up email sent to prospect", 
      time: "1 day ago",
      status: "completed"
    },
  ];

  const upcomingEvents = [
    { id: 1, title: "Demo with TechStart", time: "2:00 PM", type: "Demo", priority: "high" },
    { id: 2, title: "Follow-up call", time: "3:30 PM", type: "Call", priority: "medium" },
    { id: 3, title: "Team meeting", time: "4:00 PM", type: "Meeting", priority: "low" },
  ];

  const topPerformers = [
    { name: "Sarah Johnson", deals: 23, revenue: "$87,500", avatar: "SJ" },
    { name: "Mike Chen", deals: 19, revenue: "$65,200", avatar: "MC" },
    { name: "Emily Davis", deals: 17, revenue: "$58,900", avatar: "ED" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'new': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-400';
      case 'medium': return 'border-l-yellow-400';
      case 'low': return 'border-l-green-400';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Good morning, Admin</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your sales today</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernKPICard
            title="Total Leads"
            value="156"
            icon={Target}
            change={{ value: "+12 this week", trend: "up" }}
            gradient="from-blue-500 to-blue-600"
          />
          <ModernKPICard
            title="Active Deals"
            value="23"
            icon={FileText}
            change={{ value: "$145,600 in pipeline", trend: "up" }}
            gradient="from-emerald-500 to-emerald-600"
          />
          <ModernKPICard
            title="Tasks Due Today"
            value="8"
            icon={CheckSquare}
            change={{ value: "6 completed", trend: "up" }}
            gradient="from-orange-500 to-orange-600"
          />
          <ModernKPICard
            title="Calls Made Today"
            value="14"
            icon={Phone}
            change={{ value: "85% connect rate", trend: "up" }}
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ModernKPICard
            title="Conversion Rate"
            value="24.5%"
            icon={TrendingUp}
            change={{ value: "+2.1% vs last month", trend: "up" }}
            description="Lead to customer conversion"
            gradient="from-indigo-500 to-indigo-600"
          />
          <ModernKPICard
            title="Avg Response Time"
            value="2.4 hrs"
            icon={Clock}
            change={{ value: "-0.5 hrs improvement", trend: "up" }}
            description="Time to respond to leads"
            gradient="from-teal-500 to-teal-600"
          />
          <ModernKPICard
            title="Active Pipelines"
            value="5"
            icon={Target}
            description="Sales pipelines in progress"
            gradient="from-pink-500 to-pink-600"
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

        {/* Activity Feed & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(activity.status)}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`p-4 bg-gray-50 rounded-xl border-l-4 ${getPriorityColor(event.priority)} hover:bg-gray-100 transition-colors`}>
                  <p className="font-medium text-sm text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Users className="h-5 w-5 mr-2 text-emerald-600" />
              Top Performing Sales Reps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {performer.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-600">{performer.deals} deals closed</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-emerald-600">{performer.revenue}</p>
                    <Badge className="bg-emerald-100 text-emerald-700">#{index + 1}</Badge>
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
