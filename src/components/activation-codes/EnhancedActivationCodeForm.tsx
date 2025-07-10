import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Package, Users, Clock, Percent, RefreshCw } from 'lucide-react';
import { ActivationCodeFormData } from '../../types/superadmin';

interface EnhancedActivationCodeFormProps {
  onSubmit: (data: ActivationCodeFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ActivationCodeFormData>;
  isLoading?: boolean;
}

export const EnhancedActivationCodeForm: React.FC<EnhancedActivationCodeFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ActivationCodeFormData>({
    code: '',
    packageId: '',
    usageType: 'one-time',
    usageLimit: 1,
    usersLimit: 5,
    validityDays: 30,
    status: 'active',
    type: 'activation',
    discountPercentage: 0,
    trialDays: 0,
    source: '',
    sources: [],
    codeCount: 1,
    codeParts: 3,
    partLength: 4,
    department: '',
    campaign: '',
    partner: '',
    region: '',
    restrictions: [],
    ...initialData
  });

  const [generateMode, setGenerateMode] = useState(true);

  const handleInputChange = (field: keyof ActivationCodeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCode = () => {
    const parts = [];
    for (let i = 0; i < formData.codeParts!; i++) {
      let part = '';
      for (let j = 0; j < formData.partLength!; j++) {
        part += Math.random().toString(36).substring(2, 3).toUpperCase();
      }
      parts.push(part);
    }
    const generatedCode = parts.join('-');
    handleInputChange('code', generatedCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Code Generation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={generateMode}
              onCheckedChange={setGenerateMode}
            />
            <Label>Auto-generate code</Label>
          </div>

          {generateMode ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Number of Codes</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.codeCount}
                  onChange={(e) => handleInputChange('codeCount', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Code Parts</Label>
                <Select 
                  value={formData.codeParts?.toString()} 
                  onValueChange={(value) => handleInputChange('codeParts', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Parts</SelectItem>
                    <SelectItem value="3">3 Parts</SelectItem>
                    <SelectItem value="4">4 Parts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Part Length</Label>
                <Select 
                  value={formData.partLength?.toString()} 
                  onValueChange={(value) => handleInputChange('partLength', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Characters</SelectItem>
                    <SelectItem value="4">4 Characters</SelectItem>
                    <SelectItem value="5">5 Characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" onClick={generateCode}>
                  Generate Code
                </Button>
              </div>
            </div>
          ) : null}

          <div>
            <Label htmlFor="code">Activation Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
              placeholder="Enter or generate activation code"
              required
              className="font-mono"
            />
          </div>

          {formData.code && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono">
                  {formData.code}
                </Badge>
                <span className="text-sm text-blue-600">Preview</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package & Type Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Package & Type</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="packageId">Package</Label>
              <Select value={formData.packageId} onValueChange={(value) => handleInputChange('packageId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Starter Plan</SelectItem>
                  <SelectItem value="2">Professional Plan</SelectItem>
                  <SelectItem value="3">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Code Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as 'activation' | 'discount')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activation">Activation Code</SelectItem>
                  <SelectItem value="discount">Discount Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === 'discount' && (
            <div>
              <Label htmlFor="discountPercentage" className="flex items-center space-x-2">
                <Percent className="h-4 w-4" />
                <span>Discount Percentage</span>
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => handleInputChange('discountPercentage', parseInt(e.target.value))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage & Limits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Usage & Limits</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="usageType">Usage Type</Label>
              <Select value={formData.usageType} onValueChange={(value) => handleInputChange('usageType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time Use</SelectItem>
                  <SelectItem value="multi-use">Multi-use</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.usageType === 'multi-use' && (
              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value))}
                />
              </div>
            )}

            <div>
              <Label htmlFor="usersLimit">Users Limit</Label>
              <Input
                id="usersLimit"
                type="number"
                min="1"
                value={formData.usersLimit}
                onChange={(e) => handleInputChange('usersLimit', parseInt(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validity & Trial Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Validity & Trial</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="validityDays">Validity (Days)</Label>
              <Input
                id="validityDays"
                type="number"
                min="1"
                value={formData.validityDays}
                onChange={(e) => handleInputChange('validityDays', parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Code will expire after this many days from creation
              </p>
            </div>

            <div>
              <Label htmlFor="trialDays">Trial Days</Label>
              <Input
                id="trialDays"
                type="number"
                min="0"
                value={formData.trialDays}
                onChange={(e) => handleInputChange('trialDays', parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Additional trial days to grant
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking & Source Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking & Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                placeholder="e.g., Website, Email Campaign"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="partnerships">Partnerships</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="campaign">Campaign</Label>
              <Input
                id="campaign"
                value={formData.campaign}
                onChange={(e) => handleInputChange('campaign', e.target.value)}
                placeholder="Campaign name"
              />
            </div>

            <div>
              <Label htmlFor="partner">Partner</Label>
              <Input
                id="partner"
                value={formData.partner}
                onChange={(e) => handleInputChange('partner', e.target.value)}
                placeholder="Partner organization"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="region">Region</Label>
            <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                <SelectItem value="latin-america">Latin America</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      
    </form>
  );
};
