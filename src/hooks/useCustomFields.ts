
import { useState, useEffect } from 'react';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'url' | 'currency' | 'percentage' | 'rating' | 'boolean';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditionalLogic?: {
    showWhen: string;
    equals: any;
  };
  section: string;
  order: number;
  isActive: boolean;
  module?: 'contacts' | 'deals' | 'opportunities' | 'tasks';
}

export const useCustomFields = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load custom fields from localStorage or API
  useEffect(() => {
    const savedFields = localStorage.getItem('customFields');
    if (savedFields) {
      try {
        setCustomFields(JSON.parse(savedFields));
      } catch (error) {
        console.error('Error loading custom fields:', error);
      }
    }
  }, []);

  const saveCustomFields = (fields: CustomField[]) => {
    setCustomFields(fields);
    localStorage.setItem('customFields', JSON.stringify(fields));
  };

  const addCustomField = (field: Omit<CustomField, 'id' | 'order'>) => {
    const newField: CustomField = {
      ...field,
      id: `field_${Date.now()}`,
      order: customFields.length
    };
    
    const updatedFields = [...customFields, newField];
    saveCustomFields(updatedFields);
    return newField;
  };

  const updateCustomField = (fieldId: string, updates: Partial<CustomField>) => {
    const updatedFields = customFields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    saveCustomFields(updatedFields);
  };

  const deleteCustomField = (fieldId: string) => {
    const updatedFields = customFields.filter(field => field.id !== fieldId);
    saveCustomFields(updatedFields);
  };

  const getActiveFields = (module?: string) => {
    return customFields.filter(field => 
      field.isActive && (!module || field.module === module || !field.module)
    );
  };

  const getFieldsBySection = (section: string, module?: string) => {
    return customFields
      .filter(field => 
        field.section === section && 
        field.isActive && 
        (!module || field.module === module || !field.module)
      )
      .sort((a, b) => a.order - b.order);
  };

  const validateCustomFields = (data: Record<string, any>, module?: string): string[] => {
    const errors: string[] = [];
    
    customFields
      .filter(field => 
        field.isActive && 
        field.required && 
        (!module || field.module === module || !field.module)
      )
      .forEach(field => {
        const value = data[field.name];
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors.push(`${field.label} is required`);
        }
      });

    return errors;
  };

  return {
    customFields,
    isLoading,
    saveCustomFields,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    getActiveFields,
    getFieldsBySection,
    validateCustomFields
  };
};
