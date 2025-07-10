
import React, { useState } from 'react';
import { Check, ChevronDown, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  email: string;
  subdomain: string;
}

interface ClientSearchSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  onAddClient?: (clientData: { name: string; email: string; phone: string; subdomain: string }) => void;
  disabled?: boolean;
  showSubdomain?: boolean;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'TechCorp Inc.', email: 'john@techcorp.com', subdomain: 'techcorp' },
  { id: '2', name: 'StartupXYZ', email: 'sarah@startupxyz.com', subdomain: 'startupxyz' },
  { id: '3', name: 'BigCorp Ltd', email: 'michael@bigcorp.com', subdomain: 'bigcorp' },
  { id: '4', name: 'InnovateNow Corp', email: 'lisa@innovatenow.com', subdomain: 'innovatenow' },
  { id: '5', name: 'Future Systems Ltd', email: 'david@futuresystems.com', subdomain: 'futuresystems' },
];

export const ClientSearchSelect: React.FC<ClientSearchSelectProps> = ({
  value,
  onValueChange,
  onAddClient,
  disabled = false,
  showSubdomain = false,
}) => {
  const [open, setOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    subdomain: '',
  });

  const selectedClient = MOCK_CLIENTS.find(client => client.id === value);

  // Filter clients based on search
  const filteredClients = MOCK_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    client.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    client.subdomain.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddClient = () => {
    if (onAddClient && newClientData.name && newClientData.email && newClientData.subdomain) {
      onAddClient(newClientData);
      setNewClientData({ name: '', email: '', phone: '', subdomain: '' });
      setShowAddDialog(false);
    }
  };

  const validateSubdomain = (subdomain: string) => {
    if (!subdomain) return false;
    if (subdomain.length < 3) return false;
    if (!/^[a-z0-9-]+$/.test(subdomain)) return false;
    if (subdomain.startsWith('-') || subdomain.endsWith('-')) return false;
    return true;
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedClient ? (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{selectedClient.name}</div>
                  {showSubdomain && (
                    <div className="text-xs text-gray-500">{selectedClient.subdomain}.mycrm.com</div>
                  )}
                </div>
              </div>
            ) : (
              "Select client..."
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search clients..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList 
              onWheel={(e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.scrollTop += e.deltaY;
              }}
            >
              <CommandEmpty>
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">No clients found.</p>
                  {onAddClient && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddDialog(true);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add new client
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredClients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={client.id}
                    onSelect={() => {
                      onValueChange(client.id === value ? "" : client.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                      {showSubdomain && (
                        <div className="text-xs text-blue-600">{client.subdomain}.mycrm.com</div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {onAddClient && filteredClients.length > 0 && (
                <CommandGroup>
                  <CommandItem 
                    onSelect={() => {
                      setShowAddDialog(true);
                      setOpen(false);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add new client
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client account with basic information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clientName">Company Name *</Label>
              <Input
                id="clientName"
                value={newClientData.name}
                onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., TechCorp Inc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clientEmail">Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={newClientData.email}
                onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@techcorp.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clientPhone">Phone</Label>
              <Input
                id="clientPhone"
                value={newClientData.phone}
                onChange={(e) => setNewClientData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clientSubdomain">Subdomain *</Label>
              <div className="flex items-center">
                <Input
                  id="clientSubdomain"
                  value={newClientData.subdomain}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, subdomain: e.target.value.toLowerCase() }))}
                  placeholder="techcorp"
                  className="rounded-r-none border-r-0"
                />
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md text-sm text-gray-500">
                  .mycrm.com
                </div>
              </div>
              {newClientData.subdomain && !validateSubdomain(newClientData.subdomain) && (
                <p className="text-xs text-red-600">
                  Subdomain must be at least 3 characters and contain only lowercase letters, numbers, and hyphens
                </p>
              )}
              {newClientData.subdomain && validateSubdomain(newClientData.subdomain) && (
                <p className="text-xs text-green-600">
                  Client URL: {newClientData.subdomain}.mycrm.com
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClient}
              disabled={!newClientData.name || !newClientData.email || !validateSubdomain(newClientData.subdomain)}
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
