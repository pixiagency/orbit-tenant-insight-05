
import React from 'react';
import { ModernSidebar } from './ModernSidebar';
import { useAuth } from '../../contexts/AuthContext';

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
}

export const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <ModernSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};
