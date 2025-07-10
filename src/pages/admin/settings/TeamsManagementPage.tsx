
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const TeamsManagementPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teams Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Teams Management</CardTitle>
          <CardDescription>Manage teams, assign users, and configure lead distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Teams management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
