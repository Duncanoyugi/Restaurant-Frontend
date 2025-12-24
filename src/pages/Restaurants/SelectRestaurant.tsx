import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useGetAllRestaurantsQuery, useGetStaffAssignmentsByRestaurantQuery, useGetDriverAssignmentsByRestaurantQuery } from '../../features/restaurants/unifiedRestaurantApi';
import { UserRoleEnum } from '../../features/auth/authSlice';
import type { StaffAssignment, DriverAssignment } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Building2, Users, Truck, CheckCircle2 } from 'lucide-react';

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

  if (restaurantsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Loading Restaurants...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (restaurantsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">Failed to load restaurants. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const restaurants = restaurantsData?.data || [];

  if (isAssigned) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Already Assigned</p>
              <p className="text-sm text-green-700">You are already assigned to a restaurant as a {assignmentType}.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => {
              if (user?.role === UserRoleEnum.RESTAURANT_STAFF) {
                navigate('/staff/dashboard');
              } else if (user?.role === UserRoleEnum.DRIVER) {
                navigate('/driver/dashboard');
              }
            }}
            className="w-full"
          >
            Go to Dashboard
          </Button>

          <Button 
            onClick={() => {
              setIsAssigned(false);
              setSelectedRestaurantId(null);
            }}
            variant="outline"
            className="w-full"
          >
            Select Different Restaurant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Select Your Restaurant</h1>
        <p className="text-gray-600">
          {user?.role === UserRoleEnum.RESTAURANT_STAFF
            ? 'Choose the restaurant where you work as staff.'
            : 'Choose the restaurant where you work as a driver.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            onClick={() => handleRestaurantSelect(Number(restaurant.id))}
            className="cursor-pointer"
          >
            <Card
              className={`hover:shadow-lg transition-shadow ${
                selectedRestaurantId === Number(restaurant.id) ? 'border-primary border-2' : ''
              }`}
            >
              <div className="p-4">
                <h3 className="text-xl font-bold flex items-center mb-2">
                  <Building2 className="w-6 h-6 mr-2 text-primary" />
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {restaurant.description || 'A wonderful dining establishment'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {restaurant.address}
                  </span>
                  {selectedRestaurantId === Number(restaurant.id) && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {selectedRestaurantId && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleProceed}
            className="rounded-full w-16 h-16 shadow-lg p-0"
          >
            {user?.role === UserRoleEnum.RESTAURANT_STAFF ? (
              <Users className="w-8 h-8" />
            ) : (
              <Truck className="w-8 h-8" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectRestaurant;