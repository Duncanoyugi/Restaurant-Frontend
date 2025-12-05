import React, { useState, useEffect } from 'react';

type Period = 'today' | 'week' | 'month' | 'quarter';

interface RevenueItem {
  label: string;
  value: number;
}

/**
 * Simple local implementation of useRevenueData to avoid missing-module error.
 * Replace with a real data-fetching hook when available.
 */
function useRevenueData() {
  const [period, setPeriod] = useState<Period>('today');
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([
    { label: '8AM', value: 1200 },
    { label: '10AM', value: 2300 },
    { label: '12PM', value: 3400 },
    { label: '2PM', value: 2800 },
    { label: '4PM', value: 4500 }
  ]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      let data: RevenueItem[] = [];
      if (period === 'today') {
        data = [
          { label: '8AM', value: 1200 },
          { label: '10AM', value: 2300 },
          { label: '12PM', value: 3400 },
          { label: '2PM', value: 2800 },
          { label: '4PM', value: 4500 }
        ];
      } else if (period === 'week') {
        data = [
          { label: 'Mon', value: 8200 },
          { label: 'Tue', value: 9300 },
          { label: 'Wed', value: 10200 },
          { label: 'Thu', value: 7600 },
          { label: 'Fri', value: 12500 },
          { label: 'Sat', value: 14800 },
          { label: 'Sun', value: 9800 }
        ];
      } else if (period === 'month') {
        data = [
          { label: 'Week 1', value: 32000 },
          { label: 'Week 2', value: 41000 },
          { label: 'Week 3', value: 38500 },
          { label: 'Week 4', value: 47000 }
        ];
      } else {
        // quarter
        data = [
          { label: 'Jan', value: 95000 },
          { label: 'Feb', value: 88000 },
          { label: 'Mar', value: 112000 }
        ];
      }

      setRevenueData(data);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [period]);

  return { revenueData, loading, period, setPeriod };
}

const RevenueChart: React.FC = () => {
  const { revenueData, loading, period, setPeriod } = useRevenueData();
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' }
  ];

  const metrics = [
    { key: 'revenue', label: 'Revenue', color: 'text-green-600' },
    { key: 'orders', label: 'Orders', color: 'text-blue-600' },
    { key: 'customers', label: 'Customers', color: 'text-purple-600' }
  ];

  const maxValue = Math.max(...revenueData.map(item => item.value));

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Analytics
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Metric Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {metrics.map(metric => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>

          {/* Period Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  period === p.key
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-between h-48 space-x-2">
          {revenueData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {item.label}
              </div>
              <div
                className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all duration-300 hover:from-green-600 hover:to-green-700"
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  maxHeight: '180px'
                }}
              ></div>
              <div className="text-xs font-medium text-gray-900 dark:text-white mt-2">
                {selectedMetric === 'revenue' ? `KSh ${item.value.toLocaleString()}` : item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            KSh {revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total {selectedMetric}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            +12.5%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Growth</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(revenueData.reduce((sum, item) => sum + item.value, 0) / revenueData.length).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {maxValue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Peak</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;