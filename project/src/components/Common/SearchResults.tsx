import React from 'react';
import { Search, FileText, User, Package, AlertCircle } from 'lucide-react';
import { SearchResult } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import clsx from 'clsx';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  onResultClick: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  query,
  onResultClick
}) => {
  const { state } = useAppContext();
  const isRtl = isRTL(state.language);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'problem':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'script':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'category':
        return <Package className="w-4 h-4 text-purple-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (!query) return null;

  return (
    <div className={clsx(
      'absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50',
      isRtl && 'rtl'
    )}>
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="py-2">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => onResultClick(result)}
              className="w-full px-4 py-3 text-left rtl:text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {highlightText(result.title, query)}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {highlightText(result.content.substring(0, 100) + '...', query)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                      {result.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {result.type}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;