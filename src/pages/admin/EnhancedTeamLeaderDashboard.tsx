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
  Crown,
  MessageSquare,
  Mail,
  PhoneCall,
  UserCheck,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const EnhancedTeamLeaderDashboard = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [teamFilter, setTeamFilter] = useState("all");
  const [performanceView, setPerformanceView] = useState("overview");

  // Enhanced team metrics with more comprehensive data
  const teamMetrics = {
    assignedLeads: { current: 156, change: "+28 this week", trend: "up" },
    teamSize: { current: 12, change: "+2 new members", trend: "up" },
    teamConversion: { current: 34.5, change: "+5.8% vs last month", trend: "up" },
    avgResponseTime: { current: 1.2, change: "-0.6 hrs improvement", trend: "up" },
    teamCalls: { current: 284, change: "+45 today", trend: "up" },
    avgCallDuration: { current: 9.8, change: "+2.1 min vs avg", trend: "up" },
    completedTasks: { current: 156, overdue: 18, completion: 90, trend: "up" },
    teamScore: { current: 92, change: "+8 points this month", trend: "up" },
    emailsSent: { current: 189, change: "+32 today", trend: "up" },
    whatsappMessages: { current: 67, change: "+15 today", trend: "up" }
  };

  // Enhanced lead status with more granular tracking
  const leadStatuses = [
    { status: "New", count: 42, percentage: 27, color: "bg-blue-500", trend: "+12" },
    { status: "In Contact", count: 48, percentage: 31, color: "bg-yellow-500", trend: "+8" },
    { status: "Qualified", count: 35, percentage: 22, color: "bg-green-500", trend: "+5" },
    { status: "Negotiation", count: 18, percentage: 12, color: "bg-orange-500", trend: "+3" },
    { status: "Closed Won", count: 12, percentage: 8, color: "bg-emerald-500", trend: "+4" }
  ];

  // Enhanced team member performance with detailed metrics
  const teamMembers = [
    { 
      name: "John Doe", 
      role: "Senior Sales Rep", 
      calls: 42, 
      emails: 28,
      whatsapp: 12,
      conversion: "38%", 
      avgResponse: "0.8 hrs",
      avgCallDuration: "11.2 min",
      tasks: { completed: 24, total: 26 },
      score: 96,
      leads: 28,
      revenue: 145000,
      status: "active",
      improvement: "+8%"
    },
    { 
      name: "Jane Smith", 
      role: "Sales Rep", 
      calls: 35, 
      emails: 22,
      whatsapp: 8,
      conversion: "32%", 
      avgResponse: "1.2 hrs",
      avgCallDuration: "9.1 min",
      tasks: { completed: 18, total: 21 },
      score: 89,
      leads: 22,
      revenue: 98000,
      status: "active",
      improvement: "+5%"
    },
    { 
      name: "Bob Wilson", 
      role: "Junior Rep", 
      calls: 28, 
      emails: 15,
      whatsapp: 6,
      conversion: "26%", 
      avgResponse: "1.8 hrs",
      avgCallDuration: "7.5 min",
      tasks: { completed: 12, total: 18 },
      score: 82,
      leads: 18,
      revenue: 52000,
      status: "training",
      improvement: "+12%"
    },
    { 
      name: "Alice Johnson", 
      role: "Sales Rep", 
      calls: 38, 
      emails: 25,
      whatsapp: 10,
      conversion: "35%", 
      avgResponse: "1.0 hrs",
      avgCallDuration: "10.3 min",
      tasks: { completed: 22, total: 24 },
      score: 91,
      leads: 25,
      revenue: 112000,
      status: "active",
      improvement: "+6%"
    },
    { 
      name: "Sarah Chen", 
      role: "Senior Sales Rep", 
      calls: 45, 
      emails: 32,
      whatsapp: 14,
      conversion: "41%", 
      avgResponse: "0.6 hrs",
      avgCallDuration: "12.1 min",
      tasks: { completed: 26, total: 28 },
      score: 98,
      leads: 32,
      revenue: 168000,
      status: "active",
      improvement: "+10%"
    }
  ];

  // Channel performance comparison
  const channelPerformance = [
    { 
      channel: "Phone Calls", 
      total: 284, 
      responseRate: "72%", 
      conversionRate: "45%",
      avgDuration: "9.8 min",
      trend: "up"
    },
    { 
      channel: "Email", 
      total: 189, 
      responseRate: "28%", 
      conversionRate: "22%",
      avgDuration: "-",
      trend: "up"
    },
    { 
      channel: "WhatsApp", 
      total: 67, 
      responseRate: "89%", 
      conversionRate: "38%",
      avgDuration: "-",
      trend: "up"
    }
  ];

  // Team alerts and insights
  const teamAlerts = [
    {
      type: "performance",
      message: "Sarah Chen exceeded her monthly target by 25%",
      priority: "high",
      timestamp: "2 hours ago"
    },
    {
      type: "training",
      message: "Bob Wilson needs additional call handling training",
      priority: "medium",
      timestamp: "4 hours ago"
    },
    {
      type: "target",
      message: "Team is 8% ahead of monthly conversion target",
      priority: "high",
      timestamp: "1 day ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'training': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'performance': return '🏆';
      case 'training': return '📚';
      case 'target': return '🎯';
      default: return '📝';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-600';
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Enhanced Team Leader Dashboard</h1>
            <p className="text-muted-foreground mt-1">Advanced team performance monitoring and management</p>
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
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Team Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="senior">Senior Reps</SelectItem>
                <SelectItem value="junior">Junior Reps</SelectItem>
                <SelectItem value="training">In Training</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Core Team Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
          <ModernKPICard
            title="Task Completion"
            value={`${teamMetrics.completedTasks.completion}%`}
            icon={CheckCircle}
            change={{ value: `${teamMetrics.completedTasks.overdue} overdue`, trend: "neutral" }}
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* Communication Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernKPICard
            title="Avg Response Time"
            value={`${teamMetrics.avgResponseTime.current}h`}
            icon={Clock}
            change={{ value: teamMetrics.avgResponseTime.change, trend: "up" }}
            gradient="from-teal-500 to-teal-600"
          />
          <ModernKPICard
            title="Emails Sent"
            value={teamMetrics.emailsSent.current.toString()}
            icon={Mail}
            change={{ value: teamMetrics.emailsSent.change, trend: "up" }}
            gradient="from-indigo-500 to-indigo-600"
          />
          <ModernKPICard
            title="WhatsApp Messages"
            value={teamMetrics.whatsappMessages.current.toString()}
            icon={MessageSquare}
            change={{ value: teamMetrics.whatsappMessages.change, trend: "up" }}
            gradient="from-pink-500 to-pink-600"
          />
          <ModernKPICard
            title="Team Size"
            value={teamMetrics.teamSize.current.toString()}
            icon={Users}
            change={{ value: teamMetrics.teamSize.change, trend: "up" }}
            gradient="from-cyan-500 to-cyan-600"
          />
        </div>

        {/* Channel Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Communication Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channelPerformance.map((channel, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-foreground">{channel.channel}</h3>
                    <Badge variant="outline">{channel.total} total</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Rate:</span>
                      <span className="font-medium text-green-600">{channel.responseRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion:</span>
                      <span className="font-medium text-purple-600">{channel.conversionRate}</span>
                    </div>
                    {channel.avgDuration !== "-" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <span className="font-medium">{channel.avgDuration}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Status & Team Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Lead Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadStatuses.map((status, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{status.status}</span>
                      <div className="flex items-center space-x-2">
                        <span>{status.count} leads ({status.percentage}%)</span>
                        <Badge variant="outline" className="text-green-600">
                          {status.trend}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={status.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-orange-600" />
                Team Alerts & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                    <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Team Member Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-600" />
              Enhanced Team Member Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="p-6 bg-muted rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(member.score)}`}>{member.score}</div>
                        <div className="text-xs text-muted-foreground">Performance Score</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Communication Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <PhoneCall className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-muted-foreground">Calls</p>
                        <p className="font-medium text-foreground">{member.calls}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-muted-foreground">Emails</p>
                        <p className="font-medium text-foreground">{member.emails}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-muted-foreground">WhatsApp</p>
                        <p className="font-medium text-foreground">{member.whatsapp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-muted-foreground">Conversion</p>
                        <p className="font-medium text-green-600">{member.conversion}</p>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue Generated</p>
                      <p className="font-medium text-foreground">${member.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Leads</p>
                      <p className="font-medium text-foreground">{member.leads}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tasks Completion</p>
                      <p className="font-medium text-foreground">{member.tasks.completed}/{member.tasks.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Improvement</p>
                      <p className="font-medium text-green-600">{member.improvement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Team Performance Comparison" 
            description="Individual vs team average performance metrics"
          />
          <ChartPlaceholder 
            title="Channel Effectiveness Analysis" 
            description="Response and conversion rates by communication channel"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Lead Flow & Conversion Funnel" 
            description="Track lead progression through sales stages"
          />
          <ChartPlaceholder 
            title="Team Productivity Trends" 
            description="Activity and outcome trends over time"
          />
        </div>
      </div>
    </div>
  );
};