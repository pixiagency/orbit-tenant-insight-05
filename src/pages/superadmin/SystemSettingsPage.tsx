
import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SystemSettingsForm } from '../../components/settings/SystemSettingsForm';
import { useSettings } from '../../hooks/use-settings';
import { cn } from '@/lib/utils';

export const SystemSettingsPage = () => {
  const { settings, updateSetting } = useSettings();
  const [activeTab, setActiveTab] = useState('sources');

  const handleSaveSettings = async (newSettings: any) => {
    try {
      for (const key in newSettings) {
        if (newSettings.hasOwnProperty(key)) {
          await updateSetting(key, newSettings[key]);
        }
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <PageHeader
        title="System Settings"
        description="Configure system-wide settings and preferences"
        breadcrumbs={[
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'System Settings' },
        ]}
        badge={`${Object.keys(settings).length} settings`}
        showAddButton={false}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'sources', label: 'Sources' },
              { id: 'departments', label: 'Departments' },
              { id: 'industries', label: 'Industries' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab && (
            <SystemSettingsForm
              settings={settings}
              activeTab={activeTab}
              onSave={handleSaveSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};
