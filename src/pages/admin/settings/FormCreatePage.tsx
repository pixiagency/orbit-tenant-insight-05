import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { FormActionsConfig } from '@/components/forms/FormActionsConfig';
import { FormPreview } from '@/components/forms/FormPreview';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
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

export const FormCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: '1', name: 'name', label: 'Full Name', type: 'text', required: true },
    { id: '2', name: 'email', label: 'Email', type: 'email', required: true },
    { id: '3', name: 'phone', label: 'Phone', type: 'phone', required: false }
  ]);
  const [formActions, setFormActions] = useState<FormAction[]>([]);

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
    
    navigate('/admin/settings/forms');
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/admin/settings/forms')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forms
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Form</h1>
          <p className="text-muted-foreground">Build a custom lead capture form with automated actions</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
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

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={() => navigate('/admin/settings/forms')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => navigate('/admin/settings/forms')}>
                Cancel
              </Button>
              <Button onClick={handleCreateForm}>
                Create Form
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};