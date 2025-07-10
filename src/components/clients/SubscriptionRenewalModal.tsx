import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X } from 'lucide-react';
import { Client } from '../../types/superadmin';

interface SubscriptionRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: (renewalData: any) => void;
  client: Client | null;
}

const PACKAGES = [
  { id: '1', name: 'Starter Plan', price: 29 },
  { id: '2', name: 'Professional Plan', price: 99 },
  { id: '3', name: 'Enterprise Plan', price: 299 },
];

export const SubscriptionRenewalModal: React.FC<SubscriptionRenewalModalProps> = ({
  isOpen,
  onClose,
  onRenew,
  client,
}) => {
  const [renewalType, setRenewalType] = useState<'same' | 'different'>('same');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [duration, setDuration] = useState('12');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!client) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const renewalData = {
      clientId: client.id,
      renewalType,
      packageId: renewalType === 'same' ? client.packageId : selectedPackageId,
      duration: parseInt(duration),
      notes,
      attachment,
    };

    onRenew(renewalData);
    onClose();
  };

  const getCurrentPackage = () => {
    return PACKAGES.find(p => p.id === client.packageId);
  };

  const getSelectedPackage = () => {
    return PACKAGES.find(p => p.id === selectedPackageId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Renew Subscription - {client.companyName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Current Package Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Package:</strong> {client.packageName}</p>
                <p><strong>Monthly Revenue:</strong> ${client.monthlyRevenue}</p>
                <p><strong>Subscription End:</strong> {client.subscriptionEndDate ? new Date(client.subscriptionEndDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Renewal Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Renewal Options</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="same-package"
                  name="renewalType"
                  value="same"
                  checked={renewalType === 'same'}
                  onChange={(e) => setRenewalType(e.target.value as 'same' | 'different')}
                  className="h-4 w-4"
                />
                <Label htmlFor="same-package">Renew with same package ({client.packageName})</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="different-package"
                  name="renewalType"
                  value="different"
                  checked={renewalType === 'different'}
                  onChange={(e) => setRenewalType(e.target.value as 'same' | 'different')}
                  className="h-4 w-4"
                />
                <Label htmlFor="different-package">Choose a different package</Label>
              </div>
            </div>

            {renewalType === 'different' && (
              <div>
                <Label htmlFor="package-select">Select New Package *</Label>
                <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGES.map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">Renewal Duration (months) *</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="24">24 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <Label>Attachment (Contract, Invoice, etc.)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {attachment ? (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">{attachment.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAttachment}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)
            </p>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this renewal..."
              rows={3}
            />
          </div>

          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Renewal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Client:</strong> {client.companyName}</p>
                <p><strong>Package:</strong> {renewalType === 'same' ? getCurrentPackage()?.name : getSelectedPackage()?.name}</p>
                <p><strong>Duration:</strong> {duration} month{parseInt(duration) > 1 ? 's' : ''}</p>
                <p><strong>Monthly Cost:</strong> ${renewalType === 'same' ? getCurrentPackage()?.price : getSelectedPackage()?.price}</p>
                <p><strong>Total Cost:</strong> ${(renewalType === 'same' ? getCurrentPackage()?.price : getSelectedPackage()?.price || 0) * parseInt(duration)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={renewalType === 'different' && !selectedPackageId}
            >
              Process Renewal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};