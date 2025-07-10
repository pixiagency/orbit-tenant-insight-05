
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Target, 
  Users, 
  Zap, 
  Star,
  ArrowRight,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  priority: 'high' | 'medium' | 'low';
  category: 'features' | 'improvements' | 'integrations';
  quarter: string;
  votes: number;
}

const roadmapData: RoadmapItem[] = [
  {
    id: '1',
    title: 'Advanced AI Lead Scoring',
    description: 'Machine learning algorithms to automatically score and prioritize leads based on behavior and characteristics.',
    status: 'completed',
    priority: 'high',
    category: 'features',
    quarter: 'Q1 2024',
    votes: 127
  },
  {
    id: '2',
    title: 'Mobile App for iOS and Android',
    description: 'Native mobile applications for managing your CRM on the go with offline capabilities.',
    status: 'in-progress',
    priority: 'high',
    category: 'features',
    quarter: 'Q2 2024',
    votes: 203
  },
  {
    id: '3',
    title: 'Enhanced Reporting Dashboard',
    description: 'More detailed analytics and customizable reporting with advanced filtering options.',
    status: 'in-progress',
    priority: 'medium',
    category: 'improvements',
    quarter: 'Q2 2024',
    votes: 89
  },
  {
    id: '4',
    title: 'Slack Integration',
    description: 'Direct integration with Slack for notifications and quick actions.',
    status: 'planned',
    priority: 'medium',
    category: 'integrations',
    quarter: 'Q3 2024',
    votes: 156
  },
  {
    id: '5',
    title: 'Video Call Integration',
    description: 'Built-in video calling capabilities with meeting scheduling and recording.',
    status: 'planned',
    priority: 'high',
    category: 'features',
    quarter: 'Q3 2024',
    votes: 178
  },
  {
    id: '6',
    title: 'Advanced Workflow Automation',
    description: 'More sophisticated automation rules with conditional logic and multi-step workflows.',
    status: 'planned',
    priority: 'medium',
    category: 'features',
    quarter: 'Q4 2024',
    votes: 134
  }
];

export const RoadmapPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'planned': return <Circle className="h-5 w-5 text-gray-400" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'planned': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? roadmapData 
    : roadmapData.filter(item => item.category === selectedCategory);

  const stats = {
    completed: roadmapData.filter(item => item.status === 'completed').length,
    inProgress: roadmapData.filter(item => item.status === 'in-progress').length,
    planned: roadmapData.filter(item => item.status === 'planned').length,
    totalVotes: roadmapData.reduce((sum, item) => sum + item.votes, 0)
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Roadmap</h1>
          <p className="text-gray-600 mt-1">See what we're building and what's coming next</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Submit Idea
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planned</p>
                <p className="text-2xl font-bold text-gray-600">{stats.planned}</p>
              </div>
              <Target className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalVotes}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Roadmap Items</CardTitle>
          <CardDescription>Track our progress and upcoming features</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>All Items</TabsTrigger>
              <TabsTrigger value="features" onClick={() => setSelectedCategory('features')}>Features</TabsTrigger>
              <TabsTrigger value="improvements" onClick={() => setSelectedCategory('improvements')}>Improvements</TabsTrigger>
              <TabsTrigger value="integrations" onClick={() => setSelectedCategory('integrations')}>Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                              <Badge variant="outline" className={getStatusColor(item.status)}>
                                {item.status.replace('-', ' ')}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                {item.priority} priority
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{item.quarter}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{item.votes} votes</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            Vote
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
