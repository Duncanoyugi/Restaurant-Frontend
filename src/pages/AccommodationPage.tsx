import React, { useState } from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector } from '../app/hooks';
import Button from '../components/ui/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaBed, FaRulerCombined, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import RoomBookingForm from '../components/booking/RoomBookingForm';
import { useGetAllRoomsQuery } from '../features/booking/roomsApi';
import { roomCategories } from '../data/mockRooms';
import { FaWifi, FaSnowflake, FaTv } from 'react-icons/fa'; // Default icons

const AccommodationPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurant');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const { data: roomsResponse, isLoading, error } = useGetAllRoomsQuery({
    limit: 100,
    restaurantId: restaurantId || undefined
  });
  const rooms = roomsResponse?.data || [];

  const filteredRooms = selectedCategory === 'all'
    ? rooms
    : rooms.filter(room => {
      // Map frontend categories to backend RoomType if needed
      const type = room.roomType.toLowerCase();
      if (selectedCategory === 'standard' && type === 'standard') return true;
      if (selectedCategory === 'deluxe' && type === 'deluxe') return true;
      if (selectedCategory === 'suites' && type === 'suite') return true;
      if (selectedCategory === 'family' && type === 'family') return true;
      if (selectedCategory === 'premium' && type === 'executive') return true;
      return false;
    });

  const handleBookRoom = (roomId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/accommodation' } });
    } else {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setSelectedRoom(room);
        setShowBookingForm(true);
      }
    }
  };

  const getRandomImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w-1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80'
    ];
    return images[index % images.length];
  };

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-800 via-slate-900 to-amber-900/30 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            {restaurantId && (
              <Button
                variant="outline"
                className="absolute left-0 top-0 hidden md:flex border-white text-white hover:bg-white/20 hover:text-white"
                onClick={() => navigate(`/restaurants/${restaurantId}`)}
              >
                ← Back to Restaurant
              </Button>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
              Luxury Hotel Accommodations
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-slate-200 leading-relaxed backdrop-blur-sm">
              Experience unparalleled comfort in our elegantly appointed rooms and suites,
              designed for the discerning traveler
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">⭐ 4.8 Guest Rating</span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">🏆 Best Hotel Award 2024</span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">📍 Central Location</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {roomCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-amber-600" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <FaExclamationTriangle className="mx-auto text-4xl mb-4" />
              <p className="text-xl">Failed to load rooms. Please try again later.</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No rooms found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.id}
                  className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-slate-100/50`}
                >
                  {/* Room Image with Badges */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={room.imageGallery?.[0] || getRandomImage(index)}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {/* Add badges if backend supports them */}
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1 bg-slate-900/80 text-white text-sm rounded-full backdrop-blur-sm font-medium">
                        {room.size ? `${room.size} m²` : 'Spacious'}
                      </span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-slate-900 truncate pr-4">{room.name}</h3>
                        <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <FaBed className="text-amber-600" />
                            {room.bedType || 'King Bed'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRulerCombined className="text-amber-600" />
                            {room.size ? `${room.size} m²` : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">👤 {room.capacity} Guests</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-3xl font-bold text-amber-600">KSh {room.pricePerNight.toLocaleString()}</div>
                        <div className="text-sm text-slate-500">per night</div>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed text-sm line-clamp-3">{room.description}</p>

                    {/* Amenities Icons */}
                    <div className="mb-6">
                      <div className="flex gap-3 mb-3">
                        {/* Placeholder for amenity icons - backend returns strings */}
                        <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm">
                          <FaWifi className="text-slate-700 text-xl" />
                        </div>
                        <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm">
                          <FaSnowflake className="text-slate-700 text-xl" />
                        </div>
                        <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm">
                          <FaTv className="text-slate-700 text-xl" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities?.slice(0, 3).map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200/50"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98]"
                        onClick={() => handleBookRoom(room.id)}
                      >
                        {isAuthenticated ? 'Book Now' : 'Login to Book'}
                      </Button>
                      <Button
                        variant="outline"
                        className="px-6 py-3 text-lg font-semibold rounded-xl border-2 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-300"
                        onClick={() => navigate(`/rooms/${room.id}`)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hotel Features */}
          <div className="bg-gradient-to-r from-slate-50 via-amber-50 to-orange-50/30 rounded-3xl p-8 md:p-12 mb-12 border border-slate-200/50 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-8 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Hotel Amenities & Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🏊', title: 'Infinity Pool', desc: 'Rooftop with city views' },
                { icon: '🏋️', title: 'Fitness Center', desc: '24/7 access' },
                { icon: '🍽️', title: 'Fine Dining', desc: 'Gourmet restaurant' },
                { icon: '🚗', title: 'Valet Parking', desc: 'Free for guests' },
                { icon: '💼', title: 'Business Center', desc: 'Meeting rooms available' },
                { icon: '🧘', title: 'Spa & Wellness', desc: 'Massage & treatments' },
                { icon: '👨‍🍳', title: 'Room Service', desc: '24-hour dining' },
                { icon: '🧳', title: 'Concierge', desc: 'Personal assistance' },
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 group cursor-default hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-3xl shadow-xl border border-amber-200/50">
              <h3 className="text-3xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Ready to Experience Luxury?
              </h3>
              <p className="text-slate-600 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                Create an account to book your stay, save your preferences, and get exclusive member rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/login', { state: { from: '/accommodation' } })}
                  className="px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98]"
                >
                  Login to Book
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/80 transition-all duration-300"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-600">
            <p className="mb-2 text-lg flex items-center justify-center gap-2">
              <span className="text-amber-600">📞</span> For reservations: (555) 123-4567
            </p>
            <p className="mb-2 text-lg flex items-center justify-center gap-2">
              <span className="text-amber-600">✉️</span> Email: reservations@luxuryhotel.com
            </p>
            <p className="text-lg flex items-center justify-center gap-2">
              <span className="text-amber-600">📍</span> 123 Luxury Avenue, City Center
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedRoom && (
        <RoomBookingForm
          room={selectedRoom}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedRoom(null);
          }}
          onSuccess={() => {
            setShowBookingForm(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </LandingLayout>
  );
};

export default AccommodationPage;