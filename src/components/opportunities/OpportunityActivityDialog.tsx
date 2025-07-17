
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail, Phone, Activity, Calendar, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface Activity {
  id: string;
  type: 'whatsapp' | 'email' | 'call' | 'activity';
  title: string;
  description?: string;
  timestamp: string;
  template?: string;
}

interface OpportunityActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityName: string;
  activities: Activity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'call':
      return <Phone className="h-4 w-4" />;
    case 'activity':
      return <Activity className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'whatsapp':
      return 'bg-green-100 text-green-800';
    case 'email':
      return 'bg-blue-100 text-blue-800';
    case 'call':
      return 'bg-purple-100 text-purple-800';
    case 'activity':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const OpportunityActivityDialog: React.FC<OpportunityActivityDialogProps> = ({
  isOpen,
  onClose,
  opportunityId,
  opportunityName,
  activities,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter activities based on search and type
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.template?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Paginate activities
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Activity History</DialogTitle>
          <DialogDescription>
            View all activities for opportunity: {opportunityName} ({filteredActivities.length} total activities)
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex items-center space-x-4 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search activities..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {paginatedActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {activities.length === 0 
                  ? "No activities recorded for this opportunity yet." 
                  : "No activities match your search criteria."
                }
              </p>
            </div>
          ) : (
            paginatedActivities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getActivityColor(activity.type)}>
                      {getActivityIcon(activity.type)}
                      <span className="ml-2 capitalize">{activity.type}</span>
                    </Badge>
                    <span className="font-medium">{activity.title}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>

                {activity.template && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Template:</span> {activity.template}
                  </div>
                )}

                {activity.description && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {activity.description}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
