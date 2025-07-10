
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartPlaceholder } from '@/components/shared/ChartPlaceholder';
import { ModernKPICard } from '@/components/shared/ModernKPICard';
import { 
  Phone, 
  Clock, 
  TrendingUp, 
  Users, 
  PhoneCall, 
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';

interface CallLog {
  id: string;
  contactName: string;
  contactPhone: string;
  userId: string;
  userName: string;
  date: string;
  duration: string;
  type: 'outgoing' | 'incoming' | 'missed';
  status: 'completed' | 'not-answered' | 'on-hold' | 'voicemail';
  outcome: 'converted' | 'follow-up' | 'not-interested' | 'qualified' | 'scheduled';
  hasRecording: boolean;
  recordingUrl?: string;
  notes?: string;
  linkedEntity?: {
    type: 'lead' | 'deal' | 'contact' | 'task';
    id: string;
    name: string;
  };
  tags: string[];
}

interface CallAnalyticsProps {
  callLogs: CallLog[];
}

export const CallAnalytics: React.FC<CallAnalyticsProps> = ({ callLogs }) => {
  // Calculate analytics data
  const totalCalls = callLogs.length;
  const completedCalls = callLogs.filter(call => call.status === 'completed').length;
  const convertedCalls = callLogs.filter(call => call.outcome === 'converted').length;
  const responseRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
  const conversionRate = completedCalls > 0 ? Math.round((convertedCalls / completedCalls) * 100) : 0;

  // Calculate average duration
  const totalDurationMinutes = callLogs
    .filter(call => call.status === 'completed')
    .reduce((total, call) => {
      const [minutes, seconds] = call.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }, 0);
  const avgDuration = completedCalls > 0 ? Math.round(totalDurationMinutes / completedCalls) : 0;

  // Get most active users
  const userStats = callLogs.reduce((acc, call) => {
    acc[call.userName] = (acc[call.userName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topUsers = Object.entries(userStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Analyze best calling times
  const hourStats = callLogs.reduce((acc, call) => {
    const hour = new Date(call.date).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const bestHour = Object.entries(hourStats)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernKPICard
          title="Total Calls"
          value={totalCalls.toString()}
          icon={Phone}
          change={{ value: "+15% from last week", trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Response Rate"
          value={`${responseRate}%`}
          icon={TrendingUp}
          change={{ value: "+5% from last week", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Avg Duration"
          value={`${avgDuration}m`}
          icon={Clock}
          change={{ value: "+2m from last week", trend: "up" }}
          gradient="from-orange-500 to-orange-600"
        />
        <ModernKPICard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={Target}
          change={{ value: "+8% from last week", trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          title="Daily Call Volume"
          description="Number of calls made each day"
          height="300px"
        />
        <ChartPlaceholder
          title="Call Outcomes Distribution"
          description="Breakdown of call results"
          height="300px"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          title="Call Duration Trends"
          description="Average call duration over time"
          height="300px"
        />
        <ChartPlaceholder
          title="Best Times to Call"
          description="Call success rate by hour of day"
          height="300px"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Most Active Users
            </CardTitle>
            <CardDescription>Users with the highest call volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map(([userName, callCount], index) => (
                <div key={userName} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      #{index + 1}
                    </div>
                    <span className="font-medium">{userName}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{callCount}</div>
                    <div className="text-sm text-gray-500">calls</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Call Statistics
            </CardTitle>
            <CardDescription>Breakdown of call types and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Outgoing Calls</span>
                <span className="font-bold">
                  {callLogs.filter(call => call.type === 'outgoing').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Incoming Calls</span>
                <span className="font-bold">
                  {callLogs.filter(call => call.type === 'incoming').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Missed Calls</span>
                <span className="font-bold text-red-600">
                  {callLogs.filter(call => call.type === 'missed').length}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <span className="font-bold text-green-600">{responseRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Best Calling Time</span>
                  <span className="font-bold">
                    {bestHour ? `${bestHour}:00` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <ChartPlaceholder
        title="Weekly Call Performance"
        description="Comprehensive weekly analysis of call metrics"
        height="400px"
      />
    </div>
  );
};
