import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileCode, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, fields: string[], language: string) => void;
}

export const ClientExportModal: React.FC<ClientExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'companyName',
    'contactName',
    'contactEmail',
    'status',
    'packageName',
    'monthlyRevenue',
  ]);

  const exportFormats = [
    { id: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
    { id: 'json', label: 'JSON', icon: FileCode, description: 'JavaScript Object Notation' },
    { id: 'pdf', label: 'PDF', icon: FileText, description: 'Portable Document Format' },
  ];

  const availableLanguages = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'es', label: 'Español', flag: '🇪🇸' },
    { id: 'fr', label: 'Français', flag: '🇫🇷' },
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { id: 'it', label: 'Italiano', flag: '🇮🇹' },
    { id: 'pt', label: 'Português', flag: '🇵🇹' },
    { id: 'zh', label: '中文', flag: '🇨🇳' },
    { id: 'ja', label: '日本語', flag: '🇯🇵' },
    { id: 'ko', label: '한국어', flag: '🇰🇷' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const availableFields = [
    { id: 'companyName', label: 'Company Name' },
    { id: 'contactName', label: 'Contact Name' },
    { id: 'contactEmail', label: 'Contact Email' },
    { id: 'contactPhone', label: 'Contact Phone' },
    { id: 'subdomain', label: 'Subdomain' },
    { id: 'status', label: 'Status' },
    { id: 'packageName', label: 'Package' },
    { id: 'monthlyRevenue', label: 'Monthly Revenue' },
    { id: 'totalUsers', label: 'Total Users' },
    { id: 'storageUsed', label: 'Storage Used' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'lastLogin', label: 'Last Login' },
    { id: 'website', label: 'Website' },
    { id: 'address', label: 'Address' },
    { id: 'companySize', label: 'Company Size' },
    { id: 'industry', label: 'Industry' },
    { id: 'subscriptionStartDate', label: 'Subscription Start' },
    { id: 'subscriptionEndDate', label: 'Subscription End' },
  ];

  const handleFieldChange = (fieldId: string, checked: boolean) => {
    setSelectedFields(prev =>
      checked
        ? [...prev, fieldId]
        : prev.filter(id => id !== fieldId)
    );
  };

  const handleExport = () => {
    onExport(exportFormat, selectedFields, selectedLanguage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[97vh] my-1 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Clients
          </DialogTitle>
          <DialogDescription>
            Choose the export format, language, and select the fields you want to include in the export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              <div className="grid grid-cols-2 gap-4">
                {exportFormats.map((format) => (
                  <div key={format.id} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value={format.id} id={format.id} />
                    <div className="flex items-center space-x-2 flex-1">
                      <format.icon className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label htmlFor={format.id} className="font-medium cursor-pointer">
                          {format.label}
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Language Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Export Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Select language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((language) => (
                  <SelectItem key={language.id} value={language.id}>
                    <div className="flex items-center space-x-2">
                      <span>{language.flag}</span>
                      <span>{language.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              The language will be used for column headers and data formatting
            </p>
          </div>

          {/* Field Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Select Fields to Export</Label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={(checked) => handleFieldChange(field.id, checked as boolean)}
                    />
                    <Label htmlFor={field.id} className="cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {selectedFields.length} of {availableFields.length} fields selected
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={selectedFields.length === 0}
            className="min-w-[120px]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 