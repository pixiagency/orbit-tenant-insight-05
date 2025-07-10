import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Subscription } from '../../types/superadmin';

interface SubscriptionCancelDialogProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CancelData) => void;
  isLoading?: boolean;
}

interface CancelData {
  subscriptionId: string;
  reason: string;
  effectiveDate: 'immediate' | 'end-of-period';
  refundAmount?: number;
  sendNotification: boolean;
  notes?: string;
}

const CANCEL_REASONS = [
  { value: 'customer-request', label: 'Customer Request' },
  { value: 'payment-failure', label: 'Payment Failure' },
  { value: 'policy-violation', label: 'Policy Violation' },
  { value: 'technical-issues', label: 'Technical Issues' },
  { value: 'business-closure', label: 'Business Closure' },
  { value: 'other', label: 'Other' },
];

export const SubscriptionCancelDialog: React.FC<SubscriptionCancelDialogProps> = ({
  subscription,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<'immediate' | 'end-of-period'>('immediate');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [sendNotification, setSendNotification] = useState(true);
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    if (!subscription || !reason) return;

    const cancelData: CancelData = {
      subscriptionId: subscription.id,
      reason,
      effectiveDate,
      refundAmount: refundAmount > 0 ? refundAmount : undefined,
      sendNotification,
      notes: notes.trim() || undefined,
    };

    onConfirm(cancelData);
  };

  const handleClose = () => {
    // Reset form
    setReason('');
    setEffectiveDate('immediate');
    setRefundAmount(0);
    setSendNotification(true);
    setNotes('');
    onClose();
  };

  if (!subscription) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <X className="h-5 w-5" />
            <span>Cancel Subscription</span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Warning: This action cannot be undone
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Canceling this subscription will terminate access to the service. Please review the details below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Subscription Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Client:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{subscription.clientName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Package:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{subscription.packageName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Current End Date:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ${subscription.amount} {subscription.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancellation Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Cancellation Reason *
                  </Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {CANCEL_REASONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Effective Date
                  </Label>
                  <Select value={effectiveDate} onValueChange={(value: 'immediate' | 'end-of-period') => setEffectiveDate(value)}>
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="end-of-period">End of Current Period</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {effectiveDate === 'immediate' 
                      ? 'Access will be terminated immediately'
                      : 'Access will continue until the current period ends'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundAmount" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Refund Amount (Optional)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="pl-8 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                      step="0.01"
                      min="0"
                      max={subscription.amount}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum refund: ${subscription.amount}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendNotification"
                    checked={sendNotification}
                    onCheckedChange={(checked) => setSendNotification(checked === true)}
                  />
                  <Label htmlFor="sendNotification" className="text-sm text-gray-900 dark:text-gray-100">
                    Send cancellation notification to client
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Internal notes about this cancellation..."
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            Keep Subscription
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!reason || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Canceling...' : 'Cancel Subscription'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
