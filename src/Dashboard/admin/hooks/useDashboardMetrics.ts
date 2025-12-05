import { useGetDashboardOverviewQuery } from '../../../features/analytics/analyticsApi';
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
  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardOverviewQuery({
    period: AnalyticsPeriod.LAST_30_DAYS,
  });

  // Fetch users data
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({});

  // Fetch restaurants data
  const { data: restaurantsData, isLoading: restaurantsLoading } = useGetAllRestaurantsQuery({});

  // Fetch orders data
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery({});

  const loading = analyticsLoading || usersLoading || restaurantsLoading || ordersLoading;

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

    // Calculate revenue growth (simplified - would need historical data for accurate calculation)
    const currentRevenue = revenue.totalRevenue || 0;
    const previousRevenue = currentRevenue * 0.9; // Placeholder - would need actual previous period data
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

    // Generate chart data (simplified - would need actual daily breakdown)
    const chartData = [
      { date: 'Mon', revenue: revenue.totalRevenue * 0.15 },
      { date: 'Tue', revenue: revenue.totalRevenue * 0.18 },
      { date: 'Wed', revenue: revenue.totalRevenue * 0.15 },
      { date: 'Thu', revenue: revenue.totalRevenue * 0.20 },
      { date: 'Fri', revenue: revenue.totalRevenue * 0.17 },
      { date: 'Sat', revenue: revenue.totalRevenue * 0.22 },
      { date: 'Sun', revenue: revenue.totalRevenue * 0.09 },
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
        uptime: 99.8, // Would need system monitoring data
        responseTime: 124, // Would need system monitoring data
        errorRate: 0.2, // Would need system monitoring data
      },
    };
  };

  const metrics = calculateMetrics();

  return { metrics, loading };
};