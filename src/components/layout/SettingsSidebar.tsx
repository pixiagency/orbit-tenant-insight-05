
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSettingsMenu } from './AdminSettingsMenu';
import { SuperAdminSettingsMenu } from './SuperAdminSettingsMenu';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsSidebarProps {
  onBack: () => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ onBack }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1.5 h-auto hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isSuperAdmin ? 'Configure system settings' : 'Configure your system'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Settings Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {isSuperAdmin ? <SuperAdminSettingsMenu /> : <AdminSettingsMenu />}
      </nav>
    </div>
  );
};
