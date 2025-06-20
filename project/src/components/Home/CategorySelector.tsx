import React from 'react';
import { User, Car, Store, FileText } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { t, isRTL } from '../../utils/i18n';
import clsx from 'clsx';

const categories = [
  {
    id: 'generalSOP',
    key: 'category.generalSOP',
    icon: FileText,
    color: 'from-gray-500 to-gray-600',
    description: 'Standard operating procedures and general guidelines'
  },
  {
    id: 'customerSide',
    key: 'category.customerSide',
    icon: User,
    color: 'from-blue-500 to-blue-600',
    description: 'Customer-related issues and resolutions'
  },
  {
    id: 'riderSide',
    key: 'category.riderSide',
    icon: Car,
    color: 'from-green-500 to-green-600',
    description: 'Rider and delivery-related problems'
  },
  {
    id: 'merchantSide',
    key: 'category.merchantSide',
    icon: Store,
    color: 'from-purple-500 to-purple-600',
    description: 'Merchant and business-related support'
  }
];

const CategorySelector: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const isRtl = isRTL(state.language);

  const handleCategorySelect = (categoryId: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: categoryId });
    // Reset scenario when category changes
    dispatch({ type: 'SET_SCENARIO', payload: '' });
  };

  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', isRtl && 'rtl')}>
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = state.selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={clsx(
              'group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left rtl:text-right',
              isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg transform scale-105'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:transform hover:scale-102'
            )}
          >
            {/* Background Gradient */}
            <div className={clsx(
              'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br',
              category.color
            )} />
            
            {/* Icon */}
            <div className={clsx(
              'w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br',
              category.color
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t(category.key, state.language)}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {category.description}
            </p>
            
            {/* Selected Indicator */}
            {isSelected && (
              <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-3 h-3 bg-blue-500 rounded-full shadow-md" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;