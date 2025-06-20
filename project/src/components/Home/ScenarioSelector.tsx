import React from 'react';
import { Package, AlertCircle, Truck } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { t, isRTL } from '../../utils/i18n';
import clsx from 'clsx';

const scenarios = [
  {
    id: 'orderIssue',
    key: 'scenario.orderIssue',
    icon: Package,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'nonOrderIssue',
    key: 'scenario.nonOrderIssue',
    icon: AlertCircle,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'pickupIssue',
    key: 'scenario.pickupIssue',
    icon: Truck,
    color: 'from-green-500 to-teal-500'
  }
];

const ScenarioSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const isRtl = isRTL(state.language);

  const handleScenarioSelect = (scenarioId: string) => {
    dispatch({ type: 'SET_SCENARIO', payload: scenarioId });
  };

  if (!state.selectedCategory) return null;

  return (
    <div className={clsx('space-y-4', isRtl && 'rtl')}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Select Scenario Type
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = state.selectedScenario === scenario.id;
          
          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario.id)}
              className={clsx(
                'group relative p-4 rounded-xl border-2 transition-all duration-300 text-left rtl:text-right',
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br',
                  scenario.color
                )}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t(scenario.key, state.language)}
                  </h4>
                </div>
                
                {isSelected && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioSelector;