import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

// Temporary implementation - you should create proper API hooks
const useGetRestaurantsQuery = () => {
  return {
    data: { restaurants: [], total: 0 },
    isLoading: false,
  };
};

const useGetFavoriteRestaurantsQuery = () => {
  return {
    data: [],
  };
};

const useToggleFavoriteRestaurantMutation = () => {
  return [(_data: any) => Promise.resolve()];
};

const RestaurantList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  
  const { data: restaurantsData, isLoading } = useGetRestaurantsQuery();
  const { data: favoriteRestaurants } = useGetFavoriteRestaurantsQuery();
  
  const [toggleFavorite] = useToggleFavoriteRestaurantMutation();

  const isFavorite = (restaurantId: string) => {
    return (favoriteRestaurants as any[])?.some((fav: any) => fav.id === restaurantId) || false;
  };

  const handleToggleFavorite = async (restaurantId: string) => {
    await toggleFavorite({ restaurantId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const restaurants = restaurantsData?.restaurants || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Restaurants</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover amazing places to eat
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-soft border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Cuisines</option>
              <option value="italian">Italian</option>
              <option value="chinese">Chinese</option>
              <option value="indian">Indian</option>
              <option value="mexican">Mexican</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="rating">Highest Rated</option>
              <option value="distance">Nearest</option>
              <option value="delivery">Fastest Delivery</option>
            </select>
          </div>
        </div>

        {/* Restaurants List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No restaurants found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            restaurants.map((restaurant: any) => (
              <div
                key={restaurant.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={restaurant.image || 'https://via.placeholder.com/400x300'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleToggleFavorite(restaurant.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className={`text-xl ${isFavorite(restaurant.id) ? 'text-red-500' : 'text-gray-400'}`}>
                      {isFavorite(restaurant.id) ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">★★★★★</span>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {restaurant.rating} ({restaurant.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.cuisines?.map((cuisine: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Delivery:</span> ${restaurant.deliveryFee} • {restaurant.deliveryTime} min
                    </div>
                    <Link to={`/restaurants/${restaurant.id}`}>
                      <Button variant="primary" size="sm">
                        View Menu
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;