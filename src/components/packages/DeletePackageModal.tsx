
import React, { useState } from 'react';
import { Package } from '../../types/packages';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DeletePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package | null;
  availablePackages: Package[];
  onConfirm: (packageId: string, reassignPackageId?: string) => void;
}

export const DeletePackageModal: React.FC<DeletePackageModalProps> = ({
  isOpen,
  onClose,
  package: packageToDelete,
  availablePackages,
  onConfirm,
}) => {
  const [reassignPackageId, setReassignPackageId] = useState<string>('');

  if (!packageToDelete) return null;

  const hasUsers = packageToDelete.usersCount > 0;
  const activePackages = availablePackages.filter(p => p.status === 'active');

  const handleConfirm = () => {
    onConfirm(packageToDelete.id, hasUsers ? reassignPackageId : undefined);
    setReassignPackageId('');
  };

  const handleClose = () => {
    setReassignPackageId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Package
          </DialogTitle>
          <DialogDescription>
            You are about to delete the package "<strong>{packageToDelete.name}</strong>".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {hasUsers && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-center text-yellow-800 dark:text-yellow-200 mb-2">
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">Users Affected</span>
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                This package currently has <Badge variant="outline" className="mx-1">{packageToDelete.usersCount}</Badge> 
                active users. You must assign them to another package before deletion.
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            This action cannot be undone.
          </div>
        </div>

        {hasUsers && (
          <div className="space-y-3">
            <Label htmlFor="reassignPackage" className="text-gray-900 dark:text-gray-100">
              Reassign users to package *
            </Label>
            <Select value={reassignPackageId} onValueChange={setReassignPackageId} required>
              <SelectTrigger id="reassignPackage">
                <SelectValue placeholder="Select a package to reassign users" />
              </SelectTrigger>
              <SelectContent>
                {activePackages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{pkg.name}</span>
                      <Badge variant="outline" className="ml-2">
                        ${pkg.pricing.amount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activePackages.length === 0 && (
              <div className="text-sm text-red-600 dark:text-red-400">
                No active packages available for reassignment. Please activate another package first.
              </div>
            )}
          </div>
        )}

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={hasUsers && (!reassignPackageId || activePackages.length === 0)}
          >
            Delete Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
