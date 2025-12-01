import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import VerifyOtpPage from '../pages/Auth/VerifyOtp';
import RoleBasedDashboard from '../components/dashboard/RoleBasedDashboard'; // Updated import
import LandingPage from '../pages/Landing/LandingPage';
import MenuPage from '../pages/Menu/MenuPage';
import AccommodationPage from '../pages/Accommodation/AccommodationPage';
import ReservationsPage from '../pages/Reservations/ReservationsPage';
import AboutPage from '../pages/About/AboutPage';
import ContactPage from '../pages/Contact/ContactPage';
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
      <Route 
        path="/verify-otp" 
        element={!isAuthenticated ? <VerifyOtpPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/forgot-password" 
        element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/reset-password" 
        element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Public content pages */}
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/accommodation" element={<AccommodationPage />} />
      <Route path="/reservations" element={<ReservationsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Cart page */}
      <Route path="/cart" element={<CartPage />} />

      {/* Protected routes - dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedDashboard /> {/* Updated to use RoleBasedDashboard */}
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;