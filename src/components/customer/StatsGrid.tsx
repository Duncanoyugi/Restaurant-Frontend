import React from 'react';
import { Link } from 'react-router-dom';

interface StatCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  link?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export const StatsGrid: React.FC = () => {
  // Mock data - replace with actual API data
  const stats: StatCard[] = [
    {
      title: 'Active Orders',
      value: 2,
      subtitle: 'In progress',
      icon: '🚀',
      trend: { value: 12, isPositive: true },
      link: '/dashboard/orders',
      color: 'blue'
    },
    {
      title: 'Upcoming Reservations',
      value: 3,
      subtitle: 'Next 7 days',
      icon: '📅',
      trend: { value: 5, isPositive: true },
      link: '/dashboard/reservations',
      color: 'green'
    },
    {
      title: 'Loyalty Points',
      value: '1,250',
      subtitle: 'Silver Tier',
      icon: '🎯',
      trend: { value: 8, isPositive: true },
      link: '/dashboard/rewards',
      color: 'purple'
    },
    {
      title: 'Monthly Orders',
      value: 8,
      subtitle: 'This month',
      icon: '📦',
      trend: { value: 15, isPositive: true },
      color: 'orange'
    },
    {
      title: 'Favorite Restaurants',
      value: 5,
      subtitle: 'Saved favorites',
      icon: '❤️',
      link: '/dashboard/favorites',
      color: 'red'
    },
    {
      title: 'Room Bookings',
      value: 1,
      subtitle: 'Upcoming stays',
      icon: '🏨',
      link: '/dashboard/room-bookings',
      color: 'blue'
    }
  ];

  const getColorClasses = (color: StatCard['color']) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color];
  };

  const CardContent = ({ stat }: { stat: StatCard }) => (
    <div className="flex items-center">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getColorClasses(stat.color)} flex items-center justify-center mr-4`}>
        <span className="text-white text-xl">{stat.icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
          {stat.trend && (
            <span className={`ml-2 text-sm font-medium ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trend.isPositive ? '↑' : '↓'} {stat.trend.value}%
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          {stat.link ? (
            <Link to={stat.link} className="block hover:opacity-80 transition-opacity">
              <CardContent stat={stat} />
            </Link>
          ) : (
            <CardContent stat={stat} />
          )}
        </div>
      ))}
    </div>
  );
};