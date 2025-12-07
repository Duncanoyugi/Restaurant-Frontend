import React, { useState } from 'react';
import { useGetDailyReservationsQuery } from '../../features/reservations/reservationsApi';
import { useAppSelector } from '../../app/hooks';
import { ReservationStatusEnum } from '../../types/reservation';

interface DailyReservationsProps {
  restaurantId: string;
}

const DailyReservations: React.FC<DailyReservationsProps> = ({ }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'confirmed' | 'pending'>('today');

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: reservationsData } = useGetDailyReservationsQuery({
    restaurantId: 'current', // This would need to be the actual restaurant ID
    date: date
  }, {
    skip: !isAuthenticated || !user,
  });

  const reservations = reservationsData || [];

  const updateReservationStatus = async (reservationId: string, status: string, notes?: string) => {
    console.log('Updating reservation:', reservationId, status, notes);
    // Mock implementation
  };

  const assignTable = async (reservationId: string, tableId: string) => {
    console.log('Assigning table:', reservationId, tableId);
    // Mock implementation
  };

  const filteredReservations = reservations.filter(res => {
    if (filter === 'today') return true;
    if (filter === 'upcoming') return res.status === ReservationStatusEnum.CONFIRMED || res.status === ReservationStatusEnum.PENDING;
    if (filter === 'confirmed') return res.status === ReservationStatusEnum.CONFIRMED;
    if (filter === 'pending') return res.status === ReservationStatusEnum.PENDING;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case ReservationStatusEnum.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case ReservationStatusEnum.CONFIRMED: return 'bg-green-100 text-green-800 border-green-300';
      case ReservationStatusEnum.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-300';
      case ReservationStatusEnum.CANCELLED: return 'bg-red-100 text-red-800 border-red-300';
      case ReservationStatusEnum.NO_SHOW: return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ReservationStatusEnum.PENDING: return '⏳';
      case ReservationStatusEnum.CONFIRMED: return '✅';
      case ReservationStatusEnum.COMPLETED: return '🏁';
      case ReservationStatusEnum.CANCELLED: return '❌';
      case ReservationStatusEnum.NO_SHOW: return '👻';
      default: return '❓';
    }
  };

  const getTimeColor = (timeUntil: string) => {
    if (timeUntil === 'Now') return 'text-red-600 font-bold';
    if (timeUntil.includes('0h')) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Reservations</h2>
            <p className="text-gray-600">Manage today's bookings and seating</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => console.log('Refresh clicked')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{reservations.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {reservations.filter(r => r.status === ReservationStatusEnum.PENDING).length}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {reservations.filter(r => r.status === ReservationStatusEnum.CONFIRMED).length}
            </div>
            <div className="text-sm text-green-600">Confirmed</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {reservations.filter(r => r.status === ReservationStatusEnum.COMPLETED).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-700">
              {reservations.filter(r => r.status === ReservationStatusEnum.CANCELLED).length}
            </div>
            <div className="text-sm text-red-600">Cancelled</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {reservations.filter(r => r.status === ReservationStatusEnum.NO_SHOW).length}
            </div>
            <div className="text-sm text-gray-600">No Show</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'today', 'upcoming', 'confirmed', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/30">
                {reservations.filter(r =>
                  status === 'all' ? true :
                  status === 'today' ? true :
                  status === 'upcoming' ? (r.status === ReservationStatusEnum.CONFIRMED || r.status === ReservationStatusEnum.PENDING) :
                  r.status === (status === 'confirmed' ? ReservationStatusEnum.CONFIRMED :
                               status === 'pending' ? ReservationStatusEnum.PENDING : r.status)
                ).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Reservation List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onUpdateStatus={updateReservationStatus}
            onAssignTable={assignTable}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            getTimeColor={getTimeColor}
          />
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reservations</h3>
          <p className="text-gray-500">No reservations found for the selected date/filter</p>
        </div>
      )}
    </div>
  );
};

const ReservationCard: React.FC<{
  reservation: any; // Using any for now since Reservation type is complex
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
  onAssignTable: (id: string, tableId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  getTimeColor: (timeUntil: string) => string;
}> = ({ reservation, onUpdateStatus, onAssignTable, getStatusColor, getStatusIcon }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">#{reservation.reservationNumber}</span>
              <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(reservation.status)}`}>
                {getStatusIcon(reservation.status)} {reservation.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{reservation.user?.name || 'Customer'}</div>
            <div className="text-sm">{reservation.user?.phone || 'N/A'}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {reservation.reservationTime}
            </div>
            <div className="text-sm text-gray-600">{new Date(reservation.reservationDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{reservation.guestCount} people</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Table:</span>
            <span className="font-medium">
              {reservation.table ? `Table ${reservation.table.tableNumber}` : 'Not assigned'}
            </span>
          </div>
          {reservation.specialRequests && (
            <div className="text-sm">
              <span className="text-gray-600">Requests: </span>
              <span className="italic">{reservation.specialRequests}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
        >
          {showDetails ? 'Hide Actions' : 'Show Actions'}
        </button>

        {showDetails && (
          <div className="space-y-2">
            {reservation.status === ReservationStatusEnum.PENDING && (
              <>
                <button
                  onClick={() => onUpdateStatus(reservation.id, ReservationStatusEnum.CONFIRMED, 'Confirmed via phone')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Confirm Reservation
                </button>
                <button
                  onClick={() => onUpdateStatus(reservation.id, ReservationStatusEnum.CANCELLED, 'Customer cancelled')}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Cancel Reservation
                </button>
              </>
            )}
            {reservation.status === ReservationStatusEnum.CONFIRMED && (
              <>
                <button
                  onClick={() => onUpdateStatus(reservation.id, ReservationStatusEnum.COMPLETED, 'Customer arrived')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Mark as Completed
                </button>
                {!reservation.table && (
                  <button
                    onClick={() => onAssignTable(reservation.id, 'table-123')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                  >
                    Assign Table
                  </button>
                )}
              </>
            )}
            {(reservation.status === ReservationStatusEnum.CONFIRMED || reservation.status === ReservationStatusEnum.PENDING) && (
              <button
                onClick={() => onUpdateStatus(reservation.id, ReservationStatusEnum.NO_SHOW, 'Customer did not show')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
              >
                Mark as No Show
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReservations;