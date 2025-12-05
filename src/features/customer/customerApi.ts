// src/features/customer/customerApi.ts
import { baseApi } from '../../utils/baseApi';

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get customer profile
    getProfile: builder.query<any, void>({
      query: () => 'users/me/profile',
      providesTags: ['Profile'],
    }),

    // Update customer profile
    updateProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: 'users/me/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Get loyalty info
    getLoyaltyInfo: builder.query<any, void>({
      query: () => 'users/me/loyalty',
      providesTags: ['CustomerLoyalty'],
    }),

    // Get customer orders
    getOrders: builder.query<any, any>({
      query: (params) => ({
        url: 'orders/user/my-orders',
        method: 'GET',
        params,
      }),
      providesTags: ['CustomerOrders'],
    }),

    // Get order by ID
    getOrderById: builder.query<any, string>({
      query: (id) => `orders/${id}`,
      providesTags: (_, __, id) => [{ type: 'Orders', id }],
    }),

    // Cancel order
    cancelOrder: builder.mutation<any, any>({
      query: ({ orderId, reason }) => ({
        url: `orders/${orderId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['CustomerOrders'],
    }),

    // Get customer reservations
    getReservations: builder.query<any, any>({
      query: (params) => ({
        url: 'reservations/user/my-reservations',
        method: 'GET',
        params,
      }),
      providesTags: ['MyReservations'],
    }),

    // Get reservation by ID
    getReservationById: builder.query<any, string>({
      query: (id) => `reservations/${id}`,
      providesTags: (_, __, id) => [{ type: 'Reservations', id }],
    }),

    // Cancel reservation
    cancelReservation: builder.mutation<any, any>({
      query: ({ reservationId, reason }) => ({
        url: `reservations/${reservationId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['MyReservations'],
    }),

    // Update reservation
    updateReservation: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `reservations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MyReservations'],
    }),

    // Get customer reviews
    getReviews: builder.query<any, any>({
      query: (params) => ({
        url: 'reviews/my',
        method: 'GET',
        params,
      }),
      providesTags: ['MyReviews'],
    }),

    // Create review
    createReview: builder.mutation<any, any>({
      query: (data) => ({
        url: 'reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyReviews'],
    }),

    // Update review
    updateReview: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `reviews/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MyReviews'],
    }),

    // Delete review
    deleteReview: builder.mutation<any, string>({
      query: (id) => ({
        url: `reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyReviews'],
    }),

    // Get room bookings
    getRoomBookings: builder.query<any, any>({
      query: (params) => ({
        url: 'rooms/bookings/user/my-bookings',
        method: 'GET',
        params,
      }),
      providesTags: ['RoomBookings'],
    }),

    // Cancel room booking
    cancelRoomBooking: builder.mutation<any, any>({
      query: ({ bookingId, reason }) => ({
        url: `rooms/bookings/${bookingId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['RoomBookings'],
    }),

    // Create order
    createOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: 'orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CustomerOrders'],
    }),

    // Get dashboard overview
    getDashboardOverview: builder.query<any, any>({
      query: (params) => ({
        url: 'users/me/dashboard',
        method: 'GET',
        params,
      }),
      providesTags: ['DashboardAnalytics'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetLoyaltyInfoQuery,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useGetReservationsQuery,
  useGetReservationByIdQuery,
  useCancelReservationMutation,
  useUpdateReservationMutation,
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetRoomBookingsQuery,
  useCancelRoomBookingMutation,
  useCreateOrderMutation,
  useGetDashboardOverviewQuery,
} = customerApi;