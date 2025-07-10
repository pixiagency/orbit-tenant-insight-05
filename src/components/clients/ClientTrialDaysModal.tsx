
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client } from '../../types/superadmin';

interface ClientTrialDaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trialDays: number, reason: string) => void;
  client: Client | null;
}

export const ClientTrialDaysModal: React.FC<ClientTrialDaysModalProps> = ({
  isOpen,
  onClose,
  onSave,
  client,
}) => {
  const [trialDays, setTrialDays] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  if (!client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(trialDays, reason);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Trial Days - {client.companyName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Current Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Package:</strong> {client.packageName}</p>
                <p><strong>Status:</strong> {client.status}</p>
                <p><strong>Subscription End:</strong> {client.subscriptionEndDate ? new Date(client.subscriptionEndDate).toLocaleDateString() : 'N/A'}</p>
                {client.hasTrialDays ? (
                  <Badge variant="secondary">
                    <Clock className="h-4 w-4 mr-2" />
                    {client.trialDaysCount} trial days added
                  </Badge>
                ) : (
                  <Badge variant="outline">No trial days added</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trial Days */}
          <div>
            <Label htmlFor="trial-days">Additional Trial Days *</Label>
            <Input
              type="number"
              id="trial-days"
              value={trialDays}
              onChange={(e) => setTrialDays(parseInt(e.target.value))}
              placeholder="Enter number of trial days"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason for Adding Trial Days *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you are adding trial days..."
              rows={3}
              required
            />
          </div>

          {/* Summary */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-900">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Client:</strong> {client.companyName}</p>
                <p><strong>Additional Trial Days:</strong> {trialDays}</p>
                <p><strong>New Subscription End:</strong> {client.subscriptionEndDate ? new Date(new Date(client.subscriptionEndDate).setDate(new Date(client.subscriptionEndDate).getDate() + trialDays)).toLocaleDateString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Trial Days
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
