import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { useGetAllRestaurantsQuery, useGetStaffAssignmentsByRestaurantQuery, useGetDriverAssignmentsByRestaurantQuery } from '@/modules/restaurants/api/unifiedRestaurantApi';
import { UserRoleEnum } from '@/modules/auth/api/authSlice';
import type { StaffAssignment, DriverAssignment } from '@/modules/restaurants/api/unifiedRestaurantApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { Building2, Users, Truck, CheckCircle2, ArrowRight, MapPin, Clock, Star, Shield, Car, ChefHat } from 'lucide-react';

const SelectRestaurant: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { data: restaurantsData, error: restaurantsError, isLoading: restaurantsLoading } = useGetAllRestaurantsQuery();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [isAssigned, setIsAssigned] = useState<boolean>(false);
  const [assignmentType, setAssignmentType] = useState<'staff' | 'driver' | null>(null);

  const { data: staffAssignments } = useGetStaffAssignmentsByRestaurantQuery(selectedRestaurantId || 0, {
    skip: !selectedRestaurantId || user?.role !== UserRoleEnum.RESTAURANT_STAFF,
  });

  const { data: driverAssignments } = useGetDriverAssignmentsByRestaurantQuery(selectedRestaurantId || 0, {
    skip: !selectedRestaurantId || user?.role !== UserRoleEnum.DRIVER,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is already assigned to any restaurant
    if (user.role === UserRoleEnum.RESTAURANT_STAFF && staffAssignments) {
      const userAssignment = staffAssignments.find((a: StaffAssignment) => a.staffId === Number(user.id));
      if (userAssignment) {
        setIsAssigned(true);
        setAssignmentType('staff');
      }
    }

    if (user.role === UserRoleEnum.DRIVER && driverAssignments) {
      const userAssignment = driverAssignments.find((a: DriverAssignment) => a.driverId === Number(user.id));
      if (userAssignment) {
        setIsAssigned(true);
        setAssignmentType('driver');
      }
    }
  }, [user, staffAssignments, driverAssignments, navigate]);

  const handleRestaurantSelect = (restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
  };

  const handleProceed = () => {
    if (selectedRestaurantId) {
      if (user?.role === UserRoleEnum.RESTAURANT_STAFF) {
        navigate(`/staff/dashboard?restaurantId=${selectedRestaurantId}`);
      } else if (user?.role === UserRoleEnum.DRIVER) {
        navigate(`/driver/dashboard?restaurantId=${selectedRestaurantId}`);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case UserRoleEnum.RESTAURANT_STAFF:
        return <ChefHat className="w-5 h-5" />;
      case UserRoleEnum.DRIVER:
        return <Car className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case UserRoleEnum.RESTAURANT_STAFF:
        return 'Restaurant Staff';
      case UserRoleEnum.DRIVER:
        return 'Delivery Driver';
      default:
        return 'User';
    }
  };

  if (restaurantsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl mb-6">
              <Building2 className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Loading Restaurants</h2>
            <p className="text-gray-600 dark:text-gray-400">Preparing your selection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (restaurantsError) {
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Restaurant Loading Error</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Unable to load restaurant data. Please check your connection or try again later.</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const restaurants = restaurantsData?.data || [];

  if (isAssigned) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome Back, {user?.name}!
              </h1>
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-4 py-2 rounded-full mb-6">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg mr-2">
                  {getRoleIcon()}
                </div>
                <span className="font-medium text-blue-700 dark:text-blue-300">{getRoleTitle()}</span>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200 dark:border-green-800 mb-8">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Restaurant Assignment Complete</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You're already assigned to a restaurant as a {assignmentType}. You can proceed to your dashboard or select a different restaurant.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={() => {
                  if (user?.role === UserRoleEnum.RESTAURANT_STAFF) {
                    navigate('/staff/dashboard');
                  } else if (user?.role === UserRoleEnum.DRIVER) {
                    navigate('/driver/dashboard');
                  }
                }}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-4 rounded-xl text-lg"
              >
                <span className="flex items-center justify-center">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </Button>

              <Button 
                onClick={() => {
                  setIsAssigned(false);
                  setSelectedRestaurantId(null);
                }}
                variant="outline"
                className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-4 rounded-xl"
              >
                Select Different Restaurant
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl mb-6">
            {user?.role === UserRoleEnum.RESTAURANT_STAFF ? (
              <ChefHat className="w-12 h-12 text-primary" />
            ) : (
              <Truck className="w-12 h-12 text-primary" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Select Your Restaurant
          </h1>
          <div className="flex flex-col items-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-4">
              {user?.role === UserRoleEnum.RESTAURANT_STAFF
                ? 'Choose the restaurant where you work to access your staff dashboard'
                : 'Select the restaurant you deliver for to access your driver dashboard'}
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full">
              <div className="p-1.5 bg-primary/20 rounded-lg mr-2">
                {getRoleIcon()}
              </div>
              <span className="font-medium text-primary">{getRoleTitle()}</span>
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Restaurants</h2>
            <span className="text-gray-600 dark:text-gray-400">
              {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} available
            </span>
          </div>

          {restaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Restaurants Available</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">There are no restaurants to select from at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant) => {
                const isSelected = selectedRestaurantId === Number(restaurant.id);
                
                return (
                  <div
                    key={restaurant.id}
                    onClick={() => handleRestaurantSelect(Number(restaurant.id))}
                    className="group cursor-pointer"
                  >
                    <Card className={`h-full transition-all duration-300 ${
                      isSelected 
                        ? 'border-2 border-primary shadow-2xl scale-[1.02] bg-gradient-to-br from-primary/5 to-white dark:from-primary/10 dark:to-gray-800' 
                        : 'border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:shadow-xl'
                    }`}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`p-3 rounded-xl mr-4 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-primary to-primary/80' 
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'
                            }`}>
                              <Building2 className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {restaurant.name}
                              </h3>
                              {restaurant.averageRating && (
                                <div className="flex items-center mt-1">
                                  {renderStars(restaurant.averageRating)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                          {restaurant.description || 'A wonderful dining establishment offering delicious food and excellent service.'}
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{restaurant.streetAddress}</span>
                          </div>

                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                            <span className="text-sm">{restaurant.openingTime} - {restaurant.closingTime}</span>
                          </div>
                        </div>

                        <div className={`text-center py-2 rounded-lg text-sm font-medium ${
                          isSelected 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {isSelected ? 'Selected' : 'Click to select'}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button */}
        {selectedRestaurantId && (
          <div className="fixed bottom-8 right-8 z-50">
            <div className="flex flex-col items-end space-y-4">
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 animate-fade-in">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Ready to proceed?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click the button below</p>
              </div>
              <Button
                onClick={handleProceed}
                className="rounded-full w-20 h-20 shadow-2xl p-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-110 transition-all duration-300 group"
              >
                <div className="relative">
                  {user?.role === UserRoleEnum.RESTAURANT_STAFF ? (
                    <Users className="w-10 h-10" />
                  ) : (
                    <Truck className="w-10 h-10" />
                  )}
                  <ArrowRight className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!selectedRestaurantId && (
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">How to Get Started</h3>
                </div>
                <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mr-3">1</span>
                    <span>Select your restaurant from the list above</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mr-3">2</span>
                    <span>Click the floating action button to proceed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mr-3">3</span>
                    <span>Access your personalized dashboard</span>
                  </li>
                </ol>
              </div>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SelectRestaurant;