// src/Dashboard/customer/ReservationDetails.tsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  useGetReservationByIdQuery,
  useCancelReservationMutation,
} from '../../features/reservations/reservationsApi';
import { format, parseISO } from 'date-fns';
import { useToast } from '../../contexts/ToastContext';

const ReservationDetails: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const { data: reservation, isLoading, error } = useGetReservationByIdQuery(reservationId!);
  const [cancelReservation, { isLoading: cancelling }] = useCancelReservationMutation();
  const { showToast } = useToast();

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation({ id: reservationId! }).unwrap();
        showToast('Reservation cancelled successfully', 'success');
        navigate('/dashboard/reservations');
      } catch (error: any) {
        console.error('Failed to cancel reservation:', error);
        showToast(error?.data?.message || 'Failed to cancel reservation. Please try again.', 'error');
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !reservation) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Reservation Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The reservation you're looking for doesn't exist.
          </p>
          <Link
            to="/dashboard/reservations"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Reservations
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const reservationDateTime = parseISO(`${reservation.reservationDate}T${reservation.reservationTime}`);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/dashboard/reservations"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm mb-2 inline-flex items-center"
            >
              ← Back to Reservations
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reservation #{reservation.reservationNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Booked on {format(parseISO(reservation.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
              {reservation.status}
            </span>
          </div>
        </div>

        {/* Reservation Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Reservation Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Restaurant</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reservation.restaurant?.name || (reservation as any).restaurantName}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(reservationDateTime, 'EEE, MMM dd, yyyy')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(reservationDateTime, 'hh:mm a')}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Number of Guests</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reservation.guestCount} {reservation.guestCount === 1 ? 'person' : 'people'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reservation Type</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reservation.reservationType.replace('_', ' ')}
              </p>
            </div>
            
            {(reservation as any).tableNumber && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Table Number</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Table #{(reservation as any).tableNumber}
                </p>
              </div>
            )}
            
            {(reservation as any).occasion && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Occasion</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {(reservation as any).occasion}
                </p>
              </div>
            )}
          </div>

          {reservation.specialRequests && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Special Requests</p>
              <p className="text-gray-900 dark:text-white">
                {reservation.specialRequests}
              </p>
            </div>
          )}
        </div>

        {/* Restaurant Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Restaurant Contact
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <a 
                  href={`tel:${(reservation as any).restaurantPhone}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {(reservation as any).restaurantPhone || 'Not available'}
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-gray-900 dark:text-white">
                  {(reservation as any).restaurantAddress || 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {['PENDING', 'CONFIRMED'].includes(reservation.status) && (
            <>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
              </button>
              <Link
                to={`/restaurants/${reservation.restaurantId}`}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
              >
                View Restaurant
              </Link>
            </>
          )}
          
          {reservation.status === 'COMPLETED' && (
            <Link
              to="/dashboard/reviews"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              Write a Review
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationDetails;