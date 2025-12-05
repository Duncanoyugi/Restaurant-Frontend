// src/features/delivery/deliveryApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  VehicleInfo,
  CreateVehicleInfoRequest,
  UpdateVehicleInfoRequest,
  DeliveryTracking,
  CreateDeliveryTrackingRequest,
  DriverLocationRequest,
  DeliveryAssignmentRequest,
  DeliveryAssignmentResponse,
  AvailableDriver,
  AvailableDriversRequest,
  DeliveryEstimateRequest,
  DeliveryEstimateResponse,
  DriverDeliveryStats,
  DeliveryPerformance,
  LiveDeliveryTracking,
  ActiveDelivery,
} from '../../types/delivery';

export const deliveryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Vehicle Info endpoints
    createVehicleInfo: builder.mutation<VehicleInfo, CreateVehicleInfoRequest>({
      query: (data) => ({
        url: 'delivery/vehicles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['VehicleInfo'],
    }),

    getVehicleInfoByUserId: builder.query<VehicleInfo, string>({
      query: (userId) => ({
        url: `delivery/vehicles/user/${userId}`,
        method: 'GET',
      }),
      providesTags: (_, __, userId) => [{ type: 'VehicleInfo', id: userId }],
    }),

    updateVehicleInfo: builder.mutation<VehicleInfo, { userId: string; data: UpdateVehicleInfoRequest }>({
      query: ({ userId, data }) => ({
        url: `delivery/vehicles/user/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: 'VehicleInfo', id: userId },
        'VehicleInfo',
      ],
    }),

    deleteVehicleInfo: builder.mutation<void, string>({
      query: (userId) => ({
        url: `delivery/vehicles/user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['VehicleInfo'],
    }),

    // Delivery Tracking endpoints
    createDeliveryTracking: builder.mutation<DeliveryTracking, CreateDeliveryTrackingRequest>({
      query: (data) => ({
        url: 'delivery/tracking',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DeliveryTracking', 'OrderTracking'],
    }),

    updateDriverLocation: builder.mutation<DeliveryTracking, DriverLocationRequest>({
      query: (data) => ({
        url: 'delivery/tracking/location',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DeliveryTracking', 'OrderTracking'],
    }),

    getDeliveryTrackingByOrderId: builder.query<DeliveryTracking[], string>({
      query: (orderId) => ({
        url: `delivery/tracking/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: ['OrderTracking'],
    }),

    getLiveDeliveryTracking: builder.query<LiveDeliveryTracking, string>({
      query: (orderId) => ({
        url: `delivery/tracking/order/${orderId}/live`,
        method: 'GET',
      }),
    }),

    // Delivery Management endpoints
    assignDelivery: builder.mutation<DeliveryAssignmentResponse, DeliveryAssignmentRequest>({
      query: (data) => ({
        url: 'delivery/assign',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DeliveryTracking', 'OrderTracking', 'ActiveDeliveries'],
    }),

    findAvailableDrivers: builder.query<AvailableDriver[], AvailableDriversRequest>({
      query: (params) => ({
        url: 'delivery/drivers/available',
        method: 'GET',
        params,
      }),
      providesTags: ['AvailableDrivers'],
    }),

    calculateDeliveryEstimate: builder.mutation<DeliveryEstimateResponse, DeliveryEstimateRequest>({
      query: (data) => ({
        url: 'delivery/estimate',
        method: 'POST',
        body: data,
      }),
    }),

    // Analytics endpoints
    getDriverDeliveryStats: builder.query<
      DriverDeliveryStats, 
      { driverId: string; startDate: string; endDate: string }
    >({
      query: ({ driverId, startDate, endDate }) => ({
        url: `delivery/analytics/driver/${driverId}`,
        method: 'GET',
        params: { startDate, endDate },
      }),
      providesTags: ['DriverStats'],
    }),

    getDeliveryPerformance: builder.query<
      DeliveryPerformance, 
      { restaurantId: string; days?: number }
    >({
      query: ({ restaurantId, days = 7 }) => ({
        url: `delivery/analytics/restaurant/${restaurantId}`,
        method: 'GET',
        params: { days },
      }),
      providesTags: ['DeliveryPerformance'],
    }),

    // Driver-specific endpoints
    getMyDeliveryStats: builder.query<DriverDeliveryStats, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: 'delivery/my/stats',
        method: 'GET',
        params: { startDate, endDate },
      }),
      providesTags: ['MyDriverStats'],
    }),

    getMyActiveDeliveries: builder.query<ActiveDelivery[], void>({
      query: () => ({
        url: 'delivery/my/active-deliveries',
        method: 'GET',
      }),
      providesTags: ['MyActiveDeliveries'],
    }),

    // Helper method to get active delivery tracking for real-time updates
    getActiveDeliveryTracking: builder.query<DeliveryTracking | null, string>({
      query: (orderId) => ({
        url: `delivery/tracking/order/${orderId}/active`,
        method: 'GET',
      }),
      providesTags: ['ActiveTracking'],
    }),

    // Get all deliveries for a driver (including history)
    getDriverDeliveries: builder.query<DeliveryTracking[], string>({
      query: (driverId) => ({
        url: `delivery/driver/${driverId}/deliveries`,
        method: 'GET',
      }),
      providesTags: ['DriverDeliveries'],
    }),
  }),
});

export const {
  // Vehicle Info hooks
  useCreateVehicleInfoMutation,
  useGetVehicleInfoByUserIdQuery,
  useUpdateVehicleInfoMutation,
  useDeleteVehicleInfoMutation,

  // Delivery Tracking hooks
  useCreateDeliveryTrackingMutation,
  useUpdateDriverLocationMutation,
  useGetDeliveryTrackingByOrderIdQuery,
  useGetLiveDeliveryTrackingQuery,

  // Delivery Management hooks
  useAssignDeliveryMutation,
  useFindAvailableDriversQuery,
  useCalculateDeliveryEstimateMutation,

  // Analytics hooks
  useGetDriverDeliveryStatsQuery,
  useGetDeliveryPerformanceQuery,

  // Driver-specific hooks
  useGetMyDeliveryStatsQuery,
  useGetMyActiveDeliveriesQuery,

  // Helper hooks
  useGetActiveDeliveryTrackingQuery,
  useGetDriverDeliveriesQuery,
} = deliveryApi;