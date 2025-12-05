import React from 'react';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  type: 'reservation' | 'room';
  title: string;
  date: string;
  time: string;
  details: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  actions: string[];
}

export const UpcomingBookings: React.FC = () => {
  // Mock data - replace with actual API data
  const upcomingBookings: Booking[] = [
    {
      id: 'RES-001',
      type: 'reservation',
      title: 'Italian Bistro',
      date: 'Today',
      time: '7:30 PM',
      details: 'Table for 4 • Window seating',
      status: 'confirmed',
      actions: ['Modify', 'Cancel']
    },
    {
      id: 'ROOM-001',
      type: 'room',
      title: 'Deluxe Suite',
      date: 'Tomorrow',
      time: '3:00 PM',
      details: 'Check-in • 2 nights • City view',
      status: 'confirmed',
      actions: ['Modify', 'Early Check-in']
    },
    {
      id: 'RES-002',
      type: 'reservation',
      title: 'Sushi Bar',
      date: 'Dec 28',
      time: '8:00 PM',
      details: 'Table for 2 • Anniversary',
      status: 'confirmed',
      actions: ['Modify', 'Add Special Request']
    }
  ];

  const getTypeIcon = (type: Booking['type']) => {
    return type === 'reservation' ? '📅' : '🏨';
  };

  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Upcoming Bookings
        </h2>
        <Link
          to="/dashboard/reservations"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingBookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getTypeIcon(booking.type)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {booking.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.date} at {booking.time}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {booking.details}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {booking.type === 'reservation' ? 'Table Reservation' : 'Room Booking'}
              </span>
              <div className="flex space-x-2">
                {booking.actions.map((action, index) => (
                  <button
                    key={index}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {upcomingBookings.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Upcoming Bookings
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Plan your next dining experience or stay
          </p>
          <div className="flex space-x-3 justify-center">
            <Link
              to="/reservations"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Book Table
            </Link>
            <Link
              to="/accommodation"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Book Room
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};