
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Plus, 
  UserPlus, 
  Star,
  Building2,
  Calendar,
  DollarSign,
  Edit,
  MoreHorizontal,
  Eye,
  Trash2,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Lead } from '@/types/leads';

interface LeadsGridProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertLead: (leadId: string) => void;
}

export const LeadsGrid: React.FC<LeadsGridProps> = ({ 
  leads, 
  onEditLead,
  onDeleteLead,
  onConvertLead
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-700 border-green-200';
      case 'unqualified': return 'bg-red-100 text-red-700 border-red-200';
      case 'converted': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleSendEmail = (lead: Lead) => {
    console.log('Send email to:', lead.email);
  };

  const handleCall = (lead: Lead) => {
    console.log('Call:', lead.phone);
  };

  const handleSendWhatsApp = (lead: Lead) => {
    console.log('Send WhatsApp to:', lead.phone);
  };

  const handleAddTask = (lead: Lead) => {
    console.log('Add task for:', lead.firstName, lead.lastName);
  };

  const handleAssign = (lead: Lead) => {
    console.log('Assign lead:', lead.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="group hover:shadow-lg transition-all duration-200 bg-white overflow-hidden border-0 shadow-sm">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {lead.firstName} {lead.lastName}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{lead.title}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{lead.company}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                {lead.score}
              </div>
            </div>

            {/* Status and Value */}
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
              <div className="flex items-center text-sm font-medium text-green-600">
                <DollarSign className="h-4 w-4 mr-1" />
                ${lead.value.toLocaleString()}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>{lead.phone}</span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="pt-4 border-t space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Source: {lead.source}</span>
                <span>{new Date(lead.createdDate).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Assigned to: {lead.assignedTo}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
};
