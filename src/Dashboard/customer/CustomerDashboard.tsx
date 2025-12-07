import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { StatsGrid } from '../../components/customer/StatsGrid';
import { QuickActions } from '../../components/customer/QuickActions';
import { ActiveOrders } from '../../components/customer/ActiveOrders';
import { UpcomingBookings } from '../../components/customer/UpcomingBookings';
import { RecentActivity } from '../../components/customer/RecentActivity';
import { PersonalizedRecommendations } from '../../components/customer/PersonalizedRecommendations';
import { WelcomeBanner } from '../../components/customer/WelcomeBanner';
import CustomerOrders from './CustomerOrders';
import CustomerReservations from './CustomerReservations';
import CustomerProfile from './CustomerProfile';
import CustomerReviews from './CustomerReviews';
import Favourites from './Favourites';
import Rewards from './Rewards';
import OrderDetails from './OrderDetails';
import OrderTracking from './OrderTracking';
import ReservationDetails from './ReservationDetails';
import OrderSuccess from './OrderSuccess';
import RoomBookingsPage from './roomBooking';

// Main Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
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
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/orders/:orderId/track" element={<OrderTracking />} />
        <Route path="/orders/:orderId/success" element={<OrderSuccess />} />
        <Route path="/reservations" element={<CustomerReservations />} />
        <Route path="/reservations/:reservationId" element={<ReservationDetails />} />
        <Route path="/room-bookings" element={<RoomBookingsPage />} />
        <Route path="/reviews" element={<CustomerReviews />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/favorites" element={<Favourites />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerDashboard;