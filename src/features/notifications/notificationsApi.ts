// src/features/notifications/notificationsApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Notification,
  CreateNotificationRequest,
  BulkNotificationRequest,
  UpdateNotificationRequest,
  MarkReadRequest,
  NotificationQueryParams,
  NotificationListResponse,
  NotificationStats,
  OrderNotificationRequest,
  ReservationNotificationRequest,
  PaymentNotificationRequest,
  DeliveryNotificationRequest,
  LowInventoryNotificationRequest,
  ReviewNotificationRequest,
} from '../../types/notification';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications for current user
    getNotifications: builder.query<NotificationListResponse, NotificationQueryParams>({
      query: (params = {}) => ({
        url: 'notifications',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      }),
      providesTags: ['Notifications'],
    }),

    // Get notification by ID
    getNotificationById: builder.query<Notification, string>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Notifications', id }],
    }),

    // Get unread count
    getUnreadCount: builder.query<number, void>({
      query: () => ({
        url: 'notifications/unread/count',
        method: 'GET',
      }),
      providesTags: ['NotificationCount'],
    }),

    // Get notification statistics
    getNotificationStats: builder.query<NotificationStats, void>({
      query: () => ({
        url: 'notifications/stats',
        method: 'GET',
      }),
      providesTags: ['NotificationStats'],
    }),

    // Mark notification as read
    markNotificationAsRead: builder.mutation<Notification, { id: string; data: MarkReadRequest }>({
      query: ({ id, data }) => ({
        url: `notifications/${id}/read`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Notifications', id },
        'Notifications',
        'NotificationCount',
        'NotificationStats',
      ],
    }),

    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'notifications/mark-all-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications', 'NotificationCount', 'NotificationStats'],
    }),

    // Create a notification (Admin/Restaurant Owner only)
    createNotification: builder.mutation<Notification, CreateNotificationRequest>({
      query: (data) => ({
        url: 'notifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount', 'NotificationStats'],
    }),

    // Create bulk notifications (Admin only)
    createBulkNotifications: builder.mutation<Notification[], BulkNotificationRequest>({
      query: (data) => ({
        url: 'notifications/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount', 'NotificationStats'],
    }),

    // Update notification (Admin/Restaurant Owner only)
    updateNotification: builder.mutation<Notification, { id: string; data: UpdateNotificationRequest }>({
      query: ({ id, data }) => ({
        url: `notifications/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Notifications', id },
        'Notifications',
        'NotificationCount',
        'NotificationStats',
      ],
    }),

    // Delete notification
    deleteNotification: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'NotificationCount', 'NotificationStats'],
    }),

    // Admin endpoints
    getAllNotifications: builder.query<NotificationListResponse, NotificationQueryParams>({
      query: (params = {}) => ({
        url: 'notifications/admin',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      }),
      providesTags: ['AdminNotifications'],
    }),

    // Restaurant notifications
    getRestaurantNotifications: builder.query<NotificationListResponse, NotificationQueryParams>({
      query: (params = {}) => ({
        url: 'notifications/restaurant',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      }),
      providesTags: ['RestaurantNotifications'],
    }),

    // Driver order notifications
    getDriverOrderNotifications: builder.query<NotificationListResponse, NotificationQueryParams>({
      query: (params = {}) => ({
        url: 'notifications/driver/orders',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      }),
      providesTags: ['DriverNotifications'],
    }),

    // Broadcast to restaurant customers
    broadcastToRestaurantCustomers: builder.mutation<Notification[], CreateNotificationRequest>({
      query: (data) => ({
        url: 'notifications/restaurant/broadcast',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),

    // Workflow notifications
    notifyOrderConfirmed: builder.mutation<Notification, OrderNotificationRequest>({
      query: (data) => ({
        url: 'notifications/order-confirmed',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),

    notifyReservationConfirmed: builder.mutation<Notification, ReservationNotificationRequest>({
      query: (data) => ({
        url: 'notifications/reservation-confirmed',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),

    notifyPaymentSuccess: builder.mutation<Notification, PaymentNotificationRequest>({
      query: (data) => ({
        url: 'notifications/payment-success',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),

    notifyDeliveryAssigned: builder.mutation<Notification, DeliveryNotificationRequest>({
      query: (data) => ({
        url: 'notifications/delivery-assigned',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),

    notifyLowInventory: builder.mutation<Notification[], LowInventoryNotificationRequest>({
      query: (data) => ({
        url: 'notifications/low-inventory',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),

    notifyNewReview: builder.mutation<Notification[], ReviewNotificationRequest>({
      query: (data) => ({
        url: 'notifications/new-review',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),

    // System cleanup (Admin only)
    cleanupExpiredNotifications: builder.mutation<{ affected: number }, void>({
      query: () => ({
        url: 'notifications/system/cleanup',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications', 'NotificationCount', 'NotificationStats'],
    }),
  }),
});

export const {
  // Basic notification operations
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetUnreadCountQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useCreateNotificationMutation,
  useCreateBulkNotificationsMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,

  // Role-specific queries
  useGetAllNotificationsQuery,
  useGetRestaurantNotificationsQuery,
  useGetDriverOrderNotificationsQuery,

  // Broadcast operations
  useBroadcastToRestaurantCustomersMutation,

  // Workflow notifications
  useNotifyOrderConfirmedMutation,
  useNotifyReservationConfirmedMutation,
  useNotifyPaymentSuccessMutation,
  useNotifyDeliveryAssignedMutation,
  useNotifyLowInventoryMutation,
  useNotifyNewReviewMutation,

  // System operations
  useCleanupExpiredNotificationsMutation,
} = notificationsApi;