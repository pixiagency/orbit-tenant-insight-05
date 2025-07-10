
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Client } from '../../types/superadmin';
import { useToast } from '@/hooks/use-toast';

interface AssignPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export const AssignPackageModal: React.FC<AssignPackageModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { toast } = useToast();

  const handleAssign = () => {
    toast({
      title: "Package Assigned",
      description: `Package assigned to ${client.companyName}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Package to {client.companyName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Assign a new package to this client.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              Assign Package
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export const RenewSubscriptionModal: React.FC<RenewSubscriptionModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { toast } = useToast();

  const handleRenew = () => {
    toast({
      title: "Subscription Renewed",
      description: `Subscription renewed for ${client.companyName}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew Subscription for {client.companyName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Renew the subscription for this client.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleRenew}>
              Renew Subscription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface SendPasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export const SendPasswordResetModal: React.FC<SendPasswordResetModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { toast } = useToast();

  const handleSend = () => {
    toast({
      title: "Password Reset Sent",
      description: `Password reset email sent to ${client.contactEmail}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Password Reset to {client.companyName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Send a password reset email to {client.contactEmail}?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend}>
              Send Reset Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
