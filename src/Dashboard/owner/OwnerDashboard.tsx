import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useGetAllRestaurantsQuery } from '../../features/restaurants/unifiedRestaurantApi';
import type { Restaurant } from '../../types/restaurant';
import OwnerLayout from '../../components/layout/OwnerLayout';
import { PlusCircle, Building2, Users, Truck, Utensils, Calendar, Bed, FileText, Settings, LayoutGrid } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Import the management components
import StaffList from './staff/StaffList';
import StaffCreate from './staff/StaffCreate';
import StaffEdit from './staff/StaffEdit';
import StaffView from './staff/StaffView';
import DriverManagement from './DriverManagement';
import MenuManagement from './MenuManagement';
import ReservationManagement from './ReservationManagement';
import RoomManagement from './RoomManagement';
import TableManagement from './TableManagement';
import RestaurantReviews from './RestaurantReviews';
import RestaurantOrders from './RestaurantOrders';

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Fetch all restaurants owned by this user
  const { data: restaurantsData, isLoading, error } = useGetAllRestaurantsQuery();

  // Debug logging for restaurant data
  React.useEffect(() => {
    console.log('📊 Restaurant data:', restaurantsData);
    console.log('🔍 Filtered restaurants:', restaurantsData?.data?.filter((r: Restaurant) => String(r.ownerId) === String(user?.id)));
  }, [restaurantsData, user?.id]);

  const restaurants = restaurantsData?.data?.filter((r: Restaurant) => String(r.ownerId) === String(user?.id)) || [];

  const hasRestaurant = restaurants.length > 0;
  const firstRestaurant = hasRestaurant ? restaurants[0] : null;

  // Redirect to first restaurant's dashboard if user has a restaurant
  React.useEffect(() => {
    if (hasRestaurant && firstRestaurant) {
      const currentPath = window.location.pathname;
      const targetPath = `/dashboard`;
      if (currentPath !== targetPath) {
        navigate(targetPath);
      }
    }
  }, [restaurantsData, user?.id, navigate]);

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </OwnerLayout>
    );
  }

  if (error) {
    return (
      <OwnerLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Failed to load restaurant data</span>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  if (!hasRestaurant) {
    return (
      <OwnerLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Welcome, {user?.name}!</strong>
            <span className="block sm:inline"> You don't have a restaurant yet. Let's create one.</span>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                console.log('🚀 Navigating to restaurant setup');
                navigate('/restaurant-setup');
              }}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="inline w-5 h-5 mr-2" />
              Setup Your Restaurant
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('🔙 Navigating back to dashboard');
                navigate('/dashboard');
              }}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <Routes>
        {/* Default dashboard route */}
        <Route
          path="/"
          element={
            <div className="container mx-auto px-4 py-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center mb-2">
                  <Building2 className="w-8 h-8 mr-3 text-primary" />
                  {firstRestaurant?.name || 'Restaurant'} Dashboard
                </h1>
                <p className="text-gray-600">Manage your restaurant operations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="cursor-pointer" onClick={() => navigate('/dashboard/staff')}>
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

                <div className="cursor-pointer" onClick={() => navigate('/dashboard/drivers')}>
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

                <div className="cursor-pointer" onClick={() => navigate('/dashboard/menu')}>
                  <Card className="bg-purple-50 hover:shadow-lg">
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
                </div>

                <div className="cursor-pointer" onClick={() => navigate('/dashboard/reservations')}>
                  <Card className="bg-orange-50 hover:shadow-lg">
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
                </div>

                <div className="cursor-pointer" onClick={() => navigate('/dashboard/rooms')}>
                  <Card className="bg-indigo-50 hover:shadow-lg">
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
                </div>

                <div className="cursor-pointer" onClick={() => navigate('/dashboard/tables')}>
                  <Card className="bg-pink-50 hover:shadow-lg">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Table Management</h3>
                        <LayoutGrid className="w-8 h-8 text-pink-600" />
                      </div>
                      <p className="text-gray-600 text-sm mb-4">Manage restaurant tables and layout</p>
                      <Button size="sm" className="w-full">
                        Manage Tables
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="cursor-pointer" onClick={() => navigate('/dashboard/reports')}>
                  <Card className="bg-gray-50 hover:shadow-lg">
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
                </div>

                <div className="cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                  <Card className="bg-yellow-50 hover:shadow-lg">
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
              </div>
            </div>
          }
        />

        {/* Staff Management Routes */}
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/create" element={<StaffCreate />} />
        <Route path="/staff/:id" element={<StaffView />} />
        <Route path="/staff/:id/edit" element={<StaffEdit />} />

        {/* Other Management Routes */}
        <Route path="/drivers" element={<DriverManagement />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/reservations" element={<ReservationManagement />} />
        <Route path="/rooms" element={<RoomManagement />} />
        <Route path="/tables" element={<TableManagement />} />
        <Route path="/reports" element={<RestaurantReviews />} />
        <Route path="/settings" element={<RestaurantOrders />} />
      </Routes>
    </OwnerLayout>
  );
};

export default OwnerDashboard;
