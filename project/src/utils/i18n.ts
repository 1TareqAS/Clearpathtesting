import { Language } from '../contexts/AppContext';

interface Translations {
  [key: string]: {
    EN: string;
    AR: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.knowledgeBase': { EN: 'Knowledge Base', AR: 'قاعدة المعرفة' },
  'nav.scriptLibrary': { EN: 'Script Library', AR: 'مكتبة النصوص' },
  'nav.adminLogin': { EN: 'Admin Login', AR: 'دخول المشرف' },
  'nav.search': { EN: 'Search problems or scripts', AR: 'البحث في المشاكل أو النصوص' },

  // Categories
  'category.generalSOP': { EN: 'General SOP', AR: 'الإجراءات العامة' },
  'category.customerSide': { EN: 'Customer Side', AR: 'جانب العميل' },
  'category.riderSide': { EN: 'Rider Side', AR: 'جانب السائق' },
  'category.merchantSide': { EN: 'Merchant Side', AR: 'جانب التاجر' },

  // Scenarios
  'scenario.orderIssue': { EN: 'Order Issue', AR: 'مشكلة الطلب' },
  'scenario.nonOrderIssue': { EN: 'Non-Order Issue', AR: 'مشكلة غير متعلقة بالطلب' },
  'scenario.pickupIssue': { EN: 'Pickup Issue', AR: 'مشكلة الاستلام' },

  // Common
  'common.latestUpdates': { EN: 'Latest Updates', AR: 'آخر التحديثات' },
  'common.clear': { EN: 'Clear', AR: 'واضح' },
  'common.unclear': { EN: 'Unclear', AR: 'غير واضح' },
  'common.copy': { EN: 'Copy', AR: 'نسخ' },
  'common.search': { EN: 'Search', AR: 'بحث' },
  'common.save': { EN: 'Save', AR: 'حفظ' },
  'common.cancel': { EN: 'Cancel', AR: 'إلغاء' },
  'common.delete': { EN: 'Delete', AR: 'حذف' },
  'common.edit': { EN: 'Edit', AR: 'تعديل' },
  'common.add': { EN: 'Add', AR: 'إضافة' },

  // Admin
  'admin.categoriesScenarios': { EN: 'Categories & Scenarios', AR: 'الفئات والسيناريوهات' },
  'admin.problemsLogic': { EN: 'Problems & Logic', AR: 'المشاكل والمنطق' },
  'admin.scripts': { EN: 'Scripts', AR: 'النصوص' },
  'admin.updates': { EN: 'Updates', AR: 'التحديثات' },

  // Footer
  'footer.designedBy': { EN: 'Designed by Tareq Ahmad', AR: 'صممه طارق أحمد' }
};

export const t = (key: string, language: Language): string => {
  return translations[key]?.[language] || key;
};

export const isRTL = (language: Language): boolean => {
  return language === 'AR';
};