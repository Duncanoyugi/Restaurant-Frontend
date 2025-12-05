// User types - comprehensive for all roles

// User Roles (matching your authSlice)
export type UserRole = 'Admin' | 'Restaurant Owner' | 'Restaurant Staff' | 'Customer' | 'Driver';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

// Constants
export const UserRoleEnum = {
  ADMIN: 'Admin' as UserRole,
  RESTAURANT_OWNER: 'Restaurant Owner' as UserRole,
  RESTAURANT_STAFF: 'Restaurant Staff' as UserRole,
  CUSTOMER: 'Customer' as UserRole,
  DRIVER: 'Driver' as UserRole,
};

export const UserStatusEnum = {
  ACTIVE: 'ACTIVE' as UserStatus,
  INACTIVE: 'INACTIVE' as UserStatus,
  SUSPENDED: 'SUSPENDED' as UserStatus,
  PENDING_VERIFICATION: 'PENDING_VERIFICATION' as UserStatus,
};

// Base User type
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  emailVerified: boolean;
  status: UserStatus;
  role: UserRole;
  isOnline?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

// Extended User types for specific roles
export type CustomerUser = User & {
  averageRating?: number;
  totalOrders?: number;
  favoriteRestaurants?: string[];
  loyaltyPoints?: number;
  loyaltyLevel?: string;
  defaultAddressId?: string;
};

export type DriverUser = User & {
  isAvailable?: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  vehicleInfo?: VehicleInfo;
  totalDeliveries?: number;
  rating?: number;
  onTimeRate?: number;
  earnings?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
};

export type RestaurantStaffUser = User & {
  restaurantId?: string;
  position?: string;
  hireDate?: string;
  salary?: number;
  shifts?: StaffShift[];
};

export type AdminUser = User & {
  permissions?: string[];
  lastAdminAction?: string;
};

// Vehicle Info for Drivers
export type VehicleInfo = {
  type: string; // 'motorcycle', 'car', 'bicycle'
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
};

// Staff Shift
export type StaffShift = {
  id: string;
  staffId: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
};

// Request DTOs
export type CreateUserDto = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  profileImage?: string;
};

export type UpdateUserDto = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  profileImage?: string;
  status?: UserStatus;
  emailVerified?: boolean;
  isOnline?: boolean;
  isAvailable?: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  role?: UserRole;
};

// Role-specific update DTOs
export type UpdateCustomerDto = {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  defaultAddressId?: string;
};

export type UpdateDriverDto = UpdateUserDto & {
  isAvailable?: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  vehicleInfo?: Partial<VehicleInfo>;
};

export type UpdateStaffDto = {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: number;
  active?: boolean;
};

// Search DTOs
export type UserSearchDto = {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  emailVerified?: boolean;
  isOnline?: boolean;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
};

export type DriverSearchDto = UserSearchDto & {
  available?: boolean;
  hasVehicle?: boolean;
};

export type StaffSearchDto = UserSearchDto & {
  restaurantId?: string;
  position?: string;
  active?: boolean;
};

// Response types
export type UserPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UserStatistics = {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<UserStatus, number>;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
};

export type UserProfile = {
  user: User;
  statistics: {
    totalOrders?: number;
    totalReviews?: number;
    totalDeliveries?: number;
    averageRating?: number;
    totalSpent?: number;
    totalEarned?: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
};

// Role-specific response types
export type CustomerProfile = UserProfile & {
  favoriteRestaurants: Array<{
    id: string;
    name: string;
    image: string;
    rating: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    restaurantName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
};

export type DriverProfile = UserProfile & {
  vehicleInfo?: VehicleInfo;
  performance: {
    rating: number;
    completedDeliveries: number;
    onTimeRate: number;
    cancellationRate: number;
    acceptanceRate: number;
  };
  earningsSummary: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  activeDeliveries: Array<{
    id: string;
    orderNumber: string;
    restaurantName: string;
    customerName: string;
    status: string;
    estimatedDeliveryTime: string;
  }>;
};

export type StaffProfile = UserProfile & {
  restaurant?: {
    id: string;
    name: string;
    address: string;
  };
  position: string;
  salary?: number;
  hireDate: string;
  upcomingShifts: StaffShift[];
  performance?: {
    ordersProcessed: number;
    averageOrderTime: number;
    customerRating?: number;
  };
};

export type AdminProfile = UserProfile & {
  systemStats: {
    totalRestaurants: number;
    totalOrders: number;
    totalRevenue: number;
    activeDrivers: number;
    pendingReviews: number;
  };
  recentActivities: Array<{
    id: string;
    action: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
  }>;
};