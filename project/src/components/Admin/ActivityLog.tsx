import React, { useState } from 'react';
import { Clock, Edit, Plus, Trash2, Filter, Search } from 'lucide-react';
import { ActivityLog } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface ActivityLogProps {
  logs: ActivityLog[];
}

const ActivityLogComponent: React.FC<ActivityLogProps> = ({ logs }) => {
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('All');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('All');
  const isRtl = isRTL(state.language);

  const actionTypes = ['All', 'Added', 'Edited', 'Deleted'];
  const entityTypes = ['All', 'Category', 'Scenario', 'Problem', 'Script', 'User'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'All' || log.action === selectedAction;
    const matchesEntityType = selectedEntityType === 'All' || log.entityType === selectedEntityType;
    
    return matchesSearch && matchesAction && matchesEntityType;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Added':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'Edited':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'Deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Added':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Edited':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Deleted':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className={clsx('space-y-6', isRtl && 'rtl')}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity Log
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredLogs.length} of {logs.length} activities
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className={clsx(
              'absolute top-3 w-4 h-4 text-gray-400',
              isRtl ? 'right-3' : 'left-3'
            )} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={clsx(
                'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left',
                'py-2.5'
              )}
            />
          </div>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-2.5 px-4"
          >
            {actionTypes.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>

          {/* Entity Type Filter */}
          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-2.5 px-4"
          >
            {entityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getActionColor(log.action)
                      )}>
                        {log.action}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {log.entityType}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 dark:text-white mb-1">
                      <span className="font-medium">{log.userName}</span>
                      {' '}
                      {log.action.toLowerCase()}
                      {' '}
                      <span className="font-medium">{log.entityName}</span>
                    </p>
                    
                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                        <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Changes:</div>
                        {Object.entries(log.changes).map(([key, value]) => (
                          <div key={key} className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    {log.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || selectedAction !== 'All' || selectedEntityType !== 'All'
                ? 'Try adjusting your filters'
                : 'No activities have been recorded yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogComponent;