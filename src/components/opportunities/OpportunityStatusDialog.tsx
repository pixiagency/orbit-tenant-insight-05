
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface OpportunityStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onStatusChange: (status: string, reason?: string, description?: string) => void;
  onOpenDealForm: () => void;
}

const LOSS_REASONS = [
  { value: 'price', label: 'Price too high' },
  { value: 'competitor', label: 'Chose competitor' },
  { value: 'timing', label: 'Bad timing' },
  { value: 'budget', label: 'No budget' },
  { value: 'no-decision', label: 'No decision made' },
  { value: 'requirements', label: 'Requirements not met' },
  { value: 'other', label: 'Other' },
];

export const OpportunityStatusDialog: React.FC<OpportunityStatusDialogProps> = ({
  isOpen,
  onClose,
  currentStatus,
  onStatusChange,
  onOpenDealForm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [lossReason, setLossReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (selectedStatus === 'lost' && !lossReason) {
      toast.error('Please select a reason for the loss');
      return;
    }

    onStatusChange(selectedStatus, lossReason, description);
    
    if (selectedStatus === 'won') {
      onOpenDealForm();
    }
    
    onClose();
    toast.success(`Opportunity status changed to ${selectedStatus}`);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (status !== 'lost') {
      setLossReason('');
      setDescription('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Opportunity Status</DialogTitle>
          <DialogDescription>
            Update the status of this opportunity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="abandon">Abandon</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStatus === 'lost' && (
            <>
              <div>
                <Label htmlFor="reason">Reason for Loss</Label>
                <Select value={lossReason} onValueChange={setLossReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOSS_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide additional details about the loss..."
                  rows={3}
                />
              </div>
            </>
          )}

          {selectedStatus === 'won' && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Congratulations! When you save this status, the deal form will open automatically to complete the deal registration.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
