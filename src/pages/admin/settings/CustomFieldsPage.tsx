
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Plus, Edit, Trash2, Eye, EyeOff, Users, Handshake, CheckSquare, Building } from 'lucide-react';
import { CustomFieldManager } from '../../../components/leads/CustomFieldManager';
import { useCustomFields } from '../../../hooks/useCustomFields';
import { toast } from 'sonner';

export const CustomFieldsPage: React.FC = () => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState('contacts');
  const { customFields, saveCustomFields, updateCustomField, deleteCustomField } = useCustomFields();

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

  const modules = [
    { key: 'contacts', title: 'Contacts', icon: Users, description: 'Custom fields for contact forms' },
    { key: 'deals', title: 'Deals', icon: Handshake, description: 'Custom fields for deal forms' },
    { key: 'opportunities', title: 'Opportunities', icon: Building, description: 'Custom fields for opportunity forms' },
    { key: 'tasks', title: 'Tasks', icon: CheckSquare, description: 'Custom fields for task forms' }
  ];

  const moduleFields = customFields.filter(field => field.module === selectedModule || !field.module);

  const fieldsBySection = moduleFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, any[]>);

  const sections = [
    { key: 'contact', title: 'Contact Information' },
    { key: 'company', title: 'Company Information' },
    { key: 'additional', title: 'Additional Information' }
  ];

  const getModuleStats = (moduleKey: string) => {
    const moduleCustomFields = customFields.filter(f => f.module === moduleKey || !f.module);
    return {
      total: moduleCustomFields.length,
      active: moduleCustomFields.filter(f => f.isActive).length,
      required: moduleCustomFields.filter(f => f.required && f.isActive).length
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Fields Management</h1>
          <p className="text-gray-600 mt-1">
            Configure custom fields for contacts, deals, opportunities, and tasks
          </p>
        </div>
        <Button onClick={() => setIsManagerOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Manage Fields
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
                    onClick={() => setIsManagerOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Field
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsManagerOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Fields
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fields by Section */}
            {sections.map(section => (
              <Card key={section.key}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {fieldsBySection[section.key]?.length > 0 ? (
                    <div className="space-y-3">
                      {fieldsBySection[section.key].map((field: any) => (
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
                              onClick={() => setIsManagerOpen(true)}
                            >
                              <Edit className="h-4 w-4" />
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
                        onClick={() => setIsManagerOpen(true)}
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

      <CustomFieldManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        customFields={customFields}
        onSaveFields={saveCustomFields}
        selectedModule={selectedModule}
      />
    </div>
  );
};
