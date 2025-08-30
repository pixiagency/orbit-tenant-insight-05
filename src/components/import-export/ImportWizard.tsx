import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Upload, 
  Download, 
  FileText, 
  Users, 
  Handshake, 
  Calendar, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Settings,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';

type ImportStep = 'select' | 'upload' | 'mapping' | 'preview' | 'import' | 'complete';

interface ImportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  fields: string[];
  templateData: any[];
}

interface FieldMapping {
  csvField: string;
  crmField: string;
  required: boolean;
  dataType: 'text' | 'email' | 'phone' | 'date' | 'number';
}

const importOptions: ImportOption[] = [
  {
    id: 'contacts',
    name: 'Contacts',
    description: 'Import customer contacts and leads',
    icon: Users,
    fields: ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Status', 'Source'],
    templateData: [
      { 'First Name': 'John', 'Last Name': 'Doe', 'Email': 'john@example.com', 'Phone': '+1234567890', 'Company': 'Acme Corp', 'Status': 'Active', 'Source': 'Website' }
    ]
  },
  {
    id: 'deals',
    name: 'Deals',
    description: 'Import sales deals and opportunities',
    icon: Handshake,
    fields: ['Deal Name', 'Contact Email', 'Amount', 'Stage', 'Close Date', 'Priority', 'Description'],
    templateData: [
      { 'Deal Name': 'Enterprise Software License', 'Contact Email': 'john@example.com', 'Amount': '50000', 'Stage': 'Proposal', 'Close Date': '2024-12-31', 'Priority': 'High', 'Description': 'Annual software license deal' }
    ]
  },
  {
    id: 'leads',
    name: 'Leads',
    description: 'Import potential customers and prospects',
    icon: Target,
    fields: ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Lead Source', 'Score', 'Notes'],
    templateData: [
      { 'First Name': 'Jane', 'Last Name': 'Smith', 'Email': 'jane@example.com', 'Phone': '+1987654321', 'Company': 'Tech Startup', 'Lead Source': 'LinkedIn', 'Score': '85', 'Notes': 'Interested in premium package' }
    ]
  },
  {
    id: 'tasks',
    name: 'Tasks',
    description: 'Import tasks and activities',
    icon: Calendar,
    fields: ['Task Name', 'Assignee Email', 'Due Date', 'Priority', 'Status', 'Description'],
    templateData: [
      { 'Task Name': 'Follow up call', 'Assignee Email': 'agent@company.com', 'Due Date': '2024-12-25', 'Priority': 'Medium', 'Status': 'Pending', 'Description': 'Follow up on the proposal sent last week' }
    ]
  }
];

interface ImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('select');
  const [selectedType, setSelectedType] = useState<ImportOption | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [importSettings, setImportSettings] = useState({
    duplicateHandling: 'skip',
    defaultOwner: 'current',
    dateFormat: 'yyyy-mm-dd'
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);

  const steps = [
    { id: 'select', title: 'Select Type', description: 'Choose what to import' },
    { id: 'upload', title: 'Upload File', description: 'Upload your data file' },
    { id: 'mapping', title: 'Field Mapping', description: 'Map your fields' },
    { id: 'preview', title: 'Preview', description: 'Review your data' },
    { id: 'import', title: 'Import', description: 'Import your data' },
    { id: 'complete', title: 'Complete', description: 'Import finished' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);

  const handleTypeSelect = (option: ImportOption) => {
    setSelectedType(option);
    setCurrentStep('upload');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    
    // Simulate CSV parsing
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      setCsvHeaders(headers);
      setCsvData(data);
      
      // Initialize field mappings
      const mappings: FieldMapping[] = selectedType!.fields.map(field => ({
        csvField: headers.find(h => h.toLowerCase().includes(field.toLowerCase().split(' ')[0])) || '',
        crmField: field,
        required: ['First Name', 'Last Name', 'Email', 'Deal Name', 'Task Name'].includes(field),
        dataType: field.toLowerCase().includes('email') ? 'email' : 
                 field.toLowerCase().includes('phone') ? 'phone' :
                 field.toLowerCase().includes('date') ? 'date' :
                 field.toLowerCase().includes('amount') || field.toLowerCase().includes('score') ? 'number' : 'text'
      }));
      
      setFieldMappings(mappings);
      setCurrentStep('mapping');
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    if (!selectedType) return;
    
    const csvContent = [
      selectedType.fields.join(','),
      ...selectedType.templateData.map(row => 
        selectedType.fields.map(field => row[field] || '').join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedType.name.toLowerCase()}_template.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`${selectedType.name} template downloaded`);
  };

  const handleMappingChange = (index: number, csvField: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index].csvField = csvField;
    setFieldMappings(newMappings);
  };

  const generatePreview = () => {
    const preview = csvData.slice(0, 5).map(row => {
      const mappedRow: any = {};
      fieldMappings.forEach(mapping => {
        if (mapping.csvField) {
          mappedRow[mapping.crmField] = row[mapping.csvField];
        }
      });
      return mappedRow;
    });
    setPreviewData(preview);
    setCurrentStep('preview');
  };

  const startImport = () => {
    setCurrentStep('import');
    setImportProgress(0);
    
    // Simulate import process
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImportResults({
            total: csvData.length,
            success: csvData.length - 2,
            errors: 2,
            warnings: 3
          });
          setCurrentStep('complete');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const resetWizard = () => {
    setCurrentStep('select');
    setSelectedType(null);
    setUploadedFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setFieldMappings([]);
    setPreviewData([]);
    setImportProgress(0);
    setImportResults(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Import Wizard</h2>
              <p className="text-muted-foreground">Follow the steps to import your data</p>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    index <= getCurrentStepIndex() 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {index < getCurrentStepIndex() ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(getCurrentStepIndex() / (steps.length - 1)) * 100} className="mt-4" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentStep === 'select' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What would you like to import?</h3>
                <p className="text-muted-foreground">Choose the type of data you want to import into your CRM</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {importOptions.map((option) => (
                  <Card 
                    key={option.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                    onClick={() => handleTypeSelect(option)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <option.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{option.name}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          <div className="mt-2">
                            <Badge variant="secondary">{option.fields.length} fields</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'upload' && selectedType && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload {selectedType.name} Data</h3>
                <p className="text-muted-foreground">Upload your CSV or Excel file, or download our template to get started</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload File
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload">
                        <Button variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>
                    
                    {uploadedFile && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          File uploaded: {uploadedFile.name} ({csvData.length} rows)
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Template Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Download className="h-5 w-5 mr-2" />
                      Download Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Download our template to ensure your data is formatted correctly
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Required Fields:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedType.fields.map(field => (
                          <Badge 
                            key={field} 
                            variant={['First Name', 'Last Name', 'Email', 'Deal Name', 'Task Name'].includes(field) ? 'default' : 'secondary'}
                          >
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button onClick={downloadTemplate} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'mapping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Map Your Fields</h3>
                <p className="text-muted-foreground">Match your CSV columns to CRM fields</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CRM Field</TableHead>
                        <TableHead>Your CSV Column</TableHead>
                        <TableHead>Data Type</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Preview</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fieldMappings.map((mapping, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {mapping.crmField}
                            {mapping.required && <span className="text-red-500 ml-1">*</span>}
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={mapping.csvField} 
                              onValueChange={(value) => handleMappingChange(index, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select column" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">-- Skip Field --</SelectItem>
                                {csvHeaders.map(header => (
                                  <SelectItem key={header} value={header}>{header}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{mapping.dataType}</Badge>
                          </TableCell>
                          <TableCell>
                            {mapping.required ? (
                              <Badge variant="destructive">Required</Badge>
                            ) : (
                              <Badge variant="secondary">Optional</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {mapping.csvField && csvData[0] && (
                              <span className="text-sm text-muted-foreground">
                                {csvData[0][mapping.csvField] || 'N/A'}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Preview Your Data</h3>
                <p className="text-muted-foreground">Review the first 5 rows before importing</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fieldMappings.filter(m => m.csvField).map(mapping => (
                          <TableHead key={mapping.crmField}>{mapping.crmField}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <TableRow key={index}>
                          {fieldMappings.filter(m => m.csvField).map(mapping => (
                            <TableCell key={mapping.crmField}>
                              {row[mapping.crmField] || 'N/A'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Import Summary</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Ready to import {csvData.length} records with {fieldMappings.filter(m => m.csvField).length} mapped fields
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'import' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Importing Your Data</h3>
                <p className="text-muted-foreground">Please wait while we process your data</p>
              </div>

              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <Progress value={importProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {importProgress}% complete - Processing {csvData.length} records
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'complete' && importResults && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Import Complete!</h3>
                <p className="text-muted-foreground">Your data has been successfully imported</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                      <div className="text-sm text-muted-foreground">Successfully Imported</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{importResults.warnings}</div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                      <div className="text-sm text-muted-foreground">Total Records</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                if (currentStep === 'upload') setCurrentStep('select');
                else if (currentStep === 'mapping') setCurrentStep('upload');
                else if (currentStep === 'preview') setCurrentStep('mapping');
                else if (currentStep === 'complete') resetWizard();
              }}
              disabled={currentStep === 'select' || currentStep === 'import'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 'complete' ? 'Start New Import' : 'Back'}
            </Button>

            <div className="space-x-2">
              {currentStep === 'complete' ? (
                <Button onClick={onClose}>
                  Close
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    if (currentStep === 'mapping') generatePreview();
                    else if (currentStep === 'preview') startImport();
                  }}
                  disabled={
                    (currentStep === 'upload' && !uploadedFile) ||
                    (currentStep === 'mapping' && fieldMappings.filter(m => m.required && !m.csvField).length > 0) ||
                    currentStep === 'import'
                  }
                >
                  {currentStep === 'mapping' && 'Continue to Preview'}
                  {currentStep === 'preview' && 'Start Import'}
                  {currentStep !== 'mapping' && currentStep !== 'preview' && 'Continue'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};