import { baseApi } from '../../utils/baseApi';
import type {
  Table,
  Reservation,
  CreateTableDto,
  UpdateTableDto,
  CreateReservationDto,
  UpdateReservationDto,
  ReservationStatusDto,
  AvailabilityCheckDto,
  TableAvailabilityDto,
  TableSearchDto,
  ReservationSearchDto,
  TablePaginatedResponse,
  ReservationPaginatedResponse,
  AvailabilityResponse,
  ReservationStats,
} from '../../types/reservation';

export const reservationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // TABLE ENDPOINTS
    // =========================================================================
    
    // Create a new restaurant table (Admin & Restaurant Owner only)
    createTable: builder.mutation<Table, CreateTableDto>({
      query: (data) => ({
        url: 'reservations/tables',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tables'],
    }),
    
    // Get all tables with filtering
    getAllTables: builder.query<TablePaginatedResponse<Table>, TableSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.minCapacity !== undefined) params.append('minCapacity', searchDto.minCapacity.toString());
        if (searchDto?.location) params.append('location', searchDto.location);
        if (searchDto?.status) params.append('status', searchDto.status);
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `reservations/tables${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Tables' as const, id })),
              { type: 'Tables', id: 'LIST' },
            ]
          : [{ type: 'Tables', id: 'LIST' }],
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
          limit: response.limit || 20,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 20)),
        };
      },
    }),
    
    // Get table by ID
    getTableById: builder.query<Table, string>({
      query: (id) => `reservations/tables/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tables', id }],
    }),
    
    // Update table by ID (Admin & Restaurant Owner only)
    updateTable: builder.mutation<Table, { id: string; data: UpdateTableDto }>({
      query: ({ id, data }) => ({
        url: `reservations/tables/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tables', id },
        { type: 'Tables', id: 'LIST' },
      ],
    }),
    
    // Delete table by ID (Admin & Restaurant Owner only)
    deleteTable: builder.mutation<void, string>({
      query: (id) => ({
        url: `reservations/tables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Tables', id },
        { type: 'Tables', id: 'LIST' },
      ],
    }),
    
    // =========================================================================
    // RESERVATION ENDPOINTS
    // =========================================================================
    
    // Create a new reservation
    createReservation: builder.mutation<Reservation, CreateReservationDto>({
      query: (data) => ({
        url: 'reservations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reservations', 'MyReservations'],
    }),
    
    // Get all reservations with filtering (Admin, Restaurant Owner & Staff only)
    getAllReservations: builder.query<ReservationPaginatedResponse<Reservation>, ReservationSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.userId) params.append('userId', searchDto.userId);
        if (searchDto?.tableId) params.append('tableId', searchDto.tableId);
        if (searchDto?.startDate) params.append('startDate', searchDto.startDate);
        if (searchDto?.endDate) params.append('endDate', searchDto.endDate);
        if (searchDto?.status) params.append('status', searchDto.status);
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `reservations${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Reservations' as const, id })),
              { type: 'Reservations', id: 'LIST' },
            ]
          : [{ type: 'Reservations', id: 'LIST' }],
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
          limit: response.limit || 20,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 20)),
        };
      },
    }),
    
    // Get reservation by ID
    getReservationById: builder.query<Reservation, string>({
      query: (id) => `reservations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Reservations', id }],
    }),
    
    // Get reservation by reservation number
    getReservationByNumber: builder.query<Reservation, string>({
      query: (reservationNumber) => `reservations/number/${reservationNumber}`,
      providesTags: (_result, _error, reservationNumber) => [{ type: 'Reservations', id: reservationNumber }],
    }),
    
    // Update reservation by ID
    updateReservation: builder.mutation<Reservation, { id: string; data: UpdateReservationDto }>({
      query: ({ id, data }) => ({
        url: `reservations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Reservations', id },
        { type: 'Reservations', id: 'LIST' },
        'MyReservations',
      ],
    }),
    
    // Update reservation status (Admin, Restaurant Owner & Staff only)
    updateReservationStatus: builder.mutation<Reservation, { id: string; data: ReservationStatusDto }>({
      query: ({ id, data }) => ({
        url: `reservations/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Reservations', id },
        { type: 'Reservations', id: 'LIST' },
        'MyReservations',
      ],
    }),
    
    // Cancel reservation
    cancelReservation: builder.mutation<Reservation, { id: string; performedBy?: string }>({
      query: ({ id, performedBy }) => ({
        url: `reservations/${id}/cancel`,
        method: 'POST',
        body: { performedBy },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Reservations', id },
        { type: 'Reservations', id: 'LIST' },
        'MyReservations',
      ],
    }),
    
    // =========================================================================
    // AVAILABILITY ENDPOINTS
    // =========================================================================
    
    // Check table availability
    checkAvailability: builder.query<AvailabilityResponse, AvailabilityCheckDto>({
      query: (availabilityDto) => ({
        url: 'reservations/check-availability',
        method: 'POST',
        body: availabilityDto,
      }),
    }),
    
    // Find available tables for given criteria
    findAvailableTables: builder.query<Table[], TableAvailabilityDto>({
      query: (availabilityDto) => ({
        url: 'reservations/available-tables',
        method: 'POST',
        body: availabilityDto,
      }),
    }),
    
    // =========================================================================
    // ANALYTICS ENDPOINTS
    // =========================================================================
    
    // Get reservation statistics for restaurant (Admin, Restaurant Owner & Staff only)
    getReservationStats: builder.query<ReservationStats, { restaurantId: string; startDate: string; endDate: string }>({
      query: ({ restaurantId, startDate, endDate }) => {
        const params = new URLSearchParams();
        params.append('startDate', startDate);
        params.append('endDate', endDate);
        
        return {
          url: `reservations/restaurant/${restaurantId}/stats?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'ReservationStats', id: restaurantId },
      ],
    }),
    
    // Get upcoming reservations for restaurant (Admin, Restaurant Owner & Staff only)
    getUpcomingReservations: builder.query<Reservation[], { restaurantId: string; hours?: number }>({
      query: ({ restaurantId, hours = 24 }) => {
        const params = new URLSearchParams();
        params.append('hours', hours.toString());
        
        return {
          url: `reservations/restaurant/${restaurantId}/upcoming?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'UpcomingReservations', id: restaurantId },
      ],
    }),
    
    // Get daily reservations for restaurant (Admin, Restaurant Owner & Staff only)
    getDailyReservations: builder.query<Reservation[], { restaurantId: string; date: string }>({
      query: ({ restaurantId, date }) => {
        const params = new URLSearchParams();
        params.append('date', date);
        
        return {
          url: `reservations/restaurant/${restaurantId}/daily?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { restaurantId, date }) => [
        { type: 'DailyReservations', id: `${restaurantId}-${date}` },
      ],
    }),
    
    // =========================================================================
    // USER-SPECIFIC ENDPOINTS
    // =========================================================================
    
    // Get current user reservations
    getMyReservations: builder.query<Reservation[], void>({
      query: () => 'reservations/user/my-reservations',
      providesTags: ['MyReservations'],
    }),
    
    // Get current restaurant reservations (Restaurant Owner & Staff only)
    getMyRestaurantReservations: builder.query<Reservation[], void>({
      query: () => 'reservations/restaurant/my-reservations',
      providesTags: ['MyRestaurantReservations'],
    }),
    
    // Get current restaurant tables (Restaurant Owner & Staff only)
    getMyRestaurantTables: builder.query<Table[], void>({
      query: () => 'reservations/restaurant/my-tables',
      providesTags: ['MyRestaurantTables'],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Table hooks
  useCreateTableMutation,
  useGetAllTablesQuery,
  useGetTableByIdQuery,
  useUpdateTableMutation,
  useDeleteTableMutation,
  
  // Reservation hooks
  useCreateReservationMutation,
  useGetAllReservationsQuery,
  useGetReservationByIdQuery,
  useGetReservationByNumberQuery,
  useUpdateReservationMutation,
  useUpdateReservationStatusMutation,
  useCancelReservationMutation,
  
  // Availability hooks
  useCheckAvailabilityQuery,
  useFindAvailableTablesQuery,
  
  // Analytics hooks
  useGetReservationStatsQuery,
  useGetUpcomingReservationsQuery,
  useGetDailyReservationsQuery,
  
  // User-specific hooks
  useGetMyReservationsQuery,
  useGetMyRestaurantReservationsQuery,
  useGetMyRestaurantTablesQuery,
} = reservationsApi;