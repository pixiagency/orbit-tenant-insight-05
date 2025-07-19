import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmbeddedForm } from './EmbeddedForm';
import { Loader2 } from 'lucide-react';

interface FormData {
  id: string;
  name: string;
  description: string;
  fields: any[];
  actions: any[];
  isActive: boolean;
}

export const FormPublicPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // Simulate API call - replace with actual endpoint
        const response = await fetch(`/api/forms/public/${formId}`);
        if (!response.ok) {
          throw new Error('Form not found');
        }
        const formData = await response.json();
        
        if (!formData.isActive) {
          throw new Error('This form is no longer active');
        }
        
        setForm(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Form Not Available</h1>
          <p className="text-muted-foreground">{error || 'Form not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <EmbeddedForm
          formId={form.id}
          name={form.name}
          description={form.description}
          fields={form.fields}
          actions={form.actions}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
          }}
        />
      </div>
    </div>
  );
};