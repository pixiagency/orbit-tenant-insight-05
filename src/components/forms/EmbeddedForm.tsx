import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'dropdown' | 'textarea' | 'checkbox';
  required: boolean;
  options?: string[];
}

interface EmbeddedFormProps {
  formId: string;
  name: string;
  description?: string;
  fields: FormField[];
  actions: FormAction[];
  onSubmit?: (data: Record<string, any>) => void;
}

interface FormAction {
  id: string;
  type: 'email' | 'webhook' | 'redirect' | 'notification';
  config: Record<string, any>;
  enabled: boolean;
}

export const EmbeddedForm: React.FC<EmbeddedFormProps> = ({
  formId,
  name,
  description,
  fields,
  actions,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeActions = async (submissionData: Record<string, any>) => {
    const enabledActions = actions.filter(action => action.enabled);
    
    for (const action of enabledActions) {
      try {
        switch (action.type) {
          case 'email':
            await sendEmailNotification(submissionData, action.config);
            break;
          case 'webhook':
            await triggerWebhook(submissionData, action.config);
            break;
          case 'redirect':
            window.location.href = action.config.url;
            break;
          case 'notification':
            showNotification(action.config.message);
            break;
        }
      } catch (error) {
        console.error(`Failed to execute action ${action.id}:`, error);
      }
    }
  };

  const sendEmailNotification = async (data: Record<string, any>, config: any) => {
    // Simulate email API call
    await fetch('/api/forms/email-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId, data, config })
    });
  };

  const triggerWebhook = async (data: Record<string, any>, config: any) => {
    await fetch(config.url, {
      method: config.method || 'POST',
      headers: { 'Content-Type': 'application/json', ...config.headers },
      body: JSON.stringify({ formId, data })
    });
  };

  const showNotification = (message: string) => {
    // Simple notification - could be enhanced with toast
    alert(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const submissionData = {
        formId,
        data: formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };

      // Save submission
      await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      // Execute configured actions
      await executeActions(submissionData);
      
      onSubmit?.(submissionData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission failed:', error);
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className={hasError ? 'border-destructive' : ''}
          />
        );
        
      case 'dropdown':
        return (
          <Select 
            value={formData[field.name] || ''} 
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger className={hasError ? 'border-destructive' : ''}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <Label className="text-sm">{field.label}</Label>
          </div>
        );
        
      default:
        return (
          <Input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className={hasError ? 'border-destructive' : ''}
          />
        );
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center py-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
          <p className="text-muted-foreground">
            Your submission has been received successfully.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              )}
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-sm text-destructive">{errors[field.name]}</p>
              )}
            </div>
          ))}
          
          {errors.submit && (
            <p className="text-sm text-destructive">{errors.submit}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};