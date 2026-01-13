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
  id: number;
  restaurantId: number;
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
  id: number;
  reservationNumber: string;
  restaurantId: number;
  userId: number;
  tableId?: number;
  reservationType: ReservationType;
  reservationDate: string; // ISO date string
  reservationTime: string; // HH:MM format
  duration: number; // in minutes
  guestCount: number;
  status: ReservationStatus;
  specialRequest?: string;
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
  restaurantId: number;
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
  restaurantId: number;
  userId: number;
  tableId?: number;
  reservationType: ReservationType;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  duration?: number; // default 120 minutes
  guestCount: number;
  specialRequest?: string;
  depositAmount?: number;
};

export type UpdateReservationDto = {
  tableId?: number;
  reservationDate?: string;
  reservationTime?: string;
  duration?: number;
  guestCount?: number;
  specialRequest?: string;
};

export type ReservationStatusDto = {
  status: ReservationStatus;
  notes?: string;
};

export type AvailabilityCheckDto = {
  restaurantId: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  guestCount: number;
  duration?: number;
};

export type TableAvailabilityDto = {
  restaurantId: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  guestCount: number;
  duration?: number;
};

// Search DTOs
export type TableSearchDto = {
  restaurantId?: number;
  minCapacity?: number;
  location?: string;
  status?: TableStatus;
  page?: number;
  limit?: number;
};

export type ReservationSearchDto = {
  restaurantId?: number;
  userId?: number;
  tableId?: number;
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