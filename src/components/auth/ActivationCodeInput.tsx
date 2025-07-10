import React from 'react';
import { Input } from '@/components/ui/input';
import { Check, X, AlertCircle } from 'lucide-react';

interface ActivationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isValidating?: boolean;
  isValid?: boolean;
}

export const ActivationCodeInput: React.FC<ActivationCodeInputProps> = ({
  value,
  onChange,
  error,
  isValidating,
  isValid
}) => {
  const getIcon = () => {
    if (isValidating) {
      return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
    }
    if (error) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    if (isValid && value) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id="activationCode"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Enter activation code"
          className={`h-12 text-base pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : isValid && value 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300'
          }`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getIcon()}
        </div>
      </div>
      
      <div className="space-y-2">
        {error && (
          <div className="flex items-start space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <X className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}
        
        {isValid && value && !error && (
          <div className="flex items-start space-x-2 text-xs text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
            <Check className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">✨ Valid activation code</span>
          </div>
        )}
        
        {!value && (
          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            Have an activation code? Enter it to unlock special features or discounts.
          </p>
        )}
      </div>
    </div>
  );
};
