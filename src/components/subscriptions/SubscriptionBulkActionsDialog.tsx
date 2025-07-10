
import React, { useState } from 'react';
import { AlertTriangle, X, RotateCcw, Download, Users } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Subscription } from '../../types/superadmin';

interface SubscriptionBulkActionsDialogProps {
  action: 'cancel' | 'renew' | 'export' | null;
  subscriptions: Subscription[];
  selectedIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: string, data: any) => void;
  isLoading?: boolean;
}

interface BulkActionData {
  action: string;
  subscriptionIds: string[];
  reason?: string;
  duration?: number;
  durationUnit?: 'days' | 'months' | 'years';
  effectiveDate?: 'immediate' | 'end-of-period';
  sendNotification?: boolean;
  notes?: string;
  format?: string;
  includeDetails?: boolean;
}

const CANCEL_REASONS = [
  { value: 'customer-request', label: 'Customer Request' },
  { value: 'payment-failure', label: 'Payment Failure' },
  { value: 'policy-violation', label: 'Policy Violation' },
  { value: 'technical-issues', label: 'Technical Issues' },
  { value: 'business-closure', label: 'Business Closure' },
  { value: 'other', label: 'Other' },
];

const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV (Comma Separated Values)' },
  { value: 'xlsx', label: 'Excel Spreadsheet' },
  { value: 'pdf', label: 'PDF Report' },
];

export const SubscriptionBulkActionsDialog: React.FC<SubscriptionBulkActionsDialogProps> = ({
  action,
  subscriptions,
  selectedIds,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [durationUnit, setDurationUnit] = useState<'days' | 'months' | 'years'>('months');
  const [effectiveDate, setEffectiveDate] = useState<'immediate' | 'end-of-period'>('immediate');
  const [sendNotification, setSendNotification] = useState(true);
  const [notes, setNotes] = useState('');
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [includeDetails, setIncludeDetails] = useState(true);

  const selectedSubscriptions = subscriptions.filter(sub => selectedIds.includes(sub.id));

  const handleConfirm = () => {
    if (!action) return;

    const actionData: BulkActionData = {
      action,
      subscriptionIds: selectedIds,
    };

    if (action === 'cancel') {
      if (!reason) return;
      actionData.reason = reason;
      actionData.effectiveDate = effectiveDate;
      actionData.sendNotification = sendNotification;
      actionData.notes = notes.trim() || undefined;
    } else if (action === 'renew') {
      actionData.duration = duration;
      actionData.durationUnit = durationUnit;
      actionData.sendNotification = sendNotification;
      actionData.notes = notes.trim() || undefined;
    } else if (action === 'export') {
      actionData.format = exportFormat;
      actionData.includeDetails = includeDetails;
    }

    onConfirm(action, actionData);
  };

  const handleClose = () => {
    // Reset form
    setReason('');
    setDuration(1);
    setDurationUnit('months');
    setEffectiveDate('immediate');
    setSendNotification(true);
    setNotes('');
    setExportFormat('csv');
    setIncludeDetails(true);
    onClose();
  };

  const getActionIcon = () => {
    switch (action) {
      case 'cancel': return <X className="h-5 w-5" />;
      case 'renew': return <RotateCcw className="h-5 w-5" />;
      case 'export': return <Download className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const getActionTitle = () => {
    switch (action) {
      case 'cancel': return 'Cancel Selected Subscriptions';
      case 'renew': return 'Renew Selected Subscriptions';
      case 'export': return 'Export Subscriptions';
      default: return 'Bulk Action';
    }
  };

  const getActionColor = () => {
    switch (action) {
      case 'cancel': return 'text-red-600 dark:text-red-400';
      case 'renew': return 'text-blue-600 dark:text-blue-400';
      case 'export': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderActionSpecificContent = () => {
    switch (action) {
      case 'cancel':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Warning: This action cannot be undone
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    All selected subscriptions will be canceled. Clients will lose access to their services.
                  </p>
                </div>
              </div>
            </div>

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
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendNotification"
                checked={sendNotification}
                onCheckedChange={(checked) => setSendNotification(checked === true)}
              />
              <Label htmlFor="sendNotification" className="text-sm text-gray-900 dark:text-gray-100">
                Send cancellation notifications to clients
              </Label>
            </div>
          </div>
        );

      case 'renew':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Bulk Renewal Extension
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                All selected subscriptions will be extended by the specified duration.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Duration *
                </Label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  placeholder="e.g., 12"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationUnit" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Unit *
                </Label>
                <Select value={durationUnit} onValueChange={(value: 'days' | 'months' | 'years') => setDurationUnit(value)}>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendNotification"
                checked={sendNotification}
                onCheckedChange={(checked) => setSendNotification(checked === true)}
              />
              <Label htmlFor="sendNotification" className="text-sm text-gray-900 dark:text-gray-100">
                Send renewal notifications to clients
              </Label>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                Export Selected Subscriptions
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Generate a report containing all selected subscription data.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exportFormat" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Export Format
              </Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {EXPORT_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDetails"
                checked={includeDetails}
                onCheckedChange={(checked) => setIncludeDetails(checked === true)}
              />
              <Label htmlFor="includeDetails" className="text-sm text-gray-900 dark:text-gray-100">
                Include detailed subscription information
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!action) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center space-x-2 ${getActionColor()}`}>
            {getActionIcon()}
            <span>{getActionTitle()}</span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {/* Selected Subscriptions Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Selected Subscriptions ({selectedIds.length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 dark:text-gray-100">{subscription.clientName}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {subscription.packageName}
                        </Badge>
                        <Badge 
                          className={`text-xs ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'expired' ? 'bg-red-100 text-red-800' :
                            subscription.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {renderActionSpecificContent()}

              {/* Common Notes Field */}
              {(action === 'cancel' || action === 'renew') && (
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={`Internal notes about this ${action} operation...`}
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={
              isLoading || 
              (action === 'cancel' && !reason) ||
              (action === 'renew' && (!duration || duration < 1))
            }
            className={
              action === 'cancel' ? 'bg-red-600 hover:bg-red-700 text-white' :
              action === 'renew' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
              'bg-green-600 hover:bg-green-700 text-white'
            }
          >
            {isLoading ? 'Processing...' : 
             action === 'cancel' ? `Cancel ${selectedIds.length} Subscriptions` :
             action === 'renew' ? `Renew ${selectedIds.length} Subscriptions` :
             `Export ${selectedIds.length} Subscriptions`
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
