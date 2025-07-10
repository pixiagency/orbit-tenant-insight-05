
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  MessageSquare, 
  Brain, 
  Zap, 
  Settings,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export const AIAssistantPage = () => {
  const [selectedAssistant, setSelectedAssistant] = useState('sales');
  const [messageInput, setMessageInput] = useState('');

  const assistants = [
    {
      id: 'sales',
      name: 'Sales Assistant',
      description: 'AI-powered sales support and lead qualification',
      icon: TrendingUp,
      status: 'Active',
      interactions: 1247,
      color: 'from-blue-500 to-cyan-500',
      accuracy: '94.2%',
      responseTime: '1.2s'
    },
    {
      id: 'support',
      name: 'Customer Support',
      description: 'Automated customer service and ticket routing',
      icon: Users,
      status: 'Active',
      interactions: 892,
      color: 'from-green-500 to-emerald-500',
      accuracy: '96.8%',
      responseTime: '0.8s'
    },
    {
      id: 'marketing',
      name: 'Marketing Assistant',
      description: 'Campaign optimization and lead nurturing',
      icon: Mail,
      status: 'Training',
      interactions: 634,
      color: 'from-purple-500 to-pink-500',
      accuracy: '89.5%',
      responseTime: '1.5s'
    },
    {
      id: 'scheduler',
      name: 'Meeting Scheduler',
      description: 'Smart calendar management and booking',
      icon: Calendar,
      status: 'Active',
      interactions: 445,
      color: 'from-orange-500 to-red-500',
      accuracy: '97.1%',
      responseTime: '0.5s'
    }
  ];

  const recentInteractions = [
    { id: 1, type: 'Lead Qualification', user: 'john.smith@techcorp.com', assistant: 'Sales Assistant', time: '2 minutes ago', result: 'Qualified', score: 87 },
    { id: 2, type: 'Support Ticket', user: 'sarah.johnson@startup.com', assistant: 'Customer Support', time: '5 minutes ago', result: 'Resolved', score: 95 },
    { id: 3, type: 'Email Campaign', user: 'mike.chen@global.com', assistant: 'Marketing Assistant', time: '10 minutes ago', result: 'Optimized', score: 82 },
    { id: 4, type: 'Meeting Booking', user: 'emily.davis@finance.com', assistant: 'Meeting Scheduler', time: '15 minutes ago', result: 'Scheduled', score: 98 },
    { id: 5, type: 'Lead Scoring', user: 'robert.wilson@retail.com', assistant: 'Sales Assistant', time: '20 minutes ago', result: 'Hot Lead', score: 91 }
  ];

  const chatMessages = [
    { id: 1, sender: 'user', content: 'What are the top performing leads this week?', time: '10:30 AM' },
    { id: 2, sender: 'ai', content: 'Based on our analysis, here are the top 5 performing leads this week:\n\n1. TechCorp Inc. - Score: 87\n2. Global Industries - Score: 84\n3. StartupXYZ - Score: 82\n4. Finance Corp - Score: 78\n5. Retail Solutions - Score: 75\n\nWould you like me to provide more details about any of these leads?', time: '10:30 AM' },
    { id: 3, sender: 'user', content: 'Tell me more about TechCorp Inc.', time: '10:32 AM' },
    { id: 4, sender: 'ai', content: 'TechCorp Inc. Details:\n• Contact: John Smith (IT Director)\n• Company Size: 500+ employees\n• Industry: Technology\n• Budget Range: $100K - $200K\n• Interest Level: High\n• Last Activity: Requested demo\n• Recommended Action: Schedule follow-up call within 24 hours', time: '10:32 AM' }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      setMessageInput('');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600 mt-1">Manage your AI-powered business assistants</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Bot className="h-4 w-4 mr-2" />
            New Assistant
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="assistants">Assistants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assistants</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,218</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% improvement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47.8h</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Assistant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assistants.map((assistant) => {
              const IconComponent = assistant.icon;
              return (
                <Card key={assistant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${assistant.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{assistant.name}</CardTitle>
                          <CardDescription>{assistant.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={assistant.status === 'Active' ? 'default' : 'secondary'}>
                        {assistant.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{assistant.interactions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Interactions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{assistant.accuracy}</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{assistant.responseTime}</p>
                        <p className="text-xs text-muted-foreground">Response</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Interactions</CardTitle>
              <CardDescription>Latest automated assistant activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{interaction.type}</p>
                        <p className="text-sm text-gray-600">{interaction.user} • {interaction.assistant}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{interaction.result}</Badge>
                        <span className="text-sm font-medium text-blue-600">{interaction.score}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{interaction.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Chat Assistant</CardTitle>
              <CardDescription>Chat with your AI assistant to get insights and perform tasks</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask your AI assistant anything..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Management</CardTitle>
              <CardDescription>Configure and monitor your AI assistants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assistants.map((assistant) => {
                  const IconComponent = assistant.icon;
                  return (
                    <Card key={assistant.id} className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${assistant.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{assistant.name}</h3>
                          <Badge variant={assistant.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                            {assistant.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{assistant.description}</p>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Performance Analytics</CardTitle>
              <CardDescription>Detailed insights into AI assistant performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Training & Optimization</CardTitle>
              <CardDescription>Train and improve your AI assistants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Training interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
