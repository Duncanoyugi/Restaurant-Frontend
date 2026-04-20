import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { UserRoleEnum, extractRoleName } from '../features/auth/authSlice';
import { useGetProfileQuery } from '../features/auth/authApi';
import { updateUserProfile } from '../features/auth/authSlice';
import ProtectedRoute from './ProtectedRoute';

const RoleBasedDashboard = lazy(() => import('../components/dashboard/RoleBasedDashboard'));
const DashboardLayout = lazy(() => import('../components/layout/DashboardLayout'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const VerifyOtpPage = lazy(() => import('../pages/VerifyOtp'));
const MenuPage = lazy(() => import('../pages/MenuPage'));
const AccommodationPage = lazy(() => import('../pages/AccommodationPage'));
const ReservationsPage = lazy(() => import('../pages/ReservationsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const PaymentVerificationPage = lazy(() => import('../pages/PaymentVerificationPage'));
const PaymentCallbackPage = lazy(() => import('../pages/PaymentCallbackPage'));
const RoomDetailsPage = lazy(() => import('../pages/RoomDetailsPage'));
const RestaurantList = lazy(() => import('../pages/Restaurants/RestaurantList'));
const RestaurantDetail = lazy(() => import('../pages/Restaurants/RestaurantDetail'));
const SelectRestaurant = lazy(() => import('../pages/Restaurants/SelectRestaurant'));
const RestaurantSetup = lazy(() => import('../pages/Restaurants/RestaurantSetup'));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppRouter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (profile) {
      dispatch(
        updateUserProfile({
          ...profile,
          role: extractRoleName(profile.role),
        }),
      );
    }
  }, [dispatch, profile]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
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

        <Route path="/menu" element={<MenuPage />} />
        <Route path="/accommodation" element={<AccommodationPage />} />
        <Route path="/rooms/:id" element={<RoomDetailsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route
          path="/select-restaurant"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SelectRestaurant />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant-setup"
          element={
            <ProtectedRoute requiredRole={UserRoleEnum.RESTAURANT_OWNER}>
              <DashboardLayout>
                <RestaurantSetup />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

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
        <Route
          path="/payments/callback"
          element={
            <ProtectedRoute>
              <PaymentCallbackPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
