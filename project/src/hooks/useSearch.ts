import { useState, useEffect, useMemo } from 'react';
import { SearchResult } from '../types';
import { mockProblems, mockScripts, mockCategories } from '../data/mockData';

export const useSearch = (query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchData = useMemo(() => {
    const problemResults: SearchResult[] = mockProblems.map(problem => ({
      id: problem.id,
      type: 'problem' as const,
      title: problem.title,
      content: problem.faqLevels.map(faq => faq.question + ' ' + faq.answer).join(' '),
      category: mockCategories.find(cat => cat.id === problem.categoryId)?.name || '',
      relevance: 0,
      highlights: []
    }));

    const scriptResults: SearchResult[] = mockScripts.map(script => ({
      id: script.id,
      type: 'script' as const,
      title: script.title,
      content: script.content,
      category: script.category,
      relevance: 0,
      highlights: []
    }));

    const categoryResults: SearchResult[] = mockCategories.map(category => ({
      id: category.id,
      type: 'category' as const,
      title: category.name,
      content: category.description,
      category: 'Category',
      relevance: 0,
      highlights: []
    }));

    return [...problemResults, ...scriptResults, ...categoryResults];
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate search delay
    const searchTimeout = setTimeout(() => {
      const filteredResults = searchData
        .map(item => {
          const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
          const contentMatch = item.content.toLowerCase().includes(query.toLowerCase());
          
          if (!titleMatch && !contentMatch) return null;

          // Calculate relevance score
          let relevance = 0;
          if (titleMatch) relevance += 10;
          if (contentMatch) relevance += 5;
          
          // Add highlights
          const highlights: string[] = [];
          if (titleMatch) {
            highlights.push(item.title);
          }
          if (contentMatch) {
            const words = item.content.split(' ');
            const matchingWords = words.filter(word => 
              word.toLowerCase().includes(query.toLowerCase())
            );
            highlights.push(...matchingWords.slice(0, 3));
          }

          return {
            ...item,
            relevance,
            highlights: [...new Set(highlights)]
          };
        })
        .filter(Boolean)
        .sort((a, b) => (b?.relevance || 0) - (a?.relevance || 0))
        .slice(0, 10) as SearchResult[];

      setResults(filteredResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, searchData]);

  return { results, isLoading };
};