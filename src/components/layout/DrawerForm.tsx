
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';


interface DrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave: () => void;
  isLoading?: boolean;
  saveButtonText?: string;
  saveText?: string;
  onAlternateSave?: () => void;
  alternateSaveText?: string;
  showSteps?: boolean;
  currentStep?: number;
  totalSteps?: number;
  additionalActions?: React.ReactNode;
  width?: 'default' | 'wide' | 'extra-wide';
}

export const DrawerForm: React.FC<DrawerFormProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSave,
  isLoading = false,
  saveButtonText = 'Save',
  saveText,
  onAlternateSave,
  alternateSaveText = 'Save & Download',
  showSteps = false,
  currentStep = 1,
  totalSteps = 1,
  additionalActions,
  width = 'default',
}) => {
  const finalSaveText = saveText || saveButtonText;

  const getWidthClass = () => {
    switch (width) {
      case 'wide':
        return 'w-full sm:max-w-2xl';
      case 'extra-wide':
        return 'w-full sm:max-w-4xl';
      default:
        return 'w-full sm:max-w-lg';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={`${getWidthClass()} overflow-y-auto`}>
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
        
          </div>
          {description && (
            <SheetDescription className="text-sm text-muted-foreground">
              {description}
            </SheetDescription>
          )}
          {showSteps && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full ${
                      i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </SheetHeader>
        
        <div className="py-6">
          {children}
        </div>

        <SheetFooter className="flex-col space-y-2 sm:flex-col sm:space-x-0 sm:space-y-2">
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : finalSaveText}
            </Button>
          </div>
          {onAlternateSave && (
            <Button
              onClick={onAlternateSave}
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : alternateSaveText}
            </Button>
          )}
          {additionalActions && (
            <div className="w-full">
              {additionalActions}
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
