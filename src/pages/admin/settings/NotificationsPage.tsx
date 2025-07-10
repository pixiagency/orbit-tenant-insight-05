
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure email, in-app, WhatsApp, and SMS notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Notification settings functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
