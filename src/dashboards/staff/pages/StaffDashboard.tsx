import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from '@/shared/layouts/StaffLayout';
import StaffOrders from '@/dashboards/staff/components/StaffOrders';
import DailyReservations from '@/dashboards/staff/components/DailyReservations';
import StockOverview from '@/dashboards/staff/components/StockOverview';
import KitchenDashboard from '@/dashboards/staff/components/KitchenDashboard';
import TableManagement from '@/dashboards/staff/components/TableManagement';
import { useStaffContext } from '@/dashboards/staff/contexts/StaffContext';

const StaffDashboard: React.FC = () => {
  const { restaurant } = useStaffContext();

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <StaffLayout>
      <Routes>
        <Route index element={<KitchenDashboard restaurantId={restaurant.id} />} />
        <Route path="orders" element={<StaffOrders restaurantId={restaurant.id} />} />
        <Route path="reservations" element={<DailyReservations restaurantId={restaurant.id} />} />
        <Route path="inventory" element={<StockOverview restaurantId={restaurant.id} />} />
        <Route path="tables" element={<TableManagement restaurantId={restaurant.id} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </StaffLayout>
  );
};

export default StaffDashboard;
