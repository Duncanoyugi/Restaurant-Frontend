import React from 'react';
import { useAppSelector } from '../../app/hooks';
import Card from '../../components/ui/Card';

const HomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'Admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage restaurants, users, and system settings',
          features: ['User Management', 'Restaurant Approval', 'System Analytics']
        };
      case 'Restaurant Owner':
        return {
          title: 'Restaurant Owner Dashboard',
          description: 'Manage your restaurant and view performance',
          features: ['Menu Management', 'Order Tracking', 'Revenue Reports']
        };
      case 'Restaurant Staff':
        return {
          title: 'Staff Dashboard',
          description: 'Handle orders and reservations',
          features: ['Order Management', 'Table Reservations', 'Customer Service']
        };
      case 'Driver':
        return {
          title: 'Driver Dashboard',
          description: 'Manage deliveries and track earnings',
          features: ['Delivery Requests', 'Route Optimization', 'Earnings Tracking']
        };
      default:
        return {
          title: 'Customer Dashboard',
          description: 'Browse restaurants and track your orders',
          features: ['Order Food', 'Table Reservations', 'Order History']
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
        <p className="mt-2 text-gray-600">{content.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.features.map((feature, index) => (
          <Card key={index} className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{feature}</h3>
            <p className="text-gray-600">Manage and track your {feature.toLowerCase()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;