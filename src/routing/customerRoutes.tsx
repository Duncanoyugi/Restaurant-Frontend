import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerDashboard from '../Dashboard/customer/CustomerDashboard';
import CustomerOrders from '../Dashboard/customer/CustomerOrders';
import CustomerProfile from '../Dashboard/customer/CustomerProfile';
import CustomerReservations from '../Dashboard/customer/CustomerReservations';
import CustomerReviews from '../Dashboard/customer/CustomerReviews';
import Favorites from '../Dashboard/customer/Favourites';
import OrderDetails from '../Dashboard/customer/OrderDetails';
import OrderTracking from '../Dashboard/customer/OrderTracking';
import ReservationDetails from '../Dashboard/customer/ReservationDetails';
import Rewards from '../Dashboard/customer/Rewards';
import RoomBookings from '../Dashboard/customer/roomBooking';
import OrderSuccess from '../Dashboard/customer/OrderSuccess';

const CustomerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/orders" element={<CustomerOrders />} />
      <Route path="/orders/:orderId" element={<OrderDetails />} />
      <Route path="/orders/:orderId/track" element={<OrderTracking />} />
      <Route path="/orders/:orderId/success" element={<OrderSuccess />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/reservations" element={<CustomerReservations />} />
      <Route path="/reservations/:reservationId" element={<ReservationDetails />} />
      <Route path="/reviews" element={<CustomerReviews />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/room-bookings" element={<RoomBookings />} />
    </Routes>
  );
};

export default CustomerRoutes;