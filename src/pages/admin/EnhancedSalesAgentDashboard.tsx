import React, { useState } from 'react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { ChartPlaceholder } from '../../components/shared/ChartPlaceholder';
import { 
  Target, 
  DollarSign, 
  Phone, 
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  Award,
  AlertCircle,
  Star,
  Activity,
  MessageSquare,
  Mail,
  PhoneCall
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const EnhancedSalesAgentDashboard = () => {
  const [dateRange, setDateRange] = useState("30d");

  // Enhanced personal metrics
  const personalMetrics = {
    receivedLeads: { current: 34, change: "+12 this week", trend: "up" },
    dailyCalls: { current: 18, quality: 4.5, change: "+6 vs yesterday", trend: "up" },
    personalConversion: { current: 38, change: "+8% vs team avg (30%)", trend: "up" },
    weeklyGoals: { current: 95, target: 100, change: "On track", trend: "up" },
    monthlyRevenue: { current: 72000, target: 80000, percentage: 90, trend: "up" },
    responseTime: { current: 0.8, change: "-0.5 hrs improvement", trend: "up" },
    emailsSent: { current: 45, change: "+12 today", trend: "up" },
    whatsappMessages: { current: 28, change: "+8 today", trend: "up" }
  };

  // Enhanced daily tasks
  const dailyTasks = {
    total: 12,
    completed: 9,
    overdue: 1,
    pending: 2,
    completion: 75
  };

  // Enhanced opportunities with more details
  const opportunities = [
    { 
      id: 1,
      company: "TechCorp Inc.", 
      contact: "John Smith", 
      value: "$35,000", 
      stage: "Negotiation", 
      probability: 85,
      nextAction: "Contract review call",
      dueDate: "Today",
      lastContact: "2 hours ago",
      priority: "high",
      source: "LinkedIn"
    },
    { 
      id: 2,
      company: "StartupXYZ", 
      contact: "Sarah Johnson", 
      value: "$22,000", 
      stage: "Proposal", 
      probability: 70,
      nextAction: "Send updated proposal",
      dueDate: "Tomorrow",
      lastContact: "1 day ago",
      priority: "high",
      source: "Website"
    },
    { 
      id: 3,
      company: "BigCorp Ltd", 
      contact: "Mike Davis", 
      value: "$48,000", 
      stage: "Discovery", 
      probability: 55,
      nextAction: "Technical demo",
      dueDate: "Friday",
      lastContact: "3 days ago",
      priority: "medium",
      source: "Referral"
    },
    { 
      id: 4,
      company: "InnovateCo", 
      contact: "Lisa Brown", 
      value: "$28,500", 
      stage: "Qualified", 
      probability: 80,
      nextAction: "Pricing discussion",
      dueDate: "Next week",
      lastContact: "1 day ago",
      priority: "high",
      source: "Cold Call"
    }
  ];

  // Enhanced today's tasks with more variety
  const todaysTasks = [
    { 
      id: 1,
      task: "Contract review call with TechCorp", 
      time: "9:00 AM", 
      priority: "high",
      status: "pending",
      company: "TechCorp Inc.",
      type: "call"
    },
    { 
      id: 2,
      task: "Send updated proposal to StartupXYZ", 
      time: "10:30 AM", 
      priority: "high",
      status: "overdue",
      company: "StartupXYZ",
      type: "email"
    },
    { 
      id: 3,
      task: "Technical demo for BigCorp", 
      time: "2:00 PM", 
      priority: "medium",
      status: "completed",
      company: "BigCorp Ltd",
      type: "demo"
    },
    { 
      id: 4,
      task: "Follow-up WhatsApp to prospect", 
      time: "3:30 PM", 
      priority: "medium",
      status: "pending",
      company: "TechStart Inc",
      type: "whatsapp"
    },
    { 
      id: 5,
      task: "Update CRM with call notes", 
      time: "4:00 PM", 
      priority: "low",
      status: "pending",
      company: null,
      type: "admin"
    },
    { 
      id: 6,
      task: "Pricing call with InnovateCo", 
      time: "5:00 PM", 
      priority: "medium",
      status: "pending",
      company: "InnovateCo",
      type: "call"
    }
  ];

  // Enhanced goals with more KPIs
  const goals = [
    { goal: "Calls Made", current: 72, target: 80, percentage: 90 },
    { goal: "Emails Sent", current: 45, target: 50, percentage: 90 },
    { goal: "WhatsApp Messages", current: 28, target: 30, percentage: 93 },
    { goal: "Demos Scheduled", current: 12, target: 15, percentage: 80 },
    { goal: "Proposals Sent", current: 8, target: 10, percentage: 80 },
    { goal: "Deals Closed", current: 4, target: 5, percentage: 80 }
  ];

  // Communication insights
  const communicationStats = [
    { 
      channel: "Phone Calls", 
      count: 72, 
      responseRate: "68%", 
      avgDuration: "8.5 min",
      conversion: "42%",
      trend: "up"
    },
    { 
      channel: "Email", 
      count: 45, 
      responseRate: "24%", 
      avgDuration: "-",
      conversion: "18%",
      trend: "up"
    },
    { 
      channel: "WhatsApp", 
      count: 28, 
      responseRate: "85%", 
      avgDuration: "-",
      conversion: "35%",
      trend: "up"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'Discovery': 'bg-blue-100 text-blue-700 border-blue-200',
      'Qualified': 'bg-green-100 text-green-700 border-green-200',
      'Proposal': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
      'Closed Won': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'demo': return <Activity className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Enhanced Sales Dashboard</h1>
            <p className="text-muted-foreground mt-1">Advanced performance tracking and activity management</p>
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
            <Button className="bg-primary hover:bg-primary/90">
              <Phone className="h-4 w-4 mr-2" />
              Quick Call
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Core Performance KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernKPICard
            title="Received Leads"
            value={personalMetrics.receivedLeads.current.toString()}
            icon={Target}
            change={{ value: personalMetrics.receivedLeads.change, trend: "up" }}
            gradient="from-blue-500 to-blue-600"
          />
          <ModernKPICard
            title="Daily Calls"
            value={personalMetrics.dailyCalls.current.toString()}
            icon={Phone}
            change={{ value: `Quality: ${personalMetrics.dailyCalls.quality}/5`, trend: "up" }}
            gradient="from-green-500 to-green-600"
          />
          <ModernKPICard
            title="Conversion Rate"
            value={`${personalMetrics.personalConversion.current}%`}
            icon={TrendingUp}
            change={{ value: personalMetrics.personalConversion.change, trend: "up" }}
            gradient="from-purple-500 to-purple-600"
          />
          <ModernKPICard
            title="Weekly Progress"
            value={`${personalMetrics.weeklyGoals.current}%`}
            icon={Award}
            change={{ value: personalMetrics.weeklyGoals.change, trend: "up" }}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Communication Channels Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernKPICard
            title="Response Time"
            value={`${personalMetrics.responseTime.current}h`}
            icon={Clock}
            change={{ value: personalMetrics.responseTime.change, trend: "up" }}
            gradient="from-teal-500 to-teal-600"
          />
          <ModernKPICard
            title="Emails Sent"
            value={personalMetrics.emailsSent.current.toString()}
            icon={Mail}
            change={{ value: personalMetrics.emailsSent.change, trend: "up" }}
            gradient="from-indigo-500 to-indigo-600"
          />
          <ModernKPICard
            title="WhatsApp Messages"
            value={personalMetrics.whatsappMessages.current.toString()}
            icon={MessageSquare}
            change={{ value: personalMetrics.whatsappMessages.change, trend: "up" }}
            gradient="from-emerald-500 to-emerald-600"
          />
          <ModernKPICard
            title="Monthly Target"
            value={`${personalMetrics.monthlyRevenue.percentage}%`}
            icon={DollarSign}
            change={{ value: `$${personalMetrics.monthlyRevenue.current.toLocaleString()}`, trend: "up" }}
            gradient="from-pink-500 to-pink-600"
          />
        </div>

        {/* Communication Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Communication Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communicationStats.map((stat, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-foreground">{stat.channel}</h3>
                    <Badge variant="outline">{stat.count} sent</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Rate:</span>
                      <span className="font-medium text-green-600">{stat.responseRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion:</span>
                      <span className="font-medium text-purple-600">{stat.conversion}</span>
                    </div>
                    {stat.avgDuration !== "-" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <span className="font-medium">{stat.avgDuration}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-600" />
              Weekly KPI Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.goal}</span>
                    <span>{goal.current}/{goal.target}</span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{goal.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Opportunities & Enhanced Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                My Active Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 bg-muted rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-foreground">{opportunity.company}</p>
                        <p className="text-sm text-muted-foreground">{opportunity.contact}</p>
                        <p className="text-xs text-muted-foreground">Source: {opportunity.source}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{opportunity.value}</p>
                        <p className="text-xs text-muted-foreground">{opportunity.probability}% probability</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <Badge className={getStageColor(opportunity.stage)}>
                        {opportunity.stage}
                      </Badge>
                      <Badge className={getPriorityColor(opportunity.priority)}>
                        {opportunity.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Next: {opportunity.nextAction}</p>
                      <div className="flex justify-between">
                        <span>Due: {opportunity.dueDate}</span>
                        <span>Last contact: {opportunity.lastContact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                Today's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-muted rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getTaskTypeIcon(task.type)}
                        <p className="font-medium text-foreground text-sm">{task.task}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{task.time}</span>
                      {task.company && <span>{task.company}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Multi-Channel Performance Trend" 
            description="Track calls, emails, and WhatsApp performance over time"
          />
          <ChartPlaceholder 
            title="Conversion Funnel Analysis" 
            description="Lead to opportunity conversion by source and channel"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Revenue Pipeline Forecast" 
            description="Projected revenue based on current opportunities"
          />
          <ChartPlaceholder 
            title="Daily Activity Heatmap" 
            description="Activity intensity and success patterns"
          />
        </div>
      </div>
    </div>
  );
};