import { baseApi } from '../../utils/baseApi';

// IMPORTANT: Match backend enum values exactly
// Use const object instead of enum due to TypeScript configuration
export const AnalyticsPeriod = {
  TODAY: 'today',                 // backend: 'today' (lowercase)
  YESTERDAY: 'yesterday',         // backend: 'yesterday' (lowercase)
  LAST_7_DAYS: 'last_7_days',     // backend: 'last_7_days' (lowercase with underscores)
  LAST_30_DAYS: 'last_30_days',   // backend: 'last_30_days' (lowercase with underscores)
  LAST_90_DAYS: 'last_90_days',   // backend: 'last_90_days' (lowercase with underscores)
  THIS_MONTH: 'this_month',       // backend: 'this_month' (lowercase with underscore)
  LAST_MONTH: 'last_month',       // backend: 'last_month' (lowercase with underscore)
  CUSTOM: 'custom'                // backend: 'custom' (lowercase)
} as const;

// Create string union type from the object values
export type AnalyticsPeriod = typeof AnalyticsPeriod[keyof typeof AnalyticsPeriod];

export type AnalyticsQueryParams = {
  period?: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  restaurantId?: string;
  limit?: number;
};

export type DashboardOverviewResponse = {
  period: AnalyticsPeriod;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  revenue: {
    totalRevenue: number;
    onlineRevenue: number;
    dineInRevenue: number;
    deliveryRevenue: number;
    previousRevenue?: number;
  };
  orders: {
    totalOrders: number;
    onlineOrders: number;
    dineInOrders: number;
    deliveryOrders: number;
    averageOrderValue: number;
  };
  reservations: {
    totalReservations: number;
    confirmedReservations: number;
    cancelledReservations: number;
    utilizationRate: number;
  };
  roomBookings: {
    totalBookings: number;
    occupiedRooms: number;
    occupancyRate: number;
  };
  customers: {
    newCustomers: number;
    returningCustomers: number;
    satisfactionScore: number;
  };
  topMenuItems: any[];
};

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverviewResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: 'analytics/dashboard',
        method: 'GET',
        params: {
          period: params.period || AnalyticsPeriod.LAST_30_DAYS,
          startDate: params.startDate,
          endDate: params.endDate,
          restaurantId: params.restaurantId,
          limit: params.limit
        },
      }),
      providesTags: ['DashboardAnalytics'],
    }),

    getRevenueAnalytics: builder.query<any, AnalyticsQueryParams>({
      query: (params) => ({
        url: 'analytics/revenue',
        method: 'GET',
        params: {
          period: params.period || AnalyticsPeriod.LAST_30_DAYS,
          startDate: params.startDate,
          endDate: params.endDate,
          restaurantId: params.restaurantId,
          limit: params.limit
        },
      }),
      providesTags: ['RevenueAnalytics'],
    }),

    getOrderAnalytics: builder.query<any, AnalyticsQueryParams>({
      query: (params) => ({
        url: 'analytics/orders',
        method: 'GET',
        params: {
          period: params.period || AnalyticsPeriod.LAST_30_DAYS,
          startDate: params.startDate,
          endDate: params.endDate,
          restaurantId: params.restaurantId,
          limit: params.limit
        },
      }),
      providesTags: ['OrderAnalytics'],
    }),

    getCustomerAnalytics: builder.query<any, AnalyticsQueryParams>({
      query: (params) => ({
        url: 'analytics/customers',
        method: 'GET',
        params: {
          period: params.period || AnalyticsPeriod.LAST_30_DAYS,
          startDate: params.startDate,
          endDate: params.endDate,
          restaurantId: params.restaurantId,
          limit: params.limit
        },
      }),
      providesTags: ['CustomerAnalytics'],
    }),

    getMenuPerformanceAnalytics: builder.query<any, AnalyticsQueryParams>({
      query: (params) => ({
        url: 'analytics/menu-performance',
        method: 'GET',
        params: {
          period: params.period || AnalyticsPeriod.LAST_30_DAYS,
          startDate: params.startDate,
          endDate: params.endDate,
          restaurantId: params.restaurantId,
          limit: params.limit
        },
      }),
      providesTags: ['MenuPerformanceAnalytics'],
    }),

    getMyBehaviorAnalytics: builder.query<any, AnalyticsQueryParams>({
      query: (params) => ({
        url: 'analytics/my-behavior',
        method: 'GET',
        params: {
          period: params.period || AnalyticsPeriod.LAST_30_DAYS,
          startDate: params.startDate,
          endDate: params.endDate,
          restaurantId: params.restaurantId,
          limit: params.limit
        },
      }),
      providesTags: ['MyBehaviorAnalytics'],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetRevenueAnalyticsQuery,
  useGetOrderAnalyticsQuery,
  useGetCustomerAnalyticsQuery,
  useGetMenuPerformanceAnalyticsQuery,
  useGetMyBehaviorAnalyticsQuery,
} = analyticsApi;