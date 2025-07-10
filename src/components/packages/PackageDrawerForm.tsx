import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, Users, DollarSign, Settings, Clock, Shield, Bot, Phone, Link } from 'lucide-react';
import { DrawerForm } from '../layout/DrawerForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PackageFormData, AVAILABLE_MODULES } from '../../types/packages';

interface PackageDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PackageFormData) => void;
  package?: any;
  cloningPackage?: any;
  isLoading?: boolean;
}

export const PackageDrawerForm: React.FC<PackageDrawerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  package: packageData,
  cloningPackage,
  isLoading = false,
}) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [aiFeatures, setAiFeatures] = useState<string[]>([]);
  const [voiceCallsEnabled, setVoiceCallsEnabled] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [integrationsEnabled, setIntegrationsEnabled] = useState(false);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const form = useForm<PackageFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      duration: 1,
      durationUnit: 'months' as 'days' | 'months' | 'years' | 'lifetime',
      maxUsers: 1,
      maxStorageGB: 5,
      maxContacts: 1000,
      maxLeads: 500,
      modules: [],
      aiEnabled: false,
      aiFeatures: [],
      integrationsEnabled: false,
      selectedIntegrations: [],
      isPublic: true,
      status: 'active',
      notificationsEnabled: false,
      refund_period: 30,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;
  const durationUnit = watch('durationUnit');

  useEffect(() => {
    const dataToUse = cloningPackage || packageData;
    if (dataToUse) {
      const hasVoiceCalls = dataToUse.modules?.includes('voice') || false;
      const hasAi = dataToUse.modules?.includes('ai') || false;
      const hasIntegrations = dataToUse.modules?.includes('integrations') || false;
      const hasWhatsapp = dataToUse.modules?.includes('whatsapp') || false;
      const hasEmail = dataToUse.modules?.includes('email') || false;
      const hasSms = dataToUse.modules?.includes('sms') || false;
      
      const formData: PackageFormData = {
        name: cloningPackage ? `${dataToUse.name} (Copy)` : dataToUse.name || '',
        description: dataToUse.description || '',
        price: dataToUse.pricing?.amount || 0,
        currency: 'USD', // Always USD now
        duration: dataToUse.pricing?.duration || 1,
        durationUnit: (dataToUse.pricing?.durationUnit as 'days' | 'months' | 'years' | 'lifetime') || 'months',
        maxUsers: dataToUse.limits?.maxUsers || 1,
        maxStorageGB: dataToUse.limits?.maxStorageGB || 5,
        maxContacts: dataToUse.limits?.maxContacts || 1000,
        maxLeads: dataToUse.limits?.maxLeads || 500,
        modules: dataToUse.modules?.filter((m: string) => !['whatsapp', 'email', 'sms', 'voice', 'ai', 'integrations'].includes(m)) || [],
        aiEnabled: hasAi,
        aiFeatures: dataToUse.aiOptions?.features || [],
        integrationsEnabled: hasIntegrations,
        selectedIntegrations: dataToUse.integrationOptions?.platforms || [],
        smsSendingLimit: dataToUse.limits?.smsSendingLimit,
        monthlyWhatsAppMessages: dataToUse.limits?.monthlyWhatsAppMessages,
        monthlyEmailMessages: dataToUse.limits?.monthlyEmailMessages,
        monthlyCallMinutes: dataToUse.limits?.monthlyCallMinutes,
        monthlyAiAutomations: dataToUse.limits?.monthlyAiAutomations,
        monthlySmartRecommendations: dataToUse.limits?.monthlySmartRecommendations,
        monthlyAiAssistantQueries: dataToUse.limits?.monthlyAiAssistantQueries,
        isPublic: dataToUse.isPublic ?? true,
        status: dataToUse.status || 'active',
        notificationsEnabled: false, // Default to false since we removed notifications module
        refund_period: dataToUse.refund_period || 30,
      };
      
      reset(formData);
      setSelectedModules(formData.modules);
      setAiFeatures(formData.aiFeatures);
      setVoiceCallsEnabled(hasVoiceCalls);
      setAiEnabled(hasAi);
      setIntegrationsEnabled(hasIntegrations);
      setSelectedIntegrations(formData.selectedIntegrations);
      setWhatsappEnabled(hasWhatsapp);
      setEmailEnabled(hasEmail);
      setSmsEnabled(hasSms);
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        currency: 'USD',
        duration: 1,
        durationUnit: 'months' as const,
        maxUsers: 1,
        maxStorageGB: 5,
        maxContacts: 1000,
        maxLeads: 500,
        modules: [],
        aiEnabled: false,
        aiFeatures: [],
        integrationsEnabled: false,
        selectedIntegrations: [],
        isPublic: true,
        status: 'active',
        notificationsEnabled: false,
        refund_period: 30,
      });
      setSelectedModules([]);
      setAiFeatures([]);
      setVoiceCallsEnabled(false);
      setAiEnabled(false);
      setIntegrationsEnabled(false);
      setSelectedIntegrations([]);
      setWhatsappEnabled(false);
      setEmailEnabled(false);
      setSmsEnabled(false);
    }
  }, [packageData, cloningPackage, reset]);

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => {
      const newModules = prev.includes(moduleId) 
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId];
      setValue('modules', newModules);
      return newModules;
    });
  };

  const handleVoiceCallsToggle = (enabled: boolean) => {
    setVoiceCallsEnabled(enabled);
  };

  const handleAiToggle = (enabled: boolean) => {
    setAiEnabled(enabled);
    setValue('aiEnabled', enabled);
    if (!enabled) {
      setAiFeatures([]);
      setValue('aiFeatures', []);
    }
  };

  const handleAiFeatureToggle = (feature: string) => {
    setAiFeatures(prev => {
      const newFeatures = prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature];
      setValue('aiFeatures', newFeatures);
      return newFeatures;
    });
  };

  const handleIntegrationsToggle = (enabled: boolean) => {
    setIntegrationsEnabled(enabled);
    setValue('integrationsEnabled', enabled);
    if (!enabled) {
      setSelectedIntegrations([]);
      setValue('selectedIntegrations', []);
      setWhatsappEnabled(false);
      setEmailEnabled(false);
      setSmsEnabled(false);
    }
  };

  const handleIntegrationToggle = (integration: string) => {
    setSelectedIntegrations(prev => {
      const newIntegrations = prev.includes(integration) 
        ? prev.filter(i => i !== integration)
        : [...prev, integration];
      setValue('selectedIntegrations', newIntegrations);
      return newIntegrations;
    });
  };

  const handleWhatsappToggle = (enabled: boolean) => {
    setWhatsappEnabled(enabled);
    if (enabled) {
      setSelectedIntegrations(prev => {
        const newIntegrations = prev.includes('whatsapp') ? prev : [...prev, 'whatsapp'];
        setValue('selectedIntegrations', newIntegrations);
        return newIntegrations;
      });
    } else {
      setSelectedIntegrations(prev => {
        const newIntegrations = prev.filter(i => i !== 'whatsapp');
        setValue('selectedIntegrations', newIntegrations);
        return newIntegrations;
      });
    }
  };

  const handleEmailToggle = (enabled: boolean) => {
    setEmailEnabled(enabled);
    if (enabled) {
      setSelectedIntegrations(prev => {
        const newIntegrations = prev.includes('email') ? prev : [...prev, 'email'];
        setValue('selectedIntegrations', newIntegrations);
        return newIntegrations;
      });
    } else {
      setSelectedIntegrations(prev => {
        const newIntegrations = prev.filter(i => i !== 'email');
        setValue('selectedIntegrations', newIntegrations);
        return newIntegrations;
      });
    }
  };

  const handleSmsToggle = (enabled: boolean) => {
    setSmsEnabled(enabled);
    if (enabled) {
      setSelectedIntegrations(prev => {
        const newIntegrations = prev.includes('sms') ? prev : [...prev, 'sms'];
        setValue('selectedIntegrations', newIntegrations);
        return newIntegrations;
      });
    } else {
      setSelectedIntegrations(prev => {
        const newIntegrations = prev.filter(i => i !== 'sms');
        setValue('selectedIntegrations', newIntegrations);
        return newIntegrations;
      });
    }
  };

  const onSubmit = (data: PackageFormData) => {
    // Combine regular modules with special modules
    let finalModules = [...selectedModules];
    if (voiceCallsEnabled) {
      finalModules = [...finalModules, 'voice'];
    }
    if (aiEnabled) {
      finalModules = [...finalModules, 'ai'];
    }
    if (integrationsEnabled) {
      finalModules = [...finalModules, 'integrations'];
    }
    if (whatsappEnabled) {
      finalModules = [...finalModules, 'whatsapp'];
    }
    if (emailEnabled) {
      finalModules = [...finalModules, 'email'];
    }
    if (smsEnabled) {
      finalModules = [...finalModules, 'sms'];
    }

    onSave({
      ...data,
      modules: finalModules,
      aiFeatures: aiEnabled ? aiFeatures : [],
      selectedIntegrations: integrationsEnabled ? selectedIntegrations : [],
    });
  };

  const maxUsers = watch('maxUsers');

  // Filter out special modules from regular modules display
  const regularModules = AVAILABLE_MODULES.filter(module => !['whatsapp', 'email', 'sms', 'voice', 'ai', 'integrations'].includes(module.id));

  return (
    <DrawerForm
      isOpen={isOpen}
      onClose={onClose}
      title={cloningPackage ? 'Clone Package' : packageData ? 'Edit Package' : 'Create New Package'}
      description={cloningPackage ? 'Create a copy of the selected package' : packageData ? 'Update package details and features' : 'Set up a new subscription package'}
      onSave={handleSubmit(onSubmit)}
      isLoading={isLoading}
      saveText={cloningPackage ? 'Clone Package' : packageData ? 'Update Package' : 'Create Package'}
    >
      <form className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Package className="inline h-4 w-4 mr-2" />
            Basic Information
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Package Name *</Label>
              <Input
                {...register('name', { required: 'Package name is required' })}
                placeholder="e.g., Professional Plan"
                className="mt-1"
              />
              {errors.name && (
                <span className="text-sm text-red-600">{errors.name.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Package description..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing Configuration */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <DollarSign className="inline h-4 w-4 mr-2" />
            Pricing (USD)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Price (USD)</Label>
              <Input
                {...register('price', { valueAsNumber: true, min: 0 })}
                type="number"
                min="0"
                step="0.01"
                placeholder="29.99"
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationUnit" className="text-sm font-medium">Duration Unit</Label>
              <Select
                onValueChange={(value) => setValue('durationUnit', value as 'days' | 'months' | 'years' | 'lifetime')}
                defaultValue={durationUnit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(durationUnit as string) !== 'lifetime' && (
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
                <Input
                  {...register('duration', { valueAsNumber: true, min: 1 })}
                  type="number"
                  min="1"
                  placeholder="1"
                  className="mt-1"
                  disabled={(durationUnit as string) === 'lifetime'}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="refund_period" className="text-sm font-medium">Refund Period (Days)</Label>
              <Input
                {...register('refund_period', { valueAsNumber: true, min: 0 })}
                type="number"
                min="0"
                placeholder="30"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Usage Limits */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Users className="inline h-4 w-4 mr-2" />
            Usage Limits
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers" className="text-sm font-medium">Max Users</Label>
              <Input
                {...register('maxUsers', { valueAsNumber: true, min: 1 })}
                type="number"
                min="1"
                placeholder="10"
                className="mt-1"
                disabled={maxUsers === -1}
              />
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id="unlimitedUsers"
                  checked={maxUsers === -1}
                  onCheckedChange={(checked) => setValue('maxUsers', checked ? -1 : 1)}
                />
                <Label htmlFor="unlimitedUsers" className="text-xs">Unlimited Users</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxContacts" className="text-sm font-medium">Max Contacts</Label>
              <Input
                {...register('maxContacts', { valueAsNumber: true, min: 1 })}
                type="number"
                min="1"
                placeholder="5000"
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStorageGB" className="text-sm font-medium">Storage Limit (GB)</Label>
              <Input
                {...register('maxStorageGB', { valueAsNumber: true, min: 1 })}
                type="number"
                min="1"
                placeholder="50"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Modules */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            <Settings className="inline h-4 w-4 mr-2" />
            Available Modules
          </h4>

          {/* Voice Calls Module */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="voiceCalls"
                checked={voiceCallsEnabled}
                onCheckedChange={handleVoiceCallsToggle}
              />
              <Label htmlFor="voiceCalls" className="text-sm font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Voice Calls
              </Label>
            </div>
            {voiceCallsEnabled && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="monthlyCallMinutes" className="text-sm font-medium">Monthly Call Minutes</Label>
                <Input
                  {...register('monthlyCallMinutes', { valueAsNumber: true, min: 0 })}
                  type="number"
                  min="0"
                  placeholder="600"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* AI Module */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai"
                checked={aiEnabled}
                onCheckedChange={handleAiToggle}
              />
              <Label htmlFor="ai" className="text-sm font-medium flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                AI Features
              </Label>
            </div>
            {aiEnabled && (
              <div className="ml-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="assistant"
                      checked={aiFeatures.includes('assistant')}
                      onCheckedChange={() => handleAiFeatureToggle('assistant')}
                    />
                    <Label htmlFor="assistant" className="text-sm">AI Assistant</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insights"
                      checked={aiFeatures.includes('insights')}
                      onCheckedChange={() => handleAiFeatureToggle('insights')}
                    />
                    <Label htmlFor="insights" className="text-sm">AI Insights</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="automation"
                      checked={aiFeatures.includes('automation')}
                      onCheckedChange={() => handleAiFeatureToggle('automation')}
                    />
                    <Label htmlFor="automation" className="text-sm">AI Automation</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scoring"
                      checked={aiFeatures.includes('scoring')}
                      onCheckedChange={() => handleAiFeatureToggle('scoring')}
                    />
                    <Label htmlFor="scoring" className="text-sm">Lead Scoring</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recommendations"
                      checked={aiFeatures.includes('recommendations')}
                      onCheckedChange={() => handleAiFeatureToggle('recommendations')}
                    />
                    <Label htmlFor="recommendations" className="text-sm">Smart Recommendations</Label>
                  </div>
                </div>

                {/* AI Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                  {aiFeatures.includes('automation') && (
                    <div className="space-y-2">
                      <Label htmlFor="monthlyAiAutomations" className="text-sm font-medium">Monthly AI Automations</Label>
                      <Input
                        {...register('monthlyAiAutomations', { valueAsNumber: true, min: 0 })}
                        type="number"
                        min="0"
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>
                  )}
                  {aiFeatures.includes('recommendations') && (
                    <div className="space-y-2">
                      <Label htmlFor="monthlySmartRecommendations" className="text-sm font-medium">Monthly Smart Recommendations</Label>
                      <Input
                        {...register('monthlySmartRecommendations', { valueAsNumber: true, min: 0 })}
                        type="number"
                        min="0"
                        placeholder="200"
                        className="mt-1"
                      />
                    </div>
                  )}
                  {aiFeatures.includes('assistant') && (
                    <div className="space-y-2">
                      <Label htmlFor="monthlyAiAssistantQueries" className="text-sm font-medium">Monthly AI Assistant Queries</Label>
                      <Input
                        {...register('monthlyAiAssistantQueries', { valueAsNumber: true, min: 0 })}
                        type="number"
                        min="0"
                        placeholder="1000"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Third-party Integrations Module */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 sm:p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="integrations"
                checked={integrationsEnabled}
                onCheckedChange={handleIntegrationsToggle}
              />
              <Label htmlFor="integrations" className="text-sm font-medium flex items-center">
                <Link className="h-4 w-4 mr-2" />
                Third-party Integrations
              </Label>
            </div>
            {integrationsEnabled && (
              <div className="ml-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp-integration"
                      checked={whatsappEnabled}
                      onCheckedChange={handleWhatsappToggle}
                    />
                    <Label htmlFor="whatsapp-integration" className="text-sm">WhatsApp</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-integration"
                      checked={emailEnabled}
                      onCheckedChange={handleEmailToggle}
                    />
                    <Label htmlFor="email-integration" className="text-sm">Email</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-integration"
                      checked={smsEnabled}
                      onCheckedChange={handleSmsToggle}
                    />
                    <Label htmlFor="sms-integration" className="text-sm">SMS</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="facebook-integration"
                      checked={selectedIntegrations.includes('facebook')}
                      onCheckedChange={() => handleIntegrationToggle('facebook')}
                    />
                    <Label htmlFor="facebook-integration" className="text-sm">Facebook</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="google-ads-integration"
                      checked={selectedIntegrations.includes('google-ads')}
                      onCheckedChange={() => handleIntegrationToggle('google-ads')}
                    />
                    <Label htmlFor="google-ads-integration" className="text-sm">Google Ads</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tiktok-ads-integration"
                      checked={selectedIntegrations.includes('tiktok-ads')}
                      onCheckedChange={() => handleIntegrationToggle('tiktok-ads')}
                    />
                    <Label htmlFor="tiktok-ads-integration" className="text-sm">TikTok Ads</Label>
                  </div>
                </div>

                {/* Integration Limits */}
                {(whatsappEnabled || emailEnabled || smsEnabled) && (
                  <div className="pt-3 border-t border-orange-200 dark:border-orange-700">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Integration Limits</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {whatsappEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="monthlyWhatsAppMessages" className="text-sm font-medium">Monthly WhatsApp Messages</Label>
                          <Input
                            {...register('monthlyWhatsAppMessages', { valueAsNumber: true, min: 0 })}
                            type="number"
                            min="0"
                            placeholder="1000"
                            className="mt-1"
                          />
                        </div>
                      )}
                      {emailEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="monthlyEmailMessages" className="text-sm font-medium">Monthly Email Messages</Label>
                          <Input
                            {...register('monthlyEmailMessages', { valueAsNumber: true, min: 0 })}
                            type="number"
                            min="0"
                            placeholder="2000"
                            className="mt-1"
                          />
                        </div>
                      )}
                      {smsEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="smsSendingLimit" className="text-sm font-medium">SMS Sending Limit</Label>
                          <Input
                            {...register('smsSendingLimit', { valueAsNumber: true, min: 0 })}
                            type="number"
                            min="0"
                            placeholder="500"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regularModules.map((module) => (
              <div key={module.id} className="flex items-center space-x-2">
                <Checkbox
                  id={module.id}
                  checked={selectedModules.includes(module.id)}
                  onCheckedChange={() => handleModuleToggle(module.id)}
                />
                <Label htmlFor={module.id} className="text-sm">{module.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status and Visibility */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Public Package</Label>
              <p className="text-xs text-gray-500">Make this package available to customers</p>
            </div>
            <Switch
              checked={watch('isPublic')}
              onCheckedChange={(checked) => setValue('isPublic', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Package Status</Label>
              <p className="text-xs text-gray-500">Enable or disable this package</p>
            </div>
            <Switch
              checked={watch('status') === 'active'}
              onCheckedChange={(checked) => setValue('status', checked ? 'active' : 'inactive')}
            />
          </div>
        </div>
      </form>
    </DrawerForm>
  );
};
