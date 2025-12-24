import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllRestaurantsQuery } from '../../features/restaurants/unifiedRestaurantApi';
import type { Restaurant } from '../../types/restaurant';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2, Search, Star, MapPin, Clock } from 'lucide-react';

const RestaurantList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error } = useGetAllRestaurantsQuery();
  const restaurants = data?.data || [];

  const filteredRestaurants = restaurants.filter((restaurant: Restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Loading Restaurants</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load restaurants</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
        <p className="text-gray-600">Browse our selection of restaurants</p>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Restaurants Found</h2>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant: Restaurant) => (
            <div
              key={restaurant.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/restaurants/${restaurant.id}`)}
            >
              <Card className="w-full">
                <div className="p-4">
                <h3 className="text-xl font-bold flex items-center mb-2">
                  <Building2 className="w-6 h-6 mr-2 text-primary" />
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {restaurant.description || 'A wonderful dining establishment'}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Open: {restaurant.openingTime} - {restaurant.closingTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{restaurant.averageRating || 'New'} ({restaurant.averageRating ? '100+ reviews' : '0 reviews'})</span>
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;