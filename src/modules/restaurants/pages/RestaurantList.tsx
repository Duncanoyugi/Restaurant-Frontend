import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { useGetAllRestaurantsQuery, useFindNearbyRestaurantsQuery } from '@/modules/restaurants/api/unifiedRestaurantApi';
import type { Restaurant } from '@/shared/types/restaurant';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/input';
import { Building2, Search, Star, MapPin, Clock, Filter, SlidersHorizontal, ChefHat, Sparkles, TrendingUp, Award, Heart } from 'lucide-react';

const RestaurantList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'newest'>('name');
  const [priceFilter, setPriceFilter] = useState<'all' | '$' | '$$' | '$$$'>('all');
  const [locationError, setLocationError] = useState('');
  const [locationChecked, setLocationChecked] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyQueryArgs, setNearbyQueryArgs] = useState<{ lat: number; lng: number; radius?: number } | null>(null);
  
  const { data, isLoading, error } = useGetAllRestaurantsQuery();
  const { data: nearbyRestaurants = [], isFetching: isFindingNearby } = useFindNearbyRestaurantsQuery(
    nearbyQueryArgs || { lat: 0, lng: 0, radius: 30 },
    { skip: !nearbyQueryArgs },
  );
  const restaurants = data?.data || [];

  const calculateDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Number((R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(2));
  };

  const detectNearestRestaurant = useCallback(() => {
    setLocationError('');
    if (!isAuthenticated) {
      setLocationError('Login to enable nearest restaurant suggestions.');
      return;
    }
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });
        setNearbyQueryArgs({ lat: latitude, lng: longitude, radius: 30 });
        setLocationChecked(true);
      },
      () => {
        setLocationError('Unable to read your location. Enable location permission and try again.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, [isAuthenticated]);

  const nearestRestaurant = useMemo(() => {
    if (!locationChecked || nearbyRestaurants.length === 0) return null;

    if (!currentCoords) return nearbyRestaurants[0];

    return [...nearbyRestaurants]
      .filter((restaurant) => restaurant.latitude !== undefined && restaurant.longitude !== undefined)
      .sort((a, b) => {
        const aDistance = calculateDistanceInKm(
          Number(a.latitude),
          Number(a.longitude),
          currentCoords.lat,
          currentCoords.lng,
        );
        const bDistance = calculateDistanceInKm(
          Number(b.latitude),
          Number(b.longitude),
          currentCoords.lat,
          currentCoords.lng,
        );
        return aDistance - bDistance;
      })[0] || nearbyRestaurants[0];
  }, [nearbyRestaurants, locationChecked, currentCoords]);

  useEffect(() => {
    if (isAuthenticated && !locationChecked) {
      detectNearestRestaurant();
    }
  }, [detectNearestRestaurant, isAuthenticated, locationChecked]);

  // Sort and filter restaurants
  let filteredRestaurants = restaurants.filter((restaurant: Restaurant) => {
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());
     
    // In a real app, you would have price data
    // This is just for demonstration
    const matchesPrice = priceFilter === 'all' || true;
     
    return matchesSearch && matchesPrice;
  });

  // Sort restaurants
  filteredRestaurants.sort((a: Restaurant, b: Restaurant) => {
    switch (sortBy) {
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'newest':
        // Assuming createdAt exists, fallback to ID
        return parseInt(b.id) - parseInt(a.id);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl mb-6">
              <Building2 className="w-16 h-16 text-primary animate-pulse mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Discovering Restaurants</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Loading amazing dining experiences...</p>
            <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary/60 animate-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-8 rounded-2xl shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl mr-4">
                  <Building2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Restaurants</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">We encountered an error while loading restaurants. Please try again later.</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-gradient-to-r from-yellow-400 to-amber-500';
    if (rating >= 4.0) return 'bg-gradient-to-r from-yellow-300 to-yellow-400';
    if (rating >= 3.5) return 'bg-gradient-to-r from-amber-300 to-amber-400';
    return 'bg-gradient-to-r from-gray-300 to-gray-400';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const isOpen = (openingTime: string, closingTime: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);
    
    const currentTime = currentHour * 60 + currentMinute;
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="mb-10 text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl mb-6">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Discover Amazing Restaurants
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Explore our curated selection of restaurants, from cozy cafes to fine dining experiences
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-primary mr-2" />
                <span className="font-semibold text-gray-900 dark:text-white">{restaurants.length}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Restaurants</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <ChefHat className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-semibold text-gray-900 dark:text-white">50+</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Cuisines</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-semibold text-gray-900 dark:text-white">4.5</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Avg Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={detectNearestRestaurant}
                disabled={isFindingNearby}
                variant="outline"
                className="rounded-xl"
              >
                {isFindingNearby ? 'Detecting nearest...' : 'Use my location'}
              </Button>
              {locationError && <span className="text-sm text-red-500">{locationError}</span>}
            </div>

            {nearestRestaurant && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Nearest suggestion: <button className="font-semibold underline" onClick={() => navigate(`/restaurants/${nearestRestaurant.id}`)}>{nearestRestaurant.name}</button>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search restaurants by name, cuisine, or location..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary/20 text-lg rounded-xl"
                  />
                </div>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="h-14 px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-14 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-transparent appearance-none pr-10"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="newest">Sort by Newest</option>
                  </select>
                  <SlidersHorizontal className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Price Range
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['all', '$', '$$', '$$$'].map((price) => (
                        <button
                          key={price}
                          onClick={() => setPriceFilter(price as any)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            priceFilter === price
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {price === 'all' ? 'All Prices' : price}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{filteredRestaurants.length}</span> of {restaurants.length} restaurants
          </p>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Restaurants Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {searchTerm ? 'Try adjusting your search or filters' : 'No restaurants available at the moment'}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map((restaurant: Restaurant) => {
              const open = isOpen(restaurant.openingTime, restaurant.closingTime);
              
              return (
                <div
                  key={restaurant.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                >
                  <Card className="h-full border-2 border-transparent hover:border-primary/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                    {/* Restaurant Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-20 h-20 text-primary/40" />
                      </div>
                      
                      {/* Rating Badge */}
                      {restaurant.averageRating && (
                        <div className="absolute top-4 right-4">
                          <div className={`px-3 py-1.5 rounded-full text-white font-bold shadow-lg ${getRatingColor(restaurant.averageRating)}`}>
                            {restaurant.averageRating.toFixed(1)}
                          </div>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-lg ${
                          open 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {open ? 'OPEN NOW' : 'CLOSED'}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {restaurant.name}
                        </h3>
                        <button 
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle favorite
                          }}
                        >
                          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                        {restaurant.description || 'A wonderful dining establishment offering delicious food and excellent service.'}
                      </p>

                      {/* Details */}
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                          <span className="text-sm truncate">{restaurant.streetAddress}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                            <span className="text-sm">{restaurant.openingTime} - {restaurant.closingTime}</span>
                          </div>
                          {restaurant.averageRating && restaurant.averageRating >= 4.5 && (
                            <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 px-2 py-1 rounded-full text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Top Rated
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        {restaurant.averageRating && (
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center">
                              {renderStars(restaurant.averageRating)}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {Math.floor(Math.random() * 500) + 100} reviews
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl group/btn"
                      >
                        <span className="group-hover/btn:translate-x-1 transition-transform inline-block">
                          View Details
                        </span>
                        <TrendingUp className="w-4 h-4 ml-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* Featured Section */}
        {filteredRestaurants.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Restaurants</h2>
                <p className="text-gray-600 dark:text-gray-400">Handpicked recommendations for you</p>
              </div>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRestaurants
                .filter((r: Restaurant) => r.averageRating && r.averageRating >= 4.5)
                .slice(0, 2)
                .map((restaurant: Restaurant) => (
                  <div
                    key={`featured-${restaurant.id}`}
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    className="bg-gradient-to-r from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:via-gray-800 dark:to-primary/10 rounded-2xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg mr-4">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{restaurant.name}</h3>
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium">
                            ⭐ {restaurant.averageRating?.toFixed(1)} Rating
                          </div>
                          <div className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
                            🏆 Featured
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{restaurant.description}</p>
                    <Button 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                    >
                      Explore Restaurant →
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RestaurantList;