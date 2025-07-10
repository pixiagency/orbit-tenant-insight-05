
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface ModernKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
  gradient?: string;
}

export const ModernKPICard: React.FC<ModernKPICardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  description,
  gradient = 'from-blue-500 to-blue-600'
}) => {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return null;
    }
  };

  const TrendIcon = change ? getTrendIcon(change.trend) : null;

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
            
            {change && (
              <div className={`flex items-center space-x-1 ${getTrendColor(change.trend)}`}>
                {TrendIcon && <TrendIcon className="h-3 w-3" />}
                <span className="text-xs font-medium">{change.value}</span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
