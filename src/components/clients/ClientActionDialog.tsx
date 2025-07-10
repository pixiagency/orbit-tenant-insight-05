
import React from 'react';
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

interface ClientActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'suspend' | 'delete' | 'activate';
  clientCount: number;
  clientName?: string;
  isBulk?: boolean;
}

export const ClientActionDialog: React.FC<ClientActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  clientCount,
  clientName,
  isBulk = false,
}) => {
  const getActionText = () => {
    if (isBulk) {
      switch (action) {
        case 'suspend':
          return {
            title: 'Suspend Clients',
            description: `Are you sure you want to suspend ${clientCount} ${clientCount === 1 ? 'client' : 'clients'}? This action will disable their access to the CRM system.`,
            confirmText: 'Suspend',
            variant: 'destructive' as const,
          };
        case 'delete':
          return {
            title: 'Delete Clients',
            description: `Are you sure you want to delete ${clientCount} ${clientCount === 1 ? 'client' : 'clients'}? This action cannot be undone and will permanently remove all data.`,
            confirmText: 'Delete',
            variant: 'destructive' as const,
          };
        case 'activate':
          return {
            title: 'Activate Clients',
            description: `Are you sure you want to activate ${clientCount} ${clientCount === 1 ? 'client' : 'clients'}? This will restore their access to the CRM system.`,
            confirmText: 'Activate',
            variant: 'default' as const,
          };
        default:
          return {
            title: 'Confirm Action',
            description: 'Are you sure you want to perform this action?',
            confirmText: 'Confirm',
            variant: 'default' as const,
          };
      }
    } else {
      // Single client actions with client name
      switch (action) {
        case 'suspend':
          return {
            title: 'Suspend Client',
            description: (
              <>
                Are you sure you want to suspend <strong>{clientName}</strong>? This action will disable their access to the CRM system.
              </>
            ),
            confirmText: 'Suspend',
            variant: 'destructive' as const,
          };
        case 'delete':
          return {
            title: 'Delete Client',
            description: (
              <>
                Are you sure you want to delete <strong>{clientName}</strong>? This action cannot be undone and will permanently remove all data.
              </>
            ),
            confirmText: 'Delete',
            variant: 'destructive' as const,
          };
        case 'activate':
          return {
            title: 'Activate Client',
            description: (
              <>
                Are you sure you want to activate <strong>{clientName}</strong>? This will restore their access to the CRM system.
              </>
            ),
            confirmText: 'Activate',
            variant: 'default' as const,
          };
        default:
          return {
            title: 'Confirm Action',
            description: 'Are you sure you want to perform this action?',
            confirmText: 'Confirm',
            variant: 'default' as const,
          };
      }
    }
  };

  const actionText = getActionText();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{actionText.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {actionText.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={actionText.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {actionText.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
