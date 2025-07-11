import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, Users, Handshake, Calendar } from 'lucide-react';

const ImportExportPage = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import / Export Center</h1>
          <p className="text-gray-600 mt-1">Import and export your data across different modules</p>
        </div>
      </div>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Import Data
          </CardTitle>
          <CardDescription>
            Upload CSV files to import data into your CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Import Contacts</h3>
                <p className="text-sm text-muted-foreground">Upload contact lists</p>
                <Button size="sm" variant="outline">
                  Select File
                </Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary">
              <div className="flex flex-col items-center text-center space-y-2">
                <Handshake className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Import Deals</h3>
                <p className="text-sm text-muted-foreground">Upload deal data</p>
                <Button size="sm" variant="outline">
                  Select File
                </Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary">
              <div className="flex flex-col items-center text-center space-y-2">
                <Calendar className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Import Tasks</h3>
                <p className="text-sm text-muted-foreground">Upload task lists</p>
                <Button size="sm" variant="outline">
                  Select File
                </Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary">
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Import Other</h3>
                <p className="text-sm text-muted-foreground">Import custom data</p>
                <Button size="sm" variant="outline">
                  Select File
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download your data in CSV format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Export Contacts</h3>
                <p className="text-sm text-muted-foreground">Download all contacts</p>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-2">
                <Handshake className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Export Deals</h3>
                <p className="text-sm text-muted-foreground">Download all deals</p>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-2">
                <Calendar className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Export Tasks</h3>
                <p className="text-sm text-muted-foreground">Download all tasks</p>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Export Reports</h3>
                <p className="text-sm text-muted-foreground">Download reports</p>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

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
                <li>Files must be in CSV format</li>
                <li>Maximum file size: 10MB</li>
                <li>First row should contain column headers</li>
                <li>Date format: YYYY-MM-DD</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sample Templates:</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Contacts Template
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Deals Template
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Tasks Template
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