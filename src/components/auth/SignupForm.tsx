import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, AlertCircle, Mail, User, Globe, Key } from 'lucide-react';
import { toast } from 'sonner';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { ActivationCodeInput } from './ActivationCodeInput';

interface SignupFormProps {
  onSuccess: (email: string) => void;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  subdomain: string;
  activationCode: string;
  agreeToTerms: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    subdomain: '',
    activationCode: '',
    agreeToTerms: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [subdomainError, setSubdomainError] = useState('');
  const [isSubdomainValid, setIsSubdomainValid] = useState(false);
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [activationCodeError, setActivationCodeError] = useState('');
  const [isActivationCodeValid, setIsActivationCodeValid] = useState(false);
  const [isValidatingActivationCode, setIsValidatingActivationCode] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'subdomain' && typeof value === 'string') {
      validateSubdomain(value);
    }

    if (field === 'activationCode' && typeof value === 'string') {
      validateActivationCode(value);
    }
  };

  const validateActivationCode = async (code: string) => {
    setActivationCodeError('');
    setIsActivationCodeValid(false);
    
    if (!code.trim()) {
      setIsValidatingActivationCode(false);
      return;
    }

    setIsValidatingActivationCode(true);

    // Basic format validation
    if (!/^[A-Z0-9-]+$/.test(code)) {
      setActivationCodeError('Activation code can only contain letters, numbers, and hyphens');
      setIsValidatingActivationCode(false);
      return;
    }

    if (code.length < 6) {
      setActivationCodeError('Activation code must be at least 6 characters');
      setIsValidatingActivationCode(false);
      return;
    }

    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation - some codes are invalid
    const invalidCodes = ['INVALID', 'EXPIRED', 'USED123'];
    if (invalidCodes.includes(code)) {
      setActivationCodeError('This activation code is invalid or has expired');
      setIsValidatingActivationCode(false);
      return;
    }

    setIsActivationCodeValid(true);
    setIsValidatingActivationCode(false);
  };

  const validateSubdomain = async (subdomain: string): Promise<boolean> => {
    setSubdomainError('');
    setIsSubdomainValid(false);
    setIsCheckingSubdomain(true);

    if (!subdomain.trim()) {
      setSubdomainError('Subdomain is required');
      setIsCheckingSubdomain(false);
      return false;
    }

    if (subdomain.length < 3) {
      setSubdomainError('Subdomain must be at least 3 characters');
      setIsCheckingSubdomain(false);
      return false;
    }

    if (subdomain.length > 30) {
      setSubdomainError('Subdomain must be less than 30 characters');
      setIsCheckingSubdomain(false);
      return false;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) {
      setSubdomainError('Subdomain can only contain letters, numbers, and hyphens');
      setIsCheckingSubdomain(false);
      return false;
    }

    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
      setSubdomainError('Subdomain cannot start or end with a hyphen');
      setIsCheckingSubdomain(false);
      return false;
    }

    if (subdomain.includes('--')) {
      setSubdomainError('Subdomain cannot contain consecutive hyphens');
      setIsCheckingSubdomain(false);
      return false;
    }

    const reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'support', 'help', 'docs'];
    if (reserved.includes(subdomain.toLowerCase())) {
      setSubdomainError('This subdomain is reserved');
      setIsCheckingSubdomain(false);
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const unavailableSubdomains = ['test', 'demo', 'sample', 'example'];
    if (unavailableSubdomains.includes(subdomain.toLowerCase())) {
      setSubdomainError('This subdomain is already taken');
      setIsCheckingSubdomain(false);
      return false;
    }

    setIsSubdomainValid(true);
    setIsCheckingSubdomain(false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }

    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email address is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isSubdomainValid) {
      toast.error('Please choose a valid subdomain');
      return;
    }

    if (formData.activationCode && !isActivationCodeValid) {
      toast.error('Please enter a valid activation code or leave it empty');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Account created successfully! Please check your email for verification code.');
      onSuccess(formData.email);
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubdomainIcon = () => {
    if (isCheckingSubdomain) {
      return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
    }
    if (subdomainError) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    if (isSubdomainValid && formData.subdomain) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
                required
                className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Doe"
                required
                className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@company.com"
              required
              className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Subdomain Field */}
          <div className="space-y-2">
            <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Subdomain
            </Label>
            <div className="flex rounded-lg shadow-sm">
              <div className="relative flex-1">
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                  placeholder="yourcompany"
                  required
                  className={`h-12 text-base rounded-r-none border-r-0 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    subdomainError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : isSubdomainValid && formData.subdomain 
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {getSubdomainIcon()}
                </div>
              </div>
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-medium">
                .crm.com
              </span>
            </div>
            
            <div className="space-y-2">
              {subdomainError && (
                <div className="flex items-start space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <X className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{subdomainError}</span>
                </div>
              )}
              
              {isSubdomainValid && formData.subdomain && !subdomainError && (
                <div className="flex items-start space-x-2 text-xs text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  <Check className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">✨ Great choice! "{formData.subdomain}.crm.com" is available</span>
                </div>
              )}
              
              {isCheckingSubdomain && (
                <div className="flex items-start space-x-2 text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Checking availability...</span>
                </div>
              )}
              
              {!subdomainError && !isSubdomainValid && !isCheckingSubdomain && formData.subdomain.length > 0 && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  Your CRM will be available at: <span className="font-medium">{formData.subdomain}.crm.com</span>
                </p>
              )}
              
              {formData.subdomain.length === 0 && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  Choose a unique subdomain for your CRM instance
                </p>
              )}
            </div>
          </div>

          {/* Activation Code */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Activation Code <span className="text-gray-400 font-normal">(Optional)</span>
            </Label>
            <ActivationCodeInput
              value={formData.activationCode}
              onChange={(value) => handleInputChange('activationCode', value)}
              error={activationCodeError}
              isValidating={isValidatingActivationCode}
              isValid={isActivationCodeValid}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                >
                  Privacy Policy
                </button>
              </Label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
            disabled={isLoading || !isSubdomainValid || isCheckingSubdomain || (formData.activationCode && !isActivationCodeValid)}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              📧 You'll receive a verification code via email after signup
            </p>
          </div>
        </div>
      </form>

      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
};
