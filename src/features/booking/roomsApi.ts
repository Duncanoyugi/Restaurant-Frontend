// src/features/booking/roomsApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Room,
  RoomBooking,
  CreateRoomDto,
  UpdateRoomDto,
  CreateRoomBookingDto,
  UpdateRoomBookingDto,
  RoomBookingStatusDto,
  RoomAvailabilityCheckDto, // Updated
  RoomSearchDto,
  RoomBookingSearchDto, // Updated
  RoomPaginatedResponse,
  RoomBookingPaginatedResponse, // Updated
  RoomAvailabilityResponse, // Updated
  RoomOccupancyStats, // Updated
} from '../../types/room';

export const roomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // ROOM ENDPOINTS
    // =========================================================================
    
    // Create a new room (Admin & Restaurant Owner only)
    createRoom: builder.mutation<Room, CreateRoomDto>({
      query: (data) => ({
        url: 'rooms',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rooms'],
    }),
    
    // Get all rooms with filtering
    getAllRooms: builder.query<RoomPaginatedResponse<Room>, RoomSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.minCapacity !== undefined) params.append('minCapacity', searchDto.minCapacity.toString());
        if (searchDto?.maxPrice !== undefined) params.append('maxPrice', searchDto.maxPrice.toString());
        if (searchDto?.available !== undefined) params.append('available', searchDto.available.toString());
        if (searchDto?.checkInDate) params.append('checkInDate', searchDto.checkInDate);
        if (searchDto?.checkOutDate) params.append('checkOutDate', searchDto.checkOutDate);
        if (searchDto?.guests) params.append('guests', searchDto.guests.toString());
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `rooms${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Rooms' as const, id })),
              { type: 'Rooms', id: 'LIST' },
            ]
          : [{ type: 'Rooms', id: 'LIST' }],
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
    
    // Search available rooms
    searchAvailableRooms: builder.query<Room[], RoomSearchDto>({
      query: (searchDto) => {
        const params = new URLSearchParams();
        
        if (searchDto.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto.minCapacity !== undefined) params.append('minCapacity', searchDto.minCapacity.toString());
        if (searchDto.maxPrice !== undefined) params.append('maxPrice', searchDto.maxPrice.toString());
        if (searchDto.checkInDate) params.append('checkInDate', searchDto.checkInDate);
        if (searchDto.checkOutDate) params.append('checkOutDate', searchDto.checkOutDate);
        if (searchDto.guests) params.append('guests', searchDto.guests.toString());
        
        const queryString = params.toString();
        return {
          url: `rooms/available${queryString ? `?${queryString}` : ''}`,
        };
      },
    }),
    
    // Get room by ID
    getRoomById: builder.query<Room, string>({
      query: (id) => `rooms/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Rooms', id }],
    }),
    
    // Update room by ID (Admin & Restaurant Owner only)
    updateRoom: builder.mutation<Room, { id: string; data: UpdateRoomDto }>({
      query: ({ id, data }) => ({
        url: `rooms/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Rooms', id },
        { type: 'Rooms', id: 'LIST' },
      ],
    }),
    
    // Delete room by ID (Admin & Restaurant Owner only)
    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({
        url: `rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Rooms', id },
        { type: 'Rooms', id: 'LIST' },
      ],
    }),
    
    // =========================================================================
    // ROOM BOOKING ENDPOINTS
    // =========================================================================
    
    // Create a new room booking
    createRoomBooking: builder.mutation<RoomBooking, CreateRoomBookingDto>({
      query: (data) => ({
        url: 'rooms/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RoomBookings'],
    }),
    
    // Get all room bookings with filtering
    getAllRoomBookings: builder.query<RoomBookingPaginatedResponse<RoomBooking>, RoomBookingSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.roomId) params.append('roomId', searchDto.roomId);
        if (searchDto?.userId) params.append('userId', searchDto.userId);
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.startDate) params.append('startDate', searchDto.startDate);
        if (searchDto?.endDate) params.append('endDate', searchDto.endDate);
        if (searchDto?.status) params.append('status', searchDto.status);
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `rooms/bookings${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'RoomBookings' as const, id })),
              { type: 'RoomBookings', id: 'LIST' },
            ]
          : [{ type: 'RoomBookings', id: 'LIST' }],
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
    
    // Get booking by ID
    getBookingById: builder.query<RoomBooking, string>({
      query: (id) => `rooms/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'RoomBookings', id }],
    }),
    
    // Get booking by booking number
    getBookingByNumber: builder.query<RoomBooking, string>({
      query: (bookingNumber) => `rooms/bookings/number/${bookingNumber}`,
      providesTags: (_result, _error, bookingNumber) => [{ type: 'RoomBookings', id: bookingNumber }],
    }),
    
    // Update booking by ID
    updateBooking: builder.mutation<RoomBooking, { id: string; data: UpdateRoomBookingDto }>({
      query: ({ id, data }) => ({
        url: `rooms/bookings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RoomBookings', id },
        { type: 'RoomBookings', id: 'LIST' },
      ],
    }),
    
    // Update booking status
    updateBookingStatus: builder.mutation<RoomBooking, { id: string; data: RoomBookingStatusDto }>({
      query: ({ id, data }) => ({
        url: `rooms/bookings/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RoomBookings', id },
        { type: 'RoomBookings', id: 'LIST' },
      ],
    }),
    
    // Cancel booking
    cancelBooking: builder.mutation<RoomBooking, { id: string; performedBy?: string }>({
      query: ({ id, performedBy }) => ({
        url: `rooms/bookings/${id}/cancel`,
        method: 'POST',
        body: { performedBy },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RoomBookings', id },
        { type: 'RoomBookings', id: 'LIST' },
      ],
    }),
    
    // =========================================================================
    // AVAILABILITY ENDPOINTS
    // =========================================================================
    
    // Check room availability
    checkRoomAvailability: builder.query<RoomAvailabilityResponse, RoomAvailabilityCheckDto>({
      query: (availabilityDto) => ({
        url: 'rooms/check-availability',
        method: 'POST',
        body: availabilityDto,
      }),
    }),
    
    // =========================================================================
    // ANALYTICS ENDPOINTS
    // =========================================================================
    
    // Get room occupancy statistics
    getRoomOccupancy: builder.query<RoomOccupancyStats, { id: string; startDate: string; endDate: string }>({
      query: ({ id, startDate, endDate }) => {
        const params = new URLSearchParams();
        params.append('startDate', startDate);
        params.append('endDate', endDate);
        
        return {
          url: `rooms/${id}/occupancy?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { id }) => [
        { type: 'RoomOccupancy', id },
      ],
    }),
    
    // Get upcoming check-ins for restaurant
    getUpcomingCheckIns: builder.query<RoomBooking[], { restaurantId: string; days?: number }>({
      query: ({ restaurantId, days = 7 }) => {
        const params = new URLSearchParams();
        params.append('days', days.toString());
        
        return {
          url: `rooms/restaurant/${restaurantId}/upcoming-checkins?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'UpcomingCheckIns', id: restaurantId },
      ],
    }),
    
    // Get upcoming check-outs for restaurant
    getUpcomingCheckOuts: builder.query<RoomBooking[], { restaurantId: string; days?: number }>({
      query: ({ restaurantId, days = 7 }) => {
        const params = new URLSearchParams();
        params.append('days', days.toString());
        
        return {
          url: `rooms/restaurant/${restaurantId}/upcoming-checkouts?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'UpcomingCheckOuts', id: restaurantId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Room hooks
  useCreateRoomMutation,
  useGetAllRoomsQuery,
  useSearchAvailableRoomsQuery,
  useGetRoomByIdQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  
  // Room booking hooks
  useCreateRoomBookingMutation,
  useGetAllRoomBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingByNumberQuery,
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  
  // Availability hooks
  useCheckRoomAvailabilityQuery, // Updated
  
  // Analytics hooks
  useGetRoomOccupancyQuery,
  useGetUpcomingCheckInsQuery,
  useGetUpcomingCheckOutsQuery,
} = roomsApi;