
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface ChartPlaceholderProps {
  title: string;
  height?: string;
  description?: string;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ 
  title, 
  height = "300px", 
  description 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div 
          className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
          style={{ height }}
        >
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Chart visualization will be here</p>
            <p className="text-xs text-gray-400 mt-1">Connected to live data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
