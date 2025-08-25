import React from 'react';
import { Button } from '@/components/ui/button';
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
import { CheckCircle, ArrowRight } from 'lucide-react';

interface OpportunityStatusAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: () => void;
  opportunityName?: string;
}

export const OpportunityStatusAlertDialog: React.FC<OpportunityStatusAlertDialogProps> = ({
  isOpen,
  onClose,
  onChangeStatus,
  opportunityName = "this opportunity"
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Deal Created Successfully!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Your deal has been created successfully. Since {opportunityName} is currently in 
              <span className="font-semibold text-blue-600"> active status</span>, 
              would you like to change it to 
              <span className="font-semibold text-green-600"> won status</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              This will help keep your opportunity pipeline accurate and up-to-date.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Keep Current Status
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onChangeStatus}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Change to Won
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};