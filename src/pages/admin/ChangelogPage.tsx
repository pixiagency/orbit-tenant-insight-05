
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Zap, 
  Bug, 
  Shield, 
  Calendar,
  Star,
  ArrowRight,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'security';
  title: string;
  description: string;
  details?: string[];
  isImportant?: boolean;
}

const changelogData: ChangelogEntry[] = [
  {
    id: '1',
    version: '2.4.0',
    date: '2024-01-22',
    type: 'feature',
    title: 'AI-Powered Lead Scoring',
    description: 'Automatically score leads based on behavior, demographics, and engagement patterns using machine learning.',
    details: [
      'Predictive lead scoring algorithm',
      'Customizable scoring criteria',
      'Real-time score updates',
      'Integration with sales pipeline'
    ],
    isImportant: true
  },
  {
    id: '2',
    version: '2.3.2',
    date: '2024-01-18',
    type: 'improvement',
    title: 'Enhanced Mobile Experience',
    description: 'Improved mobile app performance and added new features for better on-the-go CRM management.',
    details: [
      'Faster loading times',
      'Offline mode for contacts',
      'Push notifications',
      'Better touch interactions'
    ],
    isImportant: false
  },
  {
    id: '3',
    version: '2.3.1',
    date: '2024-01-15',
    type: 'bugfix',
    title: 'Calendar Sync Fixes',
    description: 'Fixed issues with calendar synchronization and improved reliability of scheduled events.',
    details: [
      'Fixed duplicate events',
      'Improved timezone handling',
      'Better error handling',
      'Enhanced sync speed'
    ],
    isImportant: false
  },
  {
    id: '4',
    version: '2.3.0',
    date: '2024-01-10',
    type: 'feature',
    title: 'Advanced Automation Workflows',
    description: 'Create complex automation workflows with conditional logic and multi-step processes.',
    details: [
      'Drag-and-drop workflow builder',
      'Conditional branching',
      'Email automation sequences',
      'Task creation triggers'
    ],
    isImportant: true
  },
  {
    id: '5',
    version: '2.2.5',
    date: '2024-01-05',
    type: 'security',
    title: 'Enhanced Security Updates',
    description: 'Important security improvements and vulnerability patches.',
    details: [
      'Two-factor authentication',
      'Enhanced encryption',
      'Session management improvements',
      'Audit log enhancements'
    ],
    isImportant: true
  },
  {
    id: '6',
    version: '2.2.4',
    date: '2024-01-02',
    type: 'improvement',
    title: 'Dashboard Performance Optimization',
    description: 'Significantly improved dashboard loading times and responsiveness.',
    details: [
      '40% faster dashboard loading',
      'Optimized database queries',
      'Reduced memory usage',
      'Better caching mechanisms'
    ],
    isImportant: false
  }
];

export const ChangelogPage = () => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Plus className="h-5 w-5 text-green-500" />;
      case 'improvement': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'bugfix': return <Bug className="h-5 w-5 text-orange-500" />;
      case 'security': return <Shield className="h-5 w-5 text-red-500" />;
      default: return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-green-100 text-green-700 border-green-200';
      case 'improvement': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'bugfix': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'security': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredEntries = selectedType === 'all' 
    ? changelogData 
    : changelogData.filter(entry => entry.type === selectedType);

  const stats = {
    features: changelogData.filter(entry => entry.type === 'feature').length,
    improvements: changelogData.filter(entry => entry.type === 'improvement').length,
    bugfixes: changelogData.filter(entry => entry.type === 'bugfix').length,
    security: changelogData.filter(entry => entry.type === 'security').length
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Changelog</h1>
          <p className="text-gray-600 mt-1">Track all updates, new features, and improvements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Release Notes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Features</p>
                <p className="text-2xl font-bold text-green-600">{stats.features}</p>
              </div>
              <Plus className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Improvements</p>
                <p className="text-2xl font-bold text-blue-600">{stats.improvements}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bug Fixes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.bugfixes}</p>
              </div>
              <Bug className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security</p>
                <p className="text-2xl font-bold text-red-600">{stats.security}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>All changes and improvements to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setSelectedType('all')}>All Updates</TabsTrigger>
              <TabsTrigger value="feature" onClick={() => setSelectedType('feature')}>Features</TabsTrigger>
              <TabsTrigger value="improvement" onClick={() => setSelectedType('improvement')}>Improvements</TabsTrigger>
              <TabsTrigger value="bugfix" onClick={() => setSelectedType('bugfix')}>Bug Fixes</TabsTrigger>
              <TabsTrigger value="security" onClick={() => setSelectedType('security')}>Security</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="space-y-6">
                {filteredEntries.map((entry, index) => (
                  <div key={entry.id} className="relative">
                    {index < filteredEntries.length - 1 && (
                      <div className="absolute left-6 top-12 w-px h-full bg-gray-200"></div>
                    )}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 bg-white rounded-full p-2 border-2 border-gray-200">
                            {getTypeIcon(entry.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                                <Badge variant="outline" className={getTypeColor(entry.type)}>
                                  {entry.type}
                                </Badge>
                                {entry.isImportant && (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                    <Star className="h-3 w-3 mr-1" />
                                    Important
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                <Badge variant="secondary">v{entry.version}</Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-3">{entry.description}</p>
                            {entry.details && (
                              <ul className="space-y-1 text-sm text-gray-600">
                                {entry.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <ArrowRight className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
