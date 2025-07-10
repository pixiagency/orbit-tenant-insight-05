
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Type, 
  Hash, 
  Mail, 
  Phone, 
  Calendar,
  CheckSquare,
  List,
  Star,
  DollarSign,
  Percent,
  Globe,
  FileText,
  ToggleLeft
} from 'lucide-react';
import { toast } from 'sonner';

// Import the CustomField type from the hook to ensure consistency
type CustomFieldType = 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'url' | 'currency' | 'percentage' | 'rating' | 'boolean';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: CustomFieldType;
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

interface CustomFieldManagerProps {
  isOpen: boolean;
  onClose: () => void;
  customFields: CustomField[];
  onSaveFields: (fields: CustomField[]) => void;
  selectedModule?: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'textarea', label: 'Text Area', icon: FileText },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'datetime', label: 'Date & Time', icon: Calendar },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'multiselect', label: 'Multi-Select', icon: CheckSquare },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { value: 'radio', label: 'Radio Buttons', icon: CheckSquare },
  { value: 'boolean', label: 'Yes/No Switch', icon: ToggleLeft },
  { value: 'currency', label: 'Currency', icon: DollarSign },
  { value: 'percentage', label: 'Percentage', icon: Percent },
  { value: 'rating', label: 'Rating', icon: Star },
  { value: 'url', label: 'URL', icon: Globe },
  { value: 'file', label: 'File Upload', icon: FileText },
] as const;

const SECTIONS = [
  { value: 'contact', label: 'Contact Information' },
  { value: 'company', label: 'Company Information' },
  { value: 'additional', label: 'Additional Information' },
];

const MODULES = [
  { value: 'contacts', label: 'Contacts' },
  { value: 'deals', label: 'Deals' },
  { value: 'opportunities', label: 'Opportunities' },
  { value: 'tasks', label: 'Tasks' },
];

export const CustomFieldManager: React.FC<CustomFieldManagerProps> = ({
  isOpen,
  onClose,
  customFields,
  onSaveFields,
  selectedModule = 'contacts'
}) => {
  const [fields, setFields] = useState<CustomField[]>(customFields);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);

  const handleAddField = () => {
    const newField: CustomField = {
      id: `field_${Date.now()}`,
      name: '',
      label: '',
      type: 'text',
      required: false,
      section: 'additional',
      order: fields.length,
      isActive: true,
      module: selectedModule as any
    };
    setEditingField(newField);
    setIsFieldDialogOpen(true);
  };

  const handleEditField = (field: CustomField) => {
    setEditingField({ ...field });
    setIsFieldDialogOpen(true);
  };

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
    toast.success('Custom field deleted');
  };

  const handleSaveField = (field: CustomField) => {
    if (!field.name || !field.label) {
      toast.error('Name and label are required');
      return;
    }

    // Generate name from label if empty
    if (!field.name) {
      field.name = field.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    const existingIndex = fields.findIndex(f => f.id === field.id);
    
    if (existingIndex >= 0) {
      const newFields = [...fields];
      newFields[existingIndex] = field;
      setFields(newFields);
      toast.success('Custom field updated');
    } else {
      setFields([...fields, field]);
      toast.success('Custom field added');
    }

    setIsFieldDialogOpen(false);
    setEditingField(null);
  };

  const handleSave = () => {
    onSaveFields(fields);
    onClose();
    toast.success('Custom fields configuration saved');
  };

  const getFieldIcon = (type: string) => {
    const fieldType = FIELD_TYPES.find(ft => ft.value === type);
    const IconComponent = fieldType?.icon || Type;
    return <IconComponent className="h-4 w-4" />;
  };

  const moduleFields = fields.filter(field => field.module === selectedModule || !field.module);
  const fieldsBySection = moduleFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, CustomField[]>);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Custom Fields Manager - {MODULES.find(m => m.value === selectedModule)?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Manage custom fields for {MODULES.find(m => m.value === selectedModule)?.label.toLowerCase()}. Fields will appear in the specified sections.
              </p>
              <Button onClick={handleAddField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Field
              </Button>
            </div>

            {SECTIONS.map(section => (
              <Card key={section.value}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {fieldsBySection[section.value]?.length > 0 ? (
                    <div className="space-y-3">
                      {fieldsBySection[section.value].map(field => (
                        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getFieldIcon(field.type)}
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
                                {field.name} • {FIELD_TYPES.find(ft => ft.value === field.type)?.label}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.isActive}
                              onCheckedChange={(checked) => {
                                const newFields = fields.map(f => 
                                  f.id === field.id ? { ...f, isActive: checked } : f
                                );
                                setFields(newFields);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditField(field)}
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
                      No custom fields in this section. Click "Add Custom Field" to get started.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Field Editor Dialog */}
      <CustomFieldEditor
        isOpen={isFieldDialogOpen}
        onClose={() => {
          setIsFieldDialogOpen(false);
          setEditingField(null);
        }}
        field={editingField}
        onSave={handleSaveField}
        existingFields={fields}
        selectedModule={selectedModule}
      />
    </>
  );
};

interface CustomFieldEditorProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomField | null;
  onSave: (field: CustomField) => void;
  existingFields: CustomField[];
  selectedModule: string;
}

const CustomFieldEditor: React.FC<CustomFieldEditorProps> = ({
  isOpen,
  onClose,
  field,
  onSave,
  existingFields,
  selectedModule
}) => {
  const [formData, setFormData] = useState<Partial<CustomField>>({});
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  React.useEffect(() => {
    if (field) {
      setFormData(field);
      setOptions(field.options || []);
    } else {
      setFormData({
        type: 'text',
        required: false,
        section: 'additional',
        isActive: true,
        module: selectedModule as any
      });
      setOptions([]);
    }
  }, [field, selectedModule]);

  const handleSave = () => {
    if (!formData.label) {
      toast.error('Field label is required');
      return;
    }

    const fieldName = formData.name || formData.label!.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Check for duplicate names
    const duplicate = existingFields.find(f => f.name === fieldName && f.id !== formData.id);
    if (duplicate) {
      toast.error('Field name already exists');
      return;
    }

    const updatedField: CustomField = {
      ...formData as CustomField,
      name: fieldName,
      options: ['select', 'multiselect', 'radio'].includes(formData.type!) ? options : undefined
    };

    onSave(updatedField);
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter(opt => opt !== optionToRemove));
  };

  const requiresOptions = ['select', 'multiselect', 'radio'].includes(formData.type || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {field?.id ? 'Edit Custom Field' : 'Add Custom Field'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              for {MODULES.find(m => m.value === selectedModule)?.label}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Field Label *</Label>
              <Input
                id="label"
                value={formData.label || ''}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Budget Range"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Auto-generated from label"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Field Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: CustomFieldType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select 
                value={formData.section} 
                onValueChange={(value) => setFormData({ ...formData, section: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map(section => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder Text</Label>
            <Input
              id="placeholder"
              value={formData.placeholder || ''}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              placeholder="Placeholder text for the field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="helpText">Help Text</Label>
            <Textarea
              id="helpText"
              value={formData.helpText || ''}
              onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
              placeholder="Optional help text to guide users"
              rows={2}
            />
          </div>

          {requiresOptions && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={option} readOnly className="flex-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(option)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add an option"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                  />
                  <Button type="button" variant="outline" onClick={addOption}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Required Field</Label>
              <p className="text-xs text-gray-500">Users must fill this field</p>
            </div>
            <Switch
              checked={formData.required || false}
              onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-xs text-gray-500">Show this field in forms</p>
            </div>
            <Switch
              checked={formData.isActive !== false}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
