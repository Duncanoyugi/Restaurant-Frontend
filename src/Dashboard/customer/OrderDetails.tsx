import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useGetOrderByIdQuery } from '../../features/orders/ordersApi';
import { useCancelOrderMutation } from '../../features/customer/customerApi';
import { format } from 'date-fns';
import type { Order, OrderItem } from '../../types/order';
import { useToast } from '../../contexts/ToastContext';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId!);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const { showToast } = useToast();

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder({ orderId: orderId!, reason: 'Customer requested cancellation' }).unwrap();
        showToast('Order cancelled successfully', 'success');
        navigate('/dashboard/orders');
      } catch (error: any) {
        console.error('Failed to cancel order:', error);
        showToast(error?.data?.message || 'Failed to cancel order. Please try again.', 'error');
      }
    }
  };

  const getStatusColor = (status: string = 'PENDING') => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'CONFIRMED': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'PREPARING': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'READY': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'DELIVERED': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link
            to="/dashboard/orders"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const orderData = order as Order;
  const status = orderData.status ? (orderData.status as unknown as string) : 'PENDING';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/dashboard/orders"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm mb-2 inline-flex items-center"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order #{orderData.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Placed on {format(new Date(orderData.createdAt), 'MMM dd, yyyy • hh:mm a')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Restaurant</p>
              <p className="font-medium text-gray-900 dark:text-white">{orderData.restaurant?.name || (orderData as any).restaurantName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Order Type</p>
              <p className="font-medium text-gray-900 dark:text-white">{orderData.orderType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="font-medium text-gray-900 dark:text-white text-xl">
                ${orderData.finalPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
              <p className="font-medium text-gray-900 dark:text-white">{(orderData as any).paymentStatus || 'Pending'}</p>
            </div>
          </div>

          {orderData.comment && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Special Instructions</p>
              <p className="text-gray-900 dark:text-white">{orderData.comment}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Items
          </h2>
          
          <div className="space-y-4">
            {orderData.orderItems?.map((item: OrderItem, index: number) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.menuItem?.name || `Item ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${(item.menuItem?.price || 0).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${((orderData as any).basePrice || orderData.finalPrice).toFixed(2)}</span>
              </div>
              {((orderData as any).discountAmount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-green-600">-${((orderData as any).discountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              {((orderData as any).deliveryFee || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                  <span className="text-gray-900 dark:text-white">${((orderData as any).deliveryFee || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">${(orderData.taxAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">${orderData.finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {status === 'PENDING' && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
          {['CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY'].includes(status) && orderData.orderType === 'DELIVERY' && (
            <Link
              to={`/dashboard/orders/${orderData.id}/track`}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              Track Order
            </Link>
          )}
          {status === 'DELIVERED' && (
            <Link
              to="/dashboard/reviews"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              Write a Review
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;