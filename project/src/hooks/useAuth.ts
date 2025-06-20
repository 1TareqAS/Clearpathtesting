import { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Simulate checking for existing auth token
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('clearpath_token');
        if (token) {
          // In a real app, validate token with backend
          const mockUser: User = {
            id: '1',
            name: 'Admin User',
            email: 'admin@clearpath.com',
            role: 'Admin',
            createdAt: new Date(),
            lastLogin: new Date()
          };
          setAuthState({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in real app, call your auth API
      if (email === 'admin@clearpath.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@clearpath.com',
          role: 'Admin',
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        localStorage.setItem('clearpath_token', 'mock_jwt_token');
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('clearpath_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};