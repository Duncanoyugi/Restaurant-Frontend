import React, { useState } from 'react';

interface DailyReservation {
  id: string;
  reservationNumber: string;
  customerName: string;
  phone: string;
  guestCount: number;
  reservationTime: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  tableNumber?: string;
  specialRequests?: string;
  createdAt: string;
  timeUntil: string;
}

interface DailyReservationsProps {
  restaurantId: string;
}

const DailyReservations: React.FC<DailyReservationsProps> = ({ }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'confirmed' | 'pending'>('today');

  // Mock data
  const mockReservations: DailyReservation[] = [
    {
      id: '1',
      reservationNumber: 'RES-001',
      customerName: 'John Smith',
      phone: '+254 712 345 678',
      guestCount: 4,
      reservationTime: '19:30',
      status: 'confirmed',
      tableNumber: '5',
      specialRequests: 'Window seat preferred',
      createdAt: '2024-01-15T10:00:00Z',
      timeUntil: '2h 30m'
    },
    {
      id: '2',
      reservationNumber: 'RES-002',
      customerName: 'Sarah Johnson',
      phone: '+254 723 456 789',
      guestCount: 2,
      reservationTime: '20:00',
      status: 'pending',
      createdAt: '2024-01-15T11:30:00Z',
      timeUntil: '3h'
    },
    {
      id: '3',
      reservationNumber: 'RES-003',
      customerName: 'Mike Wilson',
      phone: '+254 734 567 890',
      guestCount: 6,
      reservationTime: '18:00',
      status: 'seated',
      tableNumber: '12',
      createdAt: '2024-01-15T09:00:00Z',
      timeUntil: 'Now'
    }
  ];

  const reservations = mockReservations;

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
    if (filter === 'upcoming') return res.status === 'confirmed' || res.status === 'pending';
    if (filter === 'confirmed') return res.status === 'confirmed';
    if (filter === 'pending') return res.status === 'pending';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'seated': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'no_show': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'seated': return '🪑';
      case 'completed': return '🏁';
      case 'cancelled': return '❌';
      case 'no_show': return '👻';
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
              {reservations.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {reservations.filter(r => r.status === 'confirmed').length}
            </div>
            <div className="text-sm text-green-600">Confirmed</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {reservations.filter(r => r.status === 'seated').length}
            </div>
            <div className="text-sm text-blue-600">Seated</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-700">
              {reservations.filter(r => r.status === 'cancelled').length}
            </div>
            <div className="text-sm text-red-600">Cancelled</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {reservations.filter(r => r.status === 'no_show').length}
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
                  status === 'upcoming' ? (r.status === 'confirmed' || r.status === 'pending') :
                  r.status === status
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
  reservation: DailyReservation;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
  onAssignTable: (id: string, tableId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  getTimeColor: (timeUntil: string) => string;
}> = ({ reservation, onUpdateStatus, onAssignTable, getStatusColor, getStatusIcon, getTimeColor }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">#{reservation.reservationNumber}</span>
              <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(reservation.status)}`}>
                {getStatusIcon(reservation.status)} {reservation.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{reservation.customerName}</div>
            <div className="text-sm">{reservation.phone}</div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getTimeColor(reservation.timeUntil)}`}>
              {reservation.timeUntil}
            </div>
            <div className="text-sm text-gray-600">{reservation.reservationTime}</div>
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
              {reservation.tableNumber ? `Table ${reservation.tableNumber}` : 'Not assigned'}
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
            {reservation.status === 'pending' && (
              <>
                <button
                  onClick={() => onUpdateStatus(reservation.id, 'confirmed', 'Confirmed via phone')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Confirm Reservation
                </button>
                <button
                  onClick={() => onUpdateStatus(reservation.id, 'cancelled', 'Customer cancelled')}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Cancel Reservation
                </button>
              </>
            )}
            {reservation.status === 'confirmed' && (
              <>
                <button
                  onClick={() => onUpdateStatus(reservation.id, 'seated', 'Customer arrived')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Mark as Seated
                </button>
                {!reservation.tableNumber && (
                  <button
                    onClick={() => onAssignTable(reservation.id, 'table-123')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                  >
                    Assign Table
                  </button>
                )}
              </>
            )}
            {reservation.status === 'seated' && (
              <button
                onClick={() => onUpdateStatus(reservation.id, 'completed', 'Dining completed')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
              >
                Mark as Completed
              </button>
            )}
            {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
              <button
                onClick={() => onUpdateStatus(reservation.id, 'no_show', 'Customer did not show')}
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