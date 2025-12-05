export type ReservationType = 'TABLE' | 'FULL_RESTAURANT' | 'PRIVATE_EVENT';

export type ReservationStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type TableStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'OUT_OF_SERVICE';

// Constants for better IntelliSense
export const ReservationTypeEnum = {
  TABLE: 'TABLE' as ReservationType,
  FULL_RESTAURANT: 'FULL_RESTAURANT' as ReservationType,
  PRIVATE_EVENT: 'PRIVATE_EVENT' as ReservationType,
};

export const ReservationStatusEnum = {
  PENDING: 'PENDING' as ReservationStatus,
  CONFIRMED: 'CONFIRMED' as ReservationStatus,
  COMPLETED: 'COMPLETED' as ReservationStatus,
  CANCELLED: 'CANCELLED' as ReservationStatus,
  NO_SHOW: 'NO_SHOW' as ReservationStatus,
};

export const TableStatusEnum = {
  AVAILABLE: 'AVAILABLE' as TableStatus,
  RESERVED: 'RESERVED' as TableStatus,
  OCCUPIED: 'OCCUPIED' as TableStatus,
  OUT_OF_SERVICE: 'OUT_OF_SERVICE' as TableStatus,
};

export type Table = {
  id: string;
  restaurantId: string;
  tableNumber: string;
  name?: string;
  capacity: number;
  location?: string;
  status: TableStatus;
  description?: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
  
  // Relations
  restaurant?: any;
  reservations?: Reservation[];
  orders?: any[];
};

export type Reservation = {
  id: string;
  reservationNumber: string;
  restaurantId: string;
  userId: string;
  tableId?: string;
  reservationType: ReservationType;
  reservationDate: string; // ISO date string
  reservationTime: string; // HH:MM format
  duration: number; // in minutes
  guestCount: number;
  status: ReservationStatus;
  specialRequests?: string;
  cancellationReason?: string;
  checkedInAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  restaurant?: any;
  user?: any;
  table?: Table;
  payment?: any;
};

// Request DTOs
export type CreateTableDto = {
  restaurantId: string;
  tableNumber: string;
  name?: string;
  capacity: number;
  location?: string;
  description?: string;
  features?: string[];
};

export type UpdateTableDto = {
  tableNumber?: string;
  name?: string;
  capacity?: number;
  location?: string;
  status?: TableStatus;
  description?: string;
  features?: string[];
};

export type CreateReservationDto = {
  restaurantId: string;
  userId?: string;
  tableId?: string;
  reservationType: ReservationType;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  duration?: number; // default 120 minutes
  guestCount: number;
  specialRequests?: string;
};

export type UpdateReservationDto = {
  tableId?: string;
  reservationDate?: string;
  reservationTime?: string;
  duration?: number;
  guestCount?: number;
  specialRequests?: string;
};

export type ReservationStatusDto = {
  status: ReservationStatus;
  notes?: string;
};

export type AvailabilityCheckDto = {
  restaurantId: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  guestCount: number;
  duration?: number;
};

export type TableAvailabilityDto = {
  restaurantId: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  guestCount: number;
  duration?: number;
};

// Search DTOs
export type TableSearchDto = {
  restaurantId?: string;
  minCapacity?: number;
  location?: string;
  status?: TableStatus;
  page?: number;
  limit?: number;
};

export type ReservationSearchDto = {
  restaurantId?: string;
  userId?: string;
  tableId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReservationStatus;
  page?: number;
  limit?: number;
};

// Response types
export type TablePaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ReservationPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AvailabilityResponse = {
  available: boolean;
  availableTables?: Table[];
  message?: string;
};

export type ReservationStats = {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  occupancyRate: number;
};