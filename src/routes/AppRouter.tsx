import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import HomePage from '../pages/Dashboard/HomePage';
import LandingPage from '../pages/Landing/LandingPage';
import MenuPage from '../pages/Menu/MenuPage';
import AccommodationPage from '../pages/Accommodation/AccommodationPage';
import ReservationsPage from '../pages/Reservations/ReservationsPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import CartPage from '../pages/Cart/CartPage';

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Public content pages - anyone can view */}
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/accommodation" element={<AccommodationPage />} />
      <Route path="/reservations" element={<ReservationsPage />} />
      
      {/* About and Contact pages */}
      <Route path="/about" element={<LandingPage />} />
      <Route path="/contact" element={<LandingPage />} />

      {/* Cart page */}
      <Route path="/cart" element={<CartPage />} />

      {/* Protected routes - dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <HomePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;