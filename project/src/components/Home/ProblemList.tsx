import React, { useState } from 'react';
import { ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import { mockProblems } from '../../data/mockData';
import ProblemDetailView from './ProblemDetailView';
import clsx from 'clsx';

const ProblemList: React.FC = () => {
  const { state } = useAppContext();
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [detailViewProblem, setDetailViewProblem] = useState<any>(null);
  const isRtl = isRTL(state.language);

  const filteredProblems = mockProblems.filter(problem => 
    problem.categoryId === state.selectedCategory && 
    problem.scenarioId === state.selectedScenario
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'investigating':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleProblemClick = (problem: any) => {
    setDetailViewProblem(problem);
  };

  if (!state.selectedCategory || !state.selectedScenario) return null;

  return (
    <>
      <div className={clsx('space-y-4', isRtl && 'rtl')}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Related Problems
        </h3>
        
        <div className="space-y-3">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className={clsx(
                'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200',
                selectedProblem === problem.id
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              )}
            >
              <button
                onClick={() => setSelectedProblem(selectedProblem === problem.id ? null : problem.id)}
                className="w-full text-left rtl:text-right"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(problem.status)}
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {state.language === 'AR' ? problem.titleAR : problem.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getPriorityColor(problem.priority)
                      )}>
                        {problem.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Updated {problem.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className={clsx(
                    'w-5 h-5 text-gray-400 transition-transform duration-200',
                    selectedProblem === problem.id && 'rotate-90'
                  )} />
                </div>
              </button>
              
              {selectedProblem === problem.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Quick Overview</h5>
                      <div className="space-y-2">
                        {problem.faqLevels.slice(0, 2).map((faq, index) => (
                          <div key={faq.id} className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {state.language === 'AR' ? faq.questionAR : faq.question}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleProblemClick(problem)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      View Full Resolution Guide
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No problems found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No problems have been documented for this category and scenario yet.
            </p>
          </div>
        )}
      </div>

      {/* Problem Detail View Modal */}
      {detailViewProblem && (
        <ProblemDetailView
          problem={detailViewProblem}
          onClose={() => setDetailViewProblem(null)}
        />
      )}
    </>
  );
};

export default ProblemList;