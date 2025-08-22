import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { RegistrationFlow } from '@/components/registration/RegistrationFlow';

export const RegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');

  // Mock plan data - in real app, this would come from your pricing data
  const selectedPlan = planId ? {
    id: planId,
    name: planId.charAt(0).toUpperCase() + planId.slice(1),
    price: planId === 'starter' ? '$29/month' : planId === 'professional' ? '$79/month' : '$199/month',
    features: []
  } : undefined;

  return <RegistrationFlow selectedPlan={selectedPlan} />;
};