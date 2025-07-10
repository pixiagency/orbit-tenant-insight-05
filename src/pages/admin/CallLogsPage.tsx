
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { CallLogTable } from '@/components/calls/CallLogTable';
import { CallLogFilters } from '@/components/calls/CallLogFilters';
import { CallAnalytics } from '@/components/calls/CallAnalytics';
import { CallSettingsModal } from '@/components/calls/CallSettingsModal';
import { 
  Phone, 
  PhoneCall, 
  PhoneMissed, 
  Play, 
  Download, 
  Settings, 
  BarChart3,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export const CallLogsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('logs');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);

  // Mock data - replace with actual API call
  const callLogs: CallLog[] = [
    {
      id: '1',
      contactName: 'John Smith',
      contactPhone: '+1-555-0123',
      userId: 'user1',
      userName: 'Sarah Johnson',
      date: '2024-01-15 14:30:00',
      duration: '12:45',
      type: 'outgoing',
      status: 'completed',
      outcome: 'qualified',
      hasRecording: true,
      recordingUrl: '/recordings/call-1.mp3',
      notes: 'Interested in premium package, scheduled follow-up call',
      linkedEntity: { type: 'lead', id: 'lead1', name: 'Premium Service Inquiry' },
      tags: ['hot-lead', 'premium']
    },
    {
      id: '2',
      contactName: 'Alice Brown',
      contactPhone: '+1-555-0124',
      userId: 'user2',
      userName: 'Mike Wilson',
      date: '2024-01-15 13:15:00',
      duration: '8:22',
      type: 'incoming',
      status: 'completed',
      outcome: 'converted',
      hasRecording: true,
      recordingUrl: '/recordings/call-2.mp3',
      notes: 'Signed up for basic plan',
      linkedEntity: { type: 'deal', id: 'deal1', name: 'Basic Plan Sale' },
      tags: ['converted', 'basic-plan']
    },
    {
      id: '3',
      contactName: 'Bob Johnson',
      contactPhone: '+1-555-0125',
      userId: 'user1',
      userName: 'Sarah Johnson',
      date: '2024-01-15 11:00:00',
      duration: '0:00',
      type: 'outgoing',
      status: 'not-answered',
      outcome: 'follow-up',
      hasRecording: false,
      notes: 'No answer, left voicemail',
      tags: ['follow-up']
    }
  ];

  const handleBulkExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${selectedCalls.length} call logs...`,
    });
  };

  const handleBulkDelete = () => {
    toast({
      title: "Calls Deleted",
      description: `${selectedCalls.length} call logs have been deleted.`,
    });
    setSelectedCalls([]);
  };

  const handlePlayRecording = (recordingUrl: string) => {
    toast({
      title: "Playing Recording",
      description: "Recording will start playing...",
    });
  };

  const stats = {
    totalCalls: callLogs.length,
    completedCalls: callLogs.filter(call => call.status === 'completed').length,
    avgDuration: '10:23',
    conversionRate: '35%'
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Call Logs & Recordings"
        description="Monitor and analyze all system calls with recording capabilities"
        showAddButton={false}
        showExportButton={true}
        onExportClick={handleBulkExport}
      >
        <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCalls}</p>
                <p className="text-sm text-gray-600">Total Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PhoneCall className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.completedCalls}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.avgDuration}</p>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.conversionRate}</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Call Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <CallLogFilters onFiltersChange={(filters) => console.log('Filters:', filters)} />
          
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>
                Complete log of all system calls with recordings and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CallLogTable
                callLogs={callLogs}
                selectedCalls={selectedCalls}
                onSelectionChange={setSelectedCalls}
                onPlayRecording={handlePlayRecording}
                onBulkExport={handleBulkExport}
                onBulkDelete={handleBulkDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <CallAnalytics callLogs={callLogs} />
        </TabsContent>
      </Tabs>

      <CallSettingsModal 
        open={showSettings} 
        onOpenChange={setShowSettings}
      />
    </div>
  );
};
