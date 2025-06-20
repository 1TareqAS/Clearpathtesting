import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { isRTL } from '../utils/i18n';
import LatestUpdates from '../components/Home/LatestUpdates';
import CategorySelector from '../components/Home/CategorySelector';
import ScenarioSelector from '../components/Home/ScenarioSelector';
import ProblemList from '../components/Home/ProblemList';
import clsx from 'clsx';

const Home: React.FC = () => {
  const { state } = useAppContext();
  const isRtl = isRTL(state.language);

  return (
    <div className={clsx('min-h-screen bg-gray-50 dark:bg-gray-900', isRtl && 'rtl')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome to ClearPath</h1>
              <p className="text-blue-100 text-lg">
                Your comprehensive support knowledge base for resolving customer, rider, and merchant issues efficiently.
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Select Issue Category
              </h2>
              <CategorySelector />
            </div>

            {/* Scenario Selection */}
            {state.selectedCategory && (
              <div className="transition-all duration-300 ease-in-out">
                <ScenarioSelector />
              </div>
            )}

            {/* Problem List */}
            {state.selectedCategory && state.selectedScenario && (
              <div className="transition-all duration-300 ease-in-out">
                <ProblemList />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LatestUpdates />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;