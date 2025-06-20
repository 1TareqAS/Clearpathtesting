import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Problem } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import { mockProblems, mockCategories, mockScenarios } from '../../data/mockData';
import ProblemEditor from './ProblemEditor';
import clsx from 'clsx';

interface ProblemManagerProps {
  onProblemUpdate: (problem: Problem) => void;
  onProblemDelete: (problemId: string) => void;
  onProblemCreate: (problem: Problem) => void;
}

const ProblemManager: React.FC<ProblemManagerProps> = ({
  onProblemUpdate,
  onProblemDelete,
  onProblemCreate
}) => {
  const { state } = useAppContext();
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const isRtl = isRTL(state.language);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.titleAR.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || problem.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || problem.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || problem.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const handleCreateProblem = () => {
    setIsCreating(true);
    setEditingProblem(null);
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setIsCreating(false);
  };

  const handleSaveProblem = (problem: Problem) => {
    if (isCreating) {
      const newProblem = {
        ...problem,
        id: `problem-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user'
      };
      setProblems(prev => [...prev, newProblem]);
      onProblemCreate(newProblem);
    } else if (editingProblem) {
      const updatedProblem = {
        ...problem,
        updatedAt: new Date()
      };
      setProblems(prev => prev.map(p => p.id === problem.id ? updatedProblem : p));
      onProblemUpdate(updatedProblem);
    }
    
    setIsCreating(false);
    setEditingProblem(null);
  };

  const handleDeleteProblem = (problemId: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      setProblems(prev => prev.filter(p => p.id !== problemId));
      onProblemDelete(problemId);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProblem(null);
  };

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

  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? (state.language === 'AR' ? category.nameAR : category.name) : 'Unknown';
  };

  const getScenarioName = (scenarioId: string) => {
    const scenario = mockScenarios.find(s => s.id === scenarioId);
    return scenario ? (state.language === 'AR' ? scenario.nameAR : scenario.name) : 'Unknown';
  };

  if (isCreating || editingProblem) {
    return (
      <ProblemEditor
        problem={editingProblem || undefined}
        onSave={handleSaveProblem}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className={clsx('space-y-6', isRtl && 'rtl')}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Problems & Logic Management
        </h3>
        <button
          onClick={handleCreateProblem}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Create New Problem
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className={clsx(
              'absolute top-3 w-4 h-4 text-gray-400',
              isRtl ? 'right-3' : 'left-3'
            )} />
            <input
              type="text"
              placeholder="Search problems..."
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
            <option value="All">All Categories</option>
            {mockCategories.map(category => (
              <option key={category.id} value={category.id}>
                {state.language === 'AR' ? category.nameAR : category.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-2.5 px-4"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-2.5 px-4"
          >
            <option value="All">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProblems.length} of {problems.length} problems
        </p>
      </div>

      {/* Problems List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredProblems.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(problem.status)}
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {state.language === 'AR' ? problem.titleAR : problem.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getPriorityColor(problem.priority)
                      )}>
                        {problem.priority.toUpperCase()}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {getCategoryName(problem.categoryId)}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {getScenarioName(problem.scenarioId)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span>FAQ Levels: {problem.faqLevels.length}</span>
                      <span className="mx-2">•</span>
                      <span>Verification Steps: {problem.verificationSteps.length}</span>
                      <span className="mx-2">•</span>
                      <span>Updated: {problem.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4 rtl:ml-0 rtl:mr-4">
                    <button
                      onClick={() => handleEditProblem(problem)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                      title="Edit problem"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProblem(problem.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                      title="Delete problem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No problems found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All'
                ? 'Try adjusting your filters'
                : 'No problems have been created yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemManager;