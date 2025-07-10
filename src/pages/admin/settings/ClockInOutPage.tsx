
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ClockInOutPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clock-In / Clock-Out</h1>
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking</CardTitle>
          <CardDescription>Configure time tracking and working hours</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Clock-in/Clock-out functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
