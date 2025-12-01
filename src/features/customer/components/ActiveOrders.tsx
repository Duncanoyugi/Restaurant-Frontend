import React from 'react';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  restaurant: string;
  items: string[];
  status: 'preparing' | 'ready' | 'on-the-way' | 'delivered';
  statusText: string;
  estimatedTime: string;
  total: number;
  orderTime: string;
  progress: number;
}

export const ActiveOrders: React.FC = () => {
  // Mock data - replace with actual API data
  const activeOrders: Order[] = [
    {
      id: 'ORD-001',
      restaurant: 'Italian Bistro',
      items: ['Margherita Pizza', 'Caesar Salad', 'Garlic Bread'],
      status: 'preparing',
      statusText: 'Being prepared',
      estimatedTime: '15-20 min',
      total: 42.50,
      orderTime: '2:30 PM',
      progress: 60
    },
    {
      id: 'ORD-002',
      restaurant: 'Sushi Haven',
      items: ['Salmon Roll', 'Miso Soup'],
      status: 'on-the-way',
      statusText: 'On the way',
      estimatedTime: '5-10 min',
      total: 28.75,
      orderTime: '2:45 PM',
      progress: 85
    }
  ];

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      preparing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'on-the-way': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      preparing: '👨‍🍳',
      ready: '✅',
      'on-the-way': '🚗',
      delivered: '📦'
    };
    return icons[status];
  };

  if (activeOrders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Active Orders
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Ready to order something delicious?
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Active Orders
        </h2>
        <Link
          to="/dashboard/orders"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {activeOrders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {order.restaurant}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order #{order.id} • {order.orderTime}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)} {order.statusText}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {order.items.slice(0, 2).join(', ')}
                {order.items.length > 2 && ` +${order.items.length - 2} more`}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${order.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Order placed</span>
                <span>Estimated: {order.estimatedTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">
                ${order.total.toFixed(2)}
              </span>
              <div className="flex space-x-2">
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Track
                </button>
                <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};