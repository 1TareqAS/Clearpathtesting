import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { isRTL } from '../utils/i18n';
import ScriptCard from '../components/Scripts/ScriptCard';
import clsx from 'clsx';

const mockScripts = [
  {
    id: '1',
    title: 'Payment Failed - Card Declined',
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
    category: 'Customer Side',
    tags: ['payment', 'card', 'declined'],
    color: 'blue',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Order Cancellation Request',
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
    category: 'General SOP',
    tags: ['cancellation', 'refund', 'order'],
    color: 'green',
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Rider Location Update',
    content: `Hi [Customer Name],

Your order #[ORDER_ID] is on its way!

Current status:
📍 Your rider [RIDER_NAME] is currently [LOCATION]
⏱️ Estimated arrival: [TIME]
📱 You can track your order in real-time using the app

If you need to contact your rider directly, you can call [RIDER_PHONE].

Thank you for your patience!

Best regards,
[Agent Name]`,
    category: 'Rider Side',
    tags: ['tracking', 'location', 'delivery'],
    color: 'purple',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    title: 'Merchant Menu Update',
    content: `Dear [Merchant Name],

I've helped update your menu as requested:

Changes made:
• Added new items: [ITEM_LIST]
• Updated prices for: [PRICE_UPDATES]  
• Removed unavailable items: [REMOVED_ITEMS]

Your menu changes are now live and customers can see the updates immediately.

Please let me know if you need any further adjustments.

Best regards,
[Agent Name]`,
    category: 'Merchant Side',
    tags: ['menu', 'update', 'merchant'],
    color: 'orange',
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    title: 'Account Verification Process',
    content: `Hello [Customer Name],

Thank you for registering with us! To complete your account setup, please verify your email address.

Steps to verify:
1. Check your email inbox for our verification message
2. Click the verification link in the email
3. Your account will be activated immediately

If you don't see the email:
• Check your spam/junk folder
• Make sure you entered the correct email address
• Contact us if you need a new verification email

Welcome to our platform!

Best regards,
[Agent Name]`,
    category: 'Customer Side',
    tags: ['verification', 'account', 'email'],
    color: 'gray',
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '6',
    title: 'Delivery Issue Resolution',
    content: `Hi [Customer Name],

I sincerely apologize for the delivery issue with your order #[ORDER_ID].

Here's what I'm doing to resolve this:
1. I've contacted the delivery team to locate your order
2. If the order cannot be recovered, I'll process a full refund
3. I'm also adding a [COMPENSATION] credit to your account for the inconvenience

Expected resolution time: [TIMEFRAME]

I'll keep you updated every step of the way. Thank you for your patience.

Best regards,
[Agent Name]`,
    category: 'Rider Side',
    tags: ['delivery', 'issue', 'compensation'],
    color: 'red',
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

const Scripts: React.FC = () => {
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const isRtl = isRTL(state.language);

  const categories = ['All', 'Customer Side', 'Rider Side', 'Merchant Side', 'General SOP'];
  const allTags = Array.from(new Set(mockScripts.flatMap(script => script.tags)));
  const tags = ['All', ...allTags];

  const filteredScripts = mockScripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || script.category === selectedCategory;
    const matchesTag = selectedTag === 'All' || script.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className={clsx('min-h-screen bg-gray-50 dark:bg-gray-900', isRtl && 'rtl')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Script Library</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus className="w-4 h-4" />
              Add Script
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400">
            Ready-to-use scripts for common support scenarios. Copy, customize, and use them in your conversations.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={clsx(
                'absolute top-3 w-4 h-4 text-gray-400',
                isRtl ? 'right-3' : 'left-3'
              )} />
              <input
                type="text"
                placeholder="Search scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx(
                  'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left',
                  'py-2.5'
                )}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-2.5 px-4"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-2.5 px-4"
            >
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag === 'All' ? 'All Tags' : tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredScripts.length} of {mockScripts.length} scripts
          </p>
        </div>

        {/* Scripts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScripts.map(script => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>

        {/* Empty State */}
        {filteredScripts.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No scripts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scripts;