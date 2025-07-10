
import { useState, useEffect } from 'react';

interface Settings {
  [key: string]: any;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    // General Settings
    siteName: 'CRM System',
    siteUrl: 'https://example.com',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    language: 'en',
    
    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFrom: '',
    
    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 30,
    twoFactorAuth: false,
    loginAttempts: 5,
    
    // Sources
    leadSources: ['Website', 'Email', 'Phone', 'Referral', 'Social Media'],
    
    // Departments
    departments: ['Sales', 'Marketing', 'Support', 'HR', 'IT'],
    
    // Industries
    industries: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'],
  });

  const updateSetting = async (key: string, value: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  return {
    settings,
    updateSetting,
  };
};
