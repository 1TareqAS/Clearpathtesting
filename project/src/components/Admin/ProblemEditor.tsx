import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Settings } from 'lucide-react';
import { Problem, FAQLevel, VerificationStep, ClearPath, UnclearPath } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import { mockCategories, mockScenarios } from '../../data/mockData';
import UnclearPathEditor from './UnclearPathEditor';
import clsx from 'clsx';

interface ProblemEditorProps {
  problem?: Problem;
  onSave: (problem: Problem) => void;
  onCancel: () => void;
}

const ProblemEditor: React.FC<ProblemEditorProps> = ({ problem, onSave, onCancel }) => {
  const { state } = useAppContext();
  const [formData, setFormData] = useState<Partial<Problem>>(
    problem || {
      title: '',
      titleAR: '',
      categoryId: '',
      scenarioId: '',
      priority: 'medium',
      status: 'pending',
      faqLevels: [],
      verificationSteps: [],
      tags: [],
      clearPath: undefined,
      unclearPath: undefined
    }
  );
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'faq' | 'verification' | 'paths'>('basic');
  const [editingUnclearPath, setEditingUnclearPath] = useState(false);
  const isRtl = isRTL(state.language);

  const filteredScenarios = mockScenarios.filter(scenario => 
    scenario.categoryId === formData.categoryId
  );

  const addFAQLevel = () => {
    const newLevel: FAQLevel = {
      id: `faq-${Date.now()}`,
      level: (formData.faqLevels?.length || 0) + 1,
      question: '',
      questionAR: '',
      answer: '',
      answerAR: '',
      isRequired: false
    };
    setFormData(prev => ({
      ...prev,
      faqLevels: [...(prev.faqLevels || []), newLevel]
    }));
  };

  const updateFAQLevel = (index: number, field: keyof FAQLevel, value: any) => {
    setFormData(prev => ({
      ...prev,
      faqLevels: prev.faqLevels?.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      ) || []
    }));
  };

  const removeFAQLevel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqLevels: prev.faqLevels?.filter((_, i) => i !== index) || []
    }));
  };

  const addVerificationStep = () => {
    const newStep: VerificationStep = {
      id: `step-${Date.now()}`,
      step: '',
      stepAR: '',
      order: (formData.verificationSteps?.length || 0) + 1,
      isRequired: false
    };
    setFormData(prev => ({
      ...prev,
      verificationSteps: [...(prev.verificationSteps || []), newStep]
    }));
  };

  const updateVerificationStep = (index: number, field: keyof VerificationStep, value: any) => {
    setFormData(prev => ({
      ...prev,
      verificationSteps: prev.verificationSteps?.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      ) || []
    }));
  };

  const removeVerificationStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verificationSteps: prev.verificationSteps?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleClearPathUpdate = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      clearPath: {
        ...prev.clearPath,
        id: prev.clearPath?.id || `clear-${Date.now()}`,
        [field]: value
      } as ClearPath
    }));
  };

  const handleUnclearPathSave = (unclearPath: UnclearPath) => {
    setFormData(prev => ({
      ...prev,
      unclearPath
    }));
    setEditingUnclearPath(false);
  };

  const handleSave = () => {
    const problemData: Problem = {
      id: problem?.id || `problem-${Date.now()}`,
      title: formData.title || '',
      titleAR: formData.titleAR || '',
      categoryId: formData.categoryId || '',
      scenarioId: formData.scenarioId || '',
      priority: formData.priority || 'medium',
      status: formData.status || 'pending',
      faqLevels: formData.faqLevels || [],
      verificationSteps: formData.verificationSteps || [],
      clearPath: formData.clearPath,
      unclearPath: formData.unclearPath,
      tags: formData.tags || [],
      createdAt: problem?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: problem?.createdBy || 'current-user'
    };
    onSave(problemData);
  };

  if (editingUnclearPath) {
    return (
      <UnclearPathEditor
        unclearPath={formData.unclearPath}
        onSave={handleUnclearPathSave}
        onCancel={() => setEditingUnclearPath(false)}
      />
    );
  }

  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6', isRtl && 'rtl')}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {problem ? 'Edit Problem' : 'Create New Problem'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'faq', label: 'FAQ Levels' },
            { id: 'verification', label: 'Verification' },
            { id: 'paths', label: 'Resolution Paths' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter problem title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title (Arabic)
                  </label>
                  <input
                    type="text"
                    value={formData.titleAR || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleAR: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل عنوان المشكلة"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value, scenarioId: '' }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {state.language === 'AR' ? category.nameAR : category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scenario
                  </label>
                  <select
                    value={formData.scenarioId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, scenarioId: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.categoryId}
                  >
                    <option value="">Select Scenario</option>
                    {filteredScenarios.map(scenario => (
                      <option key={scenario.id} value={scenario.id}>
                        {state.language === 'AR' ? scenario.nameAR : scenario.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Levels Tab */}
        {activeTab === 'faq' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">FAQ Levels</h4>
              <button
                onClick={addFAQLevel}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add FAQ Level
              </button>
            </div>
            <div className="space-y-4">
              {formData.faqLevels?.map((faq, index) => (
                <div key={faq.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Level {faq.level}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          checked={faq.isRequired}
                          onChange={(e) => updateFAQLevel(index, 'isRequired', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Required
                      </label>
                      <button
                        onClick={() => removeFAQLevel(index)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Question (English)
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFAQLevel(index, 'question', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Question (Arabic)
                      </label>
                      <input
                        type="text"
                        value={faq.questionAR}
                        onChange={(e) => updateFAQLevel(index, 'questionAR', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Answer (English)
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQLevel(index, 'answer', e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Answer (Arabic)
                      </label>
                      <textarea
                        value={faq.answerAR}
                        onChange={(e) => updateFAQLevel(index, 'answerAR', e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Steps Tab */}
        {activeTab === 'verification' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Verification Steps</h4>
              <button
                onClick={addVerificationStep}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
            <div className="space-y-3">
              {formData.verificationSteps?.map((step, index) => (
                <div key={step.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Step {step.order}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          checked={step.isRequired}
                          onChange={(e) => updateVerificationStep(index, 'isRequired', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Required
                      </label>
                      <button
                        onClick={() => removeVerificationStep(index)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Step (English)
                      </label>
                      <input
                        type="text"
                        value={step.step}
                        onChange={(e) => updateVerificationStep(index, 'step', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Step (Arabic)
                      </label>
                      <input
                        type="text"
                        value={step.stepAR}
                        onChange={(e) => updateVerificationStep(index, 'stepAR', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Paths Tab */}
        {activeTab === 'paths' && (
          <div className="space-y-6">
            {/* Clear Path */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Clear Resolution Path</h4>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Clear Path Instructions (English)
                    </label>
                    <textarea
                      value={formData.clearPath?.instructions?.[0]?.content || ''}
                      onChange={(e) => handleClearPathUpdate('instructions', [{
                        id: 'clear-instruction-1',
                        content: e.target.value,
                        contentAR: formData.clearPath?.instructions?.[0]?.contentAR || '',
                        order: 1,
                        type: 'text' as const
                      }])}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter clear path instructions..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Clear Path Script (English)
                    </label>
                    <textarea
                      value={formData.clearPath?.script?.content || ''}
                      onChange={(e) => handleClearPathUpdate('script', {
                        id: 'clear-script',
                        title: 'Clear Path Script',
                        titleAR: 'نص المسار الواضح',
                        content: e.target.value,
                        contentAR: formData.clearPath?.script?.contentAR || '',
                        category: 'Resolution',
                        tags: ['clear-path'],
                        isTemplate: true,
                        variables: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        createdBy: 'current-user'
                      })}
                      rows={6}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="Enter clear path script..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Unclear Path */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">Unclear Resolution Path</h4>
                <button
                  onClick={() => setEditingUnclearPath(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                >
                  <Settings className="w-4 h-4" />
                  Configure Unclear Path
                </button>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                {formData.unclearPath ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Primary Options ({formData.unclearPath.primaryOptions.length})
                        </h5>
                        <div className="space-y-1">
                          {formData.unclearPath.primaryOptions.slice(0, 3).map((option) => (
                            <div key={option.id} className="text-sm text-gray-600 dark:text-gray-400">
                              • {state.language === 'AR' ? option.labelAR : option.label}
                            </div>
                          ))}
                          {formData.unclearPath.primaryOptions.length > 3 && (
                            <div className="text-sm text-gray-500 dark:text-gray-500">
                              ... and {formData.unclearPath.primaryOptions.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Secondary Options ({formData.unclearPath.secondaryOptions.length})
                        </h5>
                        <div className="space-y-1">
                          {formData.unclearPath.secondaryOptions.map((option) => (
                            <div key={option.id} className="text-sm text-gray-600 dark:text-gray-400">
                              • {state.language === 'AR' ? option.labelAR : option.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Result Mappings ({formData.unclearPath.resultMappings.length})
                      </h5>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.unclearPath.resultMappings.length} combinations configured with instructions and scripts
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      No unclear path configured yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Click "Configure Unclear Path" to set up dual selection options and result mappings
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemEditor;