// src/types/analytics.ts

// Activity Log types
export const ActivityAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  ORDER: 'ORDER',
  RESERVATION: 'RESERVATION',
  PAYMENT: 'PAYMENT',
  REVIEW: 'REVIEW',
  STATUS_CHANGE: 'STATUS_CHANGE',
} as const;

export type ActivityAction = typeof ActivityAction[keyof typeof ActivityAction];

export const EntityType = {
  USER: 'USER',
  RESTAURANT: 'RESTAURANT',
  MENU_ITEM: 'MENU_ITEM',
  ORDER: 'ORDER',
  RESERVATION: 'RESERVATION',
  PAYMENT: 'PAYMENT',
  REVIEW: 'REVIEW',
  INVENTORY: 'INVENTORY',
  TABLE: 'TABLE',
  ROOM: 'ROOM',
  SUPPLIER: 'SUPPLIER',
  NOTIFICATION: 'NOTIFICATION',
} as const;

export type EntityType = typeof EntityType[keyof typeof EntityType];

export interface ActivityLog {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface CreateActivityLogRequest {
  userId: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface ActivityLogQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: ActivityAction;
  entityType?: EntityType;
  entityId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivityLogResponse {
  logs: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Analytics Period types - MUST MATCH BACKEND ENUM EXACTLY
export const AnalyticsPeriod = {
  TODAY: 'today',                 // lowercase
  YESTERDAY: 'yesterday',         // lowercase
  LAST_7_DAYS: 'last_7_days',     // lowercase with underscores
  LAST_30_DAYS: 'last_30_days',   // lowercase with underscores
  LAST_90_DAYS: 'last_90_days',   // lowercase with underscores
  THIS_MONTH: 'this_month',       // lowercase with underscore
  LAST_MONTH: 'last_month',       // lowercase with underscore
  CUSTOM: 'custom'                // lowercase
} as const;

export type AnalyticsPeriod = typeof AnalyticsPeriod[keyof typeof AnalyticsPeriod];

export interface AnalyticsQueryParams {
  period?: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  restaurantId?: string;
  limit?: number;
}

// Revenue Analytics
export interface RevenueDataPoint {
  date: string;
  totalRevenue: number;
  onlineRevenue: number;
  dineInRevenue: number;
  deliveryRevenue: number;
}

export interface RevenueComparison {
  currentValue: number;
  previousValue: number;
  change: number;
  isPositive: boolean;
}

export interface RevenueAnalytics {
  revenueData: RevenueDataPoint[];
  comparison: RevenueComparison;
  summary: {
    totalRevenue: number;
    onlineRevenue: number;
    dineInRevenue: number;
    deliveryRevenue: number;
  };
}

// Order Analytics
export interface OrderDataPoint {
  date: string;
  totalOrders: number;
  onlineOrders: number;
  dineInOrders: number;
  deliveryOrders: number;
  averageOrderValue: number;
}

export interface OrderAnalytics {
  orderData: OrderDataPoint[];
  comparison: RevenueComparison;
  summary: {
    totalOrders: number;
    onlineOrders: number;
    dineInOrders: number;
    deliveryOrders: number;
    averageOrderValue: number;
  };
}

// Customer Analytics
export interface CustomerDataPoint {
  date: string;
  newCustomers: number;
  returningCustomers: number;
  satisfactionScore: number;
}

export interface CustomerAnalytics {
  customerData: CustomerDataPoint[];
  summary: {
    totalNewCustomers: number;
    totalReturningCustomers: number;
    averageSatisfactionScore: number;
    customerRetentionRate: number;
  };
}

// Menu Performance Analytics
export interface TopSellingItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  category?: string;
}

export interface MenuPerformanceTrend {
  date: string;
  topItems: TopSellingItem[];
}

export interface MenuPerformanceAnalytics {
  topSellingItems: TopSellingItem[];
  performanceTrend: MenuPerformanceTrend[];
}

// Dashboard Overview
export interface RevenueMetrics {
  totalRevenue: number;
  onlineRevenue: number;
  dineInRevenue: number;
  deliveryRevenue: number;
}

export interface OrderMetrics {
  totalOrders: number;
  onlineOrders: number;
  dineInOrders: number;
  deliveryOrders: number;
  averageOrderValue: number;
}

export interface ReservationMetrics {
  totalReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  utilizationRate: number;
}

export interface RoomBookingMetrics {
  totalBookings: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export interface CustomerMetrics {
  newCustomers: number;
  returningCustomers: number;
  satisfactionScore: number;
}

export interface DashboardOverview {
  period: AnalyticsPeriod;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  revenue: RevenueMetrics;
  orders: OrderMetrics;
  reservations: ReservationMetrics;
  roomBookings: RoomBookingMetrics;
  customers: CustomerMetrics;
  topMenuItems: TopSellingItem[];
}

// User Behavior Analytics
export interface UserBehaviorSession {
  id: string;
  userId: string;
  sessionDate: string;
  sessionDurationSeconds: number;
  pageViews: number;
  menuViews: number;
  itemsAddedToCart: number;
  completedOrders: number;
  completedReservations: number;
  completedRoomBookings: number;
  deviceType?: string;
  browser?: string;
  operatingSystem?: string;
}

export interface UserBehaviorSummary {
  totalSessions: number;
  totalPageViews: number;
  totalMenuViews: number;
  totalItemsAddedToCart: number;
  totalOrders: number;
  totalReservations: number;
  totalRoomBookings: number;
  totalSessionDuration: number;
  averageSessionDuration: number;
  conversionRate: number;
}

export interface UserBehaviorAnalytics {
  sessions: UserBehaviorSession[];
  summary: UserBehaviorSummary;
}