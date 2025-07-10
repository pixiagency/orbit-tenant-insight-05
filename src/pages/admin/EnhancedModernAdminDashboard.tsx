import React, { useState } from 'react';
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
  Filter,
  Crown,
  UserCheck,
  AlertTriangle,
  DollarSign,
  Mail,
  CheckCircle,
  Activity,
  Zap,
  Shield,
  Award,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export const EnhancedModernAdminDashboard = () => {
  const [activeView, setActiveView] = useState('admin');
  const [dateRange, setDateRange] = useState('30d');

  // Admin Dashboard Data
  const adminMetrics = {
    activeUsers: { current: 45, change: "+8% vs last month" },
    totalLeads: { current: 1247, change: "+12.5% this week" },
    overallConversion: { current: 24.5, change: "+2.1% vs last month" },
    avgResponseTime: { current: 2.4, change: "-0.5 hrs improvement" },
    dailySales: { current: "$8,450", change: "+18% vs yesterday" },
    monthlySales: { current: "$124,567", change: "+15% vs last month" },
    callsToday: { current: 156, change: "+23 vs yesterday" },
    emailsSent: { current: 287, change: "+45 this week" },
    tasksCompleted: { current: 89, change: "94% completion rate" }
  };

  const integrationStatus = [
    { name: "VoIP (3CX)", status: "active", uptime: "99.8%" },
    { name: "Meta Ads", status: "active", uptime: "100%" },
    { name: "Google Ads", status: "warning", uptime: "97.2%" },
    { name: "WhatsApp", status: "active", uptime: "99.5%" },
    { name: "Email", status: "active", uptime: "100%" },
    { name: "Zapier", status: "inactive", uptime: "0%" }
  ];

  const leadSources = [
    { source: "Website", count: 456, percentage: 36.6 },
    { source: "Meta Ads", count: 342, percentage: 27.4 },
    { source: "Google Ads", count: 289, percentage: 23.2 },
    { source: "Referrals", count: 98, percentage: 7.9 },
    { source: "Direct", count: 62, percentage: 4.9 }
  ];

  const topPerformers = [
    { name: "Sarah Johnson", role: "Senior Sales Rep", deals: 23, revenue: "$87,500", conversion: "32%", score: 95 },
    { name: "Mike Chen", role: "Sales Rep", deals: 19, revenue: "$65,200", conversion: "28%", score: 88 },
    { name: "Emily Davis", role: "Sales Rep", deals: 17, revenue: "$58,900", conversion: "25%", score: 82 },
    { name: "John Wilson", role: "Junior Rep", deals: 12, revenue: "$35,400", conversion: "22%", score: 75 },
    { name: "Lisa Brown", role: "Sales Rep", deals: 15, revenue: "$48,300", conversion: "26%", score: 79 }
  ];

  const teamComparison = [
    { team: "Sales Team A", leads: 234, conversion: "28%", revenue: "$156,000" },
    { team: "Sales Team B", leads: 189, conversion: "25%", revenue: "$128,500" },
    { team: "Sales Team C", leads: 156, conversion: "31%", revenue: "$142,300" }
  ];

  const alerts = [
    { type: "warning", message: "Google Ads integration showing decreased performance", time: "2 hours ago" },
    { type: "error", message: "5 overdue tasks assigned to Team B", time: "4 hours ago" },
    { type: "info", message: "Monthly sales target 85% achieved", time: "1 day ago" }
  ];

  // Team Leader Dashboard Data
  const teamLeaderData = {
    assignedLeads: { current: 67, change: "+12 this week" },
    teamMembers: 8,
    teamConversion: { current: 28.5, change: "+3.2% vs last month" },
    avgResponseTime: { current: 1.8, change: "-0.3 hrs improvement" },
    teamCalls: { current: 89, change: "+15 today" },
    completedTasks: { current: 156, change: "92% completion rate" },
    teamScore: { current: 87, change: "+5 points" }
  };

  const teamMemberPerformance = [
    { name: "John Doe", calls: 15, conversion: "32%", avgResponse: "1.2 hrs", tasks: "8/9", score: 92 },
    { name: "Jane Smith", calls: 12, conversion: "28%", avgResponse: "1.8 hrs", tasks: "7/8", score: 85 },
    { name: "Bob Wilson", calls: 8, conversion: "22%", avgResponse: "2.1 hrs", tasks: "5/7", score: 78 }
  ];

  const leadStatuses = [
    { status: "New", count: 23, percentage: 34 },
    { status: "In Contact", count: 18, percentage: 27 },
    { status: "Qualified", count: 15, percentage: 22 },
    { status: "Closed Won", count: 8, percentage: 12 },
    { status: "Closed Lost", count: 3, percentage: 5 }
  ];

  // Sales Dashboard Data
  const salesAgentData = {
    receivedLeads: { current: 18, change: "+3 this week" },
    dailyCalls: { current: 8, change: "Quality rating: 4.2/5" },
    personalConversion: { current: 32, change: "+4% vs team avg" },
    dailyTasks: { current: 5, completed: 4, overdue: 1 },
    opportunities: { current: 12, value: "$45,600" },
    monthlyRevenue: { current: "$52,000", target: "$60,000", percentage: 87 },
    weeklyGoals: { current: 85, change: "On track" }
  };

  const myOpportunities = [
    { company: "TechCorp Inc.", value: "$25,000", stage: "Negotiation", probability: "75%", nextAction: "Follow-up call" },
    { company: "StartupXYZ", value: "$15,000", stage: "Proposal", probability: "60%", nextAction: "Send proposal" },
    { company: "BigCorp Ltd", value: "$35,000", stage: "Discovery", probability: "40%", nextAction: "Demo scheduled" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const AdminDashboard = () => (
    <>
      {/* System Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ModernKPICard
          title="Active Users"
          value={adminMetrics.activeUsers.current.toString()}
          icon={Users}
          change={{ value: adminMetrics.activeUsers.change, trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Total Leads"
          value={adminMetrics.totalLeads.current.toLocaleString()}
          icon={Target}
          change={{ value: adminMetrics.totalLeads.change, trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Conversion Rate"
          value={`${adminMetrics.overallConversion.current}%`}
          icon={TrendingUp}
          change={{ value: adminMetrics.overallConversion.change, trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="Avg Response Time"
          value={`${adminMetrics.avgResponseTime.current} hrs`}
          icon={Clock}
          change={{ value: adminMetrics.avgResponseTime.change, trend: "up" }}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Sales & Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <ModernKPICard
          title="Daily Sales"
          value={adminMetrics.dailySales.current}
          icon={DollarSign}
          change={{ value: adminMetrics.dailySales.change, trend: "up" }}
          gradient="from-emerald-500 to-emerald-600"
        />
        <ModernKPICard
          title="Monthly Sales"
          value={adminMetrics.monthlySales.current}
          icon={DollarSign}
          change={{ value: adminMetrics.monthlySales.change, trend: "up" }}
          gradient="from-emerald-600 to-emerald-700"
        />
        <ModernKPICard
          title="Calls Today"
          value={adminMetrics.callsToday.current.toString()}
          icon={Phone}
          change={{ value: adminMetrics.callsToday.change, trend: "up" }}
          gradient="from-indigo-500 to-indigo-600"
        />
        <ModernKPICard
          title="Emails Sent"
          value={adminMetrics.emailsSent.current.toString()}
          icon={Mail}
          change={{ value: adminMetrics.emailsSent.change, trend: "up" }}
          gradient="from-cyan-500 to-cyan-600"
        />
        <ModernKPICard
          title="Tasks Completed"
          value={adminMetrics.tasksCompleted.current.toString()}
          icon={CheckCircle}
          change={{ value: adminMetrics.tasksCompleted.change, trend: "up" }}
          gradient="from-teal-500 to-teal-600"
        />
      </div>

      {/* Integration Status & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {integrationStatus.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{integration.name}</p>
                    <p className="text-sm text-gray-600">Uptime: {integration.uptime}</p>
                  </div>
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPlaceholder 
          title="Leads by Source" 
          description="Lead distribution across channels"
        />
        <ChartPlaceholder 
          title="Team Performance Comparison" 
          description="Revenue and conversion by team"
        />
      </div>

      {/* Top Performers & Team Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Top 10 Performing Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-600">{performer.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{performer.deals} deals • {performer.revenue}</p>
                    <p className="text-xs text-gray-600">Conversion: {performer.conversion} • Score: {performer.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Team Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamComparison.map((team, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{team.team}</h4>
                    <Badge variant="outline">{team.conversion} conversion</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Leads: <span className="font-medium text-gray-900">{team.leads}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue: <span className="font-medium text-green-600">{team.revenue}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const TeamLeaderDashboard = () => (
    <>
      {/* Team Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ModernKPICard
          title="Assigned Leads"
          value={teamLeaderData.assignedLeads.current.toString()}
          icon={Target}
          change={{ value: teamLeaderData.assignedLeads.change, trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Team Conversion"
          value={`${teamLeaderData.teamConversion.current}%`}
          icon={TrendingUp}
          change={{ value: teamLeaderData.teamConversion.change, trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Team Calls Today"
          value={teamLeaderData.teamCalls.current.toString()}
          icon={Phone}
          change={{ value: teamLeaderData.teamCalls.change, trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="Team Score"
          value={teamLeaderData.teamScore.current.toString()}
          icon={Award}
          change={{ value: teamLeaderData.teamScore.change, trend: "up" }}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Team Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ModernKPICard
          title="Avg Response Time"
          value={`${teamLeaderData.avgResponseTime.current} hrs`}
          icon={Clock}
          change={{ value: teamLeaderData.avgResponseTime.change, trend: "up" }}
          gradient="from-teal-500 to-teal-600"
        />
        <ModernKPICard
          title="Tasks Completion"
          value={teamLeaderData.completedTasks.current.toString()}
          icon={CheckCircle}
          change={{ value: teamLeaderData.completedTasks.change, trend: "up" }}
          gradient="from-emerald-500 to-emerald-600"
        />
        <ModernKPICard
          title="Team Members"
          value={teamLeaderData.teamMembers.toString()}
          icon={Users}
          description="Active team members"
          gradient="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Lead Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                    <span>{status.count} leads</span>
                  </div>
                  <Progress value={status.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ChartPlaceholder 
          title="Team Performance Trends" 
          description="Track team metrics over time"
        />
      </div>

      {/* Team Member Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-600" />
            Team Member Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMemberPerformance.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">Score: {member.score}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Calls: <span className="font-medium">{member.calls}</span></p>
                      <p className="text-gray-600">Conversion: <span className="font-medium">{member.conversion}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Response: <span className="font-medium">{member.avgResponse}</span></p>
                      <p className="text-gray-600">Tasks: <span className="font-medium">{member.tasks}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const SalesAgentDashboard = () => (
    <>
      {/* Personal Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ModernKPICard
          title="Received Leads"
          value={salesAgentData.receivedLeads.current.toString()}
          icon={Target}
          change={{ value: salesAgentData.receivedLeads.change, trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Daily Calls"
          value={salesAgentData.dailyCalls.current.toString()}
          icon={Phone}
          change={{ value: salesAgentData.dailyCalls.change, trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Conversion Rate"
          value={`${salesAgentData.personalConversion.current}%`}
          icon={TrendingUp}
          change={{ value: salesAgentData.personalConversion.change, trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="Weekly Goals"
          value={`${salesAgentData.weeklyGoals.current}%`}
          icon={Award}
          change={{ value: salesAgentData.weeklyGoals.change, trend: "up" }}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Revenue & Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">{salesAgentData.monthlyRevenue.current}</span>
                <Badge variant="outline">{salesAgentData.monthlyRevenue.percentage}% of target</Badge>
              </div>
              <Progress value={salesAgentData.monthlyRevenue.percentage} className="h-3" />
              <p className="text-sm text-gray-600">Target: {salesAgentData.monthlyRevenue.target}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{salesAgentData.dailyTasks.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">{salesAgentData.dailyTasks.current}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overdue</span>
                <span className="font-medium text-red-600">{salesAgentData.dailyTasks.overdue}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Deals</span>
                <span className="font-medium">{salesAgentData.opportunities.current}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pipeline Value</span>
                <span className="font-medium text-green-600">{salesAgentData.opportunities.value}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPlaceholder 
          title="Personal Performance Trend" 
          description="Track your daily/weekly performance"
        />
        <ChartPlaceholder 
          title="Goal Progress" 
          description="KPI progress vs targets"
        />
      </div>

      {/* My Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            My Active Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{opportunity.company}</p>
                    <p className="text-sm text-gray-600">{opportunity.stage} • {opportunity.probability} probability</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{opportunity.value}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {opportunity.stage}
                  </Badge>
                  <p className="text-xs text-gray-500">Next: {opportunity.nextAction}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Good morning, Admin</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your sales today</p>
            </div>
            <Select value={activeView} onValueChange={setActiveView}>
              <SelectTrigger className="w-56 bg-blue-50 border-blue-200">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    {activeView === 'admin' && <Shield className="h-4 w-4 text-blue-600" />}
                    {activeView === 'team-leader' && <Crown className="h-4 w-4 text-purple-600" />}
                    {activeView === 'sales-agent' && <UserCheck className="h-4 w-4 text-green-600" />}
                    <span className="font-medium">
                      {activeView === 'admin' && 'Admin Dashboard'}
                      {activeView === 'team-leader' && 'Team Leader View'}
                      {activeView === 'sales-agent' && 'Sales Agent View'}
                    </span>
                  </div>
                </SelectValue>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Admin Dashboard</span>
                  </div>
                </SelectItem>
                <SelectItem value="team-leader">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <span>Team Leader View</span>
                  </div>
                </SelectItem>
                <SelectItem value="sales-agent">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span>Sales Agent View</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'team-leader' && <TeamLeaderDashboard />}
        {activeView === 'sales-agent' && <SalesAgentDashboard />}
      </div>
    </div>
  );
};
