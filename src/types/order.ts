// src/types/order.ts

// Use string literal unions instead of enums for compatibility with erasableSyntaxOnly
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export type OrderStatusName = 
  | 'Pending' 
  | 'Preparing' 
  | 'Ready' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Completed' 
  | 'Cancelled';

// Constants for OrderType (optional, for better IntelliSense)
export const OrderTypeEnum = {
  DINE_IN: 'DINE_IN' as OrderType,
  TAKEAWAY: 'TAKEAWAY' as OrderType,
  DELIVERY: 'DELIVERY' as OrderType,
};

// Constants for OrderStatusName (optional, for better IntelliSense)
export const OrderStatusNameEnum = {
  PENDING: 'Pending' as OrderStatusName,
  PREPARING: 'Preparing' as OrderStatusName,
  READY: 'Ready' as OrderStatusName,
  OUT_FOR_DELIVERY: 'Out for Delivery' as OrderStatusName,
  DELIVERED: 'Delivered' as OrderStatusName,
  COMPLETED: 'Completed' as OrderStatusName,
  CANCELLED: 'Cancelled' as OrderStatusName,
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  comment?: string;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  menuItem?: any;
};

export type StatusCatalog = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = {
  id: string;
  orderId: string;
  statusCatalogId: string;
  notes?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  statusCatalog?: StatusCatalog;
};

export type Order = {
  id: string;
  orderNumber: string;
  restaurantId: string;
  userId: string;
  driverId?: string;
  tableId?: string;
  deliveryAddressId?: string;
  statusId: string;
  orderType: OrderType;
  totalPrice: number;
  discount: number;
  deliveryFee: number;
  taxAmount: number;
  finalPrice: number;
  comment?: string;
  scheduledTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  
  // Relations
  restaurant?: any;
  user?: any;
  driver?: any;
  table?: any;
  deliveryAddress?: any;
  status?: StatusCatalog;
  orderItems?: OrderItem[];
  statusHistory?: OrderStatus[];
  payment?: any;
  deliveryTracking?: any;
};

// Request DTOs
export type CreateOrderItemDto = {
  menuItemId: string;
  quantity: number;
  comment?: string;
};

export type CreateOrderDto = {
  restaurantId: string;
  userId?: string;
  tableId?: string;
  deliveryAddressId?: string;
  orderType: OrderType;
  items: CreateOrderItemDto[];
  discount?: number;
  deliveryFee?: number;
  taxAmount?: number;
  comment?: string;
  scheduledTime?: string;
};

export type UpdateOrderDto = {
  tableId?: string;
  deliveryAddressId?: string;
  orderType?: OrderType;
  items?: CreateOrderItemDto[];
  discount?: number;
  deliveryFee?: number;
  taxAmount?: number;
  comment?: string;
  scheduledTime?: string;
};

export type OrderStatusDto = {
  statusId: string;
  notes?: string;
  updatedBy?: string;
};

export type AssignDriverDto = {
  driverId: string;
};

// Search DTOs
export type OrderSearchDto = {
  restaurantId?: string;
  userId?: string;
  driverId?: string;
  statusId?: string;
  orderType?: OrderType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type KitchenOrderSearchDto = {
  restaurantId?: string;
  statusId?: string;
  date?: string;
};

export type DeliveryOrderSearchDto = {
  restaurantId?: string;
  driverId?: string;
  statusId?: string;
};

export type OrderStatsDto = {
  restaurantId?: string;
  startDate: string;
  endDate: string;
};

// Response types
export type OrderPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type OrderStatistics = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusCounts: Array<{ status: string; count: string }>;
  orderTypeCounts: Array<{ orderType: OrderType; count: string; revenue: string }>;
  period: {
    startDate: string;
    endDate: string;
  };
};

export type RestaurantOrdersToday = {
  count: number;
  revenue: number;
};