
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Mail, Phone, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface OpportunityCommunicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'whatsapp' | 'email' | 'call' | 'activity';
  opportunityIds: string[];
  onSend: (type: string, data: any) => void;
}

const MESSAGE_TEMPLATES = [
  { id: '1', title: 'Follow-up Message', content: 'Hi {name}, following up on our previous conversation...' },
  { id: '2', title: 'Proposal Follow-up', content: 'Hi {name}, I wanted to check if you had a chance to review our proposal...' },
  { id: '3', title: 'Meeting Reminder', content: 'Hi {name}, this is a reminder about our meeting scheduled for...' },
  { id: '4', title: 'Thank You Message', content: 'Hi {name}, thank you for your time today...' },
];

const EMAIL_TEMPLATES = [
  { id: '1', title: 'Introduction Email', subject: 'Introduction - {company}', content: 'Dear {name}, I hope this email finds you well...' },
  { id: '2', title: 'Proposal Email', subject: 'Proposal for {company}', content: 'Dear {name}, please find attached our proposal...' },
  { id: '3', title: 'Follow-up Email', subject: 'Following up on our conversation', content: 'Dear {name}, I wanted to follow up on our recent conversation...' },
];

const ACTIVITY_TYPES = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'call', label: 'Phone Call' },
  { value: 'email', label: 'Email Sent' },
  { value: 'note', label: 'Note' },
  { value: 'task', label: 'Task' },
];

export const OpportunityCommunicationDialog: React.FC<OpportunityCommunicationDialogProps> = ({
  isOpen,
  onClose,
  type,
  opportunityIds,
  onSend,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [activityType, setActivityType] = useState('');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDescription, setActivityDescription] = useState('');

  const getTitle = () => {
    switch (type) {
      case 'whatsapp':
        return 'Send WhatsApp Message';
      case 'email':
        return 'Send Email';
      case 'call':
        return 'Log Phone Call';
      case 'activity':
        return 'Add Activity';
      default:
        return 'Communication';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'call':
        return <Phone className="h-5 w-5" />;
      case 'activity':
        return <Activity className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleSend = () => {
    let data: any = {};

    switch (type) {
      case 'whatsapp':
        if (!customMessage && !selectedTemplate) {
          toast.error('Please select a template or enter a custom message');
          return;
        }
        data = {
          template: selectedTemplate,
          message: customMessage,
          opportunityIds,
        };
        break;

      case 'email':
        if (!emailSubject || (!customMessage && !selectedTemplate)) {
          toast.error('Please fill in all required fields');
          return;
        }
        data = {
          template: selectedTemplate,
          subject: emailSubject,
          message: customMessage,
          opportunityIds,
        };
        break;

      case 'call':
        if (!customMessage) {
          toast.error('Please enter call notes');
          return;
        }
        data = {
          notes: customMessage,
          opportunityIds,
        };
        break;

      case 'activity':
        if (!activityType || !activityTitle) {
          toast.error('Please fill in all required fields');
          return;
        }
        data = {
          type: activityType,
          title: activityTitle,
          description: activityDescription,
          opportunityIds,
        };
        break;
    }

    onSend(type, data);
    onClose();
    toast.success(`${getTitle()} completed successfully`);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (type === 'whatsapp') {
      const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setCustomMessage(template.content);
      }
    } else if (type === 'email') {
      const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setEmailSubject(template.subject);
        setCustomMessage(template.content);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {opportunityIds.length === 1 
              ? 'Send communication to 1 opportunity'
              : `Send communication to ${opportunityIds.length} opportunities`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(type === 'whatsapp' || type === 'email') && (
            <div>
              <Label htmlFor="template">Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {(type === 'whatsapp' ? MESSAGE_TEMPLATES : EMAIL_TEMPLATES).map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'email' && (
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..."
              />
            </div>
          )}

          {type === 'activity' && (
            <>
              <div>
                <Label htmlFor="activityType">Activity Type *</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((activity) => (
                      <SelectItem key={activity.value} value={activity.value}>
                        {activity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="activityTitle">Title *</Label>
                <Input
                  id="activityTitle"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="Enter activity title..."
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="message">
              {type === 'call' ? 'Call Notes *' : 
               type === 'activity' ? 'Description' : 
               'Message *'}
            </Label>
            <Textarea
              id="message"
              value={type === 'activity' ? activityDescription : customMessage}
              onChange={(e) => 
                type === 'activity' 
                  ? setActivityDescription(e.target.value)
                  : setCustomMessage(e.target.value)
              }
              placeholder={
                type === 'call' ? 'Enter call notes and outcomes...' :
                type === 'activity' ? 'Enter activity description...' :
                'Enter your message or customize the template...'
              }
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            {type === 'call' ? 'Log Call' : 
             type === 'activity' ? 'Add Activity' : 
             'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
