interface Translations {
  [key: string]: {
    en: string;
    es: string;
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  'dashboard': { en: 'Dashboard', es: 'Panel de Control', fr: 'Tableau de Bord', ar: 'لوحة التحكم' },
  'packages': { en: 'Packages', es: 'Paquetes', fr: 'Forfaits', ar: 'الحزم' },
  'clients': { en: 'Clients', es: 'Clientes', fr: 'Clients', ar: 'العملاء' },
  'subscriptions': { en: 'Subscriptions', es: 'Suscripciones', fr: 'Abonnements', ar: 'الاشتراكات' },
  'users': { en: 'Users', es: 'Usuarios', fr: 'Utilisateurs', ar: 'المستخدمون' },
  'settings': { en: 'Settings', es: 'Configuración', fr: 'Paramètres', ar: 'الإعدادات' },
  
  // Page Headers & Actions
  'Package Management': { en: 'Package Management', es: 'Gestión de Paquetes', fr: 'Gestion des Forfaits', ar: 'إدارة الباقات' },
  'Add Package': { en: 'Add Package', es: 'Agregar Paquete', fr: 'Ajouter Forfait', ar: 'إضافة باقة' },
  'Export': { en: 'Export', es: 'Exportar', fr: 'Exporter', ar: 'تصدير' },
  'Import': { en: 'Import', es: 'Importar', fr: 'Importer', ar: 'استيراد' },
  'Create and manage CRM packages with features and pricing': {
    en: 'Create and manage CRM packages with features and pricing',
    es: 'Crear y gestionar paquetes CRM con características y precios',
    fr: 'Créer et gérer des forfaits CRM avec fonctionnalités et tarification',
    ar: 'إنشاء وإدارة باقات CRM مع الميزات والأسعار'
  },
  'Super Admin': { en: 'Super Admin', es: 'Super Administrador', fr: 'Super Administrateur', ar: 'مشرف عام' },
  'Packages': { en: 'Packages', es: 'Paquetes', fr: 'Forfaits', ar: 'الباقات' },
  'Clients': { en: 'Clients', es: 'Clientes', fr: 'Clients', ar: 'العملاء' },
  'Subscriptions': { en: 'Subscriptions', es: 'Suscripciones', fr: 'Abonnements', ar: 'الاشتراكات' },
  'Users': { en: 'Users', es: 'Usuarios', fr: 'Utilisateurs', ar: 'المستخدمون' },
  'Settings': { en: 'Settings', es: 'Configuración', fr: 'Paramètres', ar: 'الإعدادات' },
  'Add New': { en: 'Add New', es: 'Agregar Nuevo', fr: 'Ajouter Nouveau', ar: 'إضافة جديد' },
  'Description': { en: 'Description', es: 'Descripción', fr: 'Description', ar: 'الوصف' },
  'Save': { en: 'Save', es: 'Guardar', fr: 'Enregistrer', ar: 'حفظ' },
  'Cancel': { en: 'Cancel', es: 'Cancelar', fr: 'Annuler', ar: 'إلغاء' },
  'Delete': { en: 'Delete', es: 'Eliminar', fr: 'Supprimer', ar: 'حذف' },
  'Edit': { en: 'Edit', es: 'Editar', fr: 'Modifier', ar: 'تعديل' },
  'Create': { en: 'Create', es: 'Crear', fr: 'Créer', ar: 'إنشاء' },
  'Search': { en: 'Search', es: 'Buscar', fr: 'Rechercher', ar: 'بحث' },
  'Filter': { en: 'Filter', es: 'Filtrar', fr: 'Filtrer', ar: 'تصفية' },
  'Next': { en: 'Next', es: 'Siguiente', fr: 'Suivant', ar: 'التالي' },
  'Previous': { en: 'Previous', es: 'Anterior', fr: 'Précédent', ar: 'السابق' },
  'Prev': { en: 'Prev', es: 'Ant.', fr: 'Préc.', ar: 'السابق' },
  
  // Package form
  'package_name': { en: 'Package Name', es: 'Nombre del Paquete', fr: 'Nom du Forfait', ar: 'اسم الحزمة' },
  'description': { en: 'Description', es: 'Descripción', fr: 'Description', ar: 'الوصف' },
  'price': { en: 'Price', es: 'Precio', fr: 'Prix', ar: 'السعر' },
  'duration': { en: 'Duration', es: 'Duración', fr: 'Durée', ar: 'المدة' },
  'max_users': { en: 'Max Users', es: 'Máximo de Usuarios', fr: 'Nombre Max d\'Utilisateurs', ar: 'الحد الأقصى للمستخدمين' },
  'unlimited_users': { en: 'Unlimited Users', es: 'Usuarios Ilimitados', fr: 'Utilisateurs Illimités', ar: 'مستخدمون غير محدودون' },
  'max_contacts': { en: 'Max Contacts', es: 'Máximo de Contactos', fr: 'Nombre Max de Contacts', ar: 'الحد الأقصى لجهات الاتصال' },
  'storage_limit': { en: 'Storage Limit (GB)', es: 'Límite de Almacenamiento (GB)', fr: 'Limite de Stockage (GB)', ar: 'حد التخزين (جيجابايت)' },
  'notifications': { en: 'Notifications', es: 'Notificaciones', fr: 'Notifications', ar: 'الإشعارات' },
  'voice_calls': { en: 'Voice Calls', es: 'Llamadas de Voz', fr: 'Appels Vocaux', ar: 'المكالمات الصوتية' },
  'ai_features': { en: 'AI Features', es: 'Funciones de IA', fr: 'Fonctionnalités IA', ar: 'ميزات الذكاء الاصطناعي' },
  'public_package': { en: 'Public Package', es: 'Paquete Público', fr: 'Forfait Public', ar: 'حزمة عامة' },
  'package_status': { en: 'Package Status', es: 'Estado del Paquete', fr: 'Statut du Forfait', ar: 'حالة الحزمة' },
  
  // Status
  'active': { en: 'Active', es: 'Activo', fr: 'Actif', ar: 'نشط' },
  'inactive': { en: 'Inactive', es: 'Inactivo', fr: 'Inactif', ar: 'غير نشط' },
  
  // Common phrases
  'make_available': { en: 'Make this package available to customers', es: 'Hacer este paquete disponible para clientes', fr: 'Rendre ce forfait disponible aux clients', ar: 'جعل هذه الحزمة متاحة للعملاء' },
  'enable_disable': { en: 'Enable or disable this package', es: 'Habilitar o deshabilitar este paquete', fr: 'Activer ou désactiver ce forfait', ar: 'تفعيل أو إلغاء تفعيل هذه الحزمة' },
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
