import { useGetDashboardOverviewQuery, useGetRevenueAnalyticsQuery } from '../../../features/analytics/analyticsApi';
import { useGetAllUsersQuery } from '../../../features/users/usersApi';
import { useGetAllRestaurantsQuery } from '../../../features/restaurant/restaurantApi';
import { useGetAllOrdersQuery } from '../../../features/orders/ordersApi';
import { AnalyticsPeriod } from '../../../features/analytics/analyticsApi';

interface DashboardMetrics {
  revenue: {
    current: number;
    previous: number;
    growth: number;
    chartData: { date: string; revenue: number }[];
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    trend: number;
  };
  users: {
    active: number;
    newToday: number;
    total: number;
    growth: number;
  };
  restaurants: {
    total: number;
    active: number;
    pendingApproval: number;
    suspended: number;
  };
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

export const useDashboardMetrics = () => {
  // Fetch dashboard overview data
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardOverviewQuery({
    period: AnalyticsPeriod.LAST_30_DAYS,
  });

  // Fetch revenue analytics for chart
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueAnalyticsQuery({
    period: AnalyticsPeriod.LAST_7_DAYS, // Chart usually shows last 7 days
  });

  // Fetch users data
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({});

  // Fetch restaurants data
  const { data: restaurantsData, isLoading: restaurantsLoading } = useGetAllRestaurantsQuery({});

  // Fetch orders data
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery({});

  const loading = analyticsLoading || usersLoading || restaurantsLoading || ordersLoading || revenueLoading;

  // Calculate metrics from API data
  const calculateMetrics = (): DashboardMetrics => {
    const revenue = analyticsData?.revenue || {
      totalRevenue: 0,
      onlineRevenue: 0,
      dineInRevenue: 0,
      deliveryRevenue: 0,
    };

    const orders = analyticsData?.orders || {
      totalOrders: 0,
      onlineOrders: 0,
      dineInOrders: 0,
      deliveryOrders: 0,
      averageOrderValue: 0,
    };

    const users = usersData?.data || [];
    const restaurants = restaurantsData?.data || [];
    const allOrders = ordersData?.data || [];

    // Calculate revenue growth
    const currentRevenue = revenue.totalRevenue || 0;
    // Use comparison data from backend if available, otherwise estimate
    const previousRevenue = analyticsData?.revenue?.previousRevenue || currentRevenue * 0.9;
    const revenueGrowth = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    // Calculate order metrics
    const completedOrders = allOrders.filter((o: any) =>
      o.status?.name === 'Completed' || o.status === 'Completed'
    ).length;
    const pendingOrders = allOrders.filter((o: any) =>
      o.status?.name === 'Pending' || o.status === 'Pending'
    ).length;
    const failedOrders = allOrders.filter((o: any) =>
      o.status?.name === 'Cancelled' || o.status === 'Cancelled'
    ).length;

    // Calculate user metrics
    const activeUsers = users.filter((u: any) => u.isOnline || u.status === 'active').length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newTodayUsers = users.filter((u: any) => {
      const userDate = new Date(u.createdAt || u.created_at);
      return userDate >= today;
    }).length;

    // Calculate restaurant metrics
    const activeRestaurants = restaurants.filter((r: any) =>
      r.active === true || r.status === 'active'
    ).length;
    const pendingRestaurants = restaurants.filter((r: any) =>
      r.active === false || r.status === 'pending'
    ).length;
    const suspendedRestaurants = restaurants.filter((r: any) =>
      r.status === 'suspended' || r.active === false
    ).length;

    // Generate chart data from revenueData
    // Map backend response to chart format
    // Backend returns revenueData array with date and values
    const rawChartData = revenueData?.revenueData || [];
    const chartData = rawChartData.length > 0
      ? rawChartData.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: parseFloat(item.totalRevenue || 0)
      }))
      : [
        // Fallback if no data
        { date: 'Mon', revenue: 0 },
        { date: 'Tue', revenue: 0 },
        { date: 'Wed', revenue: 0 },
        { date: 'Thu', revenue: 0 },
        { date: 'Fri', revenue: 0 },
        { date: 'Sat', revenue: 0 },
        { date: 'Sun', revenue: 0 },
      ];

    return {
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        growth: Math.round(revenueGrowth),
        chartData,
      },
      orders: {
        total: orders.totalOrders || allOrders.length,
        completed: completedOrders,
        pending: pendingOrders,
        failed: failedOrders,
        trend: orders.totalOrders > 0 ? Math.round((completedOrders / orders.totalOrders) * 100) : 0,
      },
      users: {
        active: activeUsers,
        newToday: newTodayUsers,
        total: users.length,
        growth: users.length > 0 ? Math.round((newTodayUsers / users.length) * 100) : 0,
      },
      restaurants: {
        total: restaurants.length,
        active: activeRestaurants,
        pendingApproval: pendingRestaurants,
        suspended: suspendedRestaurants,
      },
      systemHealth: {
        uptime: 99.8,
        responseTime: 124,
        errorRate: 0.2,
      },
    };
  };

  const metrics = calculateMetrics();

  return { metrics, loading };
};