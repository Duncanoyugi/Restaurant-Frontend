import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetRoomBookingsQuery,
  useCancelRoomBookingMutation
} from '../../features/customer/customerApi';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { RoomBooking } from '../../types/room';

const RoomBookingsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: bookingsData, isLoading, refetch } = useGetRoomBookingsQuery({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [cancelBooking] = useCancelRoomBookingMutation();

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking({ bookingId, reason: 'Customer requested cancellation' }).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'CONFIRMED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'CHECKED_IN': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'CHECKED_OUT': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateStayDuration = (checkIn: string, checkOut: string) => {
    try {
      const start = parseISO(checkIn);
      const end = parseISO(checkOut);
      return differenceInDays(end, start);
    } catch {
      return 0;
    }
  };

  const formatRoomType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  const bookings = bookingsData?.bookings || [];
  const total = bookingsData?.total || 0;

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Room Bookings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your hotel room reservations
            </p>
          </div>
          <Link
            to="/accommodation"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span className="mr-2">🏨</span>
            Book Room
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('CONFIRMED')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'CONFIRMED' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('CHECKED_IN')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'CHECKED_IN' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Active
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No room bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {statusFilter === 'all' 
                  ? "You haven't booked any rooms yet."
                  : `No ${statusFilter.toLowerCase()} bookings found.`}
              </p>
              <Link
                to="/accommodation"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <span className="mr-2">🏨</span>
                Browse Rooms
              </Link>
            </div>
          ) : (
            bookings.map((booking: RoomBooking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Booking #{booking.bookingNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {booking.room?.name} • {formatRoomType(booking.room?.roomType || '')}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format(parseISO(booking.checkInDate), 'EEE, MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format(parseISO(booking.checkOutDate), 'EEE, MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {calculateStayDuration(booking.checkInDate, booking.checkOutDate)} nights
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Guests</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booked On</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format(parseISO(booking.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Special Requests</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {booking.specialRequests}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex space-x-3">
                      <Link
                        to={`/dashboard/room-bookings/${booking.id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                      {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-0 text-sm text-gray-600 dark:text-gray-400">
                      Status updated {format(parseISO(booking.updatedAt), 'MMM dd')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {Math.ceil(total / limit) > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
              disabled={page === Math.ceil(total / limit)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
  );
};

export default RoomBookingsPage;