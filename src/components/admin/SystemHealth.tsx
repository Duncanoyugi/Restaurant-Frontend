import React from 'react';
import { useDashboardMetrics } from '../../Dashboard/admin/hooks/useDashboardMetrics';

const SystemHealth: React.FC = () => {
  const { metrics } = useDashboardMetrics();

  const healthIndicators = [
    {
      name: 'API Uptime',
      value: metrics.systemHealth.uptime,
      unit: '%',
      status: metrics.systemHealth.uptime >= 99.9 ? 'excellent' : metrics.systemHealth.uptime >= 99 ? 'good' : 'poor',
      icon: '🟢'
    },
    {
      name: 'Response Time',
      value: metrics.systemHealth.responseTime,
      unit: 'ms',
      status: metrics.systemHealth.responseTime <= 100 ? 'excellent' : metrics.systemHealth.responseTime <= 200 ? 'good' : 'poor',
      icon: '⚡'
    },
    {
      name: 'Error Rate',
      value: metrics.systemHealth.errorRate,
      unit: '%',
      status: metrics.systemHealth.errorRate <= 0.1 ? 'excellent' : metrics.systemHealth.errorRate <= 0.5 ? 'good' : 'poor',
      icon: '❌'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/20';
      case 'good': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'poor': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        System Health
      </h3>

      <div className="space-y-4">
        {healthIndicators.map((indicator, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${getStatusBg(indicator.status)} transition-all duration-200 hover:shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-lg mr-3">{indicator.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {indicator.name}
                </span>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor(indicator.status)}`}>
                {indicator.status.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {indicator.value}{indicator.unit}
              </span>
              
              {/* Progress bar */}
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    indicator.status === 'excellent' ? 'bg-green-500' :
                    indicator.status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (indicator.name === 'Response Time' ? 
                      (1 - (indicator.value - 50) / 300) * 100 : 
                      (indicator.name === 'Error Rate' ? 
                        (1 - indicator.value / 2) * 100 : 
                        indicator.value)
                    ))}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Server Status */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Server Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Web Server</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cache</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;