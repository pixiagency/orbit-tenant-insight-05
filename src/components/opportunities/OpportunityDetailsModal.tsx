import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Mail, 
  Phone, 
  MessageSquare,
  UserPlus,
  Plus,
  Handshake
} from 'lucide-react';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  lastActivity: string;
}

interface OpportunityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  isOpen,
  onClose,
  opportunity
}) => {
  if (!opportunity) return null;

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'qualification': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'proposal': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'closed-won': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed-lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSendEmail = () => {
    toast.success('Email composer opened');
  };

  const handleCall = () => {
    toast.success('Initiating call...');
  };

  const handleSendWhatsApp = () => {
    toast.success('Opening WhatsApp...');
  };

  const handleAssign = () => {
    toast.success('Assignment dialog opened');
  };

  const handleAddTask = () => {
    toast.success('Task creation opened');
  };

  const handleConvertToDeal = () => {
    toast.success('Converting to deal...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{opportunity.name}</span>
            <Badge variant="outline" className={getStageColor(opportunity.stage)}>
              {opportunity.stage.replace('-', ' ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Company Information</h3>
              <p className="text-lg font-medium">{opportunity.company}</p>
              <p className="text-gray-600">{opportunity.contact}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{opportunity.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{opportunity.phone}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Opportunity Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-green-600">${opportunity.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Probability:</span>
                  <span className="font-semibold">{opportunity.probability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Expected Close:</span>
                  <span className="font-semibold">{new Date(opportunity.expectedCloseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span className="font-semibold">{opportunity.source}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment & Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Assignment</h3>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{opportunity.assignedTo}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(opportunity.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Activity:</span>
                  <span>{new Date(opportunity.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{opportunity.probability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${opportunity.probability}%` }}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleSendEmail} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" onClick={handleCall} className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" onClick={handleSendWhatsApp} className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={handleAssign} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Assign
              </Button>
              <Button variant="outline" onClick={handleAddTask} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
              <Button onClick={handleConvertToDeal} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Handshake className="h-4 w-4" />
                Convert to Deal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};