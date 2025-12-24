import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import StaffOrders from '../../components/staff/StaffOrders';
import DailyReservations from '../../components/staff/DailyReservations';
import StockOverview from '../../components/staff/StockOverview';
import KitchenDashboard from '../../components/staff/KitchenDashboard';
import TableManagement from '../../components/staff/TableManagement';
import { useStaffContext } from '../../contexts/staff/StaffContext';

const StaffDashboard: React.FC = () => {
  const { restaurant } = useStaffContext();

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <StaffLayout>
      <Routes>
        <Route path="/" element={<KitchenDashboard restaurantId={restaurant.id} />} />
        <Route path="/orders" element={<StaffOrders restaurantId={restaurant.id} />} />
        <Route path="/reservations" element={<DailyReservations restaurantId={restaurant.id} />} />
        <Route path="/inventory" element={<StockOverview restaurantId={restaurant.id} />} />
        <Route path="/tables" element={<TableManagement restaurantId={restaurant.id} />} />
      </Routes>
    </StaffLayout>
  );
};

export default StaffDashboard;
