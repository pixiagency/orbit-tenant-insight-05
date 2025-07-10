
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PipelinesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pipelines & Stages</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Management</CardTitle>
          <CardDescription>Define pipelines and stages for deals and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Pipeline management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
