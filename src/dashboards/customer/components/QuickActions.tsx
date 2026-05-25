import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Calendar, Hotel, Zap, Heart, MapPin } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link: string;
  color: string;
  badge?: string;
}

export const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      title: 'Order Food',
      description: 'Browse menu & place order',
      icon: UtensilsCrossed,
      link: '/menu',
      color: 'from-primary-500 to-primary-600',
      badge: 'Popular'
    },
    {
      title: 'Book Table',
      description: 'Reserve your dining experience',
      icon: Calendar,
      link: '/reservations',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Book Room',
      description: 'Luxury accommodation',
      icon: Hotel,
      link: '/accommodation',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Quick Reorder',
      description: 'Repeat last order',
      icon: Zap,
      link: '/dashboard/orders', // Points to orders list as no dedicated reorder page exists
      color: 'from-primary-500 to-primary-600',
      badge: 'Fast'
    },
    {
      title: 'Favorites',
      description: 'Your saved items',
      icon: Heart,
      link: '/dashboard/favorites',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Track Order',
      description: 'Live order status',
      icon: MapPin,
      link: '/dashboard/orders',
      color: 'from-primary-500 to-primary-600'
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
            className="group relative bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600"
          >
            {action.badge && (
              <span className="absolute -top-2 -right-2 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {action.badge}
              </span>
            )}
            <div className={`w-12 h-12 rounded-lg bg-linear-to-r ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="text-white h-6 w-6" />
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