import React from 'react';

interface Activity {
  id: number;
  type: 'user' | 'order' | 'restaurant' | 'system';
  action: string;
  user: string;
  timestamp: string;
  icon: string;
  color: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: 1,
      type: 'user',
      action: 'New user registration',
      user: 'john.doe@example.com',
      timestamp: '2 minutes ago',
      icon: '👤',
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'order',
      action: 'Large order placed',
      user: 'Order #2847',
      timestamp: '5 minutes ago',
      icon: '📦',
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'restaurant',
      action: 'Restaurant application submitted',
      user: "Tony's Pizza",
      timestamp: '15 minutes ago',
      icon: '🏪',
      color: 'text-orange-600'
    },
    {
      id: 4,
      type: 'system',
      action: 'System backup completed',
      user: 'Automated Process',
      timestamp: '30 minutes ago',
      icon: '💾',
      color: 'text-purple-600'
    },
    {
      id: 5,
      type: 'user',
      action: 'User role updated',
      user: 'sarah.connor@example.com',
      timestamp: '1 hour ago',
      icon: '👤',
      color: 'text-blue-600'
    }
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'order': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'restaurant': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
      case 'system': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityTypeColor(activity.type)} group-hover:scale-110 transition-transform duration-200`}>
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {activity.action}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {activity.user}
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Live activity feed updating
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;