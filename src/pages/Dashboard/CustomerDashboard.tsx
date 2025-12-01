import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatsGrid } from '../../features/customer/components/StatsGrid';
import { QuickActions } from '../../features/customer/components/QuickActions';
import { ActiveOrders } from '../../features/customer/components/ActiveOrders';
import { UpcomingBookings } from '../../features/customer/components/UpcomingBookings';
import { RecentActivity } from '../../features/customer/components/RecentActivity';
import { PersonalizedRecommendations } from '../../features/customer/components/PersonalizedRecommendations';
import { WelcomeBanner } from '../../features/customer/components/WelcomeBanner';

const CustomerDashboard: React.FC = () => {
  useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Quick Stats */}
        <StatsGrid />

        {/* Quick Actions */}
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Orders */}
          <div className="lg:col-span-1">
            <ActiveOrders />
          </div>

          {/* Upcoming Bookings */}
          <div className="lg:col-span-1">
            <UpcomingBookings />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />

        {/* Personalized Recommendations */}
        <PersonalizedRecommendations />
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;