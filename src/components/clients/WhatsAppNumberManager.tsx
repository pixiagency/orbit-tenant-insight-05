import React, { useState } from 'react';
import { MessageSquare, Phone, Check, X, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  isWhatsApp: boolean;
  isPrimary: boolean;
  isVerified: boolean;
}

interface WhatsAppNumberManagerProps {
  clientId?: string;
  primaryPhone: string;
  phoneNumbers: PhoneNumber[];
  onPhoneNumbersChange: (phoneNumbers: PhoneNumber[]) => void;
}

export const WhatsAppNumberManager: React.FC<WhatsAppNumberManagerProps> = ({
  clientId,
  primaryPhone,
  phoneNumbers,
  onPhoneNumbersChange
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isWhatsApp, setIsWhatsApp] = useState(false);

  const handleAddNumber = () => {
    if (!newNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    const newPhoneNumber: PhoneNumber = {
      id: Date.now().toString(),
      number: newNumber.trim(),
      label: newLabel.trim() || 'Additional',
      isWhatsApp,
      isPrimary: false,
      isVerified: false
    };

    onPhoneNumbersChange([...phoneNumbers, newPhoneNumber]);
    toast.success('Phone number added');
    
    // Reset form
    setNewNumber('');
    setNewLabel('');
    setIsWhatsApp(false);
    setIsAddModalOpen(false);
  };

  const handleRemoveNumber = (id: string) => {
    onPhoneNumbersChange(phoneNumbers.filter(phone => phone.id !== id));
    toast.success('Phone number removed');
  };

  const handleToggleWhatsApp = (id: string) => {
    onPhoneNumbersChange(
      phoneNumbers.map(phone => 
        phone.id === id 
          ? { ...phone, isWhatsApp: !phone.isWhatsApp }
          : phone
      )
    );
  };

  const handleVerifyWhatsApp = (number: string) => {
    // This would trigger WhatsApp verification in a real implementation
    const whatsappUrl = `https://wa.me/${number}?text=Hello! This is a verification message to confirm this WhatsApp number.`;
    window.open(whatsappUrl, '_blank');
    toast.success('WhatsApp verification link opened');
  };

  const primaryPhoneObj: PhoneNumber = {
    id: 'primary',
    number: primaryPhone,
    label: 'Primary',
    isWhatsApp: true, // Assume primary phone supports WhatsApp by default
    isPrimary: true,
    isVerified: false
  };

  const allPhoneNumbers = [primaryPhoneObj, ...phoneNumbers];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          WhatsApp & Phone Numbers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <MessageSquare className="w-4 h-4" />
          <AlertDescription>
            Manage phone numbers and WhatsApp availability for this client. 
            This helps ensure messages are sent to the correct numbers.
          </AlertDescription>
        </Alert>

        {/* Phone Numbers List */}
        <div className="space-y-3">
          {allPhoneNumbers.map((phone) => (
            <div key={phone.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{phone.number}</span>
                  {phone.isPrimary && (
                    <Badge variant="default">Primary</Badge>
                  )}
                  {phone.isWhatsApp && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      WhatsApp
                    </Badge>
                  )}
                  {phone.isVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{phone.label}</p>
              </div>

              <div className="flex items-center gap-2">
                {phone.isWhatsApp && !phone.isVerified && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerifyWhatsApp(phone.number)}
                  >
                    Verify
                  </Button>
                )}
                
                {!phone.isPrimary && (
                  <>
                    <Button
                      size="sm"
                      variant={phone.isWhatsApp ? "default" : "outline"}
                      onClick={() => handleToggleWhatsApp(phone.id)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveNumber(phone.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Add Number Button */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Additional Number
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Phone Number</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newNumber">Phone Number</Label>
                <Input
                  id="newNumber"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newLabel">Label</Label>
                <Input
                  id="newLabel"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Work, Mobile, Assistant"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isWhatsApp"
                  checked={isWhatsApp}
                  onChange={(e) => setIsWhatsApp(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isWhatsApp">This number supports WhatsApp</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddNumber} className="flex-1">
                  Add Number
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};