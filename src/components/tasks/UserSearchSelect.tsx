
import React, { useState } from 'react';
import { Check, ChevronsUpDown, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TaskUser } from '@/types/users';

interface UserSearchSelectProps {
  users: TaskUser[];
  selectedUsers: string[];
  onSelectionChange: (selectedUsers: string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  excludeUsers?: string[];
}

export const UserSearchSelect: React.FC<UserSearchSelectProps> = ({
  users,
  selectedUsers,
  onSelectionChange,
  placeholder = "Select users...",
  multiple = false,
  excludeUsers = []
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const availableUsers = users.filter(user => !excludeUsers.includes(user.id));
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (userId: string) => {
    if (multiple) {
      const newSelection = selectedUsers.includes(userId)
        ? selectedUsers.filter(id => id !== userId)
        : [...selectedUsers, userId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([userId]);
      setOpen(false);
    }
  };

  const removeUser = (userId: string) => {
    onSelectionChange(selectedUsers.filter(id => id !== userId));
  };

  const getSelectedUserNames = () => {
    if (selectedUsers.length === 0) return placeholder;
    if (selectedUsers.length === 1) {
      const user = users.find(u => u.id === selectedUsers[0]);
      return user?.name || '';
    }
    return `${selectedUsers.length} users selected`;
  };

  const selectedUsersData = users.filter(user => selectedUsers.includes(user.id));

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="truncate">{getSelectedUserNames()}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search users..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => handleSelect(user.id)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.role}</div>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected users for multiple selection */}
      {multiple && selectedUsersData.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsersData.map((user) => (
            <Badge
              key={user.id}
              variant="secondary"
              className="flex items-center gap-1 py-1"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{user.name}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeUser(user.id)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
