
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
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
