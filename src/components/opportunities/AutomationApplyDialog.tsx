import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Zap, Users, User, Pause, Play } from 'lucide-react';

interface AutomationApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityIds: string[];
  onApply: (automationId: string, action: 'apply' | 'pause_and_apply' | 'cancel') => void;
}

// Mock data for existing automations
const existingAutomations = [
  { customerId: '1', customerName: 'TechCorp Inc.', automationName: 'Lead Nurturing Sequence', status: 'active' },
  { customerId: '3', customerName: 'Manufacturing Ltd', automationName: 'Demo Follow-up', status: 'active' },
];

const availableAutomations = [
  { id: 'auto1', name: 'Lead Nurturing Sequence', description: 'Email sequence for new leads' },
  { id: 'auto2', name: 'Demo Follow-up', description: 'Follow-up sequence after demo' },
  { id: 'auto3', name: 'Proposal Follow-up', description: 'Follow-up after proposal sent' },
  { id: 'auto4', name: 'Win Back Campaign', description: 'Re-engagement for lost opportunities' },
];

export const AutomationApplyDialog: React.FC<AutomationApplyDialogProps> = ({
  isOpen,
  onClose,
  opportunityIds,
  onApply,
}) => {
  const [selectedAutomation, setSelectedAutomation] = useState('');

  // Get affected customers with existing automations
  const affectedCustomers = existingAutomations.filter(auto => 
    opportunityIds.some(id => auto.customerId === id)
  );

  const handleAction = (action: 'apply' | 'pause_and_apply' | 'cancel') => {
    if (action !== 'cancel' && !selectedAutomation) return;
    onApply(selectedAutomation, action);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Apply Automation</span>
          </DialogTitle>
          <DialogDescription>
            {opportunityIds.length === 1 
              ? 'Apply automation to 1 opportunity' 
              : `Apply automation to ${opportunityIds.length} opportunities`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Automation Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Automation</label>
            <Select value={selectedAutomation} onValueChange={setSelectedAutomation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an automation..." />
              </SelectTrigger>
              <SelectContent>
                {availableAutomations.map((automation) => (
                  <SelectItem key={automation.id} value={automation.id}>
                    <div>
                      <div className="font-medium">{automation.name}</div>
                      <div className="text-sm text-gray-500">{automation.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Existing Automations Warning */}
          {affectedCustomers.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Active Automations Detected
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    The following customers have active automations that will be affected:
                  </p>
                  <div className="space-y-2">
                    {affectedCustomers.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded p-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{customer.customerName}</span>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {customer.automationName}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Summary</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• {opportunityIds.length} opportunity(ies) selected</div>
              <div>• {affectedCustomers.length} customer(s) with existing automations</div>
              {selectedAutomation && (
                <div>• New automation: {availableAutomations.find(a => a.id === selectedAutomation)?.name}</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => handleAction('cancel')}>
            Cancel
          </Button>
          
          {affectedCustomers.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => handleAction('pause_and_apply')}
              disabled={!selectedAutomation}
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause & Apply New
            </Button>
          )}
          
          <Button 
            onClick={() => handleAction('apply')}
            disabled={!selectedAutomation}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {affectedCustomers.length > 0 ? 'Apply Anyway' : 'Apply Automation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
