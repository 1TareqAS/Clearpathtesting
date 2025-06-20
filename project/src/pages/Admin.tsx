import React, { useState } from 'react';
import { Shield, Settings, FileText, Activity, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../contexts/AppContext';
import { isRTL } from '../utils/i18n';
import { mockCategories, mockScenarios, mockActivityLogs, mockUsers } from '../data/mockData';
import TreeEditor from '../components/Admin/TreeEditor';
import ActivityLogComponent from '../components/Admin/ActivityLog';
import UserManagement from '../components/Admin/UserManagement';
import ProblemManager from '../components/Admin/ProblemManager';
import ScriptManager from '../components/Admin/ScriptManager';
import clsx from 'clsx';

const Admin: React.FC = () => {
  const { state } = useAppContext();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [activeTab, setActiveTab] = useState('categories');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const isRtl = isRTL(state.language);

  const tabs = [
    { id: 'categories', label: 'Categories & Scenarios', icon: Settings },
    { id: 'problems', label: 'Problems & Logic', icon: FileText },
    { id: 'scripts', label: 'Scripts', icon: FileText },
    { id: 'updates', label: 'Updates', icon: Activity },
    { id: 'users', label: 'Users', icon: Users }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const success = await login(loginForm.email, loginForm.password);
    if (!success) {
      setLoginError('Invalid email or password');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={clsx('min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center', isRtl && 'rtl')}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Access</h2>
            <p className="text-gray-600 dark:text-gray-400">Please sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="admin@clearpath.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Demo credentials: admin@clearpath.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('min-h-screen bg-gray-50 dark:bg-gray-900', isRtl && 'rtl')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage categories, problems, scripts, and system updates
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 rtl:space-x-reverse px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'categories' && (
              <TreeEditor
                categories={mockCategories}
                scenarios={mockScenarios}
                onCategoryUpdate={(category) => console.log('Update category:', category)}
                onScenarioUpdate={(scenario) => console.log('Update scenario:', scenario)}
                onCategoryDelete={(categoryId) => console.log('Delete category:', categoryId)}
                onScenarioDelete={(scenarioId) => console.log('Delete scenario:', scenarioId)}
              />
            )}

            {activeTab === 'problems' && (
              <ProblemManager
                onProblemUpdate={(problem) => console.log('Update problem:', problem)}
                onProblemDelete={(problemId) => console.log('Delete problem:', problemId)}
                onProblemCreate={(problem) => console.log('Create problem:', problem)}
              />
            )}

            {activeTab === 'scripts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Script Management</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Create New Script
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Script management interface with rich text editor would be implemented here
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'updates' && (
              <ActivityLogComponent logs={mockActivityLogs} />
            )}

            {activeTab === 'users' && (
              <UserManagement
                users={mockUsers}
                onUserUpdate={(user) => console.log('Update user:', user)}
                onUserDelete={(userId) => console.log('Delete user:', userId)}
                onUserCreate={(user) => console.log('Create user:', user)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;