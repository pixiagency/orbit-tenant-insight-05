
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package as RegularPackage } from '../../types/packages';
import { Users, Database, Clock, Mail, MessageSquare, Phone, Zap, Brain, Eye, EyeOff } from 'lucide-react';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: RegularPackage | null;
}

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  isOpen,
  onClose,
  package: pkg,
}) => {
  if (!pkg) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{pkg.name}</span>
            <div className="flex items-center space-x-2">
              <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                {pkg.status}
              </Badge>
              {pkg.isPublic ? (
                <Badge variant="outline"><Eye className="h-3 w-3 mr-1" />Public</Badge>
              ) : (
                <Badge variant="outline"><EyeOff className="h-3 w-3 mr-1" />Private</Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {pkg.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(pkg.pricing.amount, pkg.pricing.currency)}
              </div>
              <div className="text-sm text-gray-600">
                per {pkg.pricing.duration} {pkg.pricing.durationUnit}
              </div>
              <div className="text-sm">
                <strong>Refund Period:</strong> {pkg.refundPeriodDays} days
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Active Users:</span>
                <span className="font-medium">{pkg.usersCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-medium">{new Date(pkg.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-medium">{new Date(pkg.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Usage Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600">Max Users</div>
                    <div className="font-medium">{pkg.limits.maxUsers}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-600">Storage</div>
                    <div className="font-medium">{pkg.limits.maxStorageGB} GB</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm text-gray-600">Contacts</div>
                    <div className="font-medium">{pkg.limits.maxContacts?.toLocaleString() || 'Unlimited'}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm text-gray-600">Call Minutes</div>
                    <div className="font-medium">{pkg.limits.monthlyCallMinutes || 0}/month</div>
                  </div>
                </div>

                {pkg.limits.maxLeads && (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <div>
                      <div className="text-sm text-gray-600">Leads</div>
                      <div className="font-medium">{pkg.limits.maxLeads.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                {pkg.limits.monthlyEmailMessages && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-sm text-gray-600">Email Messages</div>
                      <div className="font-medium">{pkg.limits.monthlyEmailMessages.toLocaleString()}/month</div>
                    </div>
                  </div>
                )}

                {pkg.limits.monthlyWhatsAppMessages && (
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">WhatsApp Messages</div>
                      <div className="font-medium">{pkg.limits.monthlyWhatsAppMessages.toLocaleString()}/month</div>
                    </div>
                  </div>
                )}

                {pkg.limits.smsSendingLimit && (
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">SMS Messages</div>
                      <div className="font-medium">{pkg.limits.smsSendingLimit.toLocaleString()}/month</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Modules */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Available Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pkg.modules.map((module) => (
                  <Badge key={module} variant="outline">
                    {module}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          {pkg.aiOptions.enabled && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {pkg.aiOptions.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
