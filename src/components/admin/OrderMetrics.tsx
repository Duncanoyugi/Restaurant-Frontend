import React from 'react';
import { useDashboardMetrics } from '../../Dashboard/admin/hooks/useDashboardMetrics';

const OrderMetrics: React.FC = () => {
  const { metrics } = useDashboardMetrics();

  const totalOrders = metrics.orders.total || 1; // Prevent division by zero
  const orderData = [
    { status: 'Completed', count: metrics.orders.completed || 0, color: 'bg-green-500', percentage: totalOrders > 0 ? (metrics.orders.completed / totalOrders) * 100 : 0 },
    { status: 'Pending', count: metrics.orders.pending || 0, color: 'bg-yellow-500', percentage: totalOrders > 0 ? (metrics.orders.pending / totalOrders) * 100 : 0 },
    { status: 'Failed', count: metrics.orders.failed || 0, color: 'bg-red-500', percentage: totalOrders > 0 ? (metrics.orders.failed / totalOrders) * 100 : 0 },
  ];

  // Precompute SVG segments to avoid returning non-React types from reduce
  const donutCircumference = 2 * Math.PI * 40; // ~251.2
  let cumulativeOffset = 0;
  const segments = orderData.map((item) => {
    const percentage = isNaN(item.percentage) || !isFinite(item.percentage) ? 0 : Math.max(0, Math.min(100, item.percentage));
    const segmentLength = (percentage / 100) * donutCircumference;
    const offset = isNaN(cumulativeOffset) || !isFinite(cumulativeOffset) ? 0 : cumulativeOffset;
    cumulativeOffset += segmentLength;
    const strokeDashoffset = isNaN(donutCircumference - offset) || !isFinite(donutCircumference - offset) 
      ? donutCircumference 
      : Math.max(0, Math.min(donutCircumference, donutCircumference - offset));
    const strokeColor =
      item.color === 'bg-green-500' ? '#10b981' :
      item.color === 'bg-yellow-500' ? '#f59e42' :
      item.color === 'bg-red-500' ? '#ef4444' : '#000';
    return (
      <circle
        key={item.status}
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={strokeColor}
        strokeWidth="20"
        strokeDasharray={`${segmentLength} ${donutCircumference - segmentLength}`}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 50 50)"
      />
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
          {/* Segments */}
          {segments}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.orders.total}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {orderData.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.count}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Success Rate: {totalOrders > 0 ? ((metrics.orders.completed / totalOrders) * 100).toFixed(1) : 0}%
          </span>
          <span className={`font-medium ${
            metrics.orders.trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.orders.trend >= 0 ? '+' : ''}{metrics.orders.trend}% trend
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderMetrics;