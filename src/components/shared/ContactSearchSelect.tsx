import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

interface ContactSearchSelectProps {
  value?: string;
  onValueChange: (contactId: string, contact: Contact) => void;
  placeholder?: string;
  className?: string;
}

// Mock contacts data - in real app this would come from your leads/contacts API
const MOCK_CONTACTS: Contact[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', company: 'Tech Corp' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@startup.com', company: 'Startup Inc' },
  { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@enterprise.com', company: 'Enterprise LLC' },
  { id: '4', firstName: 'Alice', lastName: 'Brown', email: 'alice.brown@company.com', company: 'Brown & Associates' },
  { id: '5', firstName: 'Charlie', lastName: 'Wilson', email: 'charlie@techfirm.com', company: 'Tech Firm' },
];

export const ContactSearchSelect: React.FC<ContactSearchSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Search contacts...",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

  const selectedContact = contacts.find(contact => contact.id === value);

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = contact.email.toLowerCase();
    const company = contact.company?.toLowerCase() || '';
    const search = searchValue.toLowerCase();
    
    return fullName.includes(search) || email.includes(search) || company.includes(search);
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedContact ? (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{selectedContact.firstName} {selectedContact.lastName}</span>
              {selectedContact.company && (
                <span className="text-gray-500">- {selectedContact.company}</span>
              )}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search contacts..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No contacts found.</CommandEmpty>
            <CommandGroup>
              {filteredContacts.map((contact) => (
                <CommandItem
                  key={contact.id}
                  value={contact.id}
                  onSelect={(currentValue) => {
                    if (currentValue === value) {
                      onValueChange('', {} as Contact);
                    } else {
                      onValueChange(currentValue, contact);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === contact.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </span>
                      {contact.company && (
                        <span className="text-sm text-gray-500">- {contact.company}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">{contact.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};