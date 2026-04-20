import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRestaurantByIdQuery } from '../../features/restaurants/unifiedRestaurantApi';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setSelectedRestaurant } from '../../features/booking/bookingSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Building2, Users, Utensils, Calendar, Bed, Phone, Mail, MapPin, Clock, Star, Globe, Heart, Share2, Navigation, ExternalLink } from 'lucide-react';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(id || '', {
    skip: !id,
  });

  const handleReservationClick = () => {
    if (isAuthenticated && restaurant) {
      dispatch(setSelectedRestaurant(Number(id)));
      navigate('/dashboard/reservations');
    } else {
      navigate(`/reservations?restaurant=${id}`);
    }
  };

  const handleRoomBookingClick = () => {
    if (isAuthenticated && restaurant) {
      dispatch(setSelectedRestaurant(Number(id)));
      navigate('/dashboard/rooms');
    } else {
      navigate(`/accommodation?restaurant=${id}`);
    }
  };

  const handleMenuClick = () => {
    if (isAuthenticated && restaurant) {
      dispatch(setSelectedRestaurant(Number(id)));
      navigate('/dashboard/orders');
    } else {
      navigate(`/menu?restaurant=${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Restaurant Not Found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't load the restaurant data. Please check the restaurant ID and try again.</p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => navigate('/restaurants')}
                      className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl"
                    >
                      Back to Restaurants
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-3 rounded-xl"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-l-4 border-amber-500 p-8 rounded-2xl shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl mr-4">
                  <Building2 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Restaurant Not Available</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">This restaurant is no longer available or has been removed.</p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => navigate('/restaurants')}
                      className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-3 rounded-xl"
                    >
                      Browse Restaurants
                    </Button>
                    <Button 
                      onClick={() => navigate(-1)}
                      variant="outline"
                      className="border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-6 py-3 rounded-xl"
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => navigate('/restaurants')}
              variant="outline"
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-xl"
            >
              ← All Restaurants
            </Button>
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:via-gray-800 dark:to-primary/10 rounded-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg mr-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {restaurant.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg">
                        {restaurant.averageRating ? renderStars(restaurant.averageRating) : (
                          <span className="text-gray-600 dark:text-gray-400">No ratings yet</span>
                        )}
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        restaurant.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {restaurant.active ? 'OPEN NOW' : 'CLOSED'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl">
                  {restaurant.description || 'A premier dining establishment offering exquisite cuisine and exceptional service in a sophisticated atmosphere.'}
                </p>
              </div>
              
              <div className="lg:text-right">
                <Button 
                  onClick={() => navigate(`/restaurants/${restaurant.id}/reservations`)}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Contact */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <Utensils className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About {restaurant.name}</h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent rounded-xl p-6 mb-8">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {restaurant.description || 'Experience culinary excellence at our restaurant, where we blend traditional flavors with modern techniques. Our chefs use only the freshest ingredients to create memorable dishes that delight the senses.'}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                        <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p className="font-medium text-gray-900 dark:text-white">{restaurant.streetAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                        <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">{restaurant.phone || 'Not available'}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4">
                        <Mail className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{restaurant.email || 'Not available'}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-4">
                        <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                        <p className="font-medium text-gray-900 dark:text-white">{restaurant.website || 'Not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Operating Hours */}
            <Card className="border border-gray-100 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-3">
                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Operating Hours</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/10 dark:to-transparent rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Weekdays</span>
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-sm">
                          Mon - Fri
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {restaurant.openingTime} - {restaurant.closingTime}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/10 dark:to-transparent rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Weekends</span>
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-sm">
                          Sat - Sun
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {restaurant.openingTime} - {restaurant.closingTime}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center">
                      <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Get directions to our restaurant
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border border-gray-100 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2.5 bg-primary/10 rounded-lg mr-3">
                    <ExternalLink className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                </div>
                
<div className="space-y-4">
                  <Button 
                    onClick={handleMenuClick}
                    className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:from-blue-700/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 justify-start px-6 py-4 rounded-xl group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">View Menu</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Browse our dishes</div>
                    </div>
                  </Button>

                  <Button 
                    onClick={handleReservationClick}
                    className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:from-green-700/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 justify-start px-6 py-4 rounded-xl group"
                  >
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Make Reservation</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Book your table</div>
                    </div>
                  </Button>

                  <Button 
                    onClick={handleRoomBookingClick}
                    className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:from-purple-700/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 justify-start px-6 py-4 rounded-xl group"
                  >
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">View Menu</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Browse our dishes</div>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => navigate(`/reservations?restaurant=${restaurant.id}`)}
                    className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 justify-start px-6 py-4 rounded-xl group"
                  >
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Make Reservation</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Book your table</div>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => navigate(`/accommodation?restaurant=${restaurant.id}`)}
                    className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 justify-start px-6 py-4 rounded-xl group"
                  >
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Book Room</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Accommodation booking</div>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => navigate('/cart')}
                    className="w-full bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700 justify-start px-6 py-4 rounded-xl group"
                  >
                    <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Order Online</div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Delivery & Takeout</div>
                    </div>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Restaurant Stats */}
            <Card className="border border-gray-100 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2.5 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg mr-3">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant Stats</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Average Rating</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-bold text-gray-900 dark:text-white">{restaurant.averageRating?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    {restaurant.averageRating && renderStars(restaurant.averageRating)}
                  </div>

                  <div className="p-5 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        restaurant.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {restaurant.active ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${restaurant.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {restaurant.active ? 'Currently Open' : 'Currently Closed'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {restaurant.active ? 'Ready to serve you!' : 'Check back during business hours'}
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Established</div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">2023</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Years of culinary excellence</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;