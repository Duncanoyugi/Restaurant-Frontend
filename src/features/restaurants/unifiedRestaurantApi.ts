// src/features/restaurants/unifiedRestaurantApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Restaurant,
  RestaurantStaff,
  Shift,
  CreateRestaurantStaffDto,
  UpdateRestaurantStaffDto,
  CreateShiftDto,
  UpdateShiftDto,
  RestaurantStatistics,
} from '../../types/restaurant';

// Define additional types for staff and driver assignments
export interface StaffAssignment {
  id: number;
  restaurantId: number;
  staffId: number;
  role: string;
  status: string;
  assignedAt: string;
  staff?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  restaurant?: Restaurant;
}

export interface DriverAssignment {
  id: number;
  restaurantId: number;
  driverId: number;
  vehicleType?: string;
  licensePlate?: string;
  status: string;
  workingHours?: {
    start: string;
    end: string;
    days: string[];
  };
  assignedAt: string;
  driver?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  restaurant?: Restaurant;
}

export interface CreateStaffAssignmentDto {
  restaurantId: number;
  staffId: number;
  role: string;
  status?: string;
}

export interface CreateDriverAssignmentDto {
  restaurantId: number;
  driverId: number;
  vehicleType?: string;
  licensePlate?: string;
  status?: string;
  workingHours?: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface RestaurantSearchParams {
  name?: string;
  cuisineType?: string;
  priceRange?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export const unifiedRestaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // RESTAURANT ENDPOINTS
    // =========================================================================

    // Get all restaurants
    getAllRestaurants: builder.query<{ data: Restaurant[]; total: number }, RestaurantSearchParams | void>({
      query: (params) => {
        const searchParams = params || {};
        const queryParams = new URLSearchParams();
        if (searchParams.name) queryParams.append('name', searchParams.name);
        if (searchParams.cuisineType) queryParams.append('cuisineType', searchParams.cuisineType);
        if (searchParams.priceRange) queryParams.append('priceRange', searchParams.priceRange);
        if (searchParams.active !== undefined) queryParams.append('active', String(searchParams.active));
        if (searchParams.page) queryParams.append('page', String(searchParams.page));
        if (searchParams.limit) queryParams.append('limit', String(searchParams.limit));

        const queryString = queryParams.toString();
        return {
          url: `restaurants${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Restaurants' as const, id })),
              { type: 'Restaurants', id: 'LIST' },
          ]
          : [{ type: 'Restaurants', id: 'LIST' }],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return { data: response, total: response.length };
        }
        return {
          data: response.data || [],
          total: response.total || 0,
        };
      },
    }),

    // Get restaurant by ID
    getRestaurantById: builder.query<Restaurant, string>({
      query: (id) => `restaurants/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Restaurants', id }],
    }),

    // Create restaurant
    createRestaurant: builder.mutation<Restaurant, Partial<Restaurant>>({
      query: (data) => ({
        url: 'restaurants',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Restaurants', id: 'LIST' }],
    }),

    // Update restaurant
    updateRestaurant: builder.mutation<Restaurant, { id: string; data: Partial<Restaurant> }>({
      query: ({ id, data }) => ({
        url: `restaurants/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Restaurants', id },
        { type: 'Restaurants', id: 'LIST' },
      ],
    }),

    // Delete restaurant
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

    // Get restaurant statistics
    getRestaurantStatistics: builder.query<RestaurantStatistics, string>({
      query: (id) => `restaurants/${id}/statistics`,
      providesTags: (_result, _error, id) => [{ type: 'RestaurantStatistics', id }],
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

    // =========================================================================
    // STAFF ASSIGNMENT ENDPOINTS
    // =========================================================================

    // Create staff assignment
    createStaffAssignment: builder.mutation<StaffAssignment, CreateStaffAssignmentDto>({
      query: (staffAssignment) => ({
        url: '/restaurants/staff-assignments',
        method: 'POST',
        body: staffAssignment,
      }),
      invalidatesTags: ['StaffAssignments'],
    }),

    // Get staff assignments by restaurant
    getStaffAssignmentsByRestaurant: builder.query<StaffAssignment[], number>({
      query: (restaurantId) => `/restaurants/staff-assignments/restaurant/${restaurantId}`,
      providesTags: (result) => (
        result
          ? [
              ...result.map(({ id }) => ({ type: 'StaffAssignments' as const, id })),
              { type: 'StaffAssignments', id: 'LIST' },
            ]
          : [{ type: 'StaffAssignments', id: 'LIST' }]
      ),
    }),

    // Delete staff assignment
    deleteStaffAssignment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/restaurants/staff-assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StaffAssignments'],
    }),

    // =========================================================================
    // DRIVER ASSIGNMENT ENDPOINTS
    // =========================================================================

    // Create driver assignment
    createDriverAssignment: builder.mutation<DriverAssignment, CreateDriverAssignmentDto>({
      query: (driverAssignment) => ({
        url: '/restaurants/driver-assignments',
        method: 'POST',
        body: driverAssignment,
      }),
      invalidatesTags: ['DriverAssignments'],
    }),

    // Get driver assignments by restaurant
    getDriverAssignmentsByRestaurant: builder.query<DriverAssignment[], number>({
      query: (restaurantId) => `/restaurants/driver-assignments/restaurant/${restaurantId}`,
      providesTags: (result) => (
        result
          ? [
              ...result.map(({ id }) => ({ type: 'DriverAssignments' as const, id })),
              { type: 'DriverAssignments', id: 'LIST' },
            ]
          : [{ type: 'DriverAssignments', id: 'LIST' }]
      ),
    }),

    // Delete driver assignment
    deleteDriverAssignment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/restaurants/driver-assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DriverAssignments'],
    }),

    // =========================================================================
    // STAFF MANAGEMENT ENDPOINTS
    // =========================================================================

    // Create restaurant staff member
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

    // Update staff member by ID
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

    // Delete staff member by ID
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
    // SHIFT MANAGEMENT ENDPOINTS
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

    // Delete shift by ID
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
  useGetAllRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
  useGetRestaurantStatisticsQuery,
  useGetDefaultRestaurantQuery,
  useFindNearbyRestaurantsQuery,
  useGetPopularRestaurantsInCityQuery,

  // Staff assignment hooks
  useCreateStaffAssignmentMutation,
  useGetStaffAssignmentsByRestaurantQuery,
  useDeleteStaffAssignmentMutation,

  // Driver assignment hooks
  useCreateDriverAssignmentMutation,
  useGetDriverAssignmentsByRestaurantQuery,
  useDeleteDriverAssignmentMutation,

  // Staff management hooks
  useCreateStaffMutation,
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,

  // Shift management hooks
  useCreateShiftMutation,
  useGetShiftsByStaffQuery,
  useGetShiftsByRestaurantQuery,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = unifiedRestaurantApi;