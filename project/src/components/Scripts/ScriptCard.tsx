import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import clsx from 'clsx';

interface Script {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  color?: string;
  updatedAt: Date;
}

interface ScriptCardProps {
  script: Script;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script }) => {
  const { state } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isRtl = isRTL(state.language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700';
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700';
      case 'gray':
        return 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const truncatedContent = script.content.length > 150 
    ? script.content.substring(0, 150) + '...'
    : script.content;

  return (
    <div className={clsx(
      'rounded-xl border p-6 transition-all duration-200 hover:shadow-md',
      getColorClass(script.color),
      isRtl && 'rtl'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {script.title}
          </h3>
          
          {/* Tags */}
          {script.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {script.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4 rtl:ml-0 rtl:mr-4">
          <button
            onClick={handleCopy}
            className={clsx(
              'p-2 rounded-lg transition-colors duration-200',
              isCopied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
            title={isCopied ? 'Copied!' : 'Copy script'}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
            {isExpanded ? script.content : truncatedContent}
          </p>
        </div>
        
        {script.content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            {isExpanded ? (
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

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          {script.category}
        </span>
        <span>
          Updated {script.updatedAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ScriptCard;