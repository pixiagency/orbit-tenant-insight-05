
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface OTPVerificationFormProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    // Auto-verify when OTP is complete (6 digits)
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification logic
      if (otp === '123456' || otp === '000000') {
        toast.success('Email verified successfully!');
        onVerified();
      } else {
        toast.error('Invalid verification code. Please try again.');
        setOtp('');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Verification code sent again!');
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="otp" className="text-sm font-medium text-gray-700 block text-center">
            Enter verification code
          </Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="123456"
            className="mt-2 h-14 text-center text-2xl font-mono tracking-widest"
            maxLength={6}
            disabled={isLoading}
            autoComplete="one-time-code"
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            {6 - otp.length} digits remaining
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Verifying...</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={!canResend || isLoading}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>
              {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </span>
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            For demo: use <span className="font-mono bg-gray-100 px-1 rounded">123456</span> or <span className="font-mono bg-gray-100 px-1 rounded">000000</span>
          </p>
        </div>
      </div>
    </div>
  );
};
