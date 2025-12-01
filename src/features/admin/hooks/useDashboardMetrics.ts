import { useState, useEffect } from 'react';

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
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    revenue: {
      current: 124580,
      previous: 111234,
      growth: 12,
      chartData: [
        { date: 'Mon', revenue: 18000 },
        { date: 'Tue', revenue: 22000 },
        { date: 'Wed', revenue: 19000 },
        { date: 'Thu', revenue: 25000 },
        { date: 'Fri', revenue: 21000 },
        { date: 'Sat', revenue: 28000 },
        { date: 'Sun', revenue: 11580 },
      ]
    },
    orders: {
      total: 1248,
      completed: 1123,
      pending: 89,
      failed: 36,
      trend: 8
    },
    users: {
      active: 8542,
      newToday: 234,
      total: 45678,
      growth: 15
    },
    restaurants: {
      total: 342,
      active: 335,
      pendingApproval: 7,
      suspended: 12
    },
    systemHealth: {
      uptime: 99.8,
      responseTime: 124,
      errorRate: 0.2
    }
  });

  const [loading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch from an API
      setMetrics(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          current: prev.revenue.current + Math.random() * 1000
        },
        users: {
          ...prev.users,
          active: prev.users.active + Math.floor(Math.random() * 10) - 5
        }
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, loading };
};