
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface IntentDetectionBadgeProps {
  intent: 'Serious' | 'Interested' | 'Not Interested' | 'Curious';
  confidence: number;
  className?: string;
}

export const IntentDetectionBadge: React.FC<IntentDetectionBadgeProps> = ({ 
  intent, 
  confidence, 
  className = "" 
}) => {
  const getIntentConfig = (intent: string) => {
    switch (intent) {
      case 'Serious':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: TrendingUp,
          description: 'High purchase intent detected'
        };
      case 'Interested':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: Eye,
          description: 'Showing genuine interest'
        };
      case 'Not Interested':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: TrendingDown,
          description: 'Low engagement signals'
        };
      case 'Curious':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: Target,
          description: 'Exploring options'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Target,
          description: 'Intent unclear'
        };
    }
  };

  const config = getIntentConfig(intent);
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge className={`${config.color} border flex items-center`}>
        <Icon className="h-3 w-3 mr-1" />
        {intent}
      </Badge>
      <div className="text-xs text-gray-500">
        {confidence}% confidence
      </div>
    </div>
  );
};
