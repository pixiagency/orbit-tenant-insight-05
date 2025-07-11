
import React, { useState, useEffect } from 'react';
import { ModernSidebarWithSections } from './ModernSidebarWithSections';
import { TopBar } from './TopBar';
import { useAuth } from '../../contexts/AuthContext';

interface ComprehensiveDashboardLayoutProps {
  children: React.ReactNode;
}

export const ComprehensiveDashboardLayout: React.FC<ComprehensiveDashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  if (!user) {
    return null;
  }

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Apply RTL/LTR direction and proper font
    const isRTL = currentLanguage === 'ar';
    document.body.dir = isRTL ? 'rtl' : 'ltr';
    
    // Remove existing direction classes
    document.body.classList.remove('rtl', 'ltr', 'font-arabic', 'font-sans');
    
    // Add appropriate classes
    document.body.classList.add(isRTL ? 'rtl' : 'ltr');
    document.body.classList.add(isRTL ? 'font-arabic' : 'font-sans');
    
    // Also apply to html element for better font inheritance
    document.documentElement.classList.remove('font-arabic', 'font-sans');
    document.documentElement.classList.add(isRTL ? 'font-arabic' : 'font-sans');
  }, [currentLanguage]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Theme toggled:', !isDarkMode);
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    console.log('Language changed to:', language);
  };

  const isRTL = currentLanguage === 'ar';

  return (
    <div className={`flex h-screen bg-background transition-colors ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <ModernSidebarWithSections />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
          onLanguageChange={handleLanguageChange}
          currentLanguage={currentLanguage}
        />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
