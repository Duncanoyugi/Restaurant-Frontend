// src/types/customer.ts
export interface CustomerProfile {
  favoriteCuisines: string[];
  dietaryPreferences: string[];
  allergies: string[];
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
}

export interface LoyaltyInfo {
  tier: string;
  points: number;
  pointsNeeded: number;
  nextTier: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  averageRating?: number;
  cuisine?: string;
  logo?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userName?: string;
  verified?: boolean;
  createdAt: string;
  restaurantId?: string;
  restaurantName?: string;
  menuItemId?: string;
  menuItemName?: string;
  images?: string[];
  adminResponse?: string;
  responseDate?: string;
}

export interface RoomBooking {
  id: string;
  bookingNumber: string;
  status: string;
  roomName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  status: string;
  restaurantName: string;
  restaurantId: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  reservationType: string;
  tableNumber?: string;
  occasion?: string;
  specialRequests?: string;
  restaurantPhone?: string;
  restaurantAddress?: string;
  createdAt: string;
}

// src/types/order.ts - Update this file
export interface Order {
  id: string;
  orderNumber: string;
  status: StatusCatalog;
  restaurant?: {
    name?: string;
  };
  restaurantName?: string;
  orderType: string;
  finalPrice: number;
  basePrice?: number;
  discountAmount?: number;
  deliveryFee?: number;
  taxAmount?: number;
  paymentStatus?: string;
  comment?: string;
  orderItems?: OrderItem[];
  driver?: {
    name: string;
    phone: string;
  };
  estimatedDeliveryTime?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  menuItemName?: string;
  quantity: number;
  price?: number;
  menuItem?: any;
}

export type StatusCatalog = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

// src/types/delivery.ts
export interface LiveDeliveryTracking {
  id: string;
  statusHistory?: {
    status: string;
    timestamp: string;
  }[];
  updatedAt?: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}