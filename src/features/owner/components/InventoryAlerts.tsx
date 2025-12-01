import React from 'react';
import { useInventoryAlerts } from '../hooks/useInventoryAlerts';

const InventoryAlerts: React.FC = () => {
  const { alerts, loading, reorderItem } = useInventoryAlerts();

  const getAlertColor = (level: string) => {
    const colors: { [key: string]: string } = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
      warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getAlertIcon = (level: string) => {
    const icons: { [key: string]: string } = {
      critical: '🔴',
      warning: '🟠',
      info: '🔵'
    };
    return icons[level] || '⚪';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Inventory Alerts
        </h3>
        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
          {alerts.filter(alert => alert.level === 'critical').length} Critical
        </span>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <div className="text-2xl mb-2">✅</div>
            <p>All inventory levels are good</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getAlertColor(alert.level)} transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getAlertIcon(alert.level)}</span>
                  <span className="font-medium text-sm">{alert.itemName}</span>
                </div>
                <span className="text-xs font-semibold">
                  {alert.currentStock} {alert.unit}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  Threshold: {alert.threshold} {alert.unit}
                </div>
                <div className="flex space-x-2">
                  {alert.supplier && (
                    <button
                      onClick={() => reorderItem(alert.id)}
                      className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    >
                      Reorder
                    </button>
                  )}
                  <button className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                    Details
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                <div 
                  className={`h-1 rounded-full ${
                    alert.level === 'critical' ? 'bg-red-500' :
                    alert.level === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (alert.currentStock / alert.threshold) * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
            Manage Inventory
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;