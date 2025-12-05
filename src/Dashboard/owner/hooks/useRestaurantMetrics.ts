import { useState, useEffect } from 'react';

interface RestaurantMetrics {
  revenue: {
    today: number;
    yesterday: number;
    growth: number;
    weekToDate: number;
  };
  orders: {
    active: number;
    completed: number;
    total: number;
    trend: number;
  };
  reservations: {
    today: number;
    confirmed: number;
    occupancy: number;
    total: number;
  };
  staff: {
    onDuty: number;
    total: number;
    efficiency: number;
  };
  inventory: {
    lowStock: number;
    outOfStock: number;
    totalItems: number;
  };
}

export const useRestaurantMetrics = () => {
  const [metrics, setMetrics] = useState<RestaurantMetrics>({
    revenue: {
      today: 45280,
      yesterday: 38750,
      growth: 16.8,
      weekToDate: 215430
    },
    orders: {
      active: 8,
      completed: 23,
      total: 31,
      trend: 12
    },
    reservations: {
      today: 15,
      confirmed: 12,
      occupancy: 75,
      total: 45
    },
    staff: {
      onDuty: 6,
      total: 12,
      efficiency: 92
    },
    inventory: {
      lowStock: 3,
      outOfStock: 1,
      totalItems: 156
    }
  });

  const [loading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          today: prev.revenue.today + Math.random() * 100
        },
        orders: {
          ...prev.orders,
          active: Math.max(0, prev.orders.active + Math.floor(Math.random() * 3) - 1)
        }
      }));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, loading };
};