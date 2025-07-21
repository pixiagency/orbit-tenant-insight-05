import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface OpportunityStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: string;
  onStageChange: (stage: string, notes?: string) => void;
  opportunityCount?: number;
}

const stages = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed-won', label: 'Closed Won' },
  { value: 'closed-lost', label: 'Closed Lost' }
];

export const OpportunityStageDialog: React.FC<OpportunityStageDialogProps> = ({
  isOpen,
  onClose,
  currentStage,
  onStageChange,
  opportunityCount = 1
}) => {
  const [selectedStage, setSelectedStage] = useState(currentStage);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!selectedStage) {
      toast.error('Please select a stage');
      return;
    }

    onStageChange(selectedStage, notes || undefined);
    toast.success(`Stage updated successfully for ${opportunityCount} opportunity(ies)`);
    onClose();
    setSelectedStage(currentStage);
    setNotes('');
  };

  const handleCancel = () => {
    onClose();
    setSelectedStage(currentStage);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            Change Stage - {opportunityCount} Opportunity{opportunityCount > 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            Update the stage for the selected opportunity{opportunityCount > 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="stage">New Stage</Label>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {stages.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this stage change..."
              className="resize-none bg-white"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Update Stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};