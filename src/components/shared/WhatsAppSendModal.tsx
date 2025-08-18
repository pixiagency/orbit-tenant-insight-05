import React, { useState } from 'react';
import { MessageSquare, Phone, Check, X, Users, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  phone: string;
  whatsappNumber?: string;
  isWhatsappVerified?: boolean;
  email: string;
}

interface WhatsAppSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  productService: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    category: string;
  };
  clients?: Client[];
}

export const WhatsAppSendModal: React.FC<WhatsAppSendModalProps> = ({
  isOpen,
  onClose,
  productService,
  clients = []
}) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [includePrice, setIncludePrice] = useState(true);
  const [includeDescription, setIncludeDescription] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sendMode, setSendMode] = useState<'existing' | 'custom'>('existing');

  const defaultMessage = `Hi! 👋

I'd like to share this ${productService.category.toLowerCase()} with you:

*${productService.name}*
${includeDescription ? `${productService.description}` : ''}
${includePrice ? `💰 Price: ${productService.currency} ${productService.price}` : ''}

Let me know if you're interested or have any questions!

Best regards`;

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSend = () => {
    const message = customMessage || defaultMessage;
    
    if (sendMode === 'existing' && selectedClients.length === 0) {
      toast.error('Please select at least one client');
      return;
    }
    
    if (sendMode === 'custom' && !phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    // Format message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    if (sendMode === 'existing') {
      // Send to selected clients
      selectedClients.forEach(clientId => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          const whatsappUrl = `https://wa.me/${client.whatsappNumber || client.phone}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        }
      });
      toast.success(`WhatsApp messages opened for ${selectedClients.length} client(s)`);
    } else {
      // Send to custom number
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      toast.success('WhatsApp message opened');
    }
    
    onClose();
  };

  const getClientWhatsAppStatus = (client: Client) => {
    if (client.isWhatsappVerified) {
      return <Badge variant="default" className="ml-2"><Check className="w-3 h-3 mr-1" />Verified</Badge>;
    }
    if (client.whatsappNumber && client.whatsappNumber !== client.phone) {
      return <Badge variant="secondary" className="ml-2"><Phone className="w-3 h-3 mr-1" />Different #</Badge>;
    }
    return <Badge variant="outline" className="ml-2"><Phone className="w-3 h-3 mr-1" />Phone</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Send via WhatsApp: {productService.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Send Mode Selection */}
          <div className="flex gap-4">
            <Button
              variant={sendMode === 'existing' ? 'default' : 'outline'}
              onClick={() => setSendMode('existing')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Send to Clients
            </Button>
            <Button
              variant={sendMode === 'custom' ? 'default' : 'outline'}
              onClick={() => setSendMode('custom')}
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-2" />
              Custom Number
            </Button>
          </div>

          {sendMode === 'existing' ? (
            /* Client Selection */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Select Clients</Label>
                <span className="text-sm text-muted-foreground">
                  {selectedClients.length} selected
                </span>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                {clients.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No clients available
                  </p>
                ) : (
                  clients.map((client) => (
                    <Card key={client.id} className="cursor-pointer hover:bg-accent/50" 
                          onClick={() => handleClientToggle(client.id)}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={() => handleClientToggle(client.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium">{client.name}</span>
                              {getClientWhatsAppStatus(client)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {client.whatsappNumber || client.phone}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Custom Number Input */
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +1 for US, +44 for UK)
              </p>
            </div>
          )}

          <Separator />

          {/* Message Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Message Options</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={includePrice}
                  onCheckedChange={(checked) => setIncludePrice(checked === true)}
                />
                <Label className="text-sm">Include price information</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={includeDescription}
                  onCheckedChange={(checked) => setIncludeDescription(checked === true)}
                />
                <Label className="text-sm">Include product description</Label>
              </div>
            </div>
          </div>

          {/* Message Preview/Custom */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (leave empty for default)</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={defaultMessage}
              rows={8}
              className="resize-none"
            />
            {!customMessage && (
              <p className="text-xs text-muted-foreground">
                Preview of default message shown above
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSend} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};