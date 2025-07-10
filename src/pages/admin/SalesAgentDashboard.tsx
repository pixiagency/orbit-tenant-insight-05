
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
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SalesAgentDashboard = () => {
  const [dateRange, setDateRange] = useState("30d");

  // Personal metrics
  const personalMetrics = {
    receivedLeads: { current: 24, change: "+6 this week" },
    dailyCalls: { current: 12, quality: 4.2, change: "+3 vs yesterday" },
    personalConversion: { current: 32, change: "+4% vs team avg (28%)" },
    weeklyGoals: { current: 92, target: 100, change: "On track" },
    monthlyRevenue: { current: 52000, target: 60000, percentage: 87 },
    responseTime: { current: 1.2, change: "-0.3 hrs improvement" }
  };

  // Daily tasks
  const dailyTasks = {
    total: 8,
    completed: 6,
    overdue: 2,
    completion: 75
  };

  // Opportunities/Deals
  const opportunities = [
    { 
      id: 1,
      company: "TechCorp Inc.", 
      contact: "John Smith", 
      value: "$25,000", 
      stage: "Negotiation", 
      probability: 75,
      nextAction: "Follow-up call scheduled",
      dueDate: "Tomorrow"
    },
    { 
      id: 2,
      company: "StartupXYZ", 
      contact: "Sarah Johnson", 
      value: "$15,000", 
      stage: "Proposal", 
      probability: 60,
      nextAction: "Send detailed proposal",
      dueDate: "Today"
    },
    { 
      id: 3,
      company: "BigCorp Ltd", 
      contact: "Mike Davis", 
      value: "$35,000", 
      stage: "Discovery", 
      probability: 40,
      nextAction: "Demo presentation",
      dueDate: "Friday"
    },
    { 
      id: 4,
      company: "InnovateCo", 
      contact: "Lisa Brown", 
      value: "$18,500", 
      stage: "Qualified", 
      probability: 70,
      nextAction: "Pricing discussion",
      dueDate: "Next week"
    }
  ];

  // Today's tasks
  const todaysTasks = [
    { 
      id: 1,
      task: "Follow-up call with TechCorp", 
      time: "10:00 AM", 
      priority: "high",
      status: "pending",
      company: "TechCorp Inc."
    },
    { 
      id: 2,
      task: "Send proposal to StartupXYZ", 
      time: "11:30 AM", 
      priority: "high",
      status: "overdue",
      company: "StartupXYZ"
    },
    { 
      id: 3,
      task: "Demo preparation for BigCorp", 
      time: "2:00 PM", 
      priority: "medium",
      status: "completed",
      company: "BigCorp Ltd"
    },
    { 
      id: 4,
      task: "Update CRM records", 
      time: "4:00 PM", 
      priority: "low",
      status: "pending",
      company: null
    },
    { 
      id: 5,
      task: "Pricing call with InnovateCo", 
      time: "5:00 PM", 
      priority: "medium",
      status: "pending",
      company: "InnovateCo"
    }
  ];

  // Weekly/Monthly Goals
  const goals = [
    { goal: "Calls Made", current: 48, target: 60, percentage: 80 },
    { goal: "Leads Contacted", current: 24, target: 30, percentage: 80 },
    { goal: "Demos Scheduled", current: 8, target: 10, percentage: 80 },
    { goal: "Proposals Sent", current: 6, target: 8, percentage: 75 },
    { goal: "Deals Closed", current: 3, target: 4, percentage: 75 }
  ];

  // Call quality ratings
  const callRatings = [
    { date: "Today", calls: 12, avgRating: 4.2, notes: "Great rapport building" },
    { date: "Yesterday", calls: 10, avgRating: 4.0, notes: "Good discovery questions" },
    { date: "2 days ago", calls: 8, avgRating: 4.5, notes: "Excellent closing technique" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'Discovery': 'bg-blue-100 text-blue-700',
      'Qualified': 'bg-green-100 text-green-700',
      'Proposal': 'bg-yellow-100 text-yellow-700',
      'Negotiation': 'bg-orange-100 text-orange-700',
      'Closed Won': 'bg-emerald-100 text-emerald-700'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your personal performance and daily activities</p>
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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Phone className="h-4 w-4 mr-2" />
              Make Call
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Personal Performance KPIs */}
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
            title="Weekly Goals"
            value={`${personalMetrics.weeklyGoals.current}%`}
            icon={Award}
            change={{ value: personalMetrics.weeklyGoals.change, trend: "up" }}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Revenue & Response Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Monthly Revenue Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-green-600">
                    ${personalMetrics.monthlyRevenue.current.toLocaleString()}
                  </span>
                  <Badge variant="outline" className="text-sm">
                    {personalMetrics.monthlyRevenue.percentage}% of target
                  </Badge>
                </div>
                <Progress value={personalMetrics.monthlyRevenue.percentage} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Target: ${personalMetrics.monthlyRevenue.target.toLocaleString()}</span>
                  <span>Remaining: ${(personalMetrics.monthlyRevenue.target - personalMetrics.monthlyRevenue.current).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Daily Tasks Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{dailyTasks.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{dailyTasks.overdue}</div>
                    <div className="text-sm text-gray-600">Overdue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{dailyTasks.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
                <Progress value={dailyTasks.completion} className="h-3" />
                <p className="text-sm text-gray-600 text-center">{dailyTasks.completion}% completion rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-600" />
              Weekly KPI Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.goal}</span>
                    <span>{goal.current}/{goal.target}</span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                  <p className="text-xs text-gray-500 text-center">{goal.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Opportunities & Today's Tasks */}
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
                  <div key={opportunity.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{opportunity.company}</p>
                        <p className="text-sm text-gray-600">{opportunity.contact}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{opportunity.value}</p>
                        <p className="text-xs text-gray-500">{opportunity.probability}% probability</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className={getStageColor(opportunity.stage)}>
                        {opportunity.stage}
                      </Badge>
                      <p className="text-xs text-gray-500">Due: {opportunity.dueDate}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Next: {opportunity.nextAction}</p>
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
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{task.task}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{task.time}</span>
                      {task.company && <span>{task.company}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Quality Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              Call Quality Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {callRatings.map((rating, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{rating.date}</p>
                    <p className="text-sm text-gray-600">{rating.calls} calls made</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{rating.avgRating}/5</span>
                    </div>
                    <p className="text-xs text-gray-500">Avg Rating</p>
                  </div>
                  <div className="text-right max-w-xs">
                    <p className="text-sm text-gray-600">{rating.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Personal Performance Trend" 
            description="Track daily/weekly performance metrics"
          />
          <ChartPlaceholder 
            title="Goal Achievement Progress" 
            description="KPI progress vs targets over time"
          />
        </div>
      </div>
    </div>
  );
};
