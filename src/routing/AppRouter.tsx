import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { UserRoleEnum, extractRoleName } from '@/modules/auth/api/authSlice';
import { useGetProfileQuery } from '@/modules/auth/api/authApi';
import { updateUserProfile } from '@/modules/auth/api/authSlice';
import ProtectedRoute from '@/routing/ProtectedRoute';

const RoleBasedDashboard = lazy(() => import('@/routing/RoleBasedDashboard'));
const DashboardLayout = lazy(() => import('@/shared/layouts/DashboardLayout'));
const LandingPage = lazy(() => import('@/modules/landing/pages/LandingPage'));
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/modules/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/modules/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/modules/auth/pages/ResetPasswordPage'));
const VerifyOtpPage = lazy(() => import('@/modules/auth/pages/VerifyOtp'));
const MenuPage = lazy(() => import('@/modules/menu/pages/MenuPage'));
const AccommodationPage = lazy(() => import('@/modules/rooms/pages/AccommodationPage'));
const ReservationsPage = lazy(() => import('@/modules/reservations/pages/ReservationsPage'));
const AboutPage = lazy(() => import('@/modules/landing/pages/AboutPage'));
const ContactPage = lazy(() => import('@/modules/landing/pages/ContactPage'));
const CartPage = lazy(() => import('@/modules/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/modules/cart/pages/CheckoutPage'));
const PaymentVerificationPage = lazy(() => import('@/modules/payments/pages/PaymentVerificationPage'));
const PaymentCallbackPage = lazy(() => import('@/modules/payments/pages/PaymentCallbackPage'));
const RoomDetailsPage = lazy(() => import('@/modules/rooms/pages/RoomDetailsPage'));
const RestaurantList = lazy(() => import('@/modules/restaurants/pages/RestaurantList'));
const RestaurantDetail = lazy(() => import('@/modules/restaurants/pages/RestaurantDetail'));
const SelectRestaurant = lazy(() => import('@/modules/restaurants/pages/SelectRestaurant'));
const RestaurantSetup = lazy(() => import('@/modules/restaurants/pages/RestaurantSetup'));

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
