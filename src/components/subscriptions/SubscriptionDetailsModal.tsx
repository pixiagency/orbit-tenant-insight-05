
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  Package,
  RotateCcw,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Subscription } from "@/types/superadmin";

interface SubscriptionDetailsModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onRenew: () => void;
  onRefund?: () => void;
}

// Mock packages data to get refund period
const MOCK_PACKAGES = [
  { id: '1', name: 'Starter Plan', refundPeriodDays: 30 },
  { id: '2', name: 'Professional Plan', refundPeriodDays: 14 },
  { id: '3', name: 'Enterprise Plan', refundPeriodDays: 7 },
];

export const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  subscription,
  isOpen,
  onClose,
  onEdit,
  onCancel,
  onRenew,
  onRefund,
}) => {
  if (!subscription) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: Subscription['status']) => {
    const variants = {
      active: 'default',
      expired: 'destructive',
      cancelled: 'destructive',
      suspended: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  // Check if refund is available based on package refund period
  const isRefundAvailable = () => {
    const packageInfo = MOCK_PACKAGES.find(p => p.name === subscription.packageName);
    if (!packageInfo) return false;
    
    const subscriptionStartDate = new Date(subscription.startDate);
    const currentDate = new Date();
    const daysSinceStart = Math.floor((currentDate.getTime() - subscriptionStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceStart <= packageInfo.refundPeriodDays && subscription.status === 'active';
  };

  const getRefundPeriod = () => {
    const packageInfo = MOCK_PACKAGES.find(p => p.name === subscription.packageName);
    return packageInfo?.refundPeriodDays || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
              Subscription Details
            </div>
            <Badge variant={getStatusBadge(subscription.status) as any} className="ml-2">
              {subscription.status.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Subscription Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="h-5 w-5 mr-2" />
                Subscription Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Package</label>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{subscription.packageName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</label>
                  <p className="text-gray-900 dark:text-gray-100">{subscription.clientName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <Badge variant={getStatusBadge(subscription.status) as any}>
                    {subscription.status}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Activation Method</label>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">{subscription.activationMethod}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</label>
                  <p className="text-gray-900 dark:text-gray-100">{subscription.source}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Auto Renew</label>
                  <Badge variant={subscription.autoRenew ? "default" : "secondary"}>
                    {subscription.autoRenew ? "Yes" : "No"}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Refund Period</label>
                  <p className="text-gray-900 dark:text-gray-100">{getRefundPeriod()} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="h-5 w-5 mr-2" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                    {subscription.currency} {subscription.amount}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</label>
                  <Badge variant={subscription.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                    {subscription.paymentStatus}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Start Date
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(subscription.startDate)}</p>
                </div>

                {subscription.endDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      End Date
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{formatDate(subscription.endDate)}</p>
                  </div>
                )}

                {subscription.nextBilling && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Billing</label>
                    <p className="text-gray-900 dark:text-gray-100">{formatDate(subscription.nextBilling)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Subscription Created</p>
                    <p className="text-xs text-gray-500">{formatDate(subscription.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Last Updated</p>
                    <p className="text-xs text-gray-500">{formatDate(subscription.lastUpdated)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        {subscription.notes && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{subscription.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isRefundAvailable() && onRefund && (
            <Button onClick={onRefund} variant="destructive">
              <RefreshCw className="h-4 w-4 mr-2" />
              Request Refund
            </Button>
          )}
          {subscription.status === 'expired' && (
            <Button onClick={onRenew} className="bg-green-600 hover:bg-green-700">
              <RotateCcw className="h-4 w-4 mr-2" />
              Renew Subscription
            </Button>
          )}
          {subscription.status === 'active' && (
            <Button onClick={onCancel} variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Subscription
            </Button>
          )}
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Subscription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
