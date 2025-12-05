import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatsGrid } from '../../components/customer/StatsGrid';
import { QuickActions } from '../../components/customer/QuickActions';
import { ActiveOrders } from '../../components/customer/ActiveOrders';
import { UpcomingBookings } from '../../components/customer/UpcomingBookings';
import { RecentActivity } from '../../components/customer/RecentActivity';
import { PersonalizedRecommendations } from '../../components/customer/PersonalizedRecommendations';
import { WelcomeBanner } from '../../components/customer/WelcomeBanner';
import { useGetDashboardOverviewQuery } from '../../features/analytics/analyticsApi';

const CustomerDashboard: React.FC = () => {
  const { isLoading } = useGetDashboardOverviewQuery({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
    restaurantId: undefined,
    period: 'LAST_30_DAYS' as any // Use string value that matches backend enum
  });

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