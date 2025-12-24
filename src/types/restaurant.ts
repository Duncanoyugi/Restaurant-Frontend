export type RestaurantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type StaffPosition = 'MANAGER' | 'CHEF' | 'WAITER' | 'CASHIER' | 'CLEANER';
export type ShiftStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Constants for better IntelliSense
export const RestaurantStatusEnum = {
  ACTIVE: 'ACTIVE' as RestaurantStatus,
  INACTIVE: 'INACTIVE' as RestaurantStatus,
  SUSPENDED: 'SUSPENDED' as RestaurantStatus,
};

export const StaffPositionEnum = {
  MANAGER: 'MANAGER' as StaffPosition,
  CHEF: 'CHEF' as StaffPosition,
  WAITER: 'WAITER' as StaffPosition,
  CASHIER: 'CASHIER' as StaffPosition,
  CLEANER: 'CLEANER' as StaffPosition,
};

export const ShiftStatusEnum = {
  SCHEDULED: 'SCHEDULED' as ShiftStatus,
  IN_PROGRESS: 'IN_PROGRESS' as ShiftStatus,
  COMPLETED: 'COMPLETED' as ShiftStatus,
  CANCELLED: 'CANCELLED' as ShiftStatus,
};

// Core types
export type Restaurant = {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  cityId: number;
  ownerId: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImageUrl?: string;
  openingTime: string; // HH:MM format
  closingTime: string; // HH:MM format
  averageRating: number;
  totalReviews: number;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: number; // in minutes
  cuisineType: string;
  features: string[];
  active: boolean;
  status: RestaurantStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  // Relations
  city?: any;
  owner?: any;
  staff?: RestaurantStaff[];
  menuItems?: any[];
  orders?: any[];
  reservations?: any[];
};

export type RestaurantStaff = {
  id: string;
  restaurantId: string;
  userId: string;
  position: StaffPosition;
  hireDate: string;
  terminationDate?: string;
  salary?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  restaurant?: Restaurant;
  user?: any;
  shifts?: Shift[];
};

export type Shift = {
  id: string;
  staffId: string;
  shiftDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: ShiftStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  staff?: RestaurantStaff;
};

// Request DTOs
export type CreateRestaurantDto = {
  name: string;
  description?: string;
  email: string;
  phone: string;
  streetAddress: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImageUrl?: string;
  openingTime?: string;
  closingTime?: string;
  active?: boolean;
  ownerId: number;
  cityId: number;
};

export type UpdateRestaurantDto = {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImageUrl?: string;
  openingTime?: string;
  closingTime?: string;
  deliveryFee?: number;
  minimumOrder?: number;
  estimatedDeliveryTime?: number;
  cuisineType?: string;
  features?: string[];
  active?: boolean;
  status?: RestaurantStatus;
};

export type CreateRestaurantStaffDto = {
  restaurantId: string;
  userId: string;
  position: StaffPosition;
  hireDate?: string;
  salary?: number;
};

export type UpdateRestaurantStaffDto = {
  position?: StaffPosition;
  salary?: number;
  active?: boolean;
  terminationDate?: string;
};

export type CreateShiftDto = {
  staffId: string;
  shiftDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notes?: string;
};

export type UpdateShiftDto = {
  shiftDate?: string;
  startTime?: string;
  endTime?: string;
  status?: ShiftStatus;
  notes?: string;
};

// Search DTOs
export type RestaurantSearchDto = {
  name?: string;
  cityId?: number;
  minRating?: number;
  active?: boolean;
  page?: number;
  limit?: number;
};

// Response types
export type RestaurantPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type RestaurantStatistics = {
  restaurant: {
    id: string;
    name: string;
    rating: number;
  };
  statistics: {
    totalStaff: number;
    activeShifts: number;
    totalMenuItems: number;
    operationalHours: string;
  };
};