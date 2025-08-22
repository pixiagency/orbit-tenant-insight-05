import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Crown, Gift, Zap } from 'lucide-react';
import { SignupForm } from '@/components/auth/SignupForm';
import { OTPVerificationForm } from '@/components/auth/OTPVerificationForm';

interface RegistrationFlowProps {
  selectedPlan?: {
    id: string;
    name: string;
    price: string;
    features: string[];
  };
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ selectedPlan }) => {
  const [flowType, setFlowType] = useState<'tier-selection' | 'direct-registration' | 'registration-form' | 'otp-verification'>(
    selectedPlan ? 'registration-form' : 'tier-selection'
  );
  const [userEmail, setUserEmail] = useState('');

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$29/month',
      description: 'Perfect for small businesses',
      features: ['Up to 5 users', 'Basic CRM features', 'Email support', '10GB storage'],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$79/month',
      description: 'Best for growing teams',
      features: ['Up to 25 users', 'Advanced CRM features', 'Priority support', '100GB storage', 'API access'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199/month',
      description: 'For large organizations',
      features: ['Unlimited users', 'Custom features', '24/7 phone support', 'Unlimited storage', 'Custom integrations'],
      popular: false
    }
  ];

  const handleTierSelection = (tier: typeof pricingTiers[0]) => {
    setFlowType('registration-form');
  };

  const handleDirectRegistration = () => {
    setFlowType('registration-form');
  };

  const handleRegistrationSuccess = (email: string) => {
    setUserEmail(email);
    setFlowType('otp-verification');
  };

  const handleOTPVerified = () => {
    // Redirect to dashboard or payment page
    window.location.href = '/admin';
  };

  const handleBackFromOTP = () => {
    setFlowType('registration-form');
  };

  if (flowType === 'registration-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Registration</h1>
            {selectedPlan && (
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {selectedPlan.name} Plan Selected
                </Badge>
              </div>
            )}
          </div>
          <Card>
            <CardContent className="p-8">
              <SignupForm onSuccess={handleRegistrationSuccess} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (flowType === 'otp-verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8">
              <OTPVerificationForm
                email={userEmail}
                onVerified={handleOTPVerified}
                onBack={handleBackFromOTP}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Our CRM</h1>
            <p className="text-lg text-muted-foreground">Choose how you'd like to get started</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {flowType === 'tier-selection' && (
          <div className="space-y-12">
            {/* Registration Options */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Crown className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Choose Your Plan</CardTitle>
                  <CardDescription>
                    Browse our pricing tiers and select the perfect plan for your business needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={() => setFlowType('tier-selection')} className="w-full" size="lg">
                    View Pricing Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/70 transition-colors">
                    <Zap className="w-8 h-8 text-foreground" />
                  </div>
                  <CardTitle className="text-xl">Quick Registration</CardTitle>
                  <CardDescription>
                    Sign up directly with or without an activation code or discount code
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={handleDirectRegistration} variant="outline" className="w-full" size="lg">
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Tiers */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Plan</h2>
                <p className="text-muted-foreground">Select the perfect plan for your business</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pricingTiers.map((tier) => (
                  <Card key={tier.id} className={`relative border-2 hover:shadow-lg transition-all ${
                    tier.popular ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                  }`}>
                    {tier.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <div className="text-3xl font-bold text-primary">{tier.price}</div>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleTierSelection(tier)}
                        className="w-full"
                        variant={tier.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Special Offers Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-primary mr-2" />
                <h3 className="text-2xl font-bold text-foreground">Have a Special Code?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Got an activation code or discount code? Use our quick registration to apply it during signup.
              </p>
              <Button onClick={handleDirectRegistration} variant="outline" size="lg">
                Register with Code
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};