import React from 'react';
import { EmbeddedForm } from './EmbeddedForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface FormPreviewProps {
  form: {
    id: string;
    name: string;
    description: string;
    fields: any[];
    actions: any[];
  };
}

export const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const handlePreviewSubmit = (data: any) => {
    console.log('Preview submission:', data);
    // Don't actually process the submission in preview mode
  };

  // Filter out actions for preview (only show enabled ones)
  const previewActions = form.actions.filter(action => action.enabled);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Form Preview</span>
            </CardTitle>
            <CardDescription>
              This is how your form will appear to users
            </CardDescription>
          </div>
          <Badge variant="outline">Preview Mode</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 p-6 rounded-lg">
          <EmbeddedForm
            formId={form.id}
            name={form.name}
            description={form.description}
            fields={form.fields}
            actions={previewActions}
            onSubmit={handlePreviewSubmit}
          />
        </div>
        
        {previewActions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Actions that will be triggered:</h4>
            <div className="flex flex-wrap gap-2">
              {previewActions.map(action => (
                <Badge key={action.id} variant="secondary" className="text-xs">
                  {action.name} ({action.type})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};