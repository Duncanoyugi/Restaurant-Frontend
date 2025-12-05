import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  useGetReservationsQuery, 
  useCancelReservationMutation,
  useUpdateReservationMutation 
} from '../../features/customer/customerApi';
import { format, parseISO } from 'date-fns';
import type { Reservation } from '../../types/reservation';

const ReservationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page] = useState(1);
  const limit = 10;

  const { data: reservationsData, isLoading, refetch } = useGetReservationsQuery({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [cancelReservation] = useCancelReservationMutation();
  const [updateReservation] = useUpdateReservationMutation();

  const handleCancelReservation = async (reservationId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation({ reservationId, reason: 'Customer requested cancellation' }).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to cancel reservation:', error);
      }
    }
  };

  const handleModifyReservation = async (reservationId: string) => {
    const newGuestCount = prompt('Enter new number of guests:');
    if (newGuestCount && parseInt(newGuestCount) > 0) {
      try {
        await updateReservation({
          id: reservationId,
          data: { guestCount: parseInt(newGuestCount) }
        }).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to update reservation:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'CONFIRMED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'COMPLETED': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'NO_SHOW': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = parseISO(`${date}T${time}`);
      return format(dateTime, 'EEE, MMM dd, yyyy • hh:mm a');
    } catch {
      return `${date} • ${time}`;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const reservations = reservationsData?.reservations || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reservations</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your restaurant reservations
            </p>
          </div>
          <Link
            to="/reservations"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span className="mr-2">📅</span>
            Book Table
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
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'COMPLETED' ? 'bg-gray-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No reservations found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {statusFilter === 'all' 
                  ? "You haven't made any reservations yet."
                  : `No ${statusFilter.toLowerCase()} reservations found.`}
              </p>
              <Link
                to="/reservations"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <span className="mr-2">📅</span>
                Make a Reservation
              </Link>
            </div>
          ) : (
            reservations.map((reservation: Reservation) => (
              <div
                key={reservation.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Reservation #{reservation.reservationNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {reservation.restaurant?.name || 'Restaurant'}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDateTime(reservation.reservationDate, reservation.reservationTime)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Guests</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {reservation.guestCount} people
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {reservation.reservationType?.replace('_', ' ') || 'Standard'}
                      </p>
                    </div>
                    {reservation.table?.tableNumber && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Table</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Table #{reservation.table.tableNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  {reservation.specialRequests && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Special Requests</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {reservation.specialRequests}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex space-x-3">
                      <Link
                        to={`/dashboard/reservations/${reservation.id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                      {reservation.status === 'PENDING' && (
                        <button
                          onClick={() => handleModifyReservation(reservation.id)}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          Modify
                        </button>
                      )}
                      {['PENDING', 'CONFIRMED'].includes(reservation.status) && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-0 text-sm text-gray-600 dark:text-gray-400">
                      Booked on {format(parseISO(reservation.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationsPage;