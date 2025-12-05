import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationsState {
  toasts: Toast[];
  notifications: Array<{
    id: string;
    type: 'order' | 'reservation' | 'review' | 'promotion' | 'system';
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
    action?: {
      label: string;
      url: string;
    };
  }>;
  unreadCount: number;
}

const initialState: NotificationsState = {
  toasts: [],
  notifications: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const newToast: Toast = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    addNotification: (state, action: PayloadAction<{
      type: NotificationsState['notifications'][0]['type'];
      title: string;
      message: string;
      action?: {
        label: string;
        url: string;
      };
    }>) => {
      const newNotification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.read) {
          notification.read = true;
        }
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    // Specialized notification actions
    notifyOrderUpdate: (state, action: PayloadAction<{
      orderId: string;
      orderNumber: string;
      status: string;
      restaurantName: string;
    }>) => {
      const { orderNumber, status, restaurantName } = action.payload;
      const statusMessages: Record<string, string> = {
        'CONFIRMED': 'Order confirmed and being prepared',
        'PREPARING': 'Order is now being prepared',
        'READY': 'Order is ready for pickup',
        'DELIVERED': 'Order has been delivered',
        'CANCELLED': 'Order has been cancelled',
      };
      
      state.notifications.unshift({
        id: Date.now().toString(),
        type: 'order',
        title: `Order #${orderNumber} Update`,
        message: `${restaurantName}: ${statusMessages[status] || 'Status updated'}`,
        read: false,
        timestamp: new Date().toISOString(),
        action: {
          label: 'View Order',
          url: `/dashboard/orders/${action.payload.orderId}`,
        },
      });
      state.unreadCount += 1;
    },
    notifyReservationUpdate: (state, action: PayloadAction<{
      reservationId: string;
      reservationNumber: string;
      status: string;
      restaurantName: string;
      date: string;
      time: string;
    }>) => {
      const { reservationNumber, status, restaurantName } = action.payload;
      const statusMessages: Record<string, string> = {
        'CONFIRMED': 'Reservation confirmed',
        'CANCELLED': 'Reservation cancelled',
        'COMPLETED': 'Reservation completed',
      };
      
      state.notifications.unshift({
        id: Date.now().toString(),
        type: 'reservation',
        title: `Reservation #${reservationNumber} Update`,
        message: `${restaurantName}: ${statusMessages[status] || 'Status updated'}`,
        read: false,
        timestamp: new Date().toISOString(),
        action: {
          label: 'View Reservation',
          url: `/dashboard/reservations/${action.payload.reservationId}`,
        },
      });
      state.unreadCount += 1;
    },
    notifyReviewResponse: (state, action: PayloadAction<{
      reviewId: string;
      restaurantName: string;
      response: string;
    }>) => {
      const { restaurantName } = action.payload;
      
      state.notifications.unshift({
        id: Date.now().toString(),
        type: 'review',
        title: 'New Response to Your Review',
        message: `${restaurantName} has responded to your review`,
        read: false,
        timestamp: new Date().toISOString(),
        action: {
          label: 'View Response',
          url: `/dashboard/reviews`,
        },
      });
      state.unreadCount += 1;
    },
    notifyPromotion: (state, action: PayloadAction<{
      title: string;
      message: string;
      code?: string;
    }>) => {
      state.notifications.unshift({
        id: Date.now().toString(),
        type: 'promotion',
        title: action.payload.title,
        message: action.payload.message,
        read: false,
        timestamp: new Date().toISOString(),
        action: action.payload.code ? {
          label: 'Use Code',
          url: `/menu?promo=${action.payload.code}`,
        } : undefined,
      });
      state.unreadCount += 1;
    },
  },
});

export const {
  addToast,
  removeToast,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  notifyOrderUpdate,
  notifyReservationUpdate,
  notifyReviewResponse,
  notifyPromotion,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;