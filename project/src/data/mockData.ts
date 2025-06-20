import { Category, Scenario, Problem, Script, ActivityLog, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@clearpath.com',
    role: 'Admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'Editor User',
    email: 'editor@clearpath.com',
    role: 'Editor',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Agent User',
    email: 'agent@clearpath.com',
    role: 'Agent',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

export const mockCategories: Category[] = [
  {
    id: 'generalSOP',
    name: 'General SOP',
    nameAR: 'الإجراءات العامة',
    icon: 'FileText',
    color: 'gray',
    description: 'Standard operating procedures and general guidelines',
    descriptionAR: 'الإجراءات التشغيلية المعيارية والإرشادات العامة',
    scenarios: [],
    order: 1,
    isActive: true
  },
  {
    id: 'customerSide',
    name: 'Customer Side',
    nameAR: 'جانب العميل',
    icon: 'User',
    color: 'blue',
    description: 'Customer-related issues and resolutions',
    descriptionAR: 'المشاكل والحلول المتعلقة بالعملاء',
    scenarios: [],
    order: 2,
    isActive: true
  },
  {
    id: 'riderSide',
    name: 'Rider Side',
    nameAR: 'جانب السائق',
    icon: 'Car',
    color: 'green',
    description: 'Rider and delivery-related problems',
    descriptionAR: 'مشاكل السائقين والتوصيل',
    scenarios: [],
    order: 3,
    isActive: true
  },
  {
    id: 'merchantSide',
    name: 'Merchant Side',
    nameAR: 'جانب التاجر',
    icon: 'Store',
    color: 'purple',
    description: 'Merchant and business-related support',
    descriptionAR: 'دعم التجار والأعمال',
    scenarios: [],
    order: 4,
    isActive: true
  }
];

export const mockScenarios: Scenario[] = [
  {
    id: 'orderIssue',
    name: 'Order Issue',
    nameAR: 'مشكلة الطلب',
    categoryId: 'customerSide',
    icon: 'Package',
    color: 'orange',
    order: 1,
    isActive: true
  },
  {
    id: 'nonOrderIssue',
    name: 'Non-Order Issue',
    nameAR: 'مشكلة غير متعلقة بالطلب',
    categoryId: 'customerSide',
    icon: 'AlertCircle',
    color: 'blue',
    order: 2,
    isActive: true
  },
  {
    id: 'pickupIssue',
    name: 'Pickup Issue',
    nameAR: 'مشكلة الاستلام',
    categoryId: 'riderSide',
    icon: 'Truck',
    color: 'green',
    order: 1,
    isActive: true
  }
];

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Customer unable to complete payment',
    titleAR: 'العميل غير قادر على إكمال الدفع',
    categoryId: 'customerSide',
    scenarioId: 'orderIssue',
    priority: 'high',
    status: 'resolved',
    faqLevels: [
      {
        id: '1-1',
        level: 1,
        question: 'Is the payment method valid?',
        questionAR: 'هل طريقة الدفع صالحة؟',
        answer: 'Check if the card is not expired and has sufficient funds',
        answerAR: 'تحقق من أن البطاقة لم تنته صلاحيتها ولديها أموال كافية',
        isRequired: true
      },
      {
        id: '1-2',
        level: 2,
        question: 'Has the customer tried different payment methods?',
        questionAR: 'هل جرب العميل طرق دفع مختلفة؟',
        answer: 'Suggest trying a different card or payment method like digital wallet',
        answerAR: 'اقترح تجربة بطاقة مختلفة أو طريقة دفع مثل المحفظة الرقمية',
        isRequired: false
      }
    ],
    verificationSteps: [
      {
        id: '1-v1',
        step: 'Verify customer payment method',
        stepAR: 'تحقق من طريقة دفع العميل',
        order: 1,
        isRequired: true
      },
      {
        id: '1-v2',
        step: 'Check transaction history',
        stepAR: 'تحقق من تاريخ المعاملات',
        order: 2,
        isRequired: false
      }
    ],
    tags: ['payment', 'card', 'declined'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    createdBy: 'admin'
  },
  {
    id: '2',
    title: 'Order delivery delayed',
    titleAR: 'تأخير في توصيل الطلب',
    categoryId: 'customerSide',
    scenarioId: 'orderIssue',
    priority: 'medium',
    status: 'investigating',
    faqLevels: [
      {
        id: '2-1',
        level: 1,
        question: 'What is the current order status?',
        questionAR: 'ما هي حالة الطلب الحالية؟',
        answer: 'Check the order tracking system for real-time updates',
        answerAR: 'تحقق من نظام تتبع الطلبات للحصول على التحديثات الفورية',
        isRequired: true
      }
    ],
    verificationSteps: [
      {
        id: '2-v1',
        step: 'Check order tracking status',
        stepAR: 'تحقق من حالة تتبع الطلب',
        order: 1,
        isRequired: true
      }
    ],
    tags: ['delivery', 'delay', 'tracking'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    createdBy: 'editor'
  },
  {
    id: '3',
    title: 'Account login issues',
    titleAR: 'مشاكل في تسجيل الدخول للحساب',
    categoryId: 'customerSide',
    scenarioId: 'nonOrderIssue',
    priority: 'low',
    status: 'resolved',
    faqLevels: [
      {
        id: '3-1',
        level: 1,
        question: 'Is the customer using the correct email?',
        questionAR: 'هل يستخدم العميل البريد الإلكتروني الصحيح؟',
        answer: 'Verify the email address associated with the account',
        answerAR: 'تحقق من عنوان البريد الإلكتروني المرتبط بالحساب',
        isRequired: true
      }
    ],
    verificationSteps: [
      {
        id: '3-v1',
        step: 'Verify customer email address',
        stepAR: 'تحقق من عنوان البريد الإلكتروني للعميل',
        order: 1,
        isRequired: true
      }
    ],
    tags: ['login', 'account', 'password'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date(),
    createdBy: 'admin'
  }
];

export const mockScripts: Script[] = [
  {
    id: '1',
    title: 'Payment Failed - Card Declined',
    titleAR: 'فشل الدفع - رفض البطاقة',
    content: `Hi [Customer Name],

I understand your payment was declined. Let me help you resolve this issue right away.

First, please check:
1. Your card details are entered correctly
2. Your card has sufficient funds
3. Your card hasn't expired

If everything looks correct, please try:
- Using a different payment method
- Contacting your bank to authorize the transaction

Would you like me to send you a secure payment link to try again?

Best regards,
[Agent Name]`,
    contentAR: `مرحباً [اسم العميل]،

أفهم أن دفعتك قد رُفضت. دعني أساعدك في حل هذه المشكلة على الفور.

أولاً، يرجى التحقق من:
1. تم إدخال تفاصيل بطاقتك بشكل صحيح
2. بطاقتك لديها أموال كافية
3. بطاقتك لم تنته صلاحيتها

إذا كان كل شيء يبدو صحيحاً، يرجى المحاولة:
- استخدام طريقة دفع مختلفة
- الاتصال بالبنك للموافقة على المعاملة

هل تريد مني إرسال رابط دفع آمن لك للمحاولة مرة أخرى؟

مع أطيب التحيات،
[اسم الوكيل]`,
    category: 'Customer Side',
    tags: ['payment', 'card', 'declined'],
    color: 'blue',
    isTemplate: true,
    variables: [
      {
        id: 'customer-name',
        name: 'Customer Name',
        placeholder: '[Customer Name]',
        description: 'The customer\'s full name',
        isRequired: true
      },
      {
        id: 'agent-name',
        name: 'Agent Name',
        placeholder: '[Agent Name]',
        description: 'The support agent\'s name',
        isRequired: true
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'admin'
  },
  {
    id: '2',
    title: 'Order Cancellation Request',
    titleAR: 'طلب إلغاء الطلب',
    content: `Hello [Customer Name],

I've received your request to cancel order #[ORDER_ID].

I've successfully processed your cancellation and:
✓ Your refund of [AMOUNT] will be processed within 3-5 business days
✓ You'll receive a confirmation email shortly
✓ The charge will be reversed to your original payment method

Is there anything else I can help you with today?

Thank you for choosing our service.

Best regards,
[Agent Name]`,
    contentAR: `مرحباً [اسم العميل]،

لقد تلقيت طلبك لإلغاء الطلب رقم [رقم الطلب].

لقد قمت بمعالجة الإلغاء بنجاح و:
✓ سيتم معالجة استردادك بقيمة [المبلغ] خلال 3-5 أيام عمل
✓ ستتلقى بريد إلكتروني للتأكيد قريباً
✓ سيتم عكس الرسوم إلى طريقة الدفع الأصلية

هل هناك أي شيء آخر يمكنني مساعدتك به اليوم؟

شكراً لاختيارك خدمتنا.

مع أطيب التحيات،
[اسم الوكيل]`,
    category: 'General SOP',
    tags: ['cancellation', 'refund', 'order'],
    color: 'green',
    isTemplate: true,
    variables: [
      {
        id: 'customer-name',
        name: 'Customer Name',
        placeholder: '[Customer Name]',
        description: 'The customer\'s full name',
        isRequired: true
      },
      {
        id: 'order-id',
        name: 'Order ID',
        placeholder: '[ORDER_ID]',
        description: 'The order identification number',
        isRequired: true
      },
      {
        id: 'amount',
        name: 'Refund Amount',
        placeholder: '[AMOUNT]',
        description: 'The refund amount',
        isRequired: true
      },
      {
        id: 'agent-name',
        name: 'Agent Name',
        placeholder: '[Agent Name]',
        description: 'The support agent\'s name',
        isRequired: true
      }
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22'),
    createdBy: 'editor'
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'Added',
    entityType: 'Problem',
    entityId: '1',
    entityName: 'Payment Processing Error Resolution',
    userId: '1',
    userName: 'Admin User',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    changes: {
      title: 'Customer unable to complete payment',
      priority: 'high',
      status: 'resolved'
    }
  },
  {
    id: '2',
    action: 'Edited',
    entityType: 'Script',
    entityId: '1',
    entityName: 'Order Cancellation Script',
    userId: '2',
    userName: 'Editor User',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    changes: {
      content: 'Updated script content with new refund policy'
    }
  },
  {
    id: '3',
    action: 'Deleted',
    entityType: 'Category',
    entityId: '5',
    entityName: 'Deprecated API Reference',
    userId: '1',
    userName: 'Admin User',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: '4',
    action: 'Added',
    entityType: 'User',
    entityId: '3',
    entityName: 'Agent User',
    userId: '1',
    userName: 'Admin User',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    changes: {
      name: 'Agent User',
      email: 'agent@clearpath.com',
      role: 'Agent'
    }
  }
];