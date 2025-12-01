import React from 'react';
import { Link } from 'react-router-dom';

interface Recommendation {
  id: string;
  type: 'restaurant' | 'dish' | 'offer';
  title: string;
  description: string;
  image: string;
  rating: number;
  price?: string;
  badge?: string;
}

export const PersonalizedRecommendations: React.FC = () => {
  // Mock data - replace with actual API data
  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'restaurant',
      title: 'Mediterranean Grill',
      description: 'Based on your love for healthy options',
      image: '🥗',
      rating: 4.7,
      badge: 'New'
    },
    {
      id: '2',
      type: 'dish',
      title: 'Truffle Pasta',
      description: 'Popular among customers with similar taste',
      image: '🍝',
      rating: 4.9,
      price: '$24.99'
    },
    {
      id: '3',
      type: 'offer',
      title: 'Weekend Special',
      description: '20% off all room bookings this weekend',
      image: '🎉',
      rating: 0,
      badge: 'Limited'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          For You
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{rec.image}</span>
              </div>
              {rec.badge && (
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {rec.badge}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {rec.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {rec.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {rec.rating}
                </span>
              </div>
              {rec.price && (
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {rec.price}
                </span>
              )}
            </div>

            <div className="mt-4">
              <Link
                to={rec.type === 'offer' ? '/accommodation' : '/menu'}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center block"
              >
                {rec.type === 'offer' ? 'Book Now' : 'View Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};