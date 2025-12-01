import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantMetrics } from '../hooks/useRestaurantMetrics';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { metrics } = useRestaurantMetrics();

  const actions = [
    {
      title: 'Manage Menu',
      description: 'Update menu items and prices',
      icon: '📋',
      action: () => navigate('/owner/menu'),
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Staff Schedule',
      description: 'Manage shifts and assignments',
      icon: '👥',
      count: metrics.staff.onDuty,
      countLabel: 'on duty',
      action: () => navigate('/owner/staff'),
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    },
    {
      title: 'Inventory',
      description: 'Check stock levels',
      icon: '📦',
      count: metrics.inventory.lowStock,
      countLabel: 'low stock',
      action: () => navigate('/owner/inventory'),
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Reservations',
      description: 'View today bookings',
      icon: '📅',
      count: metrics.reservations.today,
      countLabel: 'today',
      action: () => navigate('/owner/reservations'),
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 group text-center"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-3 ${action.color} group-hover:scale-110 transition-transform duration-200`}>
              {action.icon}
            </div>
            
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
              {action.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {action.description}
            </p>
            
            {action.count !== undefined && (
              <div className="mt-auto">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {action.count}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {action.countLabel}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;