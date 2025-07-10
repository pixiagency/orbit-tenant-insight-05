
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Building, Mail, Phone, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (clientData: any) => void;
}

const MOCK_PACKAGES = [
  { id: '1', name: 'Starter Plan', price: 49, currency: 'USD' },
  { id: '2', name: 'Professional Plan', price: 99, currency: 'USD' },
  { id: '3', name: 'Enterprise Plan', price: 199, currency: 'USD' },
];

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onClientCreated,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      // Company Information
      companyName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      
      // Subscription Details
      packageId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      autoRenew: true,
      trialDays: 0,
      notes: '',
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const selectedPackageId = watch('packageId');
  const selectedPackage = MOCK_PACKAGES.find(p => p.id === selectedPackageId);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call to create client and subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const clientData = {
        id: Date.now().toString(),
        companyName: data.companyName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        packageName: selectedPackage?.name || '',
        packageId: data.packageId,
        status: 'active',
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        usersCount: 1,
        usersLimit: 10,
        callMinutesUsed: 0,
        callMinutesLimit: 1000,
        subscriptionExpiry: data.endDate || null,
        subscription: {
          startDate: data.startDate,
          endDate: data.endDate,
          autoRenew: data.autoRenew,
          trialDays: data.trialDays,
          notes: data.notes,
        }
      };
      
      toast({
        title: "Client Created Successfully",
        description: `${data.companyName} has been created with ${selectedPackage?.name}`,
      });
      
      onClientCreated(clientData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Add New Client with Subscription
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
                <Input
                  {...register('companyName', { required: 'Company name is required' })}
                  placeholder="Enter company name"
                  className="mt-1"
                />
                {errors.companyName && (
                  <span className="text-sm text-red-600">{errors.companyName.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="contactName" className="text-sm font-medium">Contact Name *</Label>
                <Input
                  {...register('contactName', { required: 'Contact name is required' })}
                  placeholder="Enter contact person name"
                  className="mt-1"
                />
                {errors.contactName && (
                  <span className="text-sm text-red-600">{errors.contactName.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email *</Label>
                <Input
                  {...register('contactEmail', { 
                    required: 'Contact email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="contact@company.com"
                  className="mt-1"
                />
                {errors.contactEmail && (
                  <span className="text-sm text-red-600">{errors.contactEmail.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="contactPhone" className="text-sm font-medium">Contact Phone</Label>
                <Input
                  {...register('contactPhone')}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Subscription Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageId" className="text-sm font-medium">Select Package *</Label>
                <Select onValueChange={(value) => setValue('packageId', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PACKAGES.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price}/{pkg.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.packageId && (
                  <span className="text-sm text-red-600">Please select a package</span>
                )}
              </div>

              <div>
                <Label htmlFor="trialDays" className="text-sm font-medium">Trial Days</Label>
                <Input
                  {...register('trialDays', { valueAsNumber: true, min: 0 })}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
                <Input
                  {...register('startDate', { required: 'Start date is required' })}
                  type="date"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                <Input
                  {...register('endDate')}
                  type="date"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for recurring subscription</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Renewal</Label>
                <p className="text-xs text-gray-500">Automatically renew subscription</p>
              </div>
              <Switch
                checked={watch('autoRenew')}
                onCheckedChange={(checked: boolean) => setValue('autoRenew', checked)}
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">Internal Notes</Label>
              <Textarea
                {...register('notes')}
                placeholder="Add any notes about this client or subscription..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Client & Subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
