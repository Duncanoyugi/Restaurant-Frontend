import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery, useCancelOrderMutation } from '../../features/customer/customerApi';
import { format } from 'date-fns';
import type { Order, OrderItem } from '../../types/order';

const OrdersPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: ordersData, isLoading, error, refetch } = useGetOrdersQuery({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [cancelOrder] = useCancelOrderMutation();

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder({ orderId, reason: 'Customer requested cancellation' }).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Preparing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Ready': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Out for Delivery': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Delivered': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Orders
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Failed to load your orders. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const orders = ordersData?.orders || [];
  const total = ordersData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage your food orders
            </p>
          </div>
          <Link
            to="/menu"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span className="mr-2">🍽️</span>
            Order Food
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('Preparing')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'Preparing' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Preparing
            </button>
            <button
              onClick={() => setStatusFilter('Delivered')}
              className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'Delivered' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {statusFilter === 'all' 
                  ? "You haven't placed any orders yet."
                  : `No ${statusFilter.toLowerCase()} orders found.`}
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <span className="mr-2">🍽️</span>
                Browse Menu
              </Link>
            </div>
          ) : (
            orders.map((order: Order) => {
              const orderStatus = order.status?.name || 'Pending';
              const statusString = orderStatus;
              
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Order #{order.orderNumber}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(statusString)}`}>
                            {statusString}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {order.restaurant?.name || 'Unknown Restaurant'} • {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
                        </p>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(order.finalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        {(order.orderItems || []).slice(0, 3).map((item: OrderItem) => `${item.menuItem?.name || 'Item'} (x${item.quantity})`).join(', ')}
                        {(order.orderItems || []).length > 3 && ` +${(order.orderItems || []).length - 3} more items`}
                      </p>
                      {order.comment && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span className="font-medium">Note:</span> {order.comment}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex space-x-3">
                        <Link
                          to={`/dashboard/orders/${order.id}`}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                        {statusString === 'Pending' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.orderType === 'DELIVERY' && statusString === 'Preparing' && (
                          <Link
                            to={`/dashboard/orders/${order.id}/track`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Track Order
                          </Link>
                        )}
                      </div>
                      {order.driver && (
                        <div className="mt-3 sm:mt-0 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Driver:</span> {order.driver.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
  );
};

export default OrdersPage;