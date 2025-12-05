import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useGetProfileQuery } from '../../features/auth/authApi';
import { useGetAllRestaurantsQuery } from '../../features/restaurant/restaurantApi';
import type { Restaurant } from '../../types/restaurant';

const Favorites: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');
  const { data: profile } = useGetProfileQuery();
  const { data: restaurantsData } = useGetAllRestaurantsQuery({
    page: 1,
    limit: 100,
  });

  // Get favorite restaurant IDs from profile
  const favoriteRestaurantIds = (profile as any)?.favoriteRestaurants || [];
  
  // Filter restaurants that are in favorites
  const favoriteRestaurants = restaurantsData?.data?.filter((restaurant: Restaurant) =>
    favoriteRestaurantIds.includes(restaurant.id)
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your saved restaurants and dishes
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
                activeTab === 'restaurants'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Restaurants ({favoriteRestaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('dishes')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
                activeTab === 'dishes'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Dishes (0)
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'restaurants' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRestaurants.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Favorite Restaurants Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start adding restaurants to your favorites!
                </p>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              favoriteRestaurants.map((restaurant: Restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center">
                    <span className="text-6xl">{(restaurant as any).logo || '🍽️'}</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {restaurant.name}
                      </h3>
                      <button className="text-red-500 hover:text-red-600">
                        ❤️
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {restaurant.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {restaurant.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {(restaurant as any).cuisine || 'Multiple'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/restaurants/${restaurant.id}`}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        View Menu
                      </Link>
                      <Link
                        to={`/reservations?restaurant=${restaurant.id}`}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Book Table
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Favorite Dishes Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Save your favorite dishes for quick reordering!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Favorites;