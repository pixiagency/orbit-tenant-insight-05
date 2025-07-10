
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ReportingAIPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reporting & AI Insights</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Analytics</CardTitle>
          <CardDescription>Configure AI features, reporting, and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Reporting and AI functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
