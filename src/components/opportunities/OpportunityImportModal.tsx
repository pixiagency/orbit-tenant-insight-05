import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface OpportunityImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (opportunities: any[]) => void;
}

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}

const fieldMappings = {
  'Opportunity Name': 'name',
  'Company': 'company',
  'Contact': 'contact',
  'Email': 'email',
  'Phone': 'phone',
  'Stage': 'stage',
  'Deal Value': 'value',
  'Win Probability': 'probability',
  'Expected Close Date': 'expectedCloseDate',
  'Sales Rep': 'assignedTo',
  'Source': 'source',
  'Description': 'description',
  'Budget': 'budget',
  'Timeline': 'timeline'
};

export const OpportunityImportModal: React.FC<OpportunityImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => {
          const fields = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              fields.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          fields.push(current.trim());
          return fields;
        }).filter(row => row.some(field => field.length > 0));

        setCsvData(rows);
        
        // Auto-map columns if possible
        if (rows.length > 0) {
          const headers = rows[0];
          const autoMappings: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            const normalizedHeader = header.toLowerCase().trim();
            if (normalizedHeader.includes('opportunity') && normalizedHeader.includes('name')) {
              autoMappings[index] = 'name';
            } else if (normalizedHeader.includes('company')) {
              autoMappings[index] = 'company';
            } else if (normalizedHeader.includes('contact')) {
              autoMappings[index] = 'contact';
            } else if (normalizedHeader.includes('email')) {
              autoMappings[index] = 'email';
            } else if (normalizedHeader.includes('phone')) {
              autoMappings[index] = 'phone';
            } else if (normalizedHeader.includes('stage')) {
              autoMappings[index] = 'stage';
            } else if (normalizedHeader.includes('value') || normalizedHeader.includes('amount')) {
              autoMappings[index] = 'value';
            } else if (normalizedHeader.includes('probability')) {
              autoMappings[index] = 'probability';
            } else if (normalizedHeader.includes('close') && normalizedHeader.includes('date')) {
              autoMappings[index] = 'expectedCloseDate';
            } else if (normalizedHeader.includes('assigned') || normalizedHeader.includes('rep')) {
              autoMappings[index] = 'assignedTo';
            } else if (normalizedHeader.includes('source')) {
              autoMappings[index] = 'source';
            } else if (normalizedHeader.includes('description')) {
              autoMappings[index] = 'description';
            } else if (normalizedHeader.includes('budget')) {
              autoMappings[index] = 'budget';
            } else if (normalizedHeader.includes('timeline')) {
              autoMappings[index] = 'timeline';
            }
          });
          
          setColumnMappings(autoMappings);
        }
        
        setStep(2);
      } catch (error) {
        toast.error('Failed to parse CSV file');
        console.error('CSV parsing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleColumnMapping = (columnIndex: string, fieldName: string) => {
    setColumnMappings(prev => ({
      ...prev,
      [columnIndex]: fieldName
    }));
  };

  const validateAndImportData = async () => {
    if (csvData.length <= 1) {
      toast.error('No data rows found in CSV');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    
    const headers = csvData[0];
    const dataRows = csvData.slice(1);
    const results: ImportResult = {
      total: dataRows.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    const importedOpportunities = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const opportunity: any = {
        id: `imported_${Date.now()}_${i}`,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString().split('T')[0]
      };

      try {
        // Map columns to opportunity fields
        Object.entries(columnMappings).forEach(([columnIndex, fieldName]) => {
          if (fieldName === 'skip') return;
          
          const value = row[parseInt(columnIndex)]?.trim();
          if (value) {
            if (fieldName === 'value' || fieldName === 'budget') {
              opportunity[fieldName] = parseFloat(value.replace(/[$,]/g, '')) || 0;
            } else if (fieldName === 'probability') {
              const prob = parseFloat(value.replace(/%/g, '')) || 0;
              opportunity[fieldName] = Math.min(100, Math.max(0, prob));
            } else if (fieldName === 'stage') {
              const validStages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
              opportunity[fieldName] = validStages.includes(value.toLowerCase()) ? value.toLowerCase() : 'prospecting';
            } else {
              opportunity[fieldName] = value;
            }
          }
        });

        // Set default values for required fields
        opportunity.name = opportunity.name || 'Untitled Opportunity';
        opportunity.company = opportunity.company || '';
        opportunity.contact = opportunity.contact || '';
        opportunity.email = opportunity.email || '';
        opportunity.phone = opportunity.phone || '';
        opportunity.stage = opportunity.stage || 'prospecting';
        opportunity.value = opportunity.value || 0;
        opportunity.probability = opportunity.probability || 0;
        opportunity.expectedCloseDate = opportunity.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        opportunity.assignedTo = opportunity.assignedTo || 'Unassigned';
        opportunity.source = opportunity.source || 'Import';
        opportunity.description = opportunity.description || '';
        opportunity.budget = opportunity.budget || 0;
        opportunity.timeline = opportunity.timeline || '';

        // Basic validation
        if (!opportunity.name || opportunity.name === 'Untitled Opportunity') {
          results.errors.push(`Row ${i + 2}: Missing opportunity name`);
          results.failed++;
        } else {
          importedOpportunities.push(opportunity);
          results.successful++;
        }

        setImportProgress(((i + 1) / dataRows.length) * 100);
      } catch (error) {
        results.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.failed++;
      }
    }

    setImportResult(results);
    setIsImporting(false);
    setStep(3);

    if (results.successful > 0) {
      onImport(importedOpportunities);
      toast.success(`Successfully imported ${results.successful} opportunities`);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Opportunity Name', 'Company', 'Contact', 'Email', 'Phone', 'Stage', 'Deal Value', 'Win Probability', 'Expected Close Date', 'Sales Rep', 'Source', 'Description', 'Budget', 'Timeline'],
      ['Enterprise CRM Implementation', 'TechCorp Inc.', 'John Smith', 'john.smith@techcorp.com', '+1-555-123-4567', 'negotiation', '125000', '75', '2024-02-15', 'Sarah Johnson', 'Website', 'Large-scale CRM implementation', '150000', '3-6 months']
    ];
    
    const csvContent = templateData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'opportunities_import_template.csv';
    link.click();
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setCsvData([]);
    setColumnMappings({});
    setImportProgress(0);
    setImportResult(null);
    setIsImporting(false);
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload a CSV file to import your opportunities. Make sure your file includes headers in the first row.
        </p>
        <Button variant="outline" onClick={downloadTemplate} className="mb-4">
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="mb-2"
        >
          <FileText className="h-4 w-4 mr-2" />
          Select CSV File
        </Button>
        {file && (
          <p className="text-sm text-gray-600">
            Selected: {file.name}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Map CSV Columns to Opportunity Fields</h4>
        <p className="text-sm text-gray-600 mb-4">
          Preview: {csvData.length - 1} data rows found
        </p>
      </div>
      
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {csvData[0]?.map((header, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-32 text-sm font-medium truncate">
              {header}
            </div>
            <Select
              value={columnMappings[index] || 'skip'}
              onValueChange={(value) => handleColumnMapping(index.toString(), value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select field..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skip">Don't import</SelectItem>
                {Object.entries(fieldMappings).map(([label, value]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      {isImporting ? (
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-blue-600 animate-pulse" />
          </div>
          <p className="font-medium mb-2">Importing opportunities...</p>
          <Progress value={importProgress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">{Math.round(importProgress)}% complete</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-medium mb-4">Import Complete</h4>
          
          {importResult && (
            <div className="space-y-3">
              <div className="flex justify-center space-x-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {importResult.successful} Successful
                </Badge>
                {importResult.failed > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    {importResult.failed} Failed
                  </Badge>
                )}
              </div>
              
              {importResult.errors.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Import Issues</span>
                  </div>
                  <div className="text-xs text-yellow-700 max-h-32 overflow-y-auto">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                    {importResult.errors.length > 5 && (
                      <div>... and {importResult.errors.length - 5} more issues</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Opportunities</DialogTitle>
          <DialogDescription>
            Step {step} of 3: {
              step === 1 ? 'Upload CSV File' : 
              step === 2 ? 'Map Columns' : 
              'Import Results'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {step === 3 ? 'Close' : 'Cancel'}
          </Button>
          {step === 1 && (
            <Button onClick={() => setStep(2)} disabled={!file}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button onClick={validateAndImportData} disabled={Object.keys(columnMappings).length === 0}>
              Import Opportunities
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};