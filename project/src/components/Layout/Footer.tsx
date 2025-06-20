import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { t, isRTL } from '../../utils/i18n';
import clsx from 'clsx';

const Footer: React.FC = () => {
  const { state } = useAppContext();
  const isRtl = isRTL(state.language);

  return (
    <footer className={clsx(
      'bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8',
      isRtl && 'rtl'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('footer.designedBy', state.language)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;