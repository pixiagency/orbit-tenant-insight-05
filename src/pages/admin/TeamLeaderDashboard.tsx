import React, { useState } from 'react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { ChartPlaceholder } from '../../components/shared/ChartPlaceholder';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  CheckCircle,
  Calendar,
  Phone,
  DollarSign,
  Clock,
  Filter,
  Bell,
  Activity,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export const TeamLeaderDashboard = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [channelFilter, setChannelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Team metrics
  const teamMetrics = {
    assignedLeads: { current: 89, change: "+15 this week" },
    teamSize: { current: 8, change: "+1 new member" },
    teamConversion: { current: 28.5, change: "+3.2% vs last month" },
    avgResponseTime: { current: 1.8, change: "-0.3 hrs improvement" },
    teamCalls: { current: 156, change: "+23 today" },
    avgCallDuration: { current: 8.2, change: "+1.2 min vs avg" },
    completedTasks: { current: 89, overdue: 12, completion: 88 },
    teamScore: { current: 87, change: "+5 points this month" }
  };

  // Lead status breakdown
  const leadStatuses = [
    { status: "New", count: 23, percentage: 26, color: "bg-blue-500" },
    { status: "In Contact", count: 28, percentage: 31, color: "bg-yellow-500" },
    { status: "Qualified", count: 22, percentage: 25, color: "bg-green-500" },
    { status: "Closed Won", count: 12, percentage: 13, color: "bg-emerald-500" },
    { status: "Closed Lost", count: 4, percentage: 5, color: "bg-red-500" }
  ];

  // Team member performance
  const teamMembers = [
    { 
      name: "John Doe", 
      role: "Senior Sales Rep", 
      calls: 28, 
      conversion: "32%", 
      avgResponse: "1.2 hrs",
      avgCallDuration: "9.5 min",
      tasks: { completed: 15, total: 17 },
      score: 92,
      leads: 18,
      status: "active"
    },
    { 
      name: "Jane Smith", 
      role: "Sales Rep", 
      calls: 22, 
      conversion: "28%", 
      avgResponse: "1.8 hrs",
      avgCallDuration: "7.8 min",
      tasks: { completed: 12, total: 14 },
      score: 85,
      leads: 15,
      status: "active"
    },
    { 
      name: "Bob Wilson", 
      role: "Junior Rep", 
      calls: 18, 
      conversion: "22%", 
      avgResponse: "2.1 hrs",
      avgCallDuration: "6.2 min",
      tasks: { completed: 8, total: 12 },
      score: 78,
      leads: 12,
      status: "training"
    },
    { 
      name: "Alice Johnson", 
      role: "Sales Rep", 
      calls: 25, 
      conversion: "30%", 
      avgResponse: "1.5 hrs",
      avgCallDuration: "8.8 min",
      tasks: { completed: 14, total: 15 },
      score: 88,
      leads: 16,
      status: "active"
    }
  ];

  // Lead sources breakdown
  const leadSources = [
    { source: "Website", count: 34, percentage: 38 },
    { source: "Meta Ads", count: 26, percentage: 29 },
    { source: "Google Ads", count: 18, percentage: 20 },
    { source: "Referrals", count: 8, percentage: 9 },
    { source: "Direct", count: 3, percentage: 4 }
  ];

  // Recent team activities
  const recentActivities = [
    { 
      member: "John Doe", 
      action: "Closed deal with TechCorp", 
      value: "$15,000", 
      time: "2 hours ago",
      type: "success"
    },
    { 
      member: "Jane Smith", 
      action: "Scheduled demo with StartupXYZ", 
      time: "3 hours ago",
      type: "scheduled"
    },
    { 
      member: "Alice Johnson", 
      action: "Follow-up call completed", 
      time: "4 hours ago",
      type: "completed"
    },
    { 
      member: "Bob Wilson", 
      action: "New lead assigned", 
      time: "5 hours ago",
      type: "assigned"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'training': return 'bg-blue-100 text-blue-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return '💰';
      case 'scheduled': return '📅';
      case 'completed': return '✅';
      case 'assigned': return '👤';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Team Leader Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your team's performance</p>
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
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Lead Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="ads">Paid Ads</SelectItem>
                <SelectItem value="referral">Referrals</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Team Overview KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernKPICard
            title="Assigned Leads"
            value={teamMetrics.assignedLeads.current.toString()}
            icon={Target}
            change={{ value: teamMetrics.assignedLeads.change, trend: "up" }}
            gradient="from-blue-500 to-blue-600"
          />
          <ModernKPICard
            title="Team Conversion"
            value={`${teamMetrics.teamConversion.current}%`}
            icon={TrendingUp}
            change={{ value: teamMetrics.teamConversion.change, trend: "up" }}
            gradient="from-green-500 to-green-600"
          />
          <ModernKPICard
            title="Team Calls"
            value={teamMetrics.teamCalls.current.toString()}
            icon={Phone}
            change={{ value: teamMetrics.teamCalls.change, trend: "up" }}
            gradient="from-purple-500 to-purple-600"
          />
          <ModernKPICard
            title="Team Score"
            value={teamMetrics.teamScore.current.toString()}
            icon={Award}
            change={{ value: teamMetrics.teamScore.change, trend: "up" }}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernKPICard
            title="Avg Response Time"
            value={`${teamMetrics.avgResponseTime.current} hrs`}
            icon={Clock}
            change={{ value: teamMetrics.avgResponseTime.change, trend: "up" }}
            gradient="from-teal-500 to-teal-600"
          />
          <ModernKPICard
            title="Avg Call Duration"
            value={`${teamMetrics.avgCallDuration.current} min`}
            icon={Phone}
            change={{ value: teamMetrics.avgCallDuration.change, trend: "up" }}
            gradient="from-indigo-500 to-indigo-600"
          />
          <ModernKPICard
            title="Task Completion"
            value={`${teamMetrics.completedTasks.completion}%`}
            icon={CheckCircle}
            change={{ value: `${teamMetrics.completedTasks.overdue} overdue`, trend: "neutral" }}
            gradient="from-emerald-500 to-emerald-600"
          />
          <ModernKPICard
            title="Team Size"
            value={teamMetrics.teamSize.current.toString()}
            icon={Users}
            change={{ value: teamMetrics.teamSize.change, trend: "up" }}
            gradient="from-pink-500 to-pink-600"
          />
        </div>

        {/* Lead Status & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadStatuses.map((status, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{status.status}</span>
                      <span>{status.count} leads ({status.percentage}%)</span>
                    </div>
                    <Progress value={status.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ChartPlaceholder 
            title="Team Performance Trends" 
            description="Track conversion rates and response times"
          />
        </div>

        {/* Team Member Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-600" />
              Team Member Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{member.score}</div>
                        <div className="text-xs text-gray-500">Performance Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Calls Made</p>
                      <p className="font-medium text-gray-900">{member.calls}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Conversion Rate</p>
                      <p className="font-medium text-green-600">{member.conversion}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Response</p>
                      <p className="font-medium text-gray-900">{member.avgResponse}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tasks</p>
                      <p className="font-medium text-gray-900">{member.tasks.completed}/{member.tasks.total}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Avg Call Duration: <span className="font-medium">{member.avgCallDuration}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Active Leads: <span className="font-medium">{member.leads}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leadSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{source.source}</span>
                    <div className="text-right">
                      <span className="font-medium">{source.count} leads</span>
                      <p className="text-xs text-gray-500">{source.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Team Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.member} - {activity.action}
                      </p>
                      {activity.value && (
                        <p className="text-sm text-green-600 font-medium">{activity.value}</p>
                      )}
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Individual Performance Comparison" 
            description="Compare team member metrics"
          />
          <ChartPlaceholder 
            title="Lead Distribution & Conversion" 
            description="Track lead flow and conversion by source"
          />
        </div>
      </div>
    </div>
  );
};
