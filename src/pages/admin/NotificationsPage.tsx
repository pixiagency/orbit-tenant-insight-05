import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Archive,
  Smartphone,
  Monitor
} from 'lucide-react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  category: 'system' | 'sales' | 'marketing' | 'support' | 'task';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  timestamp: string;
  sender?: string;
  isRead: boolean;
}

interface NotificationPreference {
  id: string;
  category: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  description: string;
}

const notificationsData: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'John Smith from TechCorp Inc. has been assigned to you',
    type: 'info',
    category: 'sales',
    priority: 'high',
    status: 'unread',
    timestamp: '2024-01-18T10:30:00',
    sender: 'System',
    isRead: false
  },
  {
    id: '2',
    title: 'Deal Won',
    message: 'Congratulations! The Global Industries deal has been closed successfully',
    type: 'success',
    category: 'sales',
    priority: 'medium',
    status: 'unread',
    timestamp: '2024-01-18T09:15:00',
    sender: 'Sarah Johnson',
    isRead: false
  },
  {
    id: '3',
    title: 'Task Due Soon',
    message: 'Follow-up call with StartupXYZ is due in 2 hours',
    type: 'reminder',
    category: 'task',
    priority: 'high',
    status: 'read',
    timestamp: '2024-01-18T08:45:00',
    sender: 'Calendar',
    isRead: true
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will begin in 30 minutes',
    type: 'warning',
    category: 'system',
    priority: 'medium',
    status: 'read',
    timestamp: '2024-01-18T07:30:00',
    sender: 'System Admin',
    isRead: true
  },
  {
    id: '5',
    title: 'Campaign Performance Alert',
    message: 'Email campaign "Summer Sale" is performing below expectations',
    type: 'error',
    category: 'marketing',
    priority: 'urgent',
    status: 'unread',
    timestamp: '2024-01-18T06:15:00',
    sender: 'Marketing AI',
    isRead: false
  }
];

const notificationPreferences: NotificationPreference[] = [
  {
    id: '1',
    category: 'Sales',
    email: true,
    push: true,
    sms: false,
    inApp: true,
    description: 'Lead assignments, deal updates, and sales activities'
  },
  {
    id: '2',
    category: 'Marketing',
    email: true,
    push: false,
    sms: false,
    inApp: true,
    description: 'Campaign performance, lead generation, and marketing insights'
  },
  {
    id: '3',
    category: 'Support',
    email: false,
    push: true,
    sms: true,
    inApp: true,
    description: 'Customer support tickets and urgent issues'
  },
  {
    id: '4',
    category: 'System',
    email: true,
    push: true,
    sms: false,
    inApp: true,
    description: 'System updates, maintenance, and security alerts'
  },
  {
    id: '5',
    category: 'Tasks',
    email: false,
    push: true,
    sms: false,
    inApp: true,
    description: 'Task reminders, deadlines, and team assignments'
  }
];

export const NotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="h-4 w-4 text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'marketing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'support': return 'bg-green-50 text-green-700 border-green-200';
      case 'system': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'task': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredNotifications = notificationsData.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.sender?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && !notification.isRead) ||
                      (activeTab === 'read' && notification.isRead);
    
    return matchesSearch && matchesTab;
  });

  const notificationStats = {
    total: notificationsData.length,
    unread: notificationsData.filter(n => !n.isRead).length,
    urgent: notificationsData.filter(n => n.priority === 'urgent').length,
    today: notificationsData.filter(n => {
      const today = new Date().toDateString();
      return new Date(n.timestamp).toDateString() === today;
    }).length
  };

  const handleMarkAsRead = (notificationId: string) => {
    console.log('Mark as read:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage your notifications and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernKPICard
          title="Total Notifications"
          value={notificationStats.total.toString()}
          icon={Bell}
          change={{ value: `${notificationStats.today} today`, trend: "neutral" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Unread"
          value={notificationStats.unread.toString()}
          icon={MessageSquare}
          change={{ value: "Needs attention", trend: "neutral" }}
          gradient="from-yellow-500 to-yellow-600"
        />
        <ModernKPICard
          title="Urgent"
          value={notificationStats.urgent.toString()}
          icon={AlertTriangle}
          change={{ value: "High priority", trend: "neutral" }}
          gradient="from-red-500 to-red-600"
        />
        <ModernKPICard
          title="Today"
          value={notificationStats.today.toString()}
          icon={Clock}
          change={{ value: "New notifications", trend: "up" }}
          gradient="from-green-500 to-green-600"
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Notification Center</CardTitle>
              <CardDescription>View and manage all your notifications</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setActiveTab('all')}>
                All
                <Badge variant="secondary" className="ml-2">{notificationStats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" onClick={() => setActiveTab('unread')}>
                Unread
                <Badge variant="secondary" className="ml-2">{notificationStats.unread}</Badge>
              </TabsTrigger>
              <TabsTrigger value="read" onClick={() => setActiveTab('read')}>
                Read
              </TabsTrigger>
              <TabsTrigger value="preferences">
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow ${
                      !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {getTypeIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <Badge variant="outline" className={getCategoryColor(notification.category)}>
                            {notification.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          </span>
                          {notification.sender && (
                            <span>From: {notification.sender}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                  <p className="text-gray-600 mb-6">Configure how you receive notifications for different categories</p>
                </div>
                
                <div className="space-y-4">
                  {notificationPreferences.map((preference) => (
                    <Card key={preference.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{preference.category}</CardTitle>
                            <CardDescription>{preference.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <Switch checked={preference.email} />
                            <span className="text-sm">Email</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Bell className="h-4 w-4 text-gray-500" />
                            <Switch checked={preference.push} />
                            <span className="text-sm">Push</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4 text-gray-500" />
                            <Switch checked={preference.sms} />
                            <span className="text-sm">SMS</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-4 w-4 text-gray-500" />
                            <Switch checked={preference.inApp} />
                            <span className="text-sm">In-App</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 