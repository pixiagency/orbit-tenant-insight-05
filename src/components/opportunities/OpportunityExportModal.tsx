import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  description?: string;
  budget?: number;
  timeline?: string;
  createdAt: string;
  lastActivity: string;
}

interface OpportunityExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  selectedOpportunities: string[];
}

export const OpportunityExportModal: React.FC<OpportunityExportModalProps> = ({
  isOpen,
  onClose,
  opportunities,
  selectedOpportunities
}) => {
  const [exportType, setExportType] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [exportScope, setExportScope] = useState<'all' | 'selected' | 'filtered'>('all');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name',
    'company',
    'contact',
    'email',
    'phone',
    'stage',
    'value',
    'probability',
    'expectedCloseDate',
    'assignedTo',
    'source'
  ]);

  const availableFields = [
    { key: 'name', label: 'Opportunity Name' },
    { key: 'company', label: 'Company' },
    { key: 'contact', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'stage', label: 'Stage' },
    { key: 'value', label: 'Deal Value' },
    { key: 'probability', label: 'Win Probability' },
    { key: 'expectedCloseDate', label: 'Expected Close Date' },
    { key: 'assignedTo', label: 'Sales Rep' },
    { key: 'source', label: 'Source' },
    { key: 'description', label: 'Description' },
    { key: 'budget', label: 'Budget' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'createdAt', label: 'Created Date' },
    { key: 'lastActivity', label: 'Last Activity' }
  ];

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSelectAllFields = () => {
    setSelectedFields(availableFields.map(f => f.key));
  };

  const handleDeselectAllFields = () => {
    setSelectedFields([]);
  };

  const getExportData = () => {
    let dataToExport = opportunities;
    
    if (exportScope === 'selected' && selectedOpportunities.length > 0) {
      dataToExport = opportunities.filter(opp => selectedOpportunities.includes(opp.id));
    }

    return dataToExport.map(opportunity => {
      const filteredOpportunity: any = {};
      selectedFields.forEach(field => {
        filteredOpportunity[field] = opportunity[field as keyof Opportunity];
      });
      return filteredOpportunity;
    });
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = selectedFields.map(field => 
      availableFields.find(f => f.key === field)?.label || field
    ).join(',');
    
    const rows = data.map(row => 
      selectedFields.map(field => {
        const value = row[field] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const handleExport = () => {
    const exportData = getExportData();
    
    if (exportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      if (exportType === 'csv') {
        const csvContent = convertToCSV(exportData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `opportunities_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else if (exportType === 'excel') {
        const csvContent = convertToCSV(exportData);
        const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `opportunities_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
      } else if (exportType === 'pdf') {
        const htmlContent = `
          <html>
            <head><title>Opportunities Export</title></head>
            <body>
              <h1>Opportunities Export</h1>
              <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                  <tr>
                    ${selectedFields.map(field => 
                      `<th style="padding: 8px; background-color: #f0f0f0;">${availableFields.find(f => f.key === field)?.label || field}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${exportData.map(row => 
                    `<tr>
                      ${selectedFields.map(field => 
                        `<td style="padding: 8px;">${row[field] || ''}</td>`
                      ).join('')}
                    </tr>`
                  ).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `opportunities_export_${new Date().toISOString().split('T')[0]}.html`;
        link.click();
      }

      toast.success(`Successfully exported ${exportData.length} opportunities as ${exportType.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to export opportunities');
      console.error('Export error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Opportunities</span>
          </DialogTitle>
          <DialogDescription>
            Choose your export format and customize the data to include
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportType} onValueChange={(value: 'csv' | 'excel' | 'pdf') => setExportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="csv">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>CSV</span>
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Excel</span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Scope */}
          <div className="space-y-2">
            <Label>Export Scope</Label>
            <Select value={exportScope} onValueChange={(value: 'all' | 'selected' | 'filtered') => setExportScope(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Opportunities ({opportunities.length})</SelectItem>
                {selectedOpportunities.length > 0 && (
                  <SelectItem value="selected">Selected Opportunities ({selectedOpportunities.length})</SelectItem>
                )}
                <SelectItem value="filtered">Filtered Opportunities ({opportunities.length})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fields Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Fields to Export</Label>
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={handleSelectAllFields}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDeselectAllFields}>
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableFields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={selectedFields.includes(field.key)}
                    onCheckedChange={() => handleFieldToggle(field.key)}
                  />
                  <Label htmlFor={field.key} className="text-sm">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedFields.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};