import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRestaurantByIdQuery } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Building2, Users, Utensils, Calendar, Bed, Phone, Mail, MapPin, Clock, Star } from 'lucide-react';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(id || '', {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load restaurant data</span>
        </div>
        <Button onClick={() => navigate('/restaurants')} className="mt-4">
          Back to Restaurants
        </Button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Restaurant not found</span>
        </div>
        <Button onClick={() => navigate('/restaurants')} className="mt-4">
          Back to Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={() => navigate('/restaurants')} variant="outline" className="mb-4">
          ← Back to Restaurants
        </Button>
        <h1 className="text-3xl font-bold flex items-center mb-2">
          <Building2 className="w-8 h-8 mr-3 text-primary" />
          {restaurant.name}
        </h1>
        <div className="flex items-center mb-4">
          <Star className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="text-lg font-semibold">{restaurant.averageRating || 'New'} rating</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">About {restaurant.name}</h2>
              <p className="text-gray-600 mb-6">
                {restaurant.description || 'A wonderful dining establishment offering delicious food and excellent service.'}
              </p>

              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{restaurant.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{restaurant.email || 'Not provided'}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 mt-6">Operating Hours</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Monday - Friday: {restaurant.openingTime} - {restaurant.closingTime}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Saturday - Sunday: {restaurant.openingTime} - {restaurant.closingTime}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" onClick={() => navigate(`/menu?restaurant=${restaurant.id}`)}>
                  <Utensils className="w-4 h-4 mr-2" />
                  View Menu
                </Button>
                <Button className="w-full justify-start" onClick={() => navigate(`/reservations?restaurant=${restaurant.id}`)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Make Reservation
                </Button>
                <Button className="w-full justify-start" onClick={() => navigate(`/accommodation?restaurant=${restaurant.id}`)}>
                  <Bed className="w-4 h-4 mr-2" />
                  Book Room
                </Button>
                <Button className="w-full justify-start" onClick={() => navigate('/cart')}>
                  <Users className="w-4 h-4 mr-2" />
                  Order Online
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Restaurant Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Average Rating</p>
                  <p className="text-2xl font-bold">{restaurant.averageRating || 'New'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`text-lg font-semibold ${restaurant.active ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {restaurant.active ? 'Open' : 'Closed'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;