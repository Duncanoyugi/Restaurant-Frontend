import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector } from '../app/hooks';
import Button from '../components/ui/Button';
import RoomBookingForm from '../components/booking/RoomBookingForm';
import { FaArrowLeft, FaCheck, FaExclamationTriangle, FaBed, FaRulerCombined, FaUsers } from 'react-icons/fa';

import { mockRooms } from '../data/mockRooms';

const RoomDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const room = mockRooms.find(r => r.id === Number(id));

    if (!room) {
        return (
            <LandingLayout>
                <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <FaExclamationTriangle className="mx-auto text-5xl text-gray-400 mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Room Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">The room you're looking for doesn't exist or couldn't be loaded.</p>
                        <Button onClick={() => navigate('/accommodation')} variant="primary">
                            Back to Rooms
                        </Button>
                    </div>
                </div>
            </LandingLayout>
        );
    }

    // Use mock data directly instead of parsing
    const images = Array.isArray(room.image) ? room.image : [room.image];
    // Amenities are already icons/components in mock data, not JSON strings
    // But we need names for display? Wait, mockRooms has `features` (strings) and `amenities` (Icons).
    // The previous code used `amenityNames` parsed from `room.amenities` JSON.
    // In mock data: `features` is string array. `amenities` is icon array.
    // Let's use `features` for the list.
    const amenityNames = room.features || [];

    // Map amenity names to icons if possible, or just use generic check
    // Ideally backend should return amenity types, but for now we seeded strings.
    // If backend returns strings, we can't easily map to specific icons without a mapping table.
    // For simplicity, we'll list them with a checkmark.

    // Map mock room to Room interface for BookingForm
    // parsing "2 Guests" -> 2
    const capacity = parseInt(room.occupancy) || 2;

    // We need to cast or map to satisfy the Room type which expects specific fields
    // We'll trust that for the mock frontend, we just need the basics to work
    const mappedRoom: any = {
        ...room,
        id: room.id.toString(),
        pricePerNight: room.price,
        capacity: capacity,
        restaurantId: 'mock-restaurant',
        roomNumber: 'MOCK-' + room.id,
        roomType: 'STANDARD', // simplified
        available: true,
        imageGallery: [room.image],
        amenities: room.features,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/rooms/${id}` } });
        } else {
            setShowBookingForm(true);
        }
    };

    const fallbackImage = 'https://via.placeholder.com/800x600?text=Room+Image';

    return (
        <LandingLayout>
            <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/accommodation')}
                        className="flex items-center gap-2 text-amber-600 mb-8 hover:text-amber-700 transition"
                    >
                        <FaArrowLeft />
                        <span>Back to All Rooms</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Images */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Main Image */}
                            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={images[currentImageIndex] || fallbackImage}

                                    alt={room.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* removed discount/featured mock badges unless added to backend model */}
                            </div>

                            {/* Thumbnail Images */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((img: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`h-24 rounded-xl overflow-hidden border-2 transition ${currentImageIndex === index ? 'border-amber-600' : 'border-transparent hover:border-amber-400'
                                                }`}
                                        >
                                            <img src={img} alt={`${room.name} ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Room Description */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Room</h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    {room.description}
                                </p>

                                {/* Room Specs */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <FaBed className="text-2xl text-amber-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Bed Type</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{room.bedType || 'Standard Bed'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaRulerCombined className="text-2xl text-amber-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Room Size</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{room.size || 'N/A'} m²</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaUsers className="text-2xl text-amber-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{capacity} Guests</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities & Features</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {amenityNames.map((feature: string, index: number) => (
                                            <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <FaCheck className="text-green-500 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Booking Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book Your Stay</h3>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-amber-600">
                                            KSh {room.price.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">/ night</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleBookNow}
                                    className="w-full py-4 text-lg font-bold shadow-xl shadow-amber-500/20"
                                    variant="primary"
                                >
                                    Book Now
                                </Button>
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                    No credit card required for reservation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {showBookingForm && room && (
                    <RoomBookingForm
                        room={mappedRoom}
                        onClose={() => setShowBookingForm(false)}
                        onSuccess={() => {
                            setShowBookingForm(false);
                        }}
                    />
                )}
            </div>
        </LandingLayout>
    );
};

export default RoomDetailsPage;
