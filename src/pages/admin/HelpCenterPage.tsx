
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Video, 
  FileText, 
  HelpCircle,
  ExternalLink,
  Star,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  isPopular: boolean;
  views: number;
}

const helpArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Getting Started with Your CRM',
    description: 'Learn the basics of setting up your CRM account and importing your first contacts.',
    category: 'Getting Started',
    readTime: '5 min read',
    isPopular: true,
    views: 1250
  },
  {
    id: '2',
    title: 'Managing Leads and Opportunities',
    description: 'How to effectively track and manage your sales pipeline from lead to close.',
    category: 'Sales',
    readTime: '8 min read',
    isPopular: true,
    views: 980
  },
  {
    id: '3',
    title: 'Setting Up Email Automation',
    description: 'Create automated email sequences to nurture leads and engage customers.',
    category: 'Automation',
    readTime: '12 min read',
    isPopular: false,
    views: 567
  },
  {
    id: '4',
    title: 'Customizing Your Dashboard',
    description: 'Personalize your dashboard with widgets and metrics that matter to your business.',
    category: 'Customization',
    readTime: '6 min read',
    isPopular: true,
    views: 743
  },
  {
    id: '5',
    title: 'Using AI Features',
    description: 'Leverage AI-powered features like lead scoring and predictive analytics.',
    category: 'AI Features',
    readTime: '10 min read',
    isPopular: false,
    views: 432
  },
  {
    id: '6',
    title: 'Integrating Third-Party Tools',
    description: 'Connect your CRM with email marketing, calendar, and other business tools.',
    category: 'Integrations',
    readTime: '15 min read',
    isPopular: false,
    views: 321
  }
];

const videoTutorials = [
  {
    id: '1',
    title: 'CRM Setup Walkthrough',
    duration: '12:34',
    thumbnail: '/placeholder.svg',
    category: 'Getting Started'
  },
  {
    id: '2',
    title: 'Advanced Reporting Features',
    duration: '18:45',
    thumbnail: '/placeholder.svg',
    category: 'Reports'
  },
  {
    id: '3',
    title: 'Mobile App Tutorial',
    duration: '8:22',
    thumbnail: '/placeholder.svg',
    category: 'Mobile'
  }
];

export const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
        <p className="text-xl text-gray-600">Find answers, tutorials, and get support</p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search for help articles, tutorials, or features..."
            className="pl-12 h-12 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">Get help from our support team</p>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Video className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-gray-600 mb-4">Watch step-by-step guides</p>
            <Button variant="outline" className="w-full">Browse Videos</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Detailed guides and API docs</p>
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription className="mt-2">{article.description}</CardDescription>
                    </div>
                    {article.isPopular && (
                      <Badge variant="secondary" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </span>
                    <span>{article.views} views</span>
                  </div>
                  <Badge variant="outline" className="mt-3">
                    {article.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{video.duration}</span>
                    <Badge variant="outline">{video.category}</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">How do I import my existing contacts?</h4>
                  <p className="text-gray-600">You can import contacts via CSV file upload or by connecting to your existing tools like Google Contacts or Outlook.</p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Can I customize the sales pipeline stages?</h4>
                  <p className="text-gray-600">Yes, you can fully customize your sales pipeline stages to match your business process in the Settings section.</p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Is there a mobile app available?</h4>
                  <p className="text-gray-600">Yes, we have mobile apps for both iOS and Android that sync with your web dashboard.</p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">How secure is my data?</h4>
                  <p className="text-gray-600">We use industry-standard encryption and security practices to protect your data. All data is encrypted in transit and at rest.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@crmplatform.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
                <CardDescription>When you can reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Email Support</span>
                  <span className="text-gray-600">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone Support</span>
                  <span className="text-gray-600">Mon-Fri 9AM-6PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Live Chat</span>
                  <span className="text-gray-600">24/7</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Priority Support:</strong> Premium subscribers get priority support with faster response times.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
