import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your order #{orderId} has been confirmed and is being prepared.
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Steps</p>
            <p className="font-medium text-gray-900 dark:text-white">
              You'll receive a confirmation email shortly
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Delivery</p>
            <p className="font-medium text-gray-900 dark:text-white">
              30-45 minutes
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/dashboard/orders"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View All Orders
          </Link>
          <Link
            to="/menu"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Order More
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderSuccess;