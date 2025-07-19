import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/layout/PageHeader';
import { Edit, Eye, Copy, ExternalLink, Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'dropdown' | 'textarea' | 'checkbox';
  required: boolean;
  options?: string[];
}

interface FormAction {
  id: string;
  type: 'email' | 'webhook' | 'redirect' | 'notification';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

interface LeadForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  actions: FormAction[];
  isActive: boolean;
  embedCode: string;
  submissions: number;
  createdAt: string;
  automation?: string;
}

export const FormsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedForm, setSelectedForm] = useState<LeadForm | null>(null);

  const [existingForms] = useState<LeadForm[]>([
    {
      id: '1',
      name: 'Contact Us Form',
      description: 'General contact form for website',
      fields: [
        { id: '1', name: 'name', label: 'Full Name', type: 'text', required: true },
        { id: '2', name: 'email', label: 'Email', type: 'email', required: true },
        { id: '3', name: 'message', label: 'Message', type: 'textarea', required: true }
      ],
      actions: [
        { id: '1', type: 'email', name: 'Email Notification', config: { to: 'admin@example.com', subject: 'New contact form submission' }, enabled: true }
      ],
      isActive: true,
      embedCode: '<iframe src="https://forms.yoursite.com/contact-us" width="100%" height="500px"></iframe>',
      submissions: 45,
      createdAt: '2024-01-15',
      automation: 'Auto-assign to sales team'
    },
    {
      id: '2',
      name: 'Product Demo Request',
      description: 'Lead capture for product demonstrations',
      fields: [
        { id: '1', name: 'name', label: 'Full Name', type: 'text', required: true },
        { id: '2', name: 'email', label: 'Business Email', type: 'email', required: true },
        { id: '3', name: 'company', label: 'Company', type: 'text', required: true },
        { id: '4', name: 'phone', label: 'Phone', type: 'phone', required: false }
      ],
      actions: [
        { id: '1', type: 'email', name: 'Demo Team Notification', config: { to: 'demo@example.com', subject: 'New demo request' }, enabled: true },
        { id: '2', type: 'webhook', name: 'CRM Integration', config: { url: 'https://api.crm.com/leads', method: 'POST' }, enabled: true }
      ],
      isActive: true,
      embedCode: '<iframe src="https://forms.yoursite.com/demo-request" width="100%" height="600px"></iframe>',
      submissions: 23,
      createdAt: '2024-01-20',
      automation: 'Send to demo team + follow-up email'
    }
  ]);

  const copyEmbedCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Forms Settings"
        description="Create and manage embedded lead capture forms"
        showAddButton={true}
        addButtonText="Create New Form"
        onAddClick={() => navigate('/admin/settings/forms/create')}
      />

      <Card>
        <CardHeader>
          <CardTitle>Existing Forms</CardTitle>
          <CardDescription>Manage your lead capture forms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{form.name}</div>
                      <div className="text-sm text-muted-foreground">{form.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={form.isActive ? "default" : "secondary"}>
                      {form.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{form.submissions}</TableCell>
                  <TableCell>{form.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {form.actions.filter(action => action.enabled).map(action => (
                        <Badge key={action.id} variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {action.type}
                        </Badge>
                      ))}
                      {form.actions.filter(action => action.enabled).length === 0 && (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedForm(form)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/settings/forms/edit/${form.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyEmbedCode(form.embedCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.open(`/forms/${form.id}`, '_blank')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedForm && (
        <Card>
          <CardHeader>
            <CardTitle>Form Preview: {selectedForm.name}</CardTitle>
            <CardDescription>This is how your form will appear to users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="max-w-md mx-auto bg-background p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-4">{selectedForm.name}</h3>
                <div className="space-y-4">
                  {selectedForm.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>{field.label} {field.required && <span className="text-destructive ml-1">*</span>}</Label>
                      {field.type === 'textarea' ? (
                        <Textarea placeholder={`Enter ${field.label.toLowerCase()}`} />
                      ) : (
                        <Input 
                          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                          placeholder={`Enter ${field.label.toLowerCase()}`} 
                        />
                      )}
                    </div>
                  ))}
                  <Button className="w-full">Submit</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};