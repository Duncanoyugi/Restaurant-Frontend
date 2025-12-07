import React, { useState } from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector } from '../app/hooks';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { FaWifi, FaCar, FaPaw, FaTv, FaCoffee, FaBath, FaSnowflake, FaWheelchair, FaShower, FaBed, FaRulerCombined } from 'react-icons/fa';
import { IoRestaurant, IoWine } from 'react-icons/io5';
import { GiDesk, GiVacuumCleaner } from 'react-icons/gi';
import { useInitializePaymentMutation } from '../features/payments/paymentsApi';
import { PaymentMethod } from '../types/payment';

const AccommodationPage: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [initializePayment] = useInitializePaymentMutation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const roomCategories = [
    { id: 'all', name: 'All Rooms' },
    { id: 'standard', name: 'Standard Rooms' },
    { id: 'deluxe', name: 'Deluxe Rooms' },
    { id: 'suites', name: 'Suites' },
    { id: 'family', name: 'Family Rooms' },
    { id: 'premium', name: 'Premium' },
  ];

  const allRooms = [
    // STANDARD ROOMS
    {
      id: 1,
      name: 'Classic Queen Room',
      category: 'standard',
      description: 'Our most affordable option with a comfortable queen bed and essential amenities. Perfect for solo travelers or couples on a budget.',
      price: 129,
      originalPrice: 149,
      size: '35 m²',
      bedType: 'Queen Bed',
      occupancy: '2 Guests',
      features: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Desk', 'Private Bathroom'],
      amenities: [FaWifi, FaSnowflake, FaTv, GiDesk, FaBath],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80',
      featured: false,
      discount: '15% OFF'
    },
    {
      id: 2,
      name: 'Twin Room',
      category: 'standard',
      description: 'Two comfortable single beds ideal for friends or colleagues traveling together.',
      price: 139,
      originalPrice: 159,
      size: '38 m²',
      bedType: 'Two Single Beds',
      occupancy: '2 Guests',
      features: ['Free WiFi', 'AC', '32" TV', 'Mini Fridge', 'City View'],
      amenities: [FaWifi, FaSnowflake, FaTv, FaBed, FaBed],
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w-1200&auto=format&fit=crop&q=80',
      featured: false,
      discount: '12% OFF'
    },

    // DELUXE ROOMS
    {
      id: 3,
      name: 'Deluxe King Room',
      category: 'deluxe',
      description: 'Spacious room with a king-sized bed and panoramic city views. Upgraded amenities and extra comfort.',
      price: 199,
      originalPrice: 229,
      size: '45 m²',
      bedType: 'King Bed',
      occupancy: '2 Guests',
      features: ['Premium WiFi', 'Smart AC', '55" Smart TV', 'Mini Bar', 'City View', 'Coffee Machine'],
      amenities: [FaWifi, FaSnowflake, FaTv, FaCoffee, IoWine, FaCar],
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      popular: true
    },
    {
      id: 4,
      name: 'Deluxe Garden View',
      category: 'deluxe',
      description: 'Peaceful room overlooking our beautiful gardens with a comfortable king bed and sitting area.',
      price: 189,
      originalPrice: 209,
      size: '42 m²',
      bedType: 'King Bed',
      occupancy: '2 Guests',
      features: ['Garden View', 'Sitting Area', 'Premium Toiletries', 'Smart TV', 'Free Parking'],
      amenities: [FaWifi, FaSnowflake, FaTv, FaBath, FaCar],
      image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&auto=format&fit=crop&q=80',
      featured: false
    },

    // SUITES
    {
      id: 5,
      name: 'Executive Suite',
      category: 'suites',
      description: 'Separate living and sleeping areas with a dedicated workspace. Perfect for business travelers.',
      price: 299,
      size: '65 m²',
      bedType: 'King Bed + Sofa',
      occupancy: '3 Guests',
      features: ['Separate Living Area', 'Work Desk', 'Kitchenette', 'Premium WiFi', 'Bathrobes', 'Evening Turndown'],
      amenities: [FaWifi, GiDesk, FaCoffee, FaBath, GiVacuumCleaner],
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      popular: true
    },
    {
      id: 6,
      name: 'Family Suite',
      category: 'family',
      description: 'Two connecting rooms perfect for families. Includes a king bed and two single beds.',
      price: 329,
      size: '80 m²',
      bedType: 'King + Two Singles',
      occupancy: '4 Guests',
      features: ['Connecting Rooms', 'Child-friendly', 'Extra Space', 'Board Games', 'Kitchenette', 'Laundry Service'],
      amenities: [FaWifi, FaBed, FaBed, FaCoffee, GiVacuumCleaner],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      featured: false,
      family: true
    },

    // PREMIUM SUITES
    {
      id: 7,
      name: 'Presidential Suite',
      category: 'premium',
      description: 'Ultimate luxury with panoramic city views, Jacuzzi, and personalized butler service.',
      price: 599,
      size: '120 m²',
      bedType: 'Super King Bed',
      occupancy: '2 Guests',
      features: ['Jacuzzi Tub', 'Butler Service', 'Private Lounge', 'Gourmet Kitchen', 'Panoramic Views', 'Limo Service'],
      amenities: [FaWifi, FaShower, IoRestaurant, FaCoffee, FaCar],
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      luxury: true
    },
    {
      id: 8,
      name: 'Honeymoon Suite',
      category: 'premium',
      description: 'Romantic suite with rose petal turndown, champagne on arrival, and private balcony.',
      price: 459,
      size: '75 m²',
      bedType: 'Four Poster King',
      occupancy: '2 Guests',
      features: ['Romantic Decor', 'Champagne Service', 'Private Balcony', 'Rose Petal Turndown', 'Couples Massage Package'],
      amenities: [FaWifi, IoWine, FaBath, FaBed, FaCoffee],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      romantic: true
    },

    // SPECIALTY ROOMS
    {
      id: 9,
      name: 'Accessible Room',
      category: 'standard',
      description: 'Fully accessible room designed for comfort and convenience for all guests.',
      price: 129,
      size: '40 m²',
      bedType: 'Queen Bed',
      occupancy: '2 Guests',
      features: ['Roll-in Shower', 'Grab Bars', 'Wider Doors', 'Accessible Amenities', 'Emergency Call System'],
      amenities: [FaWifi, FaWheelchair, FaShower, FaBath, FaSnowflake],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80',
      featured: false,
      accessible: true
    },
    {
      id: 10,
      name: 'Pet-Friendly Room',
      category: 'deluxe',
      description: 'Bring your furry friend! Includes pet bed, bowls, and easy access to walking areas.',
      price: 169,
      size: '42 m²',
      bedType: 'King Bed',
      occupancy: '2 Guests + Pet',
      features: ['Pet Bed & Bowls', 'Easy-clean Floors', 'Pet Welcome Kit', 'Nearby Park Access', 'Pet Sitting Service'],
      amenities: [FaWifi, FaPaw, FaSnowflake, FaTv, FaBath],
      image: 'https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa?w=1200&auto=format&fit=crop&q=80',
      featured: false,
      petFriendly: true
    },
  ];

  const filteredRooms = selectedCategory === 'all' 
    ? allRooms 
    : allRooms.filter(room => room.category === selectedCategory);

  const handleBookRoom = async (roomId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/accommodation' } });
    } else {
      const room = allRooms.find(r => r.id === roomId);
      if (!room) return;

      try {
        // Calculate 50% deposit
        const depositAmount = room.price * 0.5;

        // Initialize payment for room booking deposit
        const paymentResult = await initializePayment({
          userId: user!.id,
          amount: depositAmount,
          currency: 'USD',
          method: 'card' as PaymentMethod, // Default to card, could be made configurable
          customerEmail: user!.email,
          customerName: user!.name,
        }).unwrap();

        if (paymentResult.success) {
          // Store booking details in session storage for after payment
          sessionStorage.setItem('pendingRoomBooking', JSON.stringify({
            roomId,
            roomName: room.name,
            totalAmount: room.price,
            depositAmount,
            paymentReference: paymentResult.data.reference,
          }));

          // Redirect to payment gateway
          window.location.href = paymentResult.data.authorizationUrl;
        } else {
          alert('Payment initialization failed. Please try again.');
        }
      } catch (error) {
        console.error('Payment initialization error:', error);
        alert('Failed to initialize payment. Please try again.');
      }
    }
  };

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-900 to-secondary-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Luxury Hotel Accommodations
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Experience unparalleled comfort in our elegantly appointed rooms and suites, 
              designed for the discerning traveler
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">⭐ 4.8 Guest Rating</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">🏆 Best Hotel Award 2024</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">📍 Central Location</span>
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
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {filteredRooms.map((room) => (
              <div 
                key={room.id} 
                className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
                  room.featured ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {/* Room Image with Badges */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {room.featured && (
                      <span className="px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    {room.discount && (
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                        {room.discount}
                      </span>
                    )}
                    {room.popular && (
                      <span className="px-3 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">
                        🏆 Most Popular
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full backdrop-blur-sm">
                      {room.size}
                    </span>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{room.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaBed className="text-primary-500" />
                          {room.bedType}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaRulerCombined className="text-primary-500" />
                          {room.size}
                        </span>
                        <span>👤 {room.occupancy}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-600">${room.price}</div>
                      <div className="text-sm text-gray-500">per night</div>
                      {room.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          ${room.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{room.description}</p>

                  {/* Amenities Icons */}
                  <div className="mb-6">
                    <div className="flex gap-4 mb-3">
                      {room.amenities.map((Icon, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="text-gray-700 text-xl" />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {room.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleBookRoom(room.id)}
                    >
                      {isAuthenticated ? 'Book Now' : 'Login to Book'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/rooms/${room.id}`)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hotel Features */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
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
                <div key={index} className="text-center p-4">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-3xl shadow-lg">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Experience Luxury?
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Create an account to book your stay, save your preferences, and get exclusive member rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/login', { state: { from: '/accommodation' } })}
                  className="px-8"
                >
                  Login to Book
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="px-8"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="mb-2">📞 For reservations: (555) 123-4567</p>
            <p className="mb-2">✉️ Email: reservations@luxuryhotel.com</p>
            <p>📍 123 Luxury Avenue, City Center</p>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default AccommodationPage;