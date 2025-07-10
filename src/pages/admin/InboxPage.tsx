import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Filter, 
  Search, 
  Mail,
  Inbox,
  Send,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  MoreHorizontal,
  Edit,
  Eye,
  Clock,
  User,
  Building
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  status: 'unread' | 'read' | 'archived' | 'deleted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'inbox' | 'sent' | 'draft' | 'spam' | 'trash';
  date: string;
  hasAttachments: boolean;
  isStarred: boolean;
  client?: string;
}

const emailsData: Email[] = [
  {
    id: '1',
    from: 'john.smith@techcorp.com',
    to: 'sales@company.com',
    subject: 'Follow-up on Proposal Discussion',
    preview: 'Hi team, I wanted to follow up on our proposal discussion from last week...',
    status: 'unread',
    priority: 'high',
    category: 'inbox',
    date: '2024-01-18T10:30:00',
    hasAttachments: true,
    isStarred: true,
    client: 'TechCorp Inc.'
  },
  {
    id: '2',
    from: 'emily.davis@startup.com',
    to: 'sales@company.com',
    subject: 'Contract Review Request',
    preview: 'We\'ve reviewed the contract and have a few questions about the terms...',
    status: 'read',
    priority: 'medium',
    category: 'inbox',
    date: '2024-01-18T09:15:00',
    hasAttachments: false,
    isStarred: false,
    client: 'StartupXYZ'
  },
  {
    id: '3',
    from: 'support@company.com',
    to: 'client@manufacturing.com',
    subject: 'Your Support Ticket #1234',
    preview: 'Thank you for contacting our support team. We\'ve resolved your issue...',
    status: 'read',
    priority: 'low',
    category: 'sent',
    date: '2024-01-18T08:45:00',
    hasAttachments: false,
    isStarred: false,
    client: 'Manufacturing Ltd'
  }
];

export const InboxPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('inbox');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredEmails = emailsData.filter(email => {
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = email.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const emailStats = {
    total: emailsData.filter(e => e.category === 'inbox').length,
    unread: emailsData.filter(e => e.status === 'unread' && e.category === 'inbox').length,
    starred: emailsData.filter(e => e.isStarred && e.category === 'inbox').length,
    withAttachments: emailsData.filter(e => e.hasAttachments && e.category === 'inbox').length
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-600 mt-1">Manage your emails and communications</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernKPICard
          title="Total Emails"
          value={emailStats.total.toString()}
          icon={Inbox}
          change={{ value: "+12 today", trend: "up" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Unread"
          value={emailStats.unread.toString()}
          icon={Mail}
          change={{ value: "Needs attention", trend: "neutral" }}
          gradient="from-yellow-500 to-yellow-600"
        />
        <ModernKPICard
          title="Starred"
          value={emailStats.starred.toString()}
          icon={Star}
          change={{ value: "Important emails", trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="With Attachments"
          value={emailStats.withAttachments.toString()}
          icon={Mail}
          change={{ value: "Files attached", trend: "neutral" }}
          gradient="from-green-500 to-green-600"
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Email Management</CardTitle>
              <CardDescription>Organize and manage your email communications</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search emails..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inbox" className="space-y-4">
            <TabsList>
              <TabsTrigger value="inbox" onClick={() => setCategoryFilter('inbox')}>
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
                <Badge variant="secondary" className="ml-2">{emailStats.unread}</Badge>
              </TabsTrigger>
              <TabsTrigger value="sent" onClick={() => setCategoryFilter('sent')}>
                <Send className="h-4 w-4 mr-2" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="drafts" onClick={() => setCategoryFilter('draft')}>
                <Edit className="h-4 w-4 mr-2" />
                Drafts
              </TabsTrigger>
              <TabsTrigger value="spam" onClick={() => setCategoryFilter('spam')}>
                <Mail className="h-4 w-4 mr-2" />
                Spam
              </TabsTrigger>
              <TabsTrigger value="trash" onClick={() => setCategoryFilter('trash')}>
                <Trash2 className="h-4 w-4 mr-2" />
                Trash
              </TabsTrigger>
            </TabsList>

            <TabsContent value={categoryFilter} className="space-y-4">
              <div className="space-y-4">
                {filteredEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {email.hasAttachments && <Mail className="h-4 w-4 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${email.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                            {email.from}
                          </h3>
                          <Badge variant="outline" className={getPriorityColor(email.priority)}>
                            {email.priority}
                          </Badge>
                          {email.client && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Building className="h-3 w-3 mr-1" />
                              {email.client}
                            </Badge>
                          )}
                        </div>
                        <p className={`font-medium mb-1 ${email.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">{email.preview}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(email.date).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 