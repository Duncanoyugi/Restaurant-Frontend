export const NotificationType = {
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  ORDER_READY: 'ORDER_READY',
  DELIVERY_ASSIGNED: 'DELIVERY_ASSIGNED',
  DELIVERY_PICKED_UP: 'DELIVERY_PICKED_UP',
  DELIVERY_ON_THE_WAY: 'DELIVERY_ON_THE_WAY',
  DELIVERY_COMPLETED: 'DELIVERY_COMPLETED',
  DELIVERY_DELAYED: 'DELIVERY_DELAYED',
  RESERVATION_CONFIRMED: 'RESERVATION_CONFIRMED',
  RESERVATION_CANCELLED: 'RESERVATION_CANCELLED',
  RESERVATION_REMINDER: 'RESERVATION_REMINDER',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_REFUNDED: 'PAYMENT_REFUNDED',
  REVIEW_RECEIVED: 'REVIEW_RECEIVED',
  REVIEW_RESPONSE: 'REVIEW_RESPONSE',
  LOW_INVENTORY_ALERT: 'LOW_INVENTORY_ALERT',
  STAFF_SHIFT_ASSIGNED: 'STAFF_SHIFT_ASSIGNED',
  STAFF_SHIFT_CHANGED: 'STAFF_SHIFT_CHANGED',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
  PROMOTIONAL: 'PROMOTIONAL',
  NEW_ORDER_RECEIVED: 'NEW_ORDER_RECEIVED',
  NEW_RESERVATION_RECEIVED: 'NEW_RESERVATION_RECEIVED',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type NotificationPriority = typeof NotificationPriority[keyof typeof NotificationPriority];

export const NotificationChannel = {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH',
  WHATSAPP: 'WHATSAPP',
} as const;

export type NotificationChannel = typeof NotificationChannel[keyof typeof NotificationChannel];

// Notification entity
export interface Notification {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  channel: NotificationChannel;
  isRead: boolean;
  isSent: boolean;
  readAt?: string;
  sentAt?: string;
  expiresAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Create notification DTO
export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

export interface BulkNotificationRequest {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

// Update notification DTO
export interface UpdateNotificationRequest {
  type?: NotificationType;
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  isRead?: boolean;
}

export interface MarkReadRequest {
  isRead: boolean;
}

// Query parameters
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  unreadOnly?: boolean;
}

// Response types
export interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byChannel: Record<string, number>;
}

// Workflow notification requests
export interface OrderNotificationRequest {
  userId: string;
  orderData: {
    id: string;
    orderNumber: string;
    [key: string]: any;
  };
}

export interface ReservationNotificationRequest {
  userId: string;
  reservationData: {
    id: string;
    date: string;
    time: string;
    [key: string]: any;
  };
}

export interface PaymentNotificationRequest {
  userId: string;
  paymentData: {
    id: string;
    amount: number;
    currency: string;
    [key: string]: any;
  };
}

export interface DeliveryNotificationRequest {
  userId: string;
  deliveryData: {
    id: string;
    deliveryPartner?: string;
    [key: string]: any;
  };
}

export interface LowInventoryNotificationRequest {
  adminUserIds: string[];
  inventoryData: {
    id: string;
    itemName: string;
    currentStock: number;
    [key: string]: any;
  };
}

export interface ReviewNotificationRequest {
  reviewData: {
    id: string;
    rating: number;
    [key: string]: any;
  };
}