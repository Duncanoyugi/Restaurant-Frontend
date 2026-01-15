import { baseApi } from '../../utils/baseApi';
import type { Order, OrderSearchDto, OrderStatusDto, AssignDriverDto } from '../../types/order';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders (Admin, Restaurant Owner & Staff only)
    getAllOrders: builder.query<Order[], OrderSearchDto>({
      query: (params) => ({
        url: '/orders',
        method: 'GET',
        params,
      }),
      providesTags: ['Orders'],
    }),

    // Get order by ID
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
    }),

    // Get order by order number
    getOrderByNumber: builder.query<Order, string>({
      query: (orderNumber) => `/orders/number/${orderNumber}`,
      providesTags: (_result, _error, orderNumber) => [{ type: 'Orders', id: orderNumber }],
    }),

    // Update order
    updateOrder: builder.mutation<Order, { id: number; data: Partial<Order> }>({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),

    // Delete order
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<Order, { id: number; status: OrderStatusDto }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: ['Orders'],
    }),

    // Get order status history
    getOrderStatusHistory: builder.query<any[], number>({
      query: (id) => `/orders/${id}/status-history`,
    }),

    // Assign driver to order
    assignDriver: builder.mutation<Order, { id: number; driverData: AssignDriverDto }>({
      query: ({ id, driverData }) => ({
        url: `/orders/${id}/assign-driver`,
        method: 'PATCH',
        body: driverData,
      }),
      invalidatesTags: ['Orders'],
    }),

    // Get kitchen orders
    getKitchenOrders: builder.query<Order[], any>({
      query: (params) => ({
        url: '/orders/kitchen/orders',
        method: 'GET',
        params,
      }),
      providesTags: ['Orders'],
    }),

    // Get delivery orders
    getDeliveryOrders: builder.query<Order[], any>({
      query: (params) => ({
        url: '/orders/delivery/orders',
        method: 'GET',
        params,
      }),
      providesTags: ['Orders'],
    }),

    // Get order statistics
    getOrderStatistics: builder.query<any, any>({
      query: (params) => ({
        url: '/orders/analytics/statistics',
        method: 'GET',
        params,
      }),
    }),

    // Get restaurant orders today
    getRestaurantOrdersToday: builder.query<Order[], number>({
      query: (restaurantId) => `/orders/analytics/restaurant/${restaurantId}/today`,
      providesTags: ['Orders'],
    }),

    // Get current user orders
    getMyOrders: builder.query<Order[], void>({
      query: () => '/orders/user/my-orders',
      providesTags: ['Orders'],
    }),

    // Cancel user order
    cancelMyOrder: builder.mutation<Order, { orderId: number; reason: string }>({
      query: ({ orderId, reason }) => ({
        url: `/orders/user/my-orders/${orderId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Orders'],
    }),

    // Get driver deliveries
    getMyDeliveries: builder.query<Order[], void>({
      query: () => '/orders/driver/my-deliveries',
      providesTags: ['Orders'],
    }),

    // Get restaurant orders (for owners/staff)
    getMyRestaurantOrders: builder.query<Order[], void>({
      query: () => '/orders/restaurant/my-orders',
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
  useGetOrderStatusHistoryQuery,
  useAssignDriverMutation,
  useGetKitchenOrdersQuery,
  useGetDeliveryOrdersQuery,
  useGetOrderStatisticsQuery,
  useGetRestaurantOrdersTodayQuery,
  useGetMyOrdersQuery,
  useCancelMyOrderMutation,
  useGetMyDeliveriesQuery,
  useGetMyRestaurantOrdersQuery,
} = ordersApi;
