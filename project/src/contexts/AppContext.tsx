import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Language = 'EN' | 'AR';
export type Theme = 'light' | 'dark';
export type UserRole = 'Admin' | 'Editor' | 'Agent';

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AppState {
  language: Language;
  theme: Theme;
  user: User | null;
  isAuthenticated: boolean;
  searchQuery: string;
  selectedCategory: string;
  selectedScenario: string;
}

type AppAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SCENARIO'; payload: string };

const initialState: AppState = {
  language: 'EN',
  theme: 'light',
  user: null,
  isAuthenticated: false,
  searchQuery: '',
  selectedCategory: '',
  selectedScenario: ''
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};