import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import VerifyOtpPage from '../pages/VerifyOtp';
import RoleBasedDashboard from '../components/dashboard/RoleBasedDashboard';
import LandingPage from '../pages/LandingPage';
import MenuPage from '../pages/MenuPage';
import AccommodationPage from '../pages/AccommodationPage';
import ReservationsPage from '../pages/ReservationsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ProtectedRoute from './ProtectedRoute';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentVerificationPage from '../pages/PaymentVerificationPage';
import PaymentCallbackPage from '../pages/PaymentCallbackPage';
import RoomDetailsPage from '../pages/RoomDetailsPage';

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
      <Route path="/rooms/:id" element={<RoomDetailsPage />} />
      <Route path="/reservations" element={<ReservationsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Cart and Checkout pages */}
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/verify"
        element={
          <ProtectedRoute>
            <PaymentVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route path="/payments/callback" element={<PaymentCallbackPage />} />

      {/* Protected routes - dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <RoleBasedDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;