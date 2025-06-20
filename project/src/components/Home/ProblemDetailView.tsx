import React, { useState } from 'react';
import { CheckCircle, XCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Problem } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import clsx from 'clsx';

interface ProblemDetailViewProps {
  problem: Problem;
  onClose: () => void;
}

const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({ problem, onClose }) => {
  const { state } = useAppContext();
  const [currentFAQLevel, setCurrentFAQLevel] = useState(1);
  const [verificationChecked, setVerificationChecked] = useState<string[]>([]);
  const [isCleared, setIsCleared] = useState<boolean | null>(null);
  const [primarySelection, setPrimarySelection] = useState<string>('');
  const [secondarySelection, setSecondarySelection] = useState<string>('');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [expandedInstructions, setExpandedInstructions] = useState<string[]>([]);
  
  const isRtl = isRTL(state.language);

  const handleVerificationToggle = (stepId: string) => {
    setVerificationChecked(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleCopyScript = async (scriptContent: string, scriptId: string) => {
    try {
      await navigator.clipboard.writeText(scriptContent);
      setCopiedScript(scriptId);
      setTimeout(() => setCopiedScript(null), 2000);
    } catch (err) {
      console.error('Failed to copy script:', err);
    }
  };

  const toggleInstructionExpansion = (instructionId: string) => {
    setExpandedInstructions(prev =>
      prev.includes(instructionId)
        ? prev.filter(id => id !== instructionId)
        : [...prev, instructionId]
    );
  };

  // Mock data for unclear path options
  const primaryOptions = [
    { id: '1', label: 'Technical Issue', labelAR: 'مشكلة تقنية' },
    { id: '2', label: 'Account Problem', labelAR: 'مشكلة في الحساب' },
    { id: '3', label: 'Payment Issue', labelAR: 'مشكلة في الدفع' },
    { id: '4', label: 'Service Quality', labelAR: 'جودة الخدمة' },
    { id: '5', label: 'Policy Question', labelAR: 'سؤال عن السياسة' },
    { id: '6', label: 'Other', labelAR: 'أخرى' }
  ];

  const secondaryOptions = [
    { id: '1', label: 'Urgent', labelAR: 'عاجل' },
    { id: '2', label: 'Standard', labelAR: 'عادي' }
  ];

  const mockInstructions = [
    {
      id: '1',
      content: 'Verify customer account status and recent activity',
      contentAR: 'تحقق من حالة حساب العميل والنشاط الأخير',
      type: 'action' as const
    },
    {
      id: '2',
      content: 'Check payment method validity and authorization',
      contentAR: 'تحقق من صحة طريقة الدفع والتفويض',
      type: 'action' as const
    },
    {
      id: '3',
      content: 'Review order history for similar issues',
      contentAR: 'راجع تاريخ الطلبات للمشاكل المماثلة',
      type: 'info' as const
    }
  ];

  const mockScript = `Hi [Customer Name],

Thank you for contacting us regarding your payment issue.

I've reviewed your account and found that [SPECIFIC_ISSUE]. Here's how we'll resolve this:

1. [STEP_1]
2. [STEP_2]
3. [STEP_3]

I've processed the necessary changes on our end. You should see the resolution within [TIMEFRAME].

Is there anything else I can help you with today?

Best regards,
[Agent Name]`;

  return (
    <div className={clsx(
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',
      isRtl && 'rtl'
    )}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {state.language === 'AR' ? problem.titleAR : problem.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* FAQ Levels */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              FAQ Levels
            </h3>
            <div className="space-y-4">
              {problem.faqLevels.map((faq) => (
                <div
                  key={faq.id}
                  className={clsx(
                    'border rounded-lg p-4 transition-all duration-200',
                    currentFAQLevel === faq.level
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  )}
                >
                  <button
                    onClick={() => setCurrentFAQLevel(faq.level)}
                    className="w-full text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-sm font-medium">
                        Level {faq.level}
                      </span>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {state.language === 'AR' ? faq.questionAR : faq.question}
                      </h4>
                    </div>
                  </button>
                  {currentFAQLevel === faq.level && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">
                        {state.language === 'AR' ? faq.answerAR : faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verification Checklist */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Verification Checklist
            </h3>
            <div className="space-y-3">
              {problem.verificationSteps.map((step) => (
                <label
                  key={step.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={verificationChecked.includes(step.id)}
                    onChange={() => handleVerificationToggle(step.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">
                    {state.language === 'AR' ? step.stepAR : step.step}
                  </span>
                  {step.isRequired && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Clear or Unclear Selector */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Issue Status
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setIsCleared(true)}
                className={clsx(
                  'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  isCleared === true
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-green-50 dark:hover:bg-green-900/20'
                )}
              >
                <CheckCircle className="w-5 h-5" />
                Clear
              </button>
              <button
                onClick={() => setIsCleared(false)}
                className={clsx(
                  'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  isCleared === false
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-2 border-orange-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-orange-50 dark:hover:bg-orange-900/20'
                )}
              >
                <XCircle className="w-5 h-5" />
                Unclear
              </button>
            </div>
          </div>

          {/* Clear Path */}
          {isCleared === true && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
                Clear Resolution Path
              </h4>
              
              {/* Instructions */}
              <div className="space-y-3 mb-6">
                {mockInstructions.map((instruction) => (
                  <div
                    key={instruction.id}
                    className={clsx(
                      'p-3 rounded-lg border-l-4',
                      instruction.type === 'action' && 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
                      instruction.type === 'info' && 'bg-gray-50 dark:bg-gray-700 border-gray-500',
                      instruction.type === 'warning' && 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    )}
                  >
                    <p className="text-gray-800 dark:text-gray-200">
                      {state.language === 'AR' ? instruction.contentAR : instruction.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Script */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Resolution Script
                  </h5>
                  <button
                    onClick={() => handleCopyScript(mockScript, 'clear-script')}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors duration-200',
                      copiedScript === 'clear-script'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    {copiedScript === 'clear-script' ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {mockScript}
                </pre>
              </div>
            </div>
          )}

          {/* Unclear Path */}
          {isCleared === false && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">
                Unclear Issue - Additional Classification
              </h4>
              
              {/* Primary Options */}
              <div className="mb-6">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                  Primary Classification
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {primaryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setPrimarySelection(option.id)}
                      className={clsx(
                        'p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                        primarySelection === option.id
                          ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-600'
                      )}
                    >
                      {state.language === 'AR' ? option.labelAR : option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Options */}
              <div className="mb-6">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                  Priority Level
                </h5>
                <div className="flex gap-3">
                  {secondaryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSecondarySelection(option.id)}
                      className={clsx(
                        'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                        secondarySelection === option.id
                          ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-600'
                      )}
                    >
                      {state.language === 'AR' ? option.labelAR : option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Mapping */}
              {primarySelection && secondarySelection && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-4">
                    Recommended Resolution Steps
                  </h5>
                  
                  <div className="space-y-4">
                    {mockInstructions.map((instruction, index) => (
                      <div key={instruction.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200">
                            {state.language === 'AR' ? instruction.contentAR : instruction.content}
                          </p>
                          {instruction.content.length > 100 && (
                            <button
                              onClick={() => toggleInstructionExpansion(instruction.id)}
                              className="text-orange-600 dark:text-orange-400 text-sm mt-1 flex items-center gap-1"
                            >
                              {expandedInstructions.includes(instruction.id) ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Show More
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mapped Script */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-gray-900 dark:text-white">
                        Customized Script
                      </h6>
                      <button
                        onClick={() => handleCopyScript(mockScript, 'unclear-script')}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors duration-200',
                          copiedScript === 'unclear-script'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                        )}
                      >
                        {copiedScript === 'unclear-script' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {mockScript}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailView;