import React from 'react';
import { useDashboardMetrics } from '../../Dashboard/admin/hooks/useDashboardMetrics';

const RevenueChart: React.FC = () => {
  const { metrics } = useDashboardMetrics();

  const maxRevenue = metrics.revenue.chartData.length > 0 
    ? Math.max(...metrics.revenue.chartData.map(d => d.revenue || 0), 1)
    : 1; // Prevent division by zero
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Revenue Trend (Last 7 Days)
      </h3>
      
      <div className="space-y-3">
        {metrics.revenue.chartData.map((day) => (
          <div key={day.date} className="flex items-center">
            <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
              {day.date}
            </div>
            <div className="flex-1 ml-4">
              <div className="flex items-center">
                <div 
                  className="h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-l transition-all duration-300"
                  style={{ 
                    width: `${Math.max(0, Math.min(100, ((day.revenue || 0) / maxRevenue) * 100))}%`,
                    maxWidth: 'calc(100% - 80px)'
                  }}
                ></div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white min-w-[80px] text-right">
                  ${day.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total: ${metrics.revenue.current.toLocaleString()}
          </span>
          <span className={`font-medium ${
            metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.revenue.growth >= 0 ? '+' : ''}{metrics.revenue.growth}% vs last week
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;