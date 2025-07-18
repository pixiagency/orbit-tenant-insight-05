
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, Edit, Trash2, Eye, EyeOff, Users, Handshake, CheckSquare, Building } from 'lucide-react';
import { DrawerForm } from '@/components/layout/DrawerForm';
import { useCustomFields } from '../../../hooks/useCustomFields';
import { toast } from 'sonner';

interface CustomFieldForm {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'url' | 'currency' | 'percentage' | 'rating' | 'boolean';
  module: 'contacts' | 'deals' | 'opportunities' | 'tasks';
  section: string;
  required: boolean;
  placeholder: string;
  helpText: string;
  options: string[];
  isActive: boolean;
}

export const CustomFieldsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState('contacts');
  const { customFields, addCustomField, updateCustomField, deleteCustomField } = useCustomFields();

  const [fieldForm, setFieldForm] = useState<CustomFieldForm>({
    name: '',
    label: '',
    type: 'text',
    module: 'contacts',
    section: 'contact',
    required: false,
    placeholder: '',
    helpText: '',
    options: [],
    isActive: true
  });

  const [optionInput, setOptionInput] = useState('');

  const handleToggleField = (fieldId: string, isActive: boolean) => {
    updateCustomField(fieldId, { isActive });
    toast.success(`Field ${isActive ? 'activated' : 'deactivated'}`);
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this custom field? This action cannot be undone.')) {
      deleteCustomField(fieldId);
      toast.success('Custom field deleted');
    }
  };

  const handleSaveField = () => {
    if (!fieldForm.name || !fieldForm.label) {
      toast.error('Name and Label are required');
      return;
    }

    addCustomField({
      name: fieldForm.name,
      label: fieldForm.label,
      type: fieldForm.type,
      module: fieldForm.module,
      section: fieldForm.section,
      required: fieldForm.required,
      placeholder: fieldForm.placeholder,
      helpText: fieldForm.helpText,
      options: fieldForm.options,
      isActive: fieldForm.isActive
    });

    toast.success('Custom field created successfully');
    setIsDrawerOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFieldForm({
      name: '',
      label: '',
      type: 'text',
      module: 'contacts',
      section: 'contact',
      required: false,
      placeholder: '',
      helpText: '',
      options: [],
      isActive: true
    });
    setOptionInput('');
  };

  const addOption = () => {
    if (optionInput.trim()) {
      setFieldForm({
        ...fieldForm,
        options: [...fieldForm.options, optionInput.trim()]
      });
      setOptionInput('');
    }
  };

  const removeOption = (index: number) => {
    setFieldForm({
      ...fieldForm,
      options: fieldForm.options.filter((_, i) => i !== index)
    });
  };

  const modules = [
    { key: 'contacts', title: 'Contacts', icon: Users, description: 'Custom fields for contact forms' },
    { key: 'deals', title: 'Deals', icon: Handshake, description: 'Custom fields for deal forms' },
    { key: 'opportunities', title: 'Opportunities', icon: Building, description: 'Custom fields for opportunity forms' },
    { key: 'tasks', title: 'Tasks', icon: CheckSquare, description: 'Custom fields for task forms' }
  ];

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'datetime', label: 'Date & Time' },
    { value: 'select', label: 'Dropdown' },
    { value: 'multiselect', label: 'Multi-select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'file', label: 'File Upload' },
    { value: 'url', label: 'URL' },
    { value: 'currency', label: 'Currency' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'rating', label: 'Rating' },
    { value: 'boolean', label: 'Yes/No' }
  ];

  const getSectionOptions = (module: string) => {
    switch (module) {
      case 'contacts':
        return [
          { value: 'contact', label: 'Contact Information' },
          { value: 'company', label: 'Company Information' },
          { value: 'additional', label: 'Additional Information' }
        ];
      case 'deals':
        return [
          { value: 'deal', label: 'Deal Information' },
          { value: 'financial', label: 'Financial Details' },
          { value: 'additional', label: 'Additional Information' }
        ];
      case 'opportunities':
        return [
          { value: 'opportunity', label: 'Opportunity Details' },
          { value: 'timeline', label: 'Timeline & Stages' },
          { value: 'additional', label: 'Additional Information' }
        ];
      case 'tasks':
        return [
          { value: 'task', label: 'Task Details' },
          { value: 'assignment', label: 'Assignment & Priority' },
          { value: 'additional', label: 'Additional Information' }
        ];
      default:
        return [{ value: 'general', label: 'General' }];
    }
  };

  const moduleFields = customFields.filter(field => field.module === selectedModule || !field.module);

  const fieldsBySection = moduleFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, any[]>);

  const sections = getSectionOptions(selectedModule);

  const getModuleStats = (moduleKey: string) => {
    const moduleCustomFields = customFields.filter(f => f.module === moduleKey || !f.module);
    return {
      total: moduleCustomFields.length,
      active: moduleCustomFields.filter(f => f.isActive).length,
      required: moduleCustomFields.filter(f => f.required && f.isActive).length
    };
  };

  const needsOptions = ['select', 'multiselect', 'radio'].includes(fieldForm.type);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Fields Management</h1>
          <p className="text-gray-600 mt-1">
            Configure custom fields for contacts, deals, opportunities, and tasks
          </p>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Field
        </Button>
      </div>

      {/* Module Selection */}
      <Tabs value={selectedModule} onValueChange={setSelectedModule} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {modules.map((module) => (
            <TabsTrigger key={module.key} value={module.key} className="flex items-center space-x-2">
              <module.icon className="h-4 w-4" />
              <span>{module.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {modules.map((module) => (
          <TabsContent key={module.key} value={module.key} className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
                  <module.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getModuleStats(module.key).total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Fields</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{getModuleStats(module.key).active}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Required Fields</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{getModuleStats(module.key).required}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions for {module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFieldForm({ ...fieldForm, module: module.key as any });
                      setIsDrawerOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Field
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fields by Section */}
            {sections.map(section => (
              <Card key={section.value}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {fieldsBySection[section.value]?.length > 0 ? (
                    <div className="space-y-3">
                      {fieldsBySection[section.value].map((field: any) => (
                        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{field.label}</span>
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                                {!field.isActive && (
                                  <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {field.name} • {field.type}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleField(field.id, !field.isActive)}
                            >
                              {field.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteField(field.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <module.icon className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-gray-500">No custom fields in this section.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setFieldForm({ ...fieldForm, module: module.key as any, section: section.value });
                          setIsDrawerOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Field
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <DrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add Custom Field"
        description="Create a new custom field for your forms"
        onSave={handleSaveField}
        width="wide"
      >
        <div className="space-y-6">
          {/* Module Selection */}
          <div className="space-y-2">
            <Label>Form Module</Label>
            <Select 
              value={fieldForm.module} 
              onValueChange={(value: 'contacts' | 'deals' | 'opportunities' | 'tasks') => 
                setFieldForm({ ...fieldForm, module: value, section: getSectionOptions(value)[0].value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.key} value={module.key}>
                    <div className="flex items-center space-x-2">
                      <module.icon className="h-4 w-4" />
                      <span>{module.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Selection */}
          <div className="space-y-2">
            <Label>Form Section</Label>
            <Select 
              value={fieldForm.section} 
              onValueChange={(value) => setFieldForm({ ...fieldForm, section: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getSectionOptions(fieldForm.module).map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field Type */}
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select 
              value={fieldForm.type} 
              onValueChange={(value: any) => setFieldForm({ ...fieldForm, type: value, options: [] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field Name */}
          <div className="space-y-2">
            <Label>Field Name *</Label>
            <Input
              value={fieldForm.name}
              onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
              placeholder="e.g. custom_field_name"
            />
          </div>

          {/* Field Label */}
          <div className="space-y-2">
            <Label>Field Label *</Label>
            <Input
              value={fieldForm.label}
              onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
              placeholder="e.g. Custom Field"
            />
          </div>

          {/* Placeholder */}
          <div className="space-y-2">
            <Label>Placeholder Text</Label>
            <Input
              value={fieldForm.placeholder}
              onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>

          {/* Help Text */}
          <div className="space-y-2">
            <Label>Help Text</Label>
            <Textarea
              value={fieldForm.helpText}
              onChange={(e) => setFieldForm({ ...fieldForm, helpText: e.target.value })}
              placeholder="Additional help text for users"
              rows={2}
            />
          </div>

          {/* Options for select/radio fields */}
          {needsOptions && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Enter option"
                    onKeyPress={(e) => e.key === 'Enter' && addOption()}
                  />
                  <Button type="button" onClick={addOption}>Add</Button>
                </div>
                {fieldForm.options.length > 0 && (
                  <div className="space-y-1">
                    {fieldForm.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{option}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Required Field</Label>
              <Switch
                checked={fieldForm.required}
                onCheckedChange={(checked) => setFieldForm({ ...fieldForm, required: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={fieldForm.isActive}
                onCheckedChange={(checked) => setFieldForm({ ...fieldForm, isActive: checked })}
              />
            </div>
          </div>
        </div>
      </DrawerForm>
    </div>
  );
};
