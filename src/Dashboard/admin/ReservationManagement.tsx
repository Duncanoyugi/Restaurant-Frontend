import React, { useState } from 'react';
import { useGetAllReservationsQuery, useUpdateReservationStatusMutation } from '../../features/reservations/reservationsApi';
import { FaCalendarAlt, FaUsers, FaClock, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import type { ReservationStatus } from '../../types/reservation';

const ReservationManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: reservationsData, isLoading, refetch } = useGetAllReservationsQuery({
    page,
    limit,
    status: statusFilter,
  });

  const [updateStatus] = useUpdateReservationStatusMutation();

  const reservations = reservationsData?.data || [];
  const totalPages = Math.ceil((reservationsData?.total || 0) / limit);

  const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
    try {
      await updateStatus({
        id: reservationId,
        data: { status }
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update reservation status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservation Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage table reservations across all restaurants
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservation Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage table reservations across all restaurants
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter || 'all'}
            onChange={(e) => {
              const value = e.target.value;
              setStatusFilter(value === 'all' ? undefined : (value as ReservationStatus));
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reservations ({reservationsData?.total || 0})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reservations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reservations found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {statusFilter === undefined ? 'No reservations have been made yet.' : `No ${statusFilter} reservations found.`}
              </p>
            </div>
          ) : (
            reservations.map((reservation: any) => (
              <div key={reservation.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Reservation #{reservation.reservationNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {reservation.user?.firstName} {reservation.user?.lastName} • {reservation.restaurant?.name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <FaUsers className="mr-1 h-4 w-4" />
                        {reservation.guestCount} guests
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1 h-4 w-4" />
                        {new Date(reservation.reservationDate).toLocaleDateString()} at {reservation.reservationTime}
                      </span>
                      {reservation.table && (
                        <span>Table: {reservation.table.tableNumber}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>

                    <div className="flex space-x-2">
                      {reservation.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}
                          >
                            <FaCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleStatusUpdate(reservation.id, 'CANCELLED')}
                          >
                            <FaTimes className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <FaEye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, reservationsData?.total || 0)} of {reservationsData?.total || 0} reservations
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;