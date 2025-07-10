
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Phone, 
  Target, 
  TrendingUp, 
  Settings, 
  Shield, 
  Zap,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface AIModuleSettings {
  personalityProfiling: {
    enabled: boolean;
    visibility: 'all' | 'team-leader' | 'admin';
    sensitivity: 'conservative' | 'moderate' | 'aggressive';
  };
  intentDetection: {
    enabled: boolean;
    visibility: 'all' | 'team-leader' | 'admin';
    autoUpdate: boolean;
  };
  callEvaluation: {
    enabled: boolean;
    autoSummary: boolean;
    scoringMetrics: string[];
    notifyTeamLeader: boolean;
  };
  productMatching: {
    enabled: boolean;
    confidenceThreshold: number;
  };
  performanceInsights: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    visibility: 'team-leader' | 'admin';
  };
  leadScoring: {
    enabled: boolean;
    autoScore: boolean;
    forecastingEnabled: boolean;
  };
  smartAssignment: {
    enabled: boolean;
    criteria: string[];
  };
  aiPlaybook: {
    enabled: boolean;
    realTimeSuggestions: boolean;
    contextAware: boolean;
  };
  aiTagging: {
    enabled: boolean;
    autoApply: boolean;
  };
  leadEnrichment: {
    enabled: boolean;
    autoEnrich: boolean;
    dataSources: string[];
  };
  privacy: {
    autoDeletePeriod: number;
    dataRetention: 'internal' | 'encrypted';
    auditLogging: boolean;
  };
}

export const AIModulePage: React.FC = () => {
  const [settings, setSettings] = useState<AIModuleSettings>({
    personalityProfiling: {
      enabled: true,
      visibility: 'all',
      sensitivity: 'moderate'
    },
    intentDetection: {
      enabled: true,
      visibility: 'all',
      autoUpdate: true
    },
    callEvaluation: {
      enabled: true,
      autoSummary: true,
      scoringMetrics: ['clarity', 'effectiveness', 'duration', 'politeness'],
      notifyTeamLeader: true
    },
    productMatching: {
      enabled: true,
      confidenceThreshold: 75
    },
    performanceInsights: {
      enabled: true,
      frequency: 'weekly',
      visibility: 'team-leader'
    },
    leadScoring: {
      enabled: true,
      autoScore: true,
      forecastingEnabled: true
    },
    smartAssignment: {
      enabled: false,
      criteria: ['specialization', 'performance', 'workload']
    },
    aiPlaybook: {
      enabled: true,
      realTimeSuggestions: true,
      contextAware: true
    },
    aiTagging: {
      enabled: true,
      autoApply: false
    },
    leadEnrichment: {
      enabled: true,
      autoEnrich: false,
      dataSources: ['company', 'social', 'public']
    },
    privacy: {
      autoDeletePeriod: 90,
      dataRetention: 'internal',
      auditLogging: true
    }
  });

  const [activeTab, setActiveTab] = useState('modules');

  const updateSetting = (section: keyof AIModuleSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving AI Module Settings:', settings);
    // Implement save logic here
  };

  const aiModules = [
    {
      id: 'personalityProfiling',
      title: 'Client Personality Profiling',
      description: 'Detects personality types from call audio and messages',
      icon: Brain,
      color: 'text-purple-600',
      enabled: settings.personalityProfiling.enabled
    },
    {
      id: 'intentDetection',
      title: 'Client Intent Detection',
      description: 'Identifies client interest level automatically',
      icon: Target,
      color: 'text-blue-600',
      enabled: settings.intentDetection.enabled
    },
    {
      id: 'callEvaluation',
      title: 'Call Evaluation',
      description: 'Auto-generates call summaries and scoring',
      icon: Phone,
      color: 'text-green-600',
      enabled: settings.callEvaluation.enabled
    },
    {
      id: 'productMatching',
      title: 'AI Product Matching',
      description: 'Suggests relevant products/services',
      icon: Zap,
      color: 'text-orange-600',
      enabled: settings.productMatching.enabled
    },
    {
      id: 'performanceInsights',
      title: 'Team AI Performance Insights',
      description: 'Analyzes team performance patterns',
      icon: TrendingUp,
      color: 'text-indigo-600',
      enabled: settings.performanceInsights.enabled
    },
    {
      id: 'leadScoring',
      title: 'Lead Scoring & Forecasting',
      description: 'Auto-scores and predicts conversion likelihood',
      icon: Activity,
      color: 'text-teal-600',
      enabled: settings.leadScoring.enabled
    },
    {
      id: 'smartAssignment',
      title: 'Smart Assignment',
      description: 'Auto-distributes leads based on criteria',
      icon: Users,
      color: 'text-pink-600',
      enabled: settings.smartAssignment.enabled
    },
    {
      id: 'aiPlaybook',
      title: 'AI Playbook & Reply Suggestions',
      description: 'Real-time conversation suggestions',
      icon: Settings,
      color: 'text-cyan-600',
      enabled: settings.aiPlaybook.enabled
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Module Settings</h1>
          <p className="text-gray-600 mt-1">Configure AI-powered features and privacy settings</p>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">AI Modules</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiModules.map((module) => (
              <Card key={module.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <module.icon className={`h-5 w-5 ${module.color}`} />
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={(enabled) => updateSetting(module.id as keyof AIModuleSettings, 'enabled', enabled)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Badge variant={module.enabled ? "default" : "secondary"}>
                      {module.enabled ? "Active" : "Inactive"}
                    </Badge>
                    {module.enabled && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Configured
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personality Profiling Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Personality Profiling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Visibility Level</Label>
                  <Select 
                    value={settings.personalityProfiling.visibility} 
                    onValueChange={(value) => updateSetting('personalityProfiling', 'visibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="team-leader">Team Leaders Only</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sensitivity Level</Label>
                  <Select 
                    value={settings.personalityProfiling.sensitivity} 
                    onValueChange={(value) => updateSetting('personalityProfiling', 'sensitivity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Call Evaluation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-green-600" />
                  Call Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.callEvaluation.autoSummary}
                    onCheckedChange={(checked) => updateSetting('callEvaluation', 'autoSummary', checked)}
                  />
                  <Label>Auto-generate summaries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.callEvaluation.notifyTeamLeader}
                    onCheckedChange={(checked) => updateSetting('callEvaluation', 'notifyTeamLeader', checked)}
                  />
                  <Label>Notify team leader of scores</Label>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Frequency</Label>
                  <Select 
                    value={settings.performanceInsights.frequency} 
                    onValueChange={(value) => updateSetting('performanceInsights', 'frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Smart Assignment Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-pink-600" />
                  Smart Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Assignment Criteria</Label>
                  <div className="space-y-2">
                    {['specialization', 'performance', 'workload'].map((criteria) => (
                      <div key={criteria} className="flex items-center space-x-2">
                        <Switch
                          checked={settings.smartAssignment.criteria.includes(criteria)}
                          onCheckedChange={(checked) => {
                            const newCriteria = checked 
                              ? [...settings.smartAssignment.criteria, criteria]
                              : settings.smartAssignment.criteria.filter(c => c !== criteria);
                            updateSetting('smartAssignment', 'criteria', newCriteria);
                          }}
                        />
                        <Label className="capitalize">{criteria}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All AI analyses are performed internally with no data shared externally. Your privacy and security are our top priorities.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Privacy & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Auto-delete AI analysis results after (days)</Label>
                <Select 
                  value={settings.privacy.autoDeletePeriod.toString()} 
                  onValueChange={(value) => updateSetting('privacy', 'autoDeletePeriod', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.privacy.auditLogging}
                  onCheckedChange={(checked) => updateSetting('privacy', 'auditLogging', checked)}
                />
                <Label>Enable audit logging for AI activities</Label>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Data Protection Features
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All processing happens on your servers</li>
                  <li>• No external API calls for sensitive data</li>
                  <li>• Encrypted storage for AI analysis results</li>
                  <li>• Configurable data retention policies</li>
                  <li>• Full audit trail of AI activities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
