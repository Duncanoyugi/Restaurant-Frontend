// src/features/customer/customerApi.ts
import { baseApi } from '../../utils/baseApi';

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get customer profile
    getProfile: builder.query<any, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: 'users/me/profile',
          });
          return result;
        } catch (error) {
          // Return mock data if backend not ready
          console.log('🔄 Backend not ready, using mock data for profile');
          return {
            data: {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+254712345678',
              role: 'Customer',
              profileImage: null,
              emailVerified: true,
              status: 'ACTIVE',
              favoriteCuisines: ['Italian', 'Kenyan'],
              dietaryPreferences: ['Vegetarian'],
              allergies: ['Peanuts'],
              totalOrders: 5,
              totalSpent: 12500, // KSH
              createdAt: new Date().toISOString()
            }
          };
        }
      },
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
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: 'orders/user/my-orders',
            method: 'GET',
            params,
          });
          return result;
        } catch (error) {
          // Return mock data if backend not ready
          console.log('🔄 Backend not ready, using mock data for orders');
          return {
            data: {
              orders: [
                {
                  id: '1',
                  orderNumber: 'ORD-001',
                  status: { name: 'Pending' },
                  restaurant: { name: 'Savory Bites' },
                  createdAt: new Date().toISOString(),
                  finalPrice: 2599, // KSH instead of USD
                  orderItems: [
                    { menuItem: { name: 'Burger' }, quantity: 1 },
                    { menuItem: { name: 'Fries' }, quantity: 1 }
                  ],
                  orderType: 'DELIVERY'
                }
              ],
              total: 1,
              page: 1,
              limit: 10
            }
          };
        }
      },
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
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: 'reservations/user/my-reservations',
            method: 'GET',
            params,
          });
          return result;
        } catch (error) {
          // Return mock data if backend not ready
          console.log('🔄 Backend not ready, using mock data for reservations');
          return {
            data: {
              reservations: [
                {
                  id: '1',
                  reservationNumber: 'RES-001',
                  status: 'CONFIRMED',
                  restaurant: { name: 'Savory Bites' },
                  reservationDate: new Date().toISOString().split('T')[0],
                  reservationTime: '19:00',
                  guestCount: 2,
                  reservationType: 'STANDARD',
                  createdAt: new Date().toISOString()
                }
              ],
              total: 1,
              page: 1,
              limit: 10
            }
          };
        }
      },
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
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: 'reviews/my',
            method: 'GET',
            params,
          });
          return result;
        } catch (error) {
          // Return mock data if backend not ready
          console.log('🔄 Backend not ready, using mock data for reviews');
          return {
            data: {
              reviews: [
                {
                  id: '1',
                  restaurant: { name: 'Savory Bites' },
                  menuItem: { name: 'Special Burger' },
                  rating: 5,
                  comment: 'Amazing food and great service!',
                  createdAt: new Date().toISOString()
                }
              ],
              total: 1,
              page: 1,
              limit: 10
            }
          };
        }
      },
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

    // Get room bookings - use correct endpoint with userId filter
    getRoomBookings: builder.query<any, { userId?: string; page?: number; limit?: number; status?: string }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.userId) queryParams.append('userId', params.userId);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status) queryParams.append('status', params.status);
        const queryString = queryParams.toString();
        return {
          url: `rooms/bookings${queryString ? `?${queryString}` : ''}`,
        };
      },
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

    // Get cities
    getCities: builder.query<any, void>({
      query: () => 'location/cities',
      providesTags: ['Cities'],
    }),

    // Get states
    getStates: builder.query<any, void>({
      query: () => 'location/states',
      providesTags: ['States'],
    }),

    // Create address
    createAddress: builder.mutation<any, any>({
      query: (data) => ({
        url: 'location/my/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Addresses'],
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
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: 'users/me/dashboard',
            method: 'GET',
            params,
          });
          return result;
        } catch (error) {
          // Return mock data if backend not ready
          console.log('🔄 Backend not ready, using mock data for dashboard');
          return {
            data: {
              period: 'LAST_30_DAYS',
              revenue: { totalRevenue: 125000 }, // KSH
              orders: { totalOrders: 245, averageOrderValue: 5102 },
              reservations: { totalReservations: 89 },
              roomBookings: { totalBookings: 12 },
              customers: { newCustomers: 15, returningCustomers: 74 },
              topMenuItems: []
            }
          };
        }
      },
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