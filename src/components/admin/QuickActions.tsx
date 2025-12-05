import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from '../../Dashboard/admin/hooks/useDashboardMetrics';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { metrics } = useDashboardMetrics();

  const actions = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: '👥',
      count: metrics.users.newToday,
      countLabel: 'new today',
      action: () => navigate('/admin/users'),
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Restaurant Approvals',
      description: 'Review pending applications',
      icon: '🏪',
      count: metrics.restaurants.pendingApproval,
      countLabel: 'pending',
      action: () => navigate('/admin/restaurants'),
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Review Moderation',
      description: 'Approve or block reviews',
      icon: '⭐',
      count: 23,
      countLabel: 'awaiting',
      action: () => navigate('/admin/reviews'),
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    },
    {
      title: 'System Alerts',
      description: 'View and manage alerts',
      icon: '🔔',
      count: 5,
      countLabel: 'active',
      action: () => navigate('/admin/notifications'),
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Frequently used tasks
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 group"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
              {action.icon}
            </div>
            
            <div className="ml-4 flex-1 text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {action.count}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {action.countLabel}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Recent System Alerts
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                High order volume detected
              </span>
            </div>
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              5 min ago
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-red-800 dark:text-red-200">
                Payment gateway latency
              </span>
            </div>
            <span className="text-xs text-red-600 dark:text-red-400">
              15 min ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;