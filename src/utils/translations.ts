interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  'dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'packages': { en: 'Packages', ar: 'الحزم' },
  'clients': { en: 'Clients', ar: 'العملاء' },
  'subscriptions': { en: 'Subscriptions', ar: 'الاشتراكات' },
  'users': { en: 'Users', ar: 'المستخدمون' },
  'settings': { en: 'Settings', ar: 'الإعدادات' },
  
  // Page Headers & Actions
  'Package Management': { en: 'Package Management', ar: 'إدارة الباقات' },
  'Add Package': { en: 'Add Package', ar: 'إضافة باقة' },
  'Export': { en: 'Export', ar: 'تصدير' },
  'Import': { en: 'Import', ar: 'استيراد' },
  'Create and manage CRM packages with features and pricing': {
    en: 'Create and manage CRM packages with features and pricing',
    ar: 'إنشاء وإدارة باقات CRM مع الميزات والأسعار'
  },
  'Super Admin': { en: 'Super Admin', ar: 'مشرف عام' },
  'Packages': { en: 'Packages', ar: 'الباقات' },
  'Clients': { en: 'Clients', ar: 'العملاء' },
  'Subscriptions': { en: 'Subscriptions', ar: 'الاشتراكات' },
  'Users': { en: 'Users', ar: 'المستخدمون' },
  'Settings': { en: 'Settings', ar: 'الإعدادات' },
  'Add New': { en: 'Add New', ar: 'إضافة جديد' },
  'Description': { en: 'Description', ar: 'الوصف' },
  'Save': { en: 'Save', ar: 'حفظ' },
  'Cancel': { en: 'Cancel', ar: 'إلغاء' },
  'Delete': { en: 'Delete', ar: 'حذف' },
  'Edit': { en: 'Edit', ar: 'تعديل' },
  'Create': { en: 'Create', ar: 'إنشاء' },
  'Search': { en: 'Search', ar: 'بحث' },
  'Filter': { en: 'Filter', ar: 'تصفية' },
  'Next': { en: 'Next', ar: 'التالي' },
  'Previous': { en: 'Previous', ar: 'السابق' },
  'Prev': { en: 'Prev', ar: 'السابق' },
  
  // Package form
  'package_name': { en: 'Package Name', ar: 'اسم الحزمة' },
  'description': { en: 'Description', ar: 'الوصف' },
  'price': { en: 'Price', ar: 'السعر' },
  'duration': { en: 'Duration', ar: 'المدة' },
  'max_users': { en: 'Max Users', ar: 'الحد الأقصى للمستخدمين' },
  'unlimited_users': { en: 'Unlimited Users', ar: 'مستخدمون غير محدودون' },
  'max_contacts': { en: 'Max Contacts', ar: 'الحد الأقصى لجهات الاتصال' },
  'storage_limit': { en: 'Storage Limit (GB)', ar: 'حد التخزين (جيجابايت)' },
  'notifications': { en: 'Notifications', ar: 'الإشعارات' },
  'voice_calls': { en: 'Voice Calls', ar: 'المكالمات الصوتية' },
  'ai_features': { en: 'AI Features', ar: 'ميزات الذكاء الاصطناعي' },
  'public_package': { en: 'Public Package', ar: 'حزمة عامة' },
  'package_status': { en: 'Package Status', ar: 'حالة الحزمة' },
  
  // Status
  'active': { en: 'Active', ar: 'نشط' },
  'inactive': { en: 'Inactive', ar: 'غير نشط' },
  
  // Common phrases
  'make_available': { en: 'Make this package available to customers', ar: 'جعل هذه الحزمة متاحة للعملاء' },
  'enable_disable': { en: 'Enable or disable this package', ar: 'تفعيل أو إلغاء تفعيل هذه الحزمة' },
};

export const t = (key: string, language: string = 'en'): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  return translation[language] || translation.en;
};

export const getDirection = (language: string): 'ltr' | 'rtl' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

export const getFontFamily = (language: string): string => {
  return language === 'ar' ? 'font-arabic' : 'font-sans';
};
