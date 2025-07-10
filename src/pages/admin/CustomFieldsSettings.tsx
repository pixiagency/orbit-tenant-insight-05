
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { CustomFieldManager } from '../../components/leads/CustomFieldManager';
import { useCustomFields } from '../../hooks/useCustomFields';
import { toast } from 'sonner';

export const CustomFieldsSettings: React.FC = () => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
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

  const fieldsBySection = customFields.reduce((acc, field) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Fields Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage custom fields for your lead forms. Configure field types, validation, and organization.
          </p>
        </div>
        <Button onClick={() => setIsManagerOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Manage Fields
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Fields:</span>
                <span className="font-medium">{customFields.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Fields:</span>
                <span className="font-medium text-green-600">
                  {customFields.filter(f => f.isActive).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Required Fields:</span>
                <span className="font-medium text-red-600">
                  {customFields.filter(f => f.required && f.isActive).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Field Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(
                customFields.reduce((acc, field) => {
                  acc[field.type] = (acc[field.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-sm text-gray-600 capitalize">{type}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setIsManagerOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Field
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setIsManagerOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Fields
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  const activeCount = customFields.filter(f => f.isActive).length;
                  const inactiveCount = customFields.length - activeCount;
                  toast.info(`${activeCount} active, ${inactiveCount} inactive fields`);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <p className="text-gray-500 text-center py-8">
                No custom fields in this section.
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <CustomFieldManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        customFields={customFields}
        onSaveFields={saveCustomFields}
      />
    </div>
  );
};
