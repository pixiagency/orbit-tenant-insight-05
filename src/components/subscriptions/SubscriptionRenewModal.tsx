
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface SubscriptionRenewModalProps {
  subscription: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { endDate: string; paymentStatus: 'paid' | 'unpaid' | 'not-applicable'; notes: string; subscriptionId: string }) => void;
  isLoading?: boolean;
}

export const SubscriptionRenewModal: React.FC<SubscriptionRenewModalProps> = ({
  subscription,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    endDate: '',
    paymentStatus: 'paid' as 'paid' | 'unpaid' | 'not-applicable',
    notes: '',
  });

  useEffect(() => {
    if (subscription && isOpen) {
      // Calculate new end date (1 year from now)
      const newEndDate = new Date();
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      
      setFormData({
        endDate: newEndDate.toISOString().split('T')[0],
        paymentStatus: 'paid',
        notes: '',
      });
    }
  }, [subscription, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      ...formData,
      subscriptionId: subscription?.id || '',
    });
  };

  if (!subscription) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const calculateAmount = () => {
    return subscription.amount;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <RotateCcw className="h-5 w-5 mr-2 text-green-600" />
            Renew Subscription
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Renew the subscription for {subscription.clientName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Subscription Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Current Subscription</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500 dark:text-gray-400">Package</label>
                <p className="text-gray-900 dark:text-gray-100">{subscription.packageName}</p>
              </div>
              <div>
                <label className="text-gray-500 dark:text-gray-400">Current Status</label>
                <p className="text-gray-900 dark:text-gray-100">{subscription.status}</p>
              </div>
              <div>
                <label className="text-gray-500 dark:text-gray-400">Current End Date</label>
                <p className="text-gray-900 dark:text-gray-100">
                  {subscription.endDate ? formatDate(subscription.endDate) : 'No end date'}
                </p>
              </div>
              <div>
                <label className="text-gray-500 dark:text-gray-400">Amount</label>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">
                  {subscription.currency} {calculateAmount()}
                </p>
              </div>
            </div>
          </div>

          {/* Renewal Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                New End Date *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="paymentStatus" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Payment Status *
              </Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(value: 'paid' | 'unpaid' | 'not-applicable') => 
                  setFormData({ ...formData, paymentStatus: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Renewal Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes about this renewal..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Renewal Summary</h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>• Subscription will be renewed until {formData.endDate ? formatDate(formData.endDate) : 'N/A'}</p>
              <p>• Status will change to "active"</p>
              <p>• Amount: {subscription.currency} {calculateAmount()}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Renewing...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Renew Subscription
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
