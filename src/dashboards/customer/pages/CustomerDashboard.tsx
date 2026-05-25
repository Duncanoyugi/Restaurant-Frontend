import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from '@/shared/layouts/CustomerLayout';
import RestaurantGuard from '@/modules/restaurants/components/RestaurantGuard';
import { StatsGrid } from '@/dashboards/customer/components/StatsGrid';
import { QuickActions } from '@/dashboards/customer/components/QuickActions';
import { ActiveOrders } from '@/dashboards/customer/components/ActiveOrders';
import { UpcomingBookings } from '@/dashboards/customer/components/UpcomingBookings';
import { RecentActivity } from '@/dashboards/customer/components/RecentActivity';
import { PersonalizedRecommendations } from '@/dashboards/customer/components/PersonalizedRecommendations';
import { WelcomeBanner } from '@/dashboards/customer/components/WelcomeBanner';
import { useRestaurant } from '@/modules/restaurants/contexts/RestaurantContext';
import CustomerOrders from '@/dashboards/customer/pages/CustomerOrders';
import CustomerReservations from '@/dashboards/customer/pages/CustomerReservations';
import CustomerProfile from '@/dashboards/customer/pages/CustomerProfile';
import CustomerReviews from '@/dashboards/customer/pages/CustomerReviews';
import Favourites from '@/dashboards/customer/pages/Favourites';
import Rewards from '@/dashboards/customer/pages/Rewards';
import OrderDetails from '@/dashboards/customer/pages/OrderDetails';
import OrderTracking from '@/dashboards/customer/pages/OrderTracking';
import ReservationDetails from '@/dashboards/customer/pages/ReservationDetails';
import OrderSuccess from '@/dashboards/customer/pages/OrderSuccess';
import RoomBookingsPage from '@/dashboards/customer/pages/roomBooking';

// Main Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const { selectedRestaurant, restaurants } = useRestaurant();

  return (
    <div className="space-y-8">
      {/* Restaurant Selection Prompt */}
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedRestaurant ? `Current Restaurant: ${selectedRestaurant.name}` : 'Welcome to Our Restaurant Platform!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {selectedRestaurant
              ? 'You can change your restaurant selection or proceed with your current choice. To book rooms, reserve tables, or order food, ensure you have the right restaurant selected.'
              : 'To book rooms, reserve tables, or order food, please choose a restaurant first. This helps us provide you with the best experience tailored to your selected restaurant.'
            }
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/restaurants'}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {selectedRestaurant ? 'Change Restaurant' : 'Browse Restaurants'}
            </button>
            {restaurants.length > 0 && (
              <p className="text-sm text-gray-500">
                {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Quick Stats */}
      <StatsGrid />

      {/* Quick Actions */}
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Orders */}
        <div className="lg:col-span-1">
          <ActiveOrders />
        </div>

        {/* Upcoming Bookings */}
        <div className="lg:col-span-1">
          <UpcomingBookings />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />

      {/* Personalized Recommendations */}
      <PersonalizedRecommendations />
    </div>
  );
};

const CustomerDashboard: React.FC = () => {
  return (
    <CustomerLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="orders" element={<RestaurantGuard><CustomerOrders /></RestaurantGuard>} />
        <Route path="orders/:orderId" element={<RestaurantGuard><OrderDetails /></RestaurantGuard>} />
        <Route path="orders/:orderId/track" element={<RestaurantGuard><OrderTracking /></RestaurantGuard>} />
        <Route path="orders/:orderId/success" element={<RestaurantGuard><OrderSuccess /></RestaurantGuard>} />
        <Route path="reservations" element={<RestaurantGuard><CustomerReservations /></RestaurantGuard>} />
        <Route path="reservations/:reservationId" element={<RestaurantGuard><ReservationDetails /></RestaurantGuard>} />
        <Route path="room-bookings" element={<RestaurantGuard><RoomBookingsPage /></RestaurantGuard>} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="favorites" element={<Favourites />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerDashboard;