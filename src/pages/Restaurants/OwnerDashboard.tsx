import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRestaurantByIdQuery } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Building2, Users, Truck, Utensils, Calendar, Bed, FileText, Settings } from 'lucide-react';

const OwnerDashboard: React.FC = () => {
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
        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Welcome!</strong>
          <span className="block sm:inline"> You don't have a restaurant yet. Let's create one.</span>
        </div>
        <Button onClick={() => navigate('/restaurant-setup')} className="mb-4">
          Setup Your Restaurant
        </Button>
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="ml-2">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center mb-2">
          <Building2 className="w-8 h-8 mr-3 text-primary" />
          {restaurant.name} Dashboard
        </h1>
        <p className="text-gray-600">Manage your restaurant operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="cursor-pointer" onClick={() => navigate(`/restaurants/${restaurant.id}/staff`)}>
          <Card className="bg-blue-50 hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Staff Management</h3>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm mb-4">Manage your staff members and their roles</p>
              <Button size="sm" className="w-full">
                Manage Staff
              </Button>
            </div>
          </Card>
        </div>

        <div className="cursor-pointer" onClick={() => navigate(`/restaurants/${restaurant.id}/drivers`)}>
          <Card className="bg-green-50 hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Driver Management</h3>
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm mb-4">Manage delivery drivers and assignments</p>
              <Button size="sm" className="w-full">
                Manage Drivers
              </Button>
            </div>
          </Card>
        </div>

        <Card className="bg-purple-50 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Menu Management</h3>
              <Utensils className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">Create and manage your menu items</p>
            <Button size="sm" className="w-full">
              Manage Menu
            </Button>
          </div>
        </Card>

        <Card className="bg-orange-50 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Reservations</h3>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">View and manage table reservations</p>
            <Button size="sm" className="w-full">
              View Reservations
            </Button>
          </div>
        </Card>

        <Card className="bg-indigo-50 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Accommodations</h3>
              <Bed className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">Manage room bookings and availability</p>
            <Button size="sm" className="w-full">
              Manage Rooms
            </Button>
          </div>
        </Card>

        <Card className="bg-gray-50 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Reports</h3>
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">View sales and performance reports</p>
            <Button size="sm" className="w-full">
              View Reports
            </Button>
          </div>
        </Card>

        <Card className="bg-yellow-50 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Settings</h3>
              <Settings className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">Configure restaurant settings</p>
            <Button size="sm" className="w-full">
              Restaurant Settings
            </Button>
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Restaurant Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Staff</p>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Active Drivers</p>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Menu Items</p>
            <p className="text-2xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Today's Reservations</p>
            <p className="text-2xl font-bold text-orange-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;