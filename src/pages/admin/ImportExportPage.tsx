import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, Users, Handshake, Calendar, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ImportExportPage = () => {
  const [importProgress, setImportProgress] = useState<{[key: string]: number}>({});
  const [activeImports, setActiveImports] = useState<string[]>([]);
  const [importResults, setImportResults] = useState<{[key: string]: any}>({});

  const handleFileUpload = (type: string, file: File) => {
    setActiveImports(prev => [...prev, type]);
    setImportProgress(prev => ({ ...prev, [type]: 0 }));
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        const currentProgress = prev[type] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setActiveImports(prev => prev.filter(t => t !== type));
          setImportResults(prev => ({
            ...prev,
            [type]: {
              success: Math.floor(Math.random() * 50) + 40,
              errors: Math.floor(Math.random() * 5),
              warnings: Math.floor(Math.random() * 10)
            }
          }));
          toast.success(`${type} import completed successfully!`);
          return { ...prev, [type]: 100 };
        }
        return { ...prev, [type]: currentProgress + 10 };
      });
    }, 500);
  };

  const handleExport = (type: string, format: 'csv' | 'xlsx' | 'pdf' = 'csv') => {
    toast.success(`Exporting ${type} data as ${format.toUpperCase()}...`);
    
    // Simulate file download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      toast.success(`${type} export completed!`);
    }, 1000);
  };

  const ImportCard = ({ type, icon: Icon, title, description }: {
    type: string;
    icon: React.ComponentType<any>;
    title: string;
    description: string;
  }) => (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary">
      <div className="flex flex-col items-center text-center space-y-2">
        <Icon className="h-8 w-8 text-primary" />
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        {activeImports.includes(type) ? (
          <div className="w-full space-y-2">
            <Progress value={importProgress[type] || 0} className="w-full" />
            <span className="text-xs text-muted-foreground">
              {importProgress[type] || 0}% imported
            </span>
          </div>
        ) : (
          <div className="w-full">
            <Input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(type, file);
              }}
              className="hidden"
              id={`file-${type}`}
            />
            <Label htmlFor={`file-${type}`} className="cursor-pointer">
              <Button size="sm" variant="outline" className="w-full" asChild>
                <span>Select File</span>
              </Button>
            </Label>
          </div>
        )}
        
        {importResults[type] && (
          <Alert className="w-full">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {importResults[type].success} imported, {importResults[type].errors} errors, {importResults[type].warnings} warnings
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );

  const ExportCard = ({ type, icon: Icon, title, description }: {
    type: string;
    icon: React.ComponentType<any>;
    title: string;
    description: string;
  }) => (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-col items-center text-center space-y-2">
        <Icon className="h-8 w-8 text-primary" />
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex space-x-1 w-full">
          <Button size="sm" className="bg-primary hover:bg-primary/90 flex-1" onClick={() => handleExport(type, 'csv')}>
            <Download className="h-3 w-3 mr-1" />
            CSV
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleExport(type, 'xlsx')}>
            <Download className="h-3 w-3 mr-1" />
            Excel
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import / Export Center</h1>
          <p className="text-gray-600 mt-1">Import and export your data across different modules</p>
        </div>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {/* Import Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Import Data
              </CardTitle>
              <CardDescription>
                Upload CSV or Excel files to import data into your CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ImportCard 
                  type="contacts" 
                  icon={Users} 
                  title="Import Contacts" 
                  description="Upload contact lists and customer data"
                />
                <ImportCard 
                  type="deals" 
                  icon={Handshake} 
                  title="Import Deals" 
                  description="Upload deal and opportunity data"
                />
                <ImportCard 
                  type="tasks" 
                  icon={Calendar} 
                  title="Import Tasks" 
                  description="Upload task lists and activities"
                />
                <ImportCard 
                  type="leads" 
                  icon={Users} 
                  title="Import Leads" 
                  description="Upload lead data and prospects"
                />
                <ImportCard 
                  type="products" 
                  icon={FileText} 
                  title="Import Products" 
                  description="Upload product catalogs"
                />
                <ImportCard 
                  type="custom" 
                  icon={FileText} 
                  title="Custom Import" 
                  description="Import other data types"
                />
              </div>
            </CardContent>
          </Card>

          {/* Import Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Import Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Duplicate Handling</Label>
                  <Select defaultValue="skip">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Skip duplicates</SelectItem>
                      <SelectItem value="update">Update existing</SelectItem>
                      <SelectItem value="create">Create new</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Owner</Label>
                  <Select defaultValue="current">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current user</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="roundrobin">Round robin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="yyyy-mm-dd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          {/* Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download your data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ExportCard 
                  type="contacts" 
                  icon={Users} 
                  title="Export Contacts" 
                  description="Download all contact data"
                />
                <ExportCard 
                  type="deals" 
                  icon={Handshake} 
                  title="Export Deals" 
                  description="Download all deal data"
                />
                <ExportCard 
                  type="tasks" 
                  icon={Calendar} 
                  title="Export Tasks" 
                  description="Download all task data"
                />
                <ExportCard 
                  type="leads" 
                  icon={Users} 
                  title="Export Leads" 
                  description="Download all lead data"
                />
                <ExportCard 
                  type="reports" 
                  icon={BarChart3} 
                  title="Export Reports" 
                  description="Download analysis reports"
                />
                <ExportCard 
                  type="analytics" 
                  icon={BarChart3} 
                  title="Export Analytics" 
                  description="Download performance metrics"
                />
              </div>
            </CardContent>
          </Card>

          {/* Export Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Export Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="quarter">This quarter</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status Filter</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active only</SelectItem>
                      <SelectItem value="inactive">Inactive only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Owner Filter</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All owners</SelectItem>
                      <SelectItem value="mine">My records only</SelectItem>
                      <SelectItem value="team">My team only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* History Section */}
          <Card>
            <CardHeader>
              <CardTitle>Import/Export History</CardTitle>
              <CardDescription>
                View your recent import and export activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'Import', module: 'Contacts', status: 'Completed', records: 150, date: '2024-01-20 10:30', user: 'Sarah Johnson' },
                  { type: 'Export', module: 'Deals', status: 'Completed', records: 89, date: '2024-01-19 14:20', user: 'Mike Chen' },
                  { type: 'Import', module: 'Tasks', status: 'Failed', records: 0, date: '2024-01-18 09:15', user: 'Emily Rodriguez' },
                  { type: 'Export', module: 'Reports', status: 'In Progress', records: 0, date: '2024-01-18 16:45', user: 'David Brown' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'Import' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type === 'Import' ? <Upload className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.type} {item.module}</p>
                        <p className="text-sm text-muted-foreground">{item.user} • {item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {item.records > 0 ? `${item.records} records` : ''}
                        </p>
                        <div className="flex items-center space-x-1">
                          {item.status === 'Completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {item.status === 'Failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {item.status === 'In Progress' && <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                          <span className={`text-sm ${
                            item.status === 'Completed' ? 'text-green-600' :
                            item.status === 'Failed' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">File Format Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Files must be in CSV or Excel format (.csv, .xlsx)</li>
                <li>Maximum file size: 50MB</li>
                <li>First row should contain column headers</li>
                <li>Date format: YYYY-MM-DD or MM-DD-YYYY</li>
                <li>Encoding: UTF-8 (recommended)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sample Templates:</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('contacts_template', 'csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Contacts Template
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('deals_template', 'csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Deals Template
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('tasks_template', 'csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Tasks Template
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('leads_template', 'csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Leads Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExportPage;