import React, { useState } from 'react';
import { LandingLayout } from '../../components/layout/LandingLayout';
import { useAppSelector } from '../../app/hooks';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ReservationsPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [reservationDetails, setReservationDetails] = useState({
    date: '',
    time: '',
    guests: 2,
    occasion: ''
  });

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
    '20:00', '20:30', '21:00', '21:30'
  ];

  const occasions = [
    'Birthday',
    'Anniversary',
    'Business Dinner',
    'Date Night',
    'Family Gathering',
    'Special Celebration'
  ];

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/reservations' } });
    } else {
      // Handle reservation logic here
      console.log('Making reservation:', reservationDetails);
      // You can implement reservation functionality here
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setReservationDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Table Reservations
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reserve your table for an unforgettable dining experience
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Reservation Form */}
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <form onSubmit={handleReservation}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={reservationDetails.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={reservationDetails.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={reservationDetails.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={reservationDetails.occasion}
                      onChange={(e) => handleInputChange('occasion', e.target.value)}
                    >
                      <option value="">Select occasion</option>
                      {occasions.map((occasion) => (
                        <option key={occasion} value={occasion}>
                          {occasion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                >
                  {isAuthenticated ? 'Reserve Table' : 'Login to Reserve'}
                </Button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="text-2xl mb-2">🕒</div>
                <h3 className="font-semibold text-gray-900 mb-2">Opening Hours</h3>
                <p className="text-gray-600 text-sm">
                  Monday - Sunday<br />
                  11:00 AM - 11:00 PM
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="text-2xl mb-2">👥</div>
                <h3 className="font-semibold text-gray-900 mb-2">Group Bookings</h3>
                <p className="text-gray-600 text-sm">
                  For parties of 8+<br />
                  Please call us directly
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="text-2xl mb-2">📞</div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <p className="text-gray-600 text-sm">
                  +1 (555) 123-4567<br />
                  reservations@savorybites.com
                </p>
              </div>
            </div>

            {/* Login Prompt */}
            {!isAuthenticated && (
              <div className="text-center mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
                <p className="text-gray-600 mb-4">
                  Please login or create an account to make a reservation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/login', { state: { from: '/reservations' } })}
                  >
                    Login to Reserve
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/register')}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default ReservationsPage;