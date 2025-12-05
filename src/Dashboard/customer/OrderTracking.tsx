// src/Dashboard/customer/OrderTracking.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useGetOrderByIdQuery } from '../../features/orders/ordersApi';
import { useGetLiveDeliveryTrackingQuery } from '../../features/delivery/deliveryApi';
import { format } from 'date-fns';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading: orderLoading } = useGetOrderByIdQuery(orderId!);
  const { data: tracking, isLoading: trackingLoading, refetch } = useGetLiveDeliveryTrackingQuery(orderId!, {
    pollingInterval: 30000, // Poll every 30 seconds
  });

  // Refresh tracking data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const isLoading = orderLoading || trackingLoading;

  const trackingSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: '📝', completed: true },
    { key: 'CONFIRMED', label: 'Confirmed', icon: '✅', completed: false },
    { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳', completed: false },
    { key: 'READY', label: 'Ready', icon: '🎉', completed: false },
    { key: 'ON_THE_WAY', label: 'On the Way', icon: '🚗', completed: false },
    { key: 'DELIVERED', label: 'Delivered', icon: '✨', completed: false },
  ];

  // Update completed steps based on order status
  if (order) {
    const statusIndex = trackingSteps.findIndex(step => step.key === (order.status as unknown as string));
    trackingSteps.forEach((step, index) => {
      step.completed = index <= statusIndex;
    });
  }

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

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Order Not Found
          </h2>
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to={`/dashboard/orders/${orderId}`}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm mb-2 inline-flex items-center"
            >
              ← Back to Order Details
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Track Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {order.restaurant?.name || (order as any).restaurantName}
            </p>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Order Status
          </h2>

          <div className="relative">
            {trackingSteps.map((step, index) => (
              <div key={step.key} className="flex items-start mb-8 last:mb-0">
                {/* Timeline line */}
                {index < trackingSteps.length - 1 && (
                  <div className={`absolute left-4 top-10 w-0.5 h-14 ${step.completed ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                )}
                
                {/* Icon */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${step.completed ? 'bg-primary-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  <span className="text-lg">{step.icon}</span>
                </div>
                
                {/* Content */}
                <div className="ml-4 flex-1">
                  <h3 className={`font-semibold ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {step.label}
                  </h3>
                  {step.completed && (tracking as any)?.statusHistory && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date((tracking as any).updatedAt), 'MMM dd, yyyy • hh:mm a')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Info */}
        {order.driver && tracking && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delivery Driver
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">{order.driver.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {order.driver.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {order.driver.phone}
                </p>
              </div>
              <a
                href={`tel:${order.driver.phone}`}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Call Driver
              </a>
            </div>

            {(tracking as any).currentLocation && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Last Updated: {format(new Date((tracking as any).updatedAt), 'hh:mm a')}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Driver is on the way to your location
                </p>
              </div>
            )}
          </div>
        )}

        {/* Estimated Delivery Time */}
        {(order as any).estimatedDeliveryTime && (order.status as unknown as string) !== 'DELIVERED' && (
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Estimated Arrival</h3>
                <p className="text-primary-100">{(order as any).estimatedDeliveryTime}</p>
              </div>
              <div className="text-4xl">⏱️</div>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delivery Address
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {order.deliveryAddress.street}<br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
              {order.deliveryAddress.country} - {order.deliveryAddress.postalCode}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderTracking;