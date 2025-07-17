
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone, Activity, Calendar } from 'lucide-react';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity History</DialogTitle>
          <DialogDescription>
            View all activities for opportunity: {opportunityName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activities recorded for this opportunity yet.</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4 space-y-3">
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
      </DialogContent>
    </Dialog>
  );
};
