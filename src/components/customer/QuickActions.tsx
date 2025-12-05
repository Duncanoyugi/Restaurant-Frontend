import React from 'react';
import { Link } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  badge?: string;
}

export const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      title: 'Order Food',
      description: 'Browse menu & place order',
      icon: '🍽️',
      link: '/menu',
      color: 'from-primary-500 to-primary-600',
      badge: 'Popular'
    },
    {
      title: 'Book Table',
      description: 'Reserve your dining experience',
      icon: '📅',
      link: '/reservations',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Book Room',
      description: 'Luxury accommodation',
      icon: '🏨',
      link: '/accommodation',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Quick Reorder',
      description: 'Repeat last order',
      icon: '⚡',
      link: '/dashboard/orders/reorder',
      color: 'from-orange-500 to-orange-600',
      badge: 'Fast'
    },
    {
      title: 'Favorites',
      description: 'Your saved items',
      icon: '❤️',
      link: '/dashboard/favorites',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Track Order',
      description: 'Live order status',
      icon: '📍',
      link: '/dashboard/orders',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get things done faster
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600"
          >
            {action.badge && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {action.badge}
              </span>
            )}
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-white text-xl">{action.icon}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {action.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};