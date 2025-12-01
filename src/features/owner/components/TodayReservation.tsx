import React, { useState } from 'react';
import { useTodayReservations } from '../hooks/useTodayReservations';

const TodayReservations: React.FC = () => {
  const { reservations, loading, updateReservationStatus } = useTodayReservations();
  const [selectedTime, setSelectedTime] = useState<string>('all');

  const timeSlots = [
    { key: 'all', label: 'All Day' },
    { key: 'morning', label: 'Morning (6AM-12PM)', time: '06:00-12:00' },
    { key: 'afternoon', label: 'Afternoon (12PM-6PM)', time: '12:00-18:00' },
    { key: 'evening', label: 'Evening (6PM-12AM)', time: '18:00-00:00' }
  ];

  const filteredReservations = selectedTime === 'all' 
    ? reservations 
    : reservations.filter(reservation => {
        if (selectedTime === 'morning') return reservation.time < '12:00';
        if (selectedTime === 'afternoon') return reservation.time >= '12:00' && reservation.time < '18:00';
        if (selectedTime === 'evening') return reservation.time >= '18:00';
        return true;
      });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      seated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getTimeUntilReservation = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reservationTime = new Date();
    reservationTime.setHours(hours, minutes, 0, 0);
    
    const diffMs = reservationTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs < 0) return 'Past';
    if (diffHours > 0) return `in ${diffHours}h ${diffMinutes}m`;
    return `in ${diffMinutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Today's Reservations
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {reservations.length} total
          </span>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {timeSlots.map(slot => (
              <option key={slot.key} value={slot.key}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No reservations for selected time period
          </div>
        ) : (
          filteredReservations.map(reservation => (
            <div
              key={reservation.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {reservation.time}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getTimeUntilReservation(reservation.time)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {reservation.customerName}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Party of {reservation.guests} • Table {reservation.table} • {reservation.phone}
                  </div>
                  {reservation.specialRequests && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      💬 {reservation.specialRequests}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {reservation.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => updateReservationStatus(reservation.id, 'seated')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Seat
                    </button>
                    <button
                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {reservation.status === 'seated' && (
                  <button
                    onClick={() => updateReservationStatus(reservation.id, 'completed')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                )}
                {reservation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayReservations;