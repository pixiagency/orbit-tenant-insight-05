import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { ModernKPICard } from '@/components/shared/ModernKPICard';
import { ChartPlaceholder } from '@/components/shared/ChartPlaceholder';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Phone, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Mail,
  Clock,
  DollarSign,
  Award,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportMetric {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  gradient: string;
}

interface ReportData {
  leads: ReportMetric[];
  sales: ReportMetric[];
  team: ReportMetric[];
  activities: ReportMetric[];
}

export const ReportsPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const reportData: ReportData = {
    leads: [
      { id: '1', name: 'Total Leads', value: '1,247', change: '+12.5%', trend: 'up', icon: Target, gradient: 'from-blue-500 to-blue-600' },
      { id: '2', name: 'Qualified Leads', value: '789', change: '+8.3%', trend: 'up', icon: Award, gradient: 'from-green-500 to-green-600' },
      { id: '3', name: 'Conversion Rate', value: '23.4%', change: '+2.1%', trend: 'up', icon: TrendingUp, gradient: 'from-purple-500 to-purple-600' },
      { id: '4', name: 'Response Time', value: '4.2 hrs', change: '-15.3%', trend: 'up', icon: Clock, gradient: 'from-orange-500 to-orange-600' }
    ],
    sales: [
      { id: '1', name: 'Total Revenue', value: '$124,567', change: '+18.2%', trend: 'up', icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600' },
      { id: '2', name: 'Deals Closed', value: '89', change: '+15.7%', trend: 'up', icon: Target, gradient: 'from-blue-500 to-blue-600' },
      { id: '3', name: 'Average Deal Size', value: '$1,401', change: '+3.4%', trend: 'up', icon: BarChart3, gradient: 'from-indigo-500 to-indigo-600' },
      { id: '4', name: 'Sales Cycle', value: '28 days', change: '-5.2%', trend: 'up', icon: Calendar, gradient: 'from-teal-500 to-teal-600' }
    ],
    team: [
      { id: '1', name: 'Active Users', value: '24', change: '+4', trend: 'up', icon: Users, gradient: 'from-pink-500 to-pink-600' },
      { id: '2', name: 'Top Performer', value: 'Sarah J.', change: '12 deals', trend: 'neutral', icon: Award, gradient: 'from-yellow-500 to-yellow-600' },
      { id: '3', name: 'Team Productivity', value: '94%', change: '+7.2%', trend: 'up', icon: Activity, gradient: 'from-red-500 to-red-600' },
      { id: '4', name: 'Training Hours', value: '156', change: '+23.1%', trend: 'up', icon: Clock, gradient: 'from-cyan-500 to-cyan-600' }
    ],
    activities: [
      { id: '1', name: 'Calls Made', value: '1,456', change: '+19.3%', trend: 'up', icon: Phone, gradient: 'from-violet-500 to-violet-600' },
      { id: '2', name: 'Emails Sent', value: '2,789', change: '+12.8%', trend: 'up', icon: Mail, gradient: 'from-slate-500 to-slate-600' },
      { id: '3', name: 'Meetings Held', value: '234', change: '+8.9%', trend: 'up', icon: Calendar, gradient: 'from-amber-500 to-amber-600' },
      { id: '4', name: 'Follow-ups', value: '567', change: '+14.2%', trend: 'up', icon: RefreshCw, gradient: 'from-lime-500 to-lime-600' }
    ]
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated. You'll receive an email when it's ready.",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed", 
      description: "All metrics have been updated with the latest data.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive insights into your CRM performance"
        showAddButton={false}
        showExportButton={true}
        onExportClick={handleExport}
      >
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="sales">Sales Team</SelectItem>
                <SelectItem value="marketing">Marketing Team</SelectItem>
                <SelectItem value="support">Support Team</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="text-xs">
              {selectedPeriod === '30d' ? 'Last 30 days' : selectedPeriod} • {selectedTeam === 'all' ? 'All Teams' : selectedTeam}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModernKPICard
              title="Total Leads"
              value="1,247"
              icon={Target}
              change={{ value: "+12.5% from last month", trend: "up" }}
              gradient="from-blue-500 to-blue-600"
            />
            <ModernKPICard
              title="Revenue"
              value="$124,567"
              icon={DollarSign}
              change={{ value: "+18.2% from last month", trend: "up" }}
              gradient="from-emerald-500 to-emerald-600"
            />
            <ModernKPICard
              title="Conversion Rate"
              value="23.4%"
              icon={TrendingUp}
              change={{ value: "+2.1% from last month", trend: "up" }}
              gradient="from-purple-500 to-purple-600"
            />
            <ModernKPICard
              title="Active Users"
              value="24"
              icon={Users}
              change={{ value: "+4 this month", trend: "up" }}
              gradient="from-pink-500 to-pink-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder
              title="Lead Generation Trend"
              description="Monthly lead generation over time"
              height="300px"
            />
            <ChartPlaceholder
              title="Revenue by Source"
              description="Revenue breakdown by lead source"
              height="300px"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <ChartPlaceholder
              title="Sales Pipeline Analysis"
              description="Deals by stage and probability"
              height="400px"
            />
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportData.leads.map((metric) => (
              <ModernKPICard
                key={metric.id}
                title={metric.name}
                value={metric.value}
                icon={metric.icon}
                change={{ value: metric.change, trend: metric.trend }}
                gradient={metric.gradient}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder
              title="Lead Sources"
              description="Where your leads are coming from"
              height="300px"
            />
            <ChartPlaceholder
              title="Lead Quality Score"
              description="Distribution of lead quality ratings"
              height="300px"
            />
          </div>

          <ChartPlaceholder
            title="Lead Conversion Funnel"
            description="Lead progression through your sales funnel"
            height="350px"
          />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportData.sales.map((metric) => (
              <ModernKPICard
                key={metric.id}
                title={metric.name}
                value={metric.value}
                icon={metric.icon}
                change={{ value: metric.change, trend: metric.trend }}
                gradient={metric.gradient}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder
              title="Monthly Revenue"
              description="Revenue trends over the past 12 months"
              height="300px"
            />
            <ChartPlaceholder
              title="Deal Size Distribution"
              description="Distribution of deal values"
              height="300px"
            />
          </div>

          <ChartPlaceholder
            title="Sales Performance by Rep"
            description="Individual sales representative performance"
            height="350px"
          />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportData.team.map((metric) => (
              <ModernKPICard
                key={metric.id}
                title={metric.name}
                value={metric.value}
                icon={metric.icon}
                change={{ value: metric.change, trend: metric.trend }}
                gradient={metric.gradient}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder
              title="Team Performance"
              description="Individual team member metrics"
              height="300px"
            />
            <ChartPlaceholder
              title="Activity Distribution"
              description="How team members spend their time"
              height="300px"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportData.activities.map((metric) => (
              <ModernKPICard
                key={metric.id}
                title={metric.name}
                value={metric.value}
                icon={metric.icon}
                change={{ value: metric.change, trend: metric.trend }}
                gradient={metric.gradient}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
