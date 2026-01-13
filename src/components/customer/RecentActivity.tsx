import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Star, Calendar, CreditCard } from 'lucide-react';

interface Activity {
  id: string;
  type: 'order' | 'reservation' | 'review' | 'payment';
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export const RecentActivity: React.FC = () => {
  // Mock data - replace with actual API data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered',
      description: 'Italian Bistro - KSh 4,250',
      time: '2 hours ago',
      icon: Package,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'review',
      title: 'Review Submitted',
      description: 'Rated Sushi Haven 5 stars',
      time: '5 hours ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: '3',
      type: 'reservation',
      title: 'Table Booked',
      description: 'Steakhouse - Tomorrow 8:00 PM',
      time: '1 day ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Processed',
      description: 'Room booking - KSh 24,900',
      time: '2 days ago',
      icon: CreditCard,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        {/* Removed broken link to non-existent activity page */}
        <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
          Recent Updates
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center ${activity.color}`}>
                <IconComponent className="h-5 w-5" />
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
          );
        })}
      </div>
    </div>
  );
};