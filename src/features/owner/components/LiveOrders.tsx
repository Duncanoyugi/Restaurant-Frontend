import React, { useState } from 'react';
import { useLiveOrders } from '../hooks/useLiveOrders';

const LiveOrders: React.FC = () => {
  const { orders, loading, updateOrderStatus } = useLiveOrders();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusFilters = [
    { key: 'all', label: 'All Orders', color: 'gray' },
    { key: 'pending', label: 'Pending', color: 'yellow' },
    { key: 'preparing', label: 'Preparing', color: 'blue' },
    { key: 'ready', label: 'Ready', color: 'green' },
    { key: 'completed', label: 'Completed', color: 'purple' }
  ];

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getTimeElapsed = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins}m ago`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Live Orders
        </h3>
        <div className="flex space-x-2">
          {statusFilters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedStatus(filter.key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedStatus === filter.key
                  ? `bg-${filter.color}-100 text-${filter.color}-800 dark:bg-${filter.color}-900 dark:text-${filter.color}-200 border border-${filter.color}-300 dark:border-${filter.color}-700`
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No orders found for selected filter
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    #{order.orderNumber}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getTimeElapsed(order.createdAt)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{order.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="font-medium text-gray-900 dark:text-white">KSh {order.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Items</p>
                <div className="flex flex-wrap gap-1">
                  {order.items.slice(0, 3).map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Table: {order.table || 'Delivery'}
                </div>
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveOrders;