
import React, { useState } from 'react';
import { Check, X, RefreshCw, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClientActivationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onApplyCode: (code: string) => void;
}

// Mock activation codes for validation
const MOCK_ACTIVATION_CODES = [
  {
    id: '1',
    code: 'BLACKFRIDAY2024',
    packageName: 'Professional Plan',
    status: 'active',
    type: 'activation',
    trialDays: 14
  },
  {
    id: '2',
    code: 'SAVE50PERCENT',
    packageName: 'Starter Plan',
    status: 'active',
    type: 'discount',
    discountPercentage: 50
  },
  {
    id: '3',
    code: 'LIFETIME50',
    packageName: 'Enterprise Plan',
    status: 'active',
    type: 'activation',
    trialDays: 30
  },
];

export const ClientActivationCodeModal: React.FC<ClientActivationCodeModalProps> = ({
  isOpen,
  onClose,
  clientName,
  onApplyCode,
}) => {
  const [code, setCode] = useState('');
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validatedCode, setValidatedCode] = useState<any>(null);
  const [error, setError] = useState('');

  const validateCode = async (codeToValidate: string) => {
    if (!codeToValidate.trim()) {
      setValidationState('idle');
      setValidatedCode(null);
      setError('');
      return;
    }

    setValidationState('validating');
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundCode = MOCK_ACTIVATION_CODES.find(
      ac => ac.code.toLowerCase() === codeToValidate.toLowerCase()
    );

    if (!foundCode) {
      setValidationState('invalid');
      setError('Invalid activation code');
      setValidatedCode(null);
      return;
    }

    if (foundCode.status !== 'active') {
      setValidationState('invalid');
      setError('Activation code is not active');
      setValidatedCode(null);
      return;
    }

    setValidationState('valid');
    setValidatedCode(foundCode);
    setError('');
  };

  const handleCodeChange = (value: string) => {
    setCode(value.toUpperCase());
    // Reset validation when code changes
    if (validationState !== 'idle') {
      setValidationState('idle');
      setValidatedCode(null);
      setError('');
    }
  };

  const handleValidate = () => {
    validateCode(code);
  };

  const handleApplyCode = () => {
    if (validationState === 'valid' && validatedCode) {
      onApplyCode(code);
      handleClose();
    }
  };

  const handleClose = () => {
    setCode('');
    setValidationState('idle');
    setValidatedCode(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Apply Activation Code
          </DialogTitle>
          <DialogDescription>
            Enter an activation code for <strong>{clientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="activationCode">Activation Code</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="activationCode"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Enter activation code"
                className="flex-1"
                disabled={validationState === 'validating'}
              />
              <Button
                variant="outline"
                onClick={handleValidate}
                disabled={!code.trim() || validationState === 'validating'}
                className="px-3"
              >
                {validationState === 'validating' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : validationState === 'valid' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : validationState === 'invalid' ? (
                  <X className="h-4 w-4 text-red-600" />
                ) : (
                  'Validate'
                )}
              </Button>
            </div>
          </div>

          {/* Validation Messages */}
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <X className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {validationState === 'valid' && validatedCode && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="space-y-1">
                  <p><strong>Valid activation code!</strong></p>
                  <p>Package: {validatedCode.packageName}</p>
                  <p>Type: {validatedCode.type === 'discount' 
                    ? `Discount (${validatedCode.discountPercentage}%)` 
                    : 'Activation Code'
                  }</p>
                  {validatedCode.trialDays && (
                    <p>Trial Period: {validatedCode.trialDays} days</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {validationState === 'validating' && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
              <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Validating activation code...
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {validationState === 'valid' ? (
            <Button onClick={handleApplyCode} className="bg-green-600 hover:bg-green-700">
              Apply Code
            </Button>
          ) : validationState === 'invalid' ? (
            <Button onClick={handleValidate} variant="outline">
              Validate Again
            </Button>
          ) : (
            <Button 
              onClick={handleValidate}
              disabled={!code.trim() || validationState === 'validating'}
            >
              {validationState === 'validating' ? 'Validating...' : 'Validate Code'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
