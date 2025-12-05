import React from 'react';
import { Link } from 'react-router-dom';

interface Activity {
  id: string;
  type: 'order' | 'reservation' | 'review' | 'payment';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

export const RecentActivity: React.FC = () => {
  // Mock data - replace with actual API data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered',
      description: 'Italian Bistro - $42.50',
      time: '2 hours ago',
      icon: '📦',
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'review',
      title: 'Review Submitted',
      description: 'Rated Sushi Haven 5 stars',
      time: '5 hours ago',
      icon: '⭐',
      color: 'text-yellow-600'
    },
    {
      id: '3',
      type: 'reservation',
      title: 'Table Booked',
      description: 'Steakhouse - Tomorrow 8:00 PM',
      time: '1 day ago',
      icon: '📅',
      color: 'text-blue-600'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Processed',
      description: 'Room booking - $249.00',
      time: '2 days ago',
      icon: '💳',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <Link
          to="/dashboard/activity"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center ${activity.color}`}>
              <span className="text-lg">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {activity.description}
              </p>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};