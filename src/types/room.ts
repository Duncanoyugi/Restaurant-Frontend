export type RoomBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'COMPLETED'
  | 'CANCELLED';

export type RoomType = 'STANDARD' | 'DELUXE' | 'SUITE' | 'FAMILY' | 'EXECUTIVE';

// Constants for better IntelliSense
export const RoomBookingStatusEnum = {
  PENDING: 'PENDING' as RoomBookingStatus,
  CONFIRMED: 'CONFIRMED' as RoomBookingStatus,
  CHECKED_IN: 'CHECKED_IN' as RoomBookingStatus,
  CHECKED_OUT: 'CHECKED_OUT' as RoomBookingStatus,
  COMPLETED: 'COMPLETED' as RoomBookingStatus,
  CANCELLED: 'CANCELLED' as RoomBookingStatus,
};

export const RoomTypeEnum = {
  STANDARD: 'STANDARD' as RoomType,
  DELUXE: 'DELUXE' as RoomType,
  SUITE: 'SUITE' as RoomType,
  FAMILY: 'FAMILY' as RoomType,
  EXECUTIVE: 'EXECUTIVE' as RoomType,
};

// Core types
export type Room = {
  id: string;
  name: string;
  description: string;
  restaurantId: string;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  pricePerNight: number;
  available: boolean;
  amenities: string[];
  imageGallery: string[];
  size?: number; // in square meters
  bedType?: string;
  view?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  restaurant?: any;
  bookings?: RoomBooking[];
};

export type RoomBooking = {
  id: string;
  bookingNumber: string;
  roomId: string;
  userId: string;
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  numberOfGuests: number;
  totalPrice: number;
  status: RoomBookingStatus;
  specialRequests?: string;
  cancellationReason?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  room?: Room;
  user?: any;
  payment?: any;
};

// Request DTOs
export type CreateRoomDto = {
  name: string;
  description: string;
  restaurantId: string;
  roomNumber: string;
  roomType?: RoomType;
  capacity: number;
  pricePerNight: number;
  available?: boolean;
  amenities?: string[];
  imageGallery?: string[];
  size?: number;
  bedType?: string;
  view?: string;
};

export type UpdateRoomDto = {
  name?: string;
  description?: string;
  roomNumber?: string;
  roomType?: RoomType;
  capacity?: number;
  pricePerNight?: number;
  available?: boolean;
  amenities?: string[];
  imageGallery?: string[];
  size?: number;
  bedType?: string;
  view?: string;
};

export type CreateRoomBookingDto = {
  roomId: string;
  userId?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  numberOfGuests: number;
  totalPrice: number;
  specialRequests?: string;
};

export type UpdateRoomBookingDto = {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  specialRequests?: string;
};

export type RoomBookingStatusDto = {
  status: RoomBookingStatus;
  notes?: string;
};

// RENAMED: Changed from AvailabilityCheckDto to RoomAvailabilityCheckDto
export type RoomAvailabilityCheckDto = {
  roomId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guests: number;
};

// Search DTOs
export type RoomSearchDto = {
  restaurantId?: string;
  minCapacity?: number;
  maxPrice?: number;
  available?: boolean;
  checkInDate?: string; // YYYY-MM-DD
  checkOutDate?: string; // YYYY-MM-DD
  guests?: number;
  page?: number;
  limit?: number;
};

export type RoomBookingSearchDto = {
  roomId?: string;
  userId?: string;
  restaurantId?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: RoomBookingStatus;
  page?: number;
  limit?: number;
};

// Response types
export type RoomPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type RoomBookingPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// RENAMED: Changed from AvailabilityResponse to RoomAvailabilityResponse
export type RoomAvailabilityResponse = {
  available: boolean;
  room?: Room;
  message?: string;
};

export type RoomOccupancyStats = {
  occupiedDays: number;
  totalDays: number;
  occupancyRate: number;
};