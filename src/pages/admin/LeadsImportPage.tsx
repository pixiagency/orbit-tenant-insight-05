
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  ArrowLeft,
  FileSpreadsheet,
  Users,
  MapPin,
  RefreshCw
} from 'lucide-react';
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

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: string;
}

export const LeadsImportPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [attachmentDragActive, setAttachmentDragActive] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'complete'>('upload');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<Partial<Lead>[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [skipFirstRow, setSkipFirstRow] = useState<boolean>(true);

  const availableFields = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'title', label: 'Title', required: false },
    { key: 'status', label: 'Status', required: false },
    { key: 'score', label: 'Score', required: false },
    { key: 'source', label: 'Source', required: false },
    { key: 'assignedTo', label: 'Assigned To', required: false },
    { key: 'value', label: 'Value', required: false },
    { key: 'notes', label: 'Notes', required: false }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleAttachmentDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setAttachmentDragActive(true);
    } else if (e.type === 'dragleave') {
      setAttachmentDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleAttachmentDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAttachmentDragActive(false);
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      handleAttachmentUpload(filesArray);
    }
  }, []);

  const handleFileUpload = (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => 
        row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      setCsvData(rows.filter(row => row.some(cell => cell.length > 0)));
      setImportStep('mapping');
    };
    reader.readAsText(uploadedFile);
  };

  const handleFieldMapping = (csvColumn: string, leadField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvColumn]: leadField
    }));
  };

  const generatePreview = () => {
    const startRow = skipFirstRow ? 1 : 0;
    const preview = csvData.slice(startRow, startRow + 5).map((row, index) => {
      const lead: Partial<Lead> = {};
      Object.entries(fieldMapping).forEach(([csvCol, leadField]) => {
        const colIndex = parseInt(csvCol);
        if (row[colIndex] && leadField) {
          (lead as any)[leadField] = row[colIndex];
        }
      });
      return lead;
    });
    setPreviewData(preview);
    setImportStep('preview');
  };

  const validateData = (): ImportError[] => {
    const errors: ImportError[] = [];
    const startRow = skipFirstRow ? 1 : 0;
    
    csvData.slice(startRow).forEach((row, index) => {
      availableFields.filter(field => field.required).forEach(field => {
        const csvColIndex = Object.entries(fieldMapping).find(([_, leadField]) => leadField === field.key)?.[0];
        if (csvColIndex) {
          const value = row[parseInt(csvColIndex)];
          if (!value || value.trim() === '') {
            errors.push({
              row: index + startRow + 1,
              field: field.label,
              message: `${field.label} is required`,
              value: value || ''
            });
          }
        }
      });
      
      // Email validation
      const emailColIndex = Object.entries(fieldMapping).find(([_, leadField]) => leadField === 'email')?.[0];
      if (emailColIndex) {
        const email = row[parseInt(emailColIndex)];
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push({
            row: index + startRow + 1,
            field: 'Email',
            message: 'Invalid email format',
            value: email
          });
        }
      }
    });
    
    return errors;
  };

  const startImport = async () => {
    const errors = validateData();
    if (errors.length > 0) {
      setImportErrors(errors);
      return;
    }

    setImportStep('importing');
    setImportProgress(0);
    
    const startRow = skipFirstRow ? 1 : 0;
    const totalRows = csvData.length - startRow;
    let processed = 0;

    // Simulate import process
    for (let i = startRow; i < csvData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      processed++;
      setImportProgress((processed / totalRows) * 100);
      setImportedCount(processed);
    }

    setImportStep('complete');
    toast.success(`Successfully imported ${processed} leads!`);
  };

  const downloadTemplate = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Title', 'Status', 'Score', 'Source', 'Value', 'Notes'];
    const sampleData = [
      ['John', 'Doe', 'john.doe@example.com', '+1234567890', 'Acme Corp', 'CEO', 'new', '85', 'Website', '50000', 'Interested in our services']
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads_import_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAttachmentUpload = (files: File[] | FileList) => {
    const filesArray = Array.isArray(files) ? files : Array.from(files);
    const validFiles = filesArray.filter(file => 
      file.type.includes('image/') || 
      file.type.includes('pdf') || 
      file.type.includes('document') ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx')
    );
    
    if (validFiles.length !== filesArray.length) {
      toast.error('Some files were skipped. Only PDF, DOC, DOCX, and images are allowed.');
    }
    
    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded successfully!`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const resetImport = () => {
    setFile(null);
    setAttachments([]);
    setCsvData([]);
    setFieldMapping({});
    setPreviewData([]);
    setImportErrors([]);
    setImportProgress(0);
    setImportedCount(0);
    setImportStep('upload');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import Leads</h1>
            <p className="text-gray-600 mt-1">Upload and import your leads from CSV files</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          {importStep !== 'upload' && (
            <Button variant="outline" size="sm" onClick={resetImport}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${importStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${importStep === 'upload' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <Upload className="h-4 w-4" />
              </div>
              <span className="font-medium">Upload File</span>
            </div>
            <div className={`flex items-center space-x-2 ${importStep === 'mapping' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${importStep === 'mapping' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-medium">Map Fields</span>
            </div>
            <div className={`flex items-center space-x-2 ${importStep === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${importStep === 'preview' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-medium">Preview</span>
            </div>
            <div className={`flex items-center space-x-2 ${importStep === 'importing' || importStep === 'complete' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${importStep === 'importing' || importStep === 'complete' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <Users className="h-4 w-4" />
              </div>
              <span className="font-medium">Import</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Step */}
      {importStep === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Upload your leads data in CSV format. Make sure your file includes columns for first name, last name, and email at minimum.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </Label>
            </div>
            
            {file && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Attachments Section */}
            <div className="mt-6">
              <Label className="text-base font-medium">Supporting Documents (Optional)</Label>
              <p className="text-sm text-gray-600 mb-4">
                Upload additional files like contracts, presentations, or documents related to your leads
              </p>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  attachmentDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleAttachmentDrag}
                onDragLeave={handleAttachmentDrag}
                onDragOver={handleAttachmentDrag}
                onDrop={handleAttachmentDrop}
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drag files here or click to browse</p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAttachmentUpload(e.target.files);
                      }
                    }}
                    className="hidden"
                    id="attachment-upload"
                  />
                  <Label htmlFor="attachment-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" type="button">
                      Choose Files
                    </Button>
                  </Label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, and images up to 10MB each
                  </p>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label className="text-sm font-medium">Attached Files ({attachments.length})</Label>
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapping Step */}
      {importStep === 'mapping' && csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Map CSV Columns to Lead Fields</CardTitle>
            <CardDescription>
              Match your CSV columns with the corresponding lead fields. Required fields are marked with an asterisk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="skip-first-row"
                checked={skipFirstRow}
                onChange={(e) => setSkipFirstRow(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="skip-first-row">First row contains headers</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {csvData[0]?.map((header, index) => (
                <div key={index} className="space-y-2">
                  <Label className="font-medium">
                    CSV Column {index + 1}: "{header}"
                  </Label>
                  <Select
                    value={fieldMapping[index.toString()] || ''}
                    onValueChange={(value) => handleFieldMapping(index.toString(), value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field to map to" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="none">Don't import this column</SelectItem>
                      {availableFields.map((field) => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.label} {field.required && '*'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button onClick={generatePreview} disabled={Object.keys(fieldMapping).length === 0}>
                Continue to Preview
              </Button>
              <Button variant="outline" onClick={() => setImportStep('upload')}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {importStep === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Import Data</CardTitle>
            <CardDescription>
              Review the first few rows of your import data to ensure everything looks correct.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {importErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-800 mb-3">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Import Errors Found</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {importErrors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      Row {error.row}: {error.message} (Value: "{error.value}")
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {availableFields.filter(field => 
                      Object.values(fieldMapping).includes(field.key)
                    ).map((field) => (
                      <TableHead key={field.key}>{field.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((lead, index) => (
                    <TableRow key={index}>
                      {availableFields.filter(field => 
                        Object.values(fieldMapping).includes(field.key)
                      ).map((field) => (
                        <TableCell key={field.key}>
                          {(lead as any)[field.key] || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex space-x-3">
              <Button onClick={startImport} disabled={importErrors.length > 0}>
                {importErrors.length > 0 ? 'Fix Errors First' : 'Start Import'}
              </Button>
              <Button variant="outline" onClick={() => setImportStep('mapping')}>
                Back to Mapping
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Importing Step */}
      {importStep === 'importing' && (
        <Card>
          <CardHeader>
            <CardTitle>Importing Leads</CardTitle>
            <CardDescription>
              Please wait while we import your leads. This may take a few moments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Import Progress</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
              <div className="text-sm text-gray-600">
                Imported {importedCount} leads...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {importStep === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span>Import Complete!</span>
            </CardTitle>
            <CardDescription>
              Your leads have been successfully imported into the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Successfully imported {importedCount} leads</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={() => navigate('/admin/leads')}>
                View Imported Leads
              </Button>
              <Button variant="outline" onClick={resetImport}>
                Import More Leads
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
