import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Search, 
  Brain, 
  Target, 
  Upload, 
  RefreshCw,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Audience {
  id: string;
  name: string;
  type: 'custom' | 'lookalike' | 'retargeting' | 'ai-generated';
  size: number;
  source: string;
  platforms: string[];
  autoRefresh: boolean;
  lastUpdated: string;
  conversionScore?: number;
}

export const AudienceManagementPage: React.FC = () => {
  const [audiences, setAudiences] = useState<Audience[]>([
    {
      id: '1',
      name: 'Young Professionals (25-35)',
      type: 'custom',
      size: 12500,
      source: 'Manual Segmentation',
      platforms: ['Facebook', 'Google'],
      autoRefresh: true,
      lastUpdated: '2024-06-20',
      conversionScore: 85
    },
    {
      id: '2',
      name: 'High-Value Customers Lookalike',
      type: 'lookalike',
      size: 8900,
      source: 'Top Converters',
      platforms: ['Facebook', 'TikTok'],
      autoRefresh: false,
      lastUpdated: '2024-06-18',
      conversionScore: 92
    },
    {
      id: '3',
      name: 'Website Visitors - Cart Abandoners',
      type: 'retargeting',
      size: 3400,
      source: 'Website Behavior',
      platforms: ['Google', 'Facebook'],
      autoRefresh: true,
      lastUpdated: '2024-06-21',
      conversionScore: 78
    },
    {
      id: '4',
      name: 'AI-Predicted High Intent Users',
      type: 'ai-generated',
      size: 15600,
      source: 'AI Segmentation',
      platforms: ['Facebook', 'Google', 'TikTok'],
      autoRefresh: true,
      lastUpdated: '2024-06-21',
      conversionScore: 88
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'custom': return 'bg-blue-100 text-blue-800';
      case 'lookalike': return 'bg-green-100 text-green-800';
      case 'retargeting': return 'bg-orange-100 text-orange-800';
      case 'ai-generated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAudiences = audiences.filter(audience => {
    const matchesSearch = audience.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || audience.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Audience Management
          </h1>
          <p className="text-gray-600">Create, manage and analyze your target audiences</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Audience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Audience</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="manual">Manual Segmentation</TabsTrigger>
                  <TabsTrigger value="ai">AI Segmentation</TabsTrigger>
                  <TabsTrigger value="import">Import & Sync</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="space-y-4 p-4">
                  <p className="text-gray-600">Manual audience creation form would be implemented here.</p>
                </TabsContent>
                <TabsContent value="ai" className="space-y-4 p-4">
                  <p className="text-gray-600">AI-powered audience generation options would be implemented here.</p>
                </TabsContent>
                <TabsContent value="import" className="space-y-4 p-4">
                  <p className="text-gray-600">External platform import and sync options would be implemented here.</p>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Audiences</p>
                <p className="text-2xl font-bold">{audiences.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold">
                  {(audiences.reduce((sum, a) => sum + a.size, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold">
                  {audiences.filter(a => a.type === 'ai-generated').length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auto-Sync Active</p>
                <p className="text-2xl font-bold">
                  {audiences.filter(a => a.autoRefresh).length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search audiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Audience Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="custom">Custom Audience</SelectItem>
                <SelectItem value="lookalike">Lookalike Audience</SelectItem>
                <SelectItem value="retargeting">Retargeting Audience</SelectItem>
                <SelectItem value="ai-generated">AI Generated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audiences Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audience Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Auto-Sync</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudiences.map((audience) => (
                <TableRow key={audience.id}>
                  <TableCell className="font-medium">{audience.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(audience.type)}>
                      {audience.type.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{audience.size.toLocaleString()}</TableCell>
                  <TableCell>{audience.source}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {audience.platforms.map(platform => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {audience.conversionScore && (
                      <span className={`font-semibold ${getScoreColor(audience.conversionScore)}`}>
                        {audience.conversionScore}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={audience.autoRefresh ? "default" : "secondary"}>
                      {audience.autoRefresh ? 'On' : 'Off'}
                    </Badge>
                  </TableCell>
                  <TableCell>{audience.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Audience Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Overlap Detection</p>
                <p className="text-xs text-blue-700">
                  "Young Professionals" and "High-Value Customers Lookalike" have 23% overlap
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Optimization Suggestion</p>
                <p className="text-xs text-green-700">
                  Consider merging audiences with similar conversion scores to reduce ad spend
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-900">New Opportunity</p>
                <p className="text-xs text-purple-700">
                  AI identified 5.2K new high-intent users based on recent behavior patterns
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audiences.slice(0, 4).map((audience, index) => (
                <div key={audience.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{audience.name}</p>
                    <p className="text-xs text-gray-500">{audience.size.toLocaleString()} users</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${getScoreColor(audience.conversionScore || 0)}`}>
                      {audience.conversionScore}%
                    </p>
                    <p className="text-xs text-gray-500">conversion score</p>
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
