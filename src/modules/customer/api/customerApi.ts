import { baseApi } from '@/shared/utils/baseApi';

export interface LoyaltyInfo {
  points?: number;
  loyaltyPoints?: number;
  tier?: string;
  loyaltyTier?: string;
  pointsToNextTier?: number;
  pointsNeeded?: number;
  nextTier?: string;
}

const normalizeCollectionResponse = (
  response: any,
  key: string,
  fallbackPage = 1,
  fallbackLimit = 10,
) => {
  if (Array.isArray(response)) {
    return {
      [key]: response,
      total: response.length,
      page: fallbackPage,
      limit: fallbackLimit,
    };
  }

  if (response?.data && Array.isArray(response.data)) {
    return {
      [key]: response.data,
      total: response.total || response.data.length,
      page: response.page || fallbackPage,
      limit: response.limit || fallbackLimit,
    };
  }

  return {
    [key]: response?.[key] || [],
    total: response?.total || 0,
    page: response?.page || fallbackPage,
    limit: response?.limit || fallbackLimit,
  };
};

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => 'users/me/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: 'users/me/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    getLoyaltyInfo: builder.query<LoyaltyInfo, void>({
      query: () => 'users/me/loyalty',
      providesTags: ['CustomerLoyalty'],
    }),

    getOrders: builder.query<any, { page?: number; limit?: number; status?: string } | void>({
      query: (params) => ({
        url: 'orders/user/my-orders',
        method: 'GET',
        params: params || {},
      }),
      transformResponse: (response: any, _meta, arg) =>
        normalizeCollectionResponse(response, 'orders', arg?.page || 1, arg?.limit || 10),
      providesTags: ['CustomerOrders'],
    }),

    getOrderById: builder.query<any, string>({
      query: (id) => `orders/${id}`,
      providesTags: (_, __, id) => [{ type: 'Orders', id }],
    }),

    cancelOrder: builder.mutation<any, { orderId: string; reason?: string }>({
      query: ({ orderId, reason }) => ({
        url: `orders/user/my-orders/${orderId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['CustomerOrders', 'Orders'],
    }),

    getReservations: builder.query<any, { page?: number; limit?: number; status?: string } | void>({
      query: (params) => ({
        url: 'reservations/user/my-reservations',
        method: 'GET',
        params: params || {},
      }),
      transformResponse: (response: any, _meta, arg) =>
        normalizeCollectionResponse(response, 'reservations', arg?.page || 1, arg?.limit || 10),
      providesTags: ['MyReservations'],
    }),

    getReservationById: builder.query<any, string>({
      query: (id) => `reservations/${id}`,
      providesTags: (_, __, id) => [{ type: 'Reservations', id }],
    }),

    cancelReservation: builder.mutation<any, { reservationId: string; reason?: string }>({
      query: ({ reservationId, reason }) => ({
        url: `reservations/${reservationId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['MyReservations'],
    }),

    updateReservation: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `reservations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MyReservations'],
    }),

    getReviews: builder.query<any, { page?: number; limit?: number; sortBy?: string } | void>({
      query: (params) => ({
        url: 'reviews/my',
        method: 'GET',
        params: params || {},
      }),
      transformResponse: (response: any, _meta, arg) =>
        normalizeCollectionResponse(response, 'reviews', arg?.page || 1, arg?.limit || 10),
      providesTags: ['MyReviews'],
    }),

    createReview: builder.mutation<any, any>({
      query: (data) => ({
        url: 'reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyReviews', 'Reviews'],
    }),

    updateReview: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `reviews/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MyReviews', 'Reviews'],
    }),

    deleteReview: builder.mutation<any, string>({
      query: (id) => ({
        url: `reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyReviews', 'Reviews'],
    }),

    getRoomBookings: builder.query<any, { userId?: string; page?: number; limit?: number; status?: string }>({
      query: (params = {}) => ({
        url: 'rooms/bookings',
        params,
      }),
      transformResponse: (response: any, _meta, arg) =>
        normalizeCollectionResponse(response, 'bookings', arg?.page || 1, arg?.limit || 10),
      providesTags: ['RoomBookings'],
    }),

    cancelRoomBooking: builder.mutation<any, { bookingId: string; reason?: string }>({
      query: ({ bookingId, reason }) => ({
        url: `rooms/bookings/${bookingId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['RoomBookings'],
    }),

    getCities: builder.query<any, void>({
      query: () => 'location/cities',
      providesTags: ['Cities'],
    }),

    getStates: builder.query<any, void>({
      query: () => 'location/states',
      providesTags: ['States'],
    }),

    createAddress: builder.mutation<any, any>({
      query: (data) => ({
        url: 'location/my/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Addresses'],
    }),

    createOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: 'orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CustomerOrders', 'Orders'],
    }),

    getDashboardOverview: builder.query<any, void>({
      query: () => ({
        url: 'users/me/dashboard',
        method: 'GET',
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
  useGetCitiesQuery,
  useGetStatesQuery,
  useCreateAddressMutation,
  useCreateOrderMutation,
  useGetDashboardOverviewQuery,
} = customerApi;
