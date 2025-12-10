
import { FaWifi, FaCar, FaPaw, FaTv, FaCoffee, FaBath, FaSnowflake, FaWheelchair, FaShower, FaBed } from 'react-icons/fa';
import { IoRestaurant, IoWine } from 'react-icons/io5';
import { GiDesk, GiVacuumCleaner } from 'react-icons/gi';

const USD_TO_KES_RATE = 129;

export const roomCategories = [
    { id: 'all', name: 'All Rooms' },
    { id: 'standard', name: 'Standard Rooms' },
    { id: 'deluxe', name: 'Deluxe Rooms' },
    { id: 'suites', name: 'Suites' },
    { id: 'family', name: 'Family Rooms' },
    { id: 'premium', name: 'Premium' },
];

export const mockRooms = [
    // STANDARD ROOMS
    {
        id: 1,
        name: 'Classic Queen Room',
        category: 'standard',
        description: 'Our most affordable option with a comfortable queen bed and essential amenities. Perfect for solo travelers or couples on a budget.',
        price: 129 * USD_TO_KES_RATE, // 16,641 KSh
        originalPrice: 149 * USD_TO_KES_RATE, // 19,221 KSh
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
        price: 139 * USD_TO_KES_RATE, // 17,931 KSh
        originalPrice: 159 * USD_TO_KES_RATE, // 20,511 KSh
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
        price: 199 * USD_TO_KES_RATE, // 25,671 KSh
        originalPrice: 229 * USD_TO_KES_RATE, // 29,541 KSh
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
        price: 189 * USD_TO_KES_RATE, // 24,381 KSh
        originalPrice: 209 * USD_TO_KES_RATE, // 26,961 KSh
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
        price: 299 * USD_TO_KES_RATE, // 38,571 KSh
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
        price: 329 * USD_TO_KES_RATE, // 42,441 KSh
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
        price: 599 * USD_TO_KES_RATE, // 77,271 KSh
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
        price: 459 * USD_TO_KES_RATE, // 59,211 KSh
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
        price: 129 * USD_TO_KES_RATE, // 16,641 KSh
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
        price: 169 * USD_TO_KES_RATE, // 21,801 KSh
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
