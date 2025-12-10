// src/features/restaurant/restaurantApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Restaurant,
  RestaurantStaff,
  Shift,
  CreateRestaurantDto,
  UpdateRestaurantDto,
  CreateRestaurantStaffDto,
  UpdateRestaurantStaffDto,
  CreateShiftDto,
  UpdateShiftDto,
  RestaurantSearchDto,
  RestaurantPaginatedResponse,
  RestaurantStatistics,
} from '../../types/restaurant';

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // RESTAURANT ENDPOINTS
    // =========================================================================

    // Create a new restaurant (Admin & Restaurant Owner only)
    createRestaurant: builder.mutation<Restaurant, CreateRestaurantDto>({
      query: (data) => ({
        url: 'restaurants',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Restaurants'],
    }),

    // Get all restaurants with filtering
    getAllRestaurants: builder.query<RestaurantPaginatedResponse<Restaurant>, RestaurantSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();

        if (searchDto?.name) params.append('name', searchDto.name);
        if (searchDto?.cityId) params.append('cityId', searchDto.cityId);
        if (searchDto?.minRating !== undefined) params.append('minRating', searchDto.minRating.toString());
        if (searchDto?.active !== undefined) params.append('active', searchDto.active.toString());
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());

        const queryString = params.toString();
        return {
          url: `restaurants${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }: { id: string }) => ({ type: 'Restaurants' as const, id })),
            { type: 'Restaurants', id: 'LIST' },
          ]
          : [{ type: 'Restaurants', id: 'LIST' }],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return {
            data: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1,
          };
        }
        return {
          data: response.data || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),

    // Get default restaurant (for single restaurant system)
    getDefaultRestaurant: builder.query<Restaurant, void>({
      query: () => 'restaurants/default',
      providesTags: [{ type: 'Restaurants', id: 'DEFAULT' }],
    }),

    // Find restaurants nearby coordinates
    findNearbyRestaurants: builder.query<Restaurant[], { lat: number; lng: number; radius?: number }>({
      query: ({ lat, lng, radius = 10 }) => {
        const params = new URLSearchParams();
        params.append('lat', lat.toString());
        params.append('lng', lng.toString());
        params.append('radius', radius.toString());

        return {
          url: `restaurants/nearby?${params.toString()}`,
        };
      },
    }),

    // Get popular restaurants in city
    getPopularRestaurantsInCity: builder.query<Restaurant[], { cityId: string; limit?: number }>({
      query: ({ cityId, limit = 10 }) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());

        return {
          url: `restaurants/city/${cityId}/popular?${params.toString()}`,
        };
      },
    }),

    // Get restaurant by ID
    getRestaurantById: builder.query<Restaurant, string>({
      query: (id) => `restaurants/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Restaurants', id }],
    }),

    // Get restaurant statistics
    getRestaurantStatistics: builder.query<RestaurantStatistics, string>({
      query: (id) => `restaurants/${id}/statistics`,
      providesTags: (_result, _error, id) => [{ type: 'RestaurantStatistics', id }],
    }),

    // Update restaurant by ID (Admin & Restaurant Owner only)
    updateRestaurant: builder.mutation<Restaurant, { id: string; data: UpdateRestaurantDto }>({
      query: ({ id, data }) => ({
        url: `restaurants/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Restaurants', id },
        { type: 'Restaurants', id: 'LIST' },
        { type: 'RestaurantStatistics', id },
      ],
    }),

    // Delete restaurant by ID (Admin only)
    deleteRestaurant: builder.mutation<void, string>({
      query: (id) => ({
        url: `restaurants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Restaurants', id },
        { type: 'Restaurants', id: 'LIST' },
      ],
    }),

    // =========================================================================
    // STAFF ENDPOINTS
    // =========================================================================

    // Create restaurant staff member (Admin & Restaurant Owner only)
    createStaff: builder.mutation<RestaurantStaff, CreateRestaurantStaffDto>({
      query: (data) => ({
        url: 'restaurants/staff',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RestaurantStaff'],
    }),

    // Get all staff for restaurant
    getAllStaff: builder.query<RestaurantStaff[], string>({
      query: (restaurantId) => `restaurants/staff/restaurant/${restaurantId}`,
      providesTags: ['RestaurantStaff'],
    }),

    // Get staff member by ID
    getStaffById: builder.query<RestaurantStaff, string>({
      query: (id) => `restaurants/staff/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'RestaurantStaff', id }],
    }),

    // Update staff member by ID (Admin & Restaurant Owner only)
    updateStaff: builder.mutation<RestaurantStaff, { id: string; data: UpdateRestaurantStaffDto }>({
      query: ({ id, data }) => ({
        url: `restaurants/staff/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RestaurantStaff', id },
        { type: 'RestaurantStaff', id: 'LIST' },
      ],
    }),

    // Delete staff member by ID (Admin & Restaurant Owner only)
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `restaurants/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'RestaurantStaff', id },
        { type: 'RestaurantStaff', id: 'LIST' },
      ],
    }),

    // =========================================================================
    // SHIFT ENDPOINTS
    // =========================================================================

    // Create a staff shift
    createShift: builder.mutation<Shift, CreateShiftDto>({
      query: (data) => ({
        url: 'restaurants/shifts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Shifts'],
    }),

    // Get shifts by staff member
    getShiftsByStaff: builder.query<Shift[], { staffId: string; startDate?: string; endDate?: string }>({
      query: ({ staffId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const queryString = params.toString();
        return {
          url: `restaurants/shifts/staff/${staffId}${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'Shifts', id }))
          : ['Shifts'],
    }),

    // Get shifts by restaurant
    getShiftsByRestaurant: builder.query<Shift[], { restaurantId: string; date?: string }>({
      query: ({ restaurantId, date }) => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);

        const queryString = params.toString();
        return {
          url: `restaurants/shifts/restaurant/${restaurantId}${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'Shifts', id }))
          : ['Shifts'],
    }),

    // Update shift by ID
    updateShift: builder.mutation<Shift, { id: string; data: UpdateShiftDto }>({
      query: ({ id, data }) => ({
        url: `restaurants/shifts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Shifts', id },
        { type: 'Shifts', id: 'LIST' },
      ],
    }),

    // Delete shift by ID (Admin & Restaurant Owner only)
    deleteShift: builder.mutation<void, string>({
      query: (id) => ({
        url: `restaurants/shifts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Shifts', id },
        { type: 'Shifts', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Restaurant hooks
  useCreateRestaurantMutation,
  useGetAllRestaurantsQuery,
  useGetDefaultRestaurantQuery,
  useFindNearbyRestaurantsQuery,
  useGetPopularRestaurantsInCityQuery,
  useGetRestaurantByIdQuery,
  useGetRestaurantStatisticsQuery,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,

  // Staff hooks
  useCreateStaffMutation,
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,

  // Shift hooks
  useCreateShiftMutation,
  useGetShiftsByStaffQuery,
  useGetShiftsByRestaurantQuery,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = restaurantApi;