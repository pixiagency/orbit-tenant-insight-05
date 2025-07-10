
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

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score: number;
  source: string;
  assignedTo: string;
  createdDate: string;
  createdAt: string;
  lastActivity: string;
  value: number;
  notes: string;
}

interface LeadsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  selectedLeads: string[];
}

export const LeadsExportModal: React.FC<LeadsExportModalProps> = ({
  isOpen,
  onClose,
  leads,
  selectedLeads
}) => {
  const [exportType, setExportType] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [exportScope, setExportScope] = useState<'all' | 'selected' | 'filtered'>('all');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'firstName',
    'lastName',
    'email',
    'phone',
    'company',
    'title',
    'status',
    'score',
    'source',
    'assignedTo',
    'value'
  ]);

  const availableFields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'score', label: 'Score' },
    { key: 'source', label: 'Source' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'value', label: 'Value' },
    { key: 'createdDate', label: 'Created Date' },
    { key: 'lastActivity', label: 'Last Activity' },
    { key: 'notes', label: 'Notes' }
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
    let dataToExport = leads;
    
    if (exportScope === 'selected' && selectedLeads.length > 0) {
      dataToExport = leads.filter(lead => selectedLeads.includes(lead.id));
    }

    return dataToExport.map(lead => {
      const filteredLead: any = {};
      selectedFields.forEach(field => {
        filteredLead[field] = lead[field as keyof Lead];
      });
      return filteredLead;
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
        link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else if (exportType === 'excel') {
        // For Excel export, we'll use CSV format but with .xlsx extension
        const csvContent = convertToCSV(exportData);
        const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
      } else if (exportType === 'pdf') {
        // For PDF export, we'll create a simple table format
        const htmlContent = `
          <html>
            <head><title>Leads Export</title></head>
            <body>
              <h1>Leads Export</h1>
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
        link.download = `leads_export_${new Date().toISOString().split('T')[0]}.html`;
        link.click();
      }

      toast.success(`Successfully exported ${exportData.length} leads as ${exportType.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to export leads');
      console.error('Export error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Leads</span>
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
                <SelectItem value="all">All Leads ({leads.length})</SelectItem>
                {selectedLeads.length > 0 && (
                  <SelectItem value="selected">Selected Leads ({selectedLeads.length})</SelectItem>
                )}
                <SelectItem value="filtered">Filtered Leads ({leads.length})</SelectItem>
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
