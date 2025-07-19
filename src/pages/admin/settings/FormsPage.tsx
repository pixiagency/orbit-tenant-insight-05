
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { FormActionsConfig } from '@/components/forms/FormActionsConfig';
import { FormPreview } from '@/components/forms/FormPreview';
import { Plus, Edit, Eye, Copy, Trash2, ExternalLink, Settings, Zap } from 'lucide-react';
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
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState<LeadForm | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: '1', name: 'name', label: 'Full Name', type: 'text', required: true },
    { id: '2', name: 'email', label: 'Email', type: 'email', required: true },
    { id: '3', name: 'phone', label: 'Phone', type: 'phone', required: false }
  ]);

  const [formActions, setFormActions] = useState<FormAction[]>([]);

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

  const handleCreateForm = () => {
    if (!formName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a form name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Form created successfully",
    });
    
    setShowCreateForm(false);
    setFormName('');
    setFormDescription('');
    setFormActions([]);
    setFormFields([
      { id: '1', name: 'name', label: 'Full Name', type: 'text', required: true },
      { id: '2', name: 'email', label: 'Email', type: 'email', required: true },
      { id: '3', name: 'phone', label: 'Phone', type: 'phone', required: false }
    ]);
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const removeField = (fieldId: string) => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
  };

  const copyEmbedCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forms Settings"
        description="Create and manage embedded lead capture forms"
        showAddButton={true}
        addButtonText="Create New Form"
        onAddClick={() => setShowCreateForm(true)}
      />

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Form</CardTitle>
            <CardDescription>Build a custom lead capture form with automated actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="formName">Form Name</Label>
                    <Input
                      id="formName"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter form name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formDesc">Description</Label>
                    <Input
                      id="formDesc"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Brief description"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Form Fields</h4>
                    <Button onClick={addField} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formFields.map((field) => (
                      <div key={field.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-4 gap-3">
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            placeholder="Field Label"
                          />
                          <Select value={field.type} onValueChange={(value: any) => updateField(field.id, { type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                            />
                            <Label>Required</Label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeField(field.id)}
                            disabled={formFields.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions">
                <FormActionsConfig 
                  actions={formActions} 
                  onChange={setFormActions} 
                />
              </TabsContent>

              <TabsContent value="preview">
                <FormPreview 
                  form={{
                    id: 'preview',
                    name: formName || 'New Form',
                    description: formDescription,
                    fields: formFields,
                    actions: formActions
                  }}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateForm}>
                Create Form
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                      <div className="text-sm text-gray-500">{form.description}</div>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyEmbedCode(form.embedCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">{selectedForm.name}</h3>
                <div className="space-y-4">
                  {selectedForm.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
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
