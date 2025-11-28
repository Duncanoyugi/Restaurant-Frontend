import React from 'react';
import { LandingLayout } from '../../components/layout/LandingLayout';
import { useAppSelector } from '../../app/hooks';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AccommodationPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const rooms = [
    {
      id: 1,
      name: 'Deluxe Room',
      description: 'Spacious room with king-sized bed, city view, and modern amenities. Perfect for business travelers and couples.',
      price: '$149/night',
      features: ['WiFi', 'AC', 'Smart TV', 'Mini Bar', 'City View'],
      image: '/src/assets/images/bedroom.jpg',
      size: '45 m²'
    },
    {
      id: 2,
      name: 'Executive Suite',
      description: 'Luxurious suite with separate living area, work space, and premium services. Ideal for extended stays.',
      price: '$249/night',
      features: ['WiFi', 'AC', 'Living Area', 'Work Space', 'Premium Amenities'],
      image: '/src/assets/images/sittingroom.jpg',
      size: '75 m²'
    },
    {
      id: 3,
      name: 'Presidential Suite',
      description: 'Ultimate luxury with panoramic views, jacuzzi, and personalized butler service. The epitome of luxury.',
      price: '$499/night',
      features: ['WiFi', 'Jacuzzi', 'Butler Service', 'Panoramic View', 'Lounge Access'],
      image: '/src/assets/images/sitting.jpg',
      size: '120 m²'
    }
  ];

  const handleBookRoom = (roomId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/accommodation' } });
    } else {
      // Handle booking logic here
      console.log('Booking room:', roomId);
      // You can implement booking functionality here
    }
  };

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Luxury Accommodations
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience unparalleled comfort in our elegantly appointed rooms and suites
            </p>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <span className="text-6xl">🏨</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                    <span className="text-lg font-semibold text-primary-600">{room.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{room.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="font-semibold">Size:</span>
                      <span className="ml-2">{room.size}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleBookRoom(room.id)}
                  >
                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Ready to book your stay?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Login or create an account to reserve your perfect room.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/login', { state: { from: '/accommodation' } })}
                >
                  Login to Book
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LandingLayout>
  );
};

export default AccommodationPage;