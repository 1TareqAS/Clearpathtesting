import React from 'react';
import { Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { t, isRTL } from '../../utils/i18n';
import clsx from 'clsx';

interface Update {
  id: string;
  action: 'Added' | 'Edited' | 'Deleted';
  item: string;
  category: string;
  timestamp: Date;
  author: string;
}

const mockUpdates: Update[] = [
  {
    id: '1',
    action: 'Added',
    item: 'Payment Processing Error Resolution',
    category: 'Customer Side',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    author: 'Admin'
  },
  {
    id: '2',
    action: 'Edited',
    item: 'Order Cancellation Script',
    category: 'Merchant Side',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    author: 'Editor'
  },
  {
    id: '3',
    action: 'Deleted',
    item: 'Deprecated API Reference',
    category: 'General SOP',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    author: 'Admin'
  }
];

const LatestUpdates: React.FC = () => {
  const { state } = useAppContext();
  const isRtl = isRTL(state.language);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Added':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'Edited':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'Deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Added':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Edited':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Deleted':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6',
      isRtl && 'rtl'
    )}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        {t('common.latestUpdates', state.language)}
      </h3>
      
      <div className="space-y-4">
        {mockUpdates.map((update) => (
          <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <div className="flex-shrink-0 mt-1">
              {getActionIcon(update.action)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={clsx(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getActionColor(update.action)
                )}>
                  {update.action}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(update.timestamp)}
                </span>
              </div>
              
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {update.item}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{update.category}</span>
                <span>•</span>
                <span>by {update.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
        View All Updates
      </button>
    </div>
  );
};

export default LatestUpdates;