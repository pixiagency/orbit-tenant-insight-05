import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Client } from '../../types/superadmin';

interface ClientDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clientId: string) => void;
  client: Client | null;
}

export const ClientDeleteModal: React.FC<ClientDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  client,
}) => {
  const handleConfirm = () => {
    if (client) {
      onConfirm(client.id);
    }
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Client
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this client? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Client Details
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Company:</span> {client.companyName}</p>
              <p><span className="font-medium">Contact:</span> {client.contactName}</p>
              <p><span className="font-medium">Email:</span> {client.contactEmail}</p>
              <p><span className="font-medium">Status:</span> {client.status}</p>
              <p><span className="font-medium">Package:</span> {client.packageName}</p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium mb-1">Warning:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All client data will be permanently deleted</li>
                  <li>Active subscriptions will be cancelled</li>
                  <li>User access will be revoked immediately</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
