import React from 'react';
import { useAppSelector } from '../../app/hooks';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { roomBookings, tableReservations } = useAppSelector((state) => state.booking);
  const navigate = useNavigate();

  const activeBookings = roomBookings.filter(booking => booking.status === 'confirmed');
  const upcomingReservations = tableReservations.filter(res => res.status === 'confirmed');

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your orders and reservations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">{cartItems.length}</div>
          <h3 className="text-lg font-medium text-gray-900">Cart Items</h3>
          <Button 
            variant="primary" 
            size="sm" 
            className="mt-3 w-full"
            onClick={() => navigate('/menu')}
          >
            Continue Shopping
          </Button>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-secondary-600 mb-2">{upcomingReservations.length}</div>
          <h3 className="text-lg font-medium text-gray-900">Upcoming Reservations</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 w-full"
            onClick={() => navigate('/reservations')}
          >
            Book Table
          </Button>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{activeBookings.length}</div>
          <h3 className="text-lg font-medium text-gray-900">Room Bookings</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 w-full"
            onClick={() => navigate('/accommodation')}
          >
            Book Room
          </Button>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
          <h3 className="text-lg font-medium text-gray-900">Active Orders</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 w-full"
            onClick={() => navigate('/menu')}
          >
            Order Food
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/menu')}>
          <Card className="text-center p-6">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Food</h3>
            <p className="text-gray-600">Browse our menu and place your order</p>
          </Card>
        </div>

        <div className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/reservations')}>
          <Card className="text-center p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Book a Table</h3>
            <p className="text-gray-600">Reserve your table for a perfect dining experience</p>
          </Card>
        </div>

        <div className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/accommodation')}>
          <Card className="text-center p-6">
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Book a Room</h3>
            <p className="text-gray-600">Stay in our luxury accommodations</p>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {upcomingReservations.length === 0 && activeBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity. Start by making a reservation or placing an order!</p>
          ) : (
            <>
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Table Reservation</p>
                    <p className="text-sm text-gray-600">
                      {new Date(reservation.date).toLocaleDateString()} at {reservation.time} for {reservation.guests} people
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Confirmed
                  </span>
                </div>
              ))}
              
              {activeBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Room Booking - {booking.roomName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Active
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CustomerDashboard;