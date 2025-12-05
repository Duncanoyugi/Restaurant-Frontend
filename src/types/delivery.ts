// src/types/delivery.ts

// Vehicle Information
export interface VehicleInfo {
  id: string;
  userId: string;
  user?: any; // User type from user module
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  licensePlate: string;
  vehicleColor?: string;
  vehicleType: VehicleType;
  insuranceProvider?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export const VehicleType = {
  MOTORCYCLE: 'motorcycle',
  CAR: 'car',
  TRICYCLE: 'tricycle',
  BICYCLE: 'bicycle',
  VAN: 'van',
  TRUCK: 'truck',
} as const;

export type VehicleType = typeof VehicleType[keyof typeof VehicleType];

export interface CreateVehicleInfoRequest {
  userId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  licensePlate: string;
  vehicleColor?: string;
  vehicleType: VehicleType;
  insuranceProvider?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
}

export interface UpdateVehicleInfoRequest {
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  licensePlate?: string;
  vehicleColor?: string;
  vehicleType?: VehicleType;
  insuranceProvider?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
}

// Delivery Tracking
export interface DeliveryTracking {
  id: string;
  orderId: string;
  order?: any; // Order type from order module
  driverId: string;
  driver?: any; // User type from user module
  latitude: number;
  longitude: number;
  status: DeliveryStatus;
  distanceToDestination?: number;
  etaMinutes?: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  accuracy?: number;
  batteryLevel?: number;
  networkSignal?: number;
  createdAt: string;
  updatedAt: string;
}

export const DeliveryStatus = {
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  ON_THE_WAY: 'on_the_way',
  NEARBY: 'nearby',
  ARRIVED: 'arrived',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  UNKNOWN: 'unknown',
} as const;

export type DeliveryStatus = typeof DeliveryStatus[keyof typeof DeliveryStatus];

export interface CreateDeliveryTrackingRequest {
  orderId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  status?: DeliveryStatus;
  distanceToDestination?: number;
  etaMinutes?: number;
  speed?: number;
  heading?: number;
}

export interface DriverLocationRequest {
  driverId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  accuracy?: number;
  batteryLevel?: number;
  networkSignal?: number;
}

// Delivery Assignment
export interface DeliveryAssignmentRequest {
  orderId: string;
  driverId: string;
  restaurantLatitude: number;
  restaurantLongitude: number;
}

export interface DeliveryAssignmentResponse {
  tracking: DeliveryTracking;
  estimatedTime: number;
}

// Available Drivers Search
export interface AvailableDriversRequest {
  latitude?: number;
  longitude?: number;
  radius?: number;
  vehicleType?: VehicleType;
}

export interface AvailableDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  averageRating?: number;
  totalDeliveries?: number;
  isOnline: boolean;
  isAvailable: boolean;
  currentLocation?: {
    latitude?: number;
    longitude?: number;
  };
  vehicleInfo?: VehicleInfo;
}

// Delivery Estimate
export interface DeliveryEstimateRequest {
  restaurantLatitude: number;
  restaurantLongitude: number;
  customerLatitude: number;
  customerLongitude: number;
  orderId?: string;
}

export interface DeliveryEstimateResponse {
  distance: number;
  duration: number;
  polyline?: string;
}

// Analytics and Statistics
export interface DriverDeliveryStats {
  totalDeliveries: number;
  totalDistance: number;
  averageDeliveryTime: number;
  onTimeRate: number;
  totalEarnings?: number;
}

export interface DeliveryPerformance {
  totalDeliveries: number;
  completedDeliveries: number;
  completionRate: number;
  averageDeliveryTime: number;
  deliveryTrends: {
    peakHours: string[];
    averageDistance: number;
    mostCommonVehicle: string;
  };
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

// Live Tracking
export interface LiveDeliveryTracking {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  driver: {
    name: string;
    vehicle: string;
    phone: string;
  };
  status: string;
  eta: number;
  distanceRemaining: number;
  polyline?: string;
}

// Driver Active Deliveries
export interface ActiveDelivery {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  latitude: number;
  longitude: number;
  etaMinutes?: number;
  distanceToDestination?: number;
  createdAt: string;
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    restaurant?: {
      id: string;
      name: string;
      address: string;
    };
    deliveryAddress?: {
      street: string;
      building?: string;
      city?: string;
    };
  };
}