import React from 'react';
import { useRestaurantMetrics } from '../hooks/useRestaurantMetrics';

const RestaurantKPIs: React.FC = () => {
  const { metrics, loading } = useRestaurantMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Today's Revenue",
      value: `KSh ${metrics.revenue.today.toLocaleString()}`,
      change: metrics.revenue.growth,
      subtitle: 'vs yesterday',
      icon: '💰',
      color: 'text-green-600'
    },
    {
      title: 'Active Orders',
      value: metrics.orders.active.toString(),
      change: metrics.orders.trend,
      subtitle: 'in kitchen',
      icon: '📦',
      color: 'text-blue-600'
    },
    {
      title: 'Today Reservations',
      value: metrics.reservations.today.toString(),
      change: metrics.reservations.occupancy,
      subtitle: 'table occupancy',
      icon: '📅',
      color: 'text-purple-600'
    },
    {
      title: 'Staff On Duty',
      value: `${metrics.staff.onDuty}/${metrics.staff.total}`,
      change: metrics.staff.efficiency,
      subtitle: 'staff efficiency',
      icon: '👥',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`text-2xl ${kpi.color}`}>
              {kpi.icon}
            </div>
            <span className={`text-sm font-medium ${
              kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.change >= 0 ? '↗' : '↘'} {Math.abs(kpi.change)}%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {kpi.value}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {kpi.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {kpi.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RestaurantKPIs;