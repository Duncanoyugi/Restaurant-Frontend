// src/features/orders/ordersApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  OrderStatusDto,
  AssignDriverDto,
  OrderSearchDto,
  KitchenOrderSearchDto,
  DeliveryOrderSearchDto,
  OrderStatsDto,
  OrderPaginatedResponse, // Changed from PaginatedResponse
  OrderStatistics,
  RestaurantOrdersToday,
} from '../../types/order';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // ORDER ENDPOINTS
    // =========================================================================
    
    // Create a new order
    createOrder: builder.mutation<Order, CreateOrderDto>({
      query: (data) => ({
        url: 'orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders', 'MyOrders'],
    }),
    
    // Get all orders with filtering (Admin, Restaurant Owner & Staff only)
    getAllOrders: builder.query<OrderPaginatedResponse<Order>, OrderSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.userId) params.append('userId', searchDto.userId);
        if (searchDto?.driverId) params.append('driverId', searchDto.driverId);
        if (searchDto?.statusId) params.append('statusId', searchDto.statusId);
        if (searchDto?.orderType) params.append('orderType', searchDto.orderType);
        if (searchDto?.startDate) params.append('startDate', searchDto.startDate);
        if (searchDto?.endDate) params.append('endDate', searchDto.endDate);
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `orders${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Orders' as const, id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
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
    
    // Get order by ID
    getOrderById: builder.query<Order, string>({
      query: (id) => `orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
    }),
    
    // Get order by order number
    getOrderByNumber: builder.query<Order, string>({
      query: (orderNumber) => `orders/number/${orderNumber}`,
      providesTags: (_result, _error, orderNumber) => [{ type: 'Orders', id: orderNumber }],
    }),
    
    // Update order by ID
    updateOrder: builder.mutation<Order, { id: string; data: UpdateOrderDto }>({
      query: ({ id, data }) => ({
        url: `orders/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Orders', id },
        { type: 'Orders', id: 'LIST' },
        'MyOrders',
      ],
    }),
    
    // Delete order by ID
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Orders', id },
        { type: 'Orders', id: 'LIST' },
        'MyOrders',
      ],
    }),
    
    // =========================================================================
    // ORDER STATUS ENDPOINTS
    // =========================================================================
    
    // Update order status (Admin, Restaurant Owner, Staff & Driver only)
    updateOrderStatus: builder.mutation<Order, { id: string; data: OrderStatusDto }>({
      query: ({ id, data }) => ({
        url: `orders/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Orders', id },
        { type: 'Orders', id: 'LIST' },
        'MyOrders',
        'KitchenOrders',
        'DeliveryOrders',
      ],
    }),
    
    // Get order status history
    getOrderStatusHistory: builder.query<Order[], string>({
      query: (id) => `orders/${id}/status-history`,
      providesTags: (_result, _error, id) => [
        { type: 'Orders', id },
        { type: 'OrderStatusHistory', id },
      ],
    }),
    
    // =========================================================================
    // DRIVER ENDPOINTS
    // =========================================================================
    
    // Assign driver to order (Admin, Restaurant Owner & Staff only)
    assignDriver: builder.mutation<Order, { id: string; data: AssignDriverDto }>({
      query: ({ id, data }) => ({
        url: `orders/${id}/assign-driver`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Orders', id },
        { type: 'Orders', id: 'LIST' },
        'DeliveryOrders',
        'MyDeliveries',
      ],
    }),
    
    // =========================================================================
    // SPECIALIZED QUERIES
    // =========================================================================
    
    // Get kitchen orders with filtering (Admin, Restaurant Owner & Staff only)
    getKitchenOrders: builder.query<Order[], KitchenOrderSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.statusId) params.append('statusId', searchDto.statusId);
        if (searchDto?.date) params.append('date', searchDto.date);
        
        const queryString = params.toString();
        return {
          url: `orders/kitchen/orders${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ['KitchenOrders'],
    }),
    
    // Get delivery orders with filtering (Admin, Restaurant Owner, Staff & Driver only)
    getDeliveryOrders: builder.query<Order[], DeliveryOrderSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.driverId) params.append('driverId', searchDto.driverId);
        if (searchDto?.statusId) params.append('statusId', searchDto.statusId);
        
        const queryString = params.toString();
        return {
          url: `orders/delivery/orders${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ['DeliveryOrders'],
    }),
    
    // =========================================================================
    // ANALYTICS ENDPOINTS
    // =========================================================================
    
    // Get order statistics with filtering (Admin & Restaurant Owner only)
    getOrderStatistics: builder.query<OrderStatistics, OrderStatsDto>({
      query: (statsDto) => {
        const params = new URLSearchParams();
        
        if (statsDto.restaurantId) params.append('restaurantId', statsDto.restaurantId);
        params.append('startDate', statsDto.startDate);
        params.append('endDate', statsDto.endDate);
        
        return {
          url: `orders/analytics/statistics?${params.toString()}`,
        };
      },
      providesTags: ['OrderStatistics'],
    }),
    
    // Get today orders for restaurant (Admin, Restaurant Owner & Staff only)
    getRestaurantOrdersToday: builder.query<RestaurantOrdersToday, string>({
      query: (restaurantId) => `orders/analytics/restaurant/${restaurantId}/today`,
      providesTags: (_result, _error, restaurantId) => [
        { type: 'RestaurantOrdersToday', id: restaurantId },
      ],
    }),
    
    // =========================================================================
    // USER-SPECIFIC ENDPOINTS
    // =========================================================================
    
    // Get current user orders
    getMyOrders: builder.query<Order[], void>({
      query: () => 'orders/user/my-orders',
      providesTags: ['MyOrders'],
    }),
    
    // Get current driver delivery orders (Driver only)
    getMyDeliveries: builder.query<Order[], void>({
      query: () => 'orders/driver/my-deliveries',
      providesTags: ['MyDeliveries'],
    }),
    
    // Get current restaurant orders (Restaurant Owner & Staff only)
    getMyRestaurantOrders: builder.query<Order[], void>({
      query: () => 'orders/restaurant/my-orders',
      providesTags: ['MyRestaurantOrders'],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Order hooks
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  
  // Order status hooks
  useUpdateOrderStatusMutation,
  useGetOrderStatusHistoryQuery,
  
  // Driver hooks
  useAssignDriverMutation,
  
  // Specialized query hooks
  useGetKitchenOrdersQuery,
  useGetDeliveryOrdersQuery,
  
  // Analytics hooks
  useGetOrderStatisticsQuery,
  useGetRestaurantOrdersTodayQuery,
  
  // User-specific hooks
  useGetMyOrdersQuery,
  useGetMyDeliveriesQuery,
  useGetMyRestaurantOrdersQuery,
} = ordersApi;