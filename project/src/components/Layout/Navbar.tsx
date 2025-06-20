import React, { useState } from 'react';
import { Search, Shield, Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useSearch } from '../../hooks/useSearch';
import { t, isRTL } from '../../utils/i18n';
import { Link, useLocation } from 'react-router-dom';
import SearchResults from '../Common/SearchResults';
import clsx from 'clsx';

const Navbar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { results: searchResults, isLoading: searchLoading } = useSearch(searchQuery);
  const isRtl = isRTL(state.language);

  const navItems = [
    { label: t('nav.knowledgeBase', state.language), link: '/', icon: null },
    { label: t('nav.scriptLibrary', state.language), link: '/scripts', icon: null },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const handleSearchResultClick = (result: any) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    // Handle navigation based on result type
    console.log('Navigate to:', result);
  };

  const toggleLanguage = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'EN' ? 'AR' : 'EN' });
    setIsLanguageOpen(false);
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <nav className={clsx(
      'sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700',
      isRtl && 'rtl'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ClearPath
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === item.link
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <Search className={clsx(
                'absolute top-3 w-4 h-4 text-gray-400',
                isRtl ? 'right-3' : 'left-3'
              )} />
              <input
                type="text"
                placeholder={t('nav.search', state.language)}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={clsx(
                  'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left',
                  'py-2.5'
                )}
              />
              
              {/* Search Results */}
              {isSearchFocused && (
                <SearchResults
                  results={searchResults}
                  isLoading={searchLoading}
                  query={searchQuery}
                  onResultClick={handleSearchResultClick}
                />
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Globe className="w-5 h-5" />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={toggleLanguage}
                    className="w-full px-4 py-2 text-left rtl:text-right text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {state.language === 'EN' ? 'العربية' : 'English'}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {state.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Admin Login */}
            <Link
              to="/admin"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title={t('nav.adminLogin', state.language)}
            >
              <Shield className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.link}
                  to={item.link}
                  onClick={() => setIsMenuOpen(false)}
                  className={clsx(
                    'block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === item.link
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Search */}
            <div className="mt-4 relative">
              <div className="relative">
                <Search className={clsx(
                  'absolute top-3 w-4 h-4 text-gray-400',
                  isRtl ? 'right-3' : 'left-3'
                )} />
                <input
                  type="text"
                  placeholder={t('nav.search', state.language)}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={clsx(
                    'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                    isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left',
                    'py-2.5'
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;