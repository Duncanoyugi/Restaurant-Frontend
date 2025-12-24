import React, { useState } from 'react';
import { useGetAllRoomBookingsQuery, useUpdateBookingStatusMutation } from '../../features/booking/roomsApi';
import { FaHotel, FaUsers, FaCalendar, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import type { RoomBooking, RoomBookingStatus } from '../../types/room';
import { RoomBookingStatusEnum } from '../../types/room';

const RoomBookingManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<RoomBookingStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: roomBookingsData, isLoading, refetch } = useGetAllRoomBookingsQuery({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [updateStatus] = useUpdateBookingStatusMutation();

  const roomBookings = roomBookingsData?.data || [];
  const totalPages = Math.ceil((roomBookingsData?.total || 0) / limit);

  const handleStatusUpdate = async (bookingId: string, status: RoomBookingStatus) => {
    try {
      await updateStatus({
        id: bookingId,
        data: { status }
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update room booking status:', error);
    }
  };

  const getStatusColor = (status: RoomBookingStatus) => {
    switch (status) {
      case RoomBookingStatusEnum.CONFIRMED: return 'bg-green-100 text-green-800';
      case RoomBookingStatusEnum.PENDING: return 'bg-yellow-100 text-yellow-800';
      case RoomBookingStatusEnum.CANCELLED: return 'bg-red-100 text-red-800';
      case RoomBookingStatusEnum.COMPLETED: return 'bg-blue-100 text-blue-800';
      case RoomBookingStatusEnum.CHECKED_IN: return 'bg-purple-100 text-purple-800';
      case RoomBookingStatusEnum.CHECKED_OUT: return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Booking Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage accommodation bookings across all restaurants
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Booking Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage accommodation bookings across all restaurants
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              const value = e.target.value;
              setStatusFilter(value === 'all' ? 'all' : (value as RoomBookingStatus));
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value={RoomBookingStatusEnum.PENDING}>Pending</option>
            <option value={RoomBookingStatusEnum.CONFIRMED}>Confirmed</option>
            <option value={RoomBookingStatusEnum.CHECKED_IN}>Checked In</option>
            <option value={RoomBookingStatusEnum.CHECKED_OUT}>Checked Out</option>
            <option value={RoomBookingStatusEnum.COMPLETED}>Completed</option>
            <option value={RoomBookingStatusEnum.CANCELLED}>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Room Bookings List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Room Bookings ({roomBookingsData?.total || 0})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {roomBookings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FaHotel className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No room bookings found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {statusFilter === 'all' ? 'No room bookings have been made yet.' : `No ${statusFilter.replace('_', ' ').toLowerCase()} bookings found.`}
              </p>
            </div>
          ) : (
            roomBookings.map((booking: RoomBooking) => (
              <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaHotel className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Booking #{booking.bookingNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.user?.firstName} {booking.user?.lastName} • {booking.room?.name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <FaUsers className="mr-1 h-4 w-4" />
                        {booking.numberOfGuests} guests
                      </span>
                      <span className="flex items-center">
                        <FaCalendar className="mr-1 h-4 w-4" />
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                      {booking.room && (
                        <span>Room: {booking.room.roomNumber} ({booking.room.roomType})</span>
                      )}
                      <span>KSh {booking.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status?.replace('_', ' ')}
                    </span>

                    <div className="flex space-x-2">
                      {booking.status === RoomBookingStatusEnum.PENDING && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStatusUpdate(booking.id, RoomBookingStatusEnum.CONFIRMED)}
                          >
                            <FaCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleStatusUpdate(booking.id, RoomBookingStatusEnum.CANCELLED)}
                          >
                            <FaTimes className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {booking.status === RoomBookingStatusEnum.CONFIRMED && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStatusUpdate(booking.id, RoomBookingStatusEnum.CHECKED_IN)}
                        >
                          Check In
                        </Button>
                      )}
                      {booking.status === RoomBookingStatusEnum.CHECKED_IN && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStatusUpdate(booking.id, RoomBookingStatusEnum.CHECKED_OUT)}
                        >
                          Check Out
                        </Button>
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
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, roomBookingsData?.total || 0)} of {roomBookingsData?.total || 0} room bookings
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

export default RoomBookingManagement;