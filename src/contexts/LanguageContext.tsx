
import React, { createContext, useContext, useState, useEffect } from 'react';
import { t, getDirection, getFontFamily } from '../utils/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
  translate: (key: string) => string;
  direction: 'ltr' | 'rtl';
  fontClass: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const isRTL = language === 'ar';
  const direction = getDirection(language);
  const fontClass = getFontFamily(language);

  useEffect(() => {
    // Apply RTL/LTR direction and font
    document.body.dir = direction;
    document.documentElement.dir = direction;
    
    // Remove existing direction and font classes
    document.body.classList.remove('rtl', 'ltr', 'font-arabic', 'font-sans');
    document.documentElement.classList.remove('font-arabic', 'font-sans');
    
    // Apply new classes
    document.body.classList.add(direction, fontClass);
    document.documentElement.classList.add(fontClass);
    
    // Set lang attribute for better accessibility
    document.documentElement.lang = language;
  }, [language, direction, fontClass]);

  const translate = (key: string) => t(key, language);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      isRTL, 
      translate, 
      direction, 
      fontClass 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
