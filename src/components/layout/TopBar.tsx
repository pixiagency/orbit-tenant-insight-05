
import React, { useState } from 'react';
import { Search, Globe, Moon, Sun, Settings, User, Bell, X, Map, HelpCircle, FileText, LogOut, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onLanguageChange: (lang: string) => void;
  currentLanguage: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onThemeToggle,
  isDarkMode,
  onLanguageChange,
  currentLanguage
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const notifications = [
    { id: 1, message: "5 subscriptions expiring this week", type: "warning", time: "2 hours ago" },
    { id: 2, message: "New client signup: TechCorp Inc.", type: "success", time: "4 hours ago" },
    { id: 3, message: "High usage alert: DataFlow Ltd", type: "alert", time: "6 hours ago" },
    { id: 4, message: "Payment received: $12,500", type: "success", time: "1 day ago" },
    { id: 5, message: "System maintenance scheduled", type: "info", time: "2 days ago" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-sm mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search leads, contacts, deals..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-0 focus:bg-white dark:focus:bg-gray-600 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-full"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSearchOpen(false)}
                className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Press Enter to search or tap outside to close
            </div>
          </div>
        </div>
      )}

      {/* Main TopBar */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
        {/* Left Section - Search Bar (hidden on mobile, visible on md+) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search leads, contacts, deals..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-700 border-0 focus:bg-white dark:focus:bg-gray-600 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Search className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>

          {/* Import Center */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/import-export')}
            className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Import/Export Center"
          >
            <ArrowUpDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      <Badge 
                        variant={notification.type === 'success' ? 'default' : notification.type === 'warning' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <Button variant="ghost" className="w-full text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Language Switcher - Visible on all screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`${currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''} text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? 
              <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" /> : 
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            }
          </Button>

          {/* User Menu - User name visible on all screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DropdownMenuItem className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/admin/roadmap')}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Map className="mr-2 h-4 w-4" />
                Roadmap
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/admin/help-center')}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help Center
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/admin/changelog')}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FileText className="mr-2 h-4 w-4" />
                Changelog
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/admin/settings')}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
