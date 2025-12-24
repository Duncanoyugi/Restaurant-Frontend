import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { useAppSelector } from '../../app/hooks';
import { UserRoleEnum } from '../../features/auth/authSlice';

interface RestaurantGuardProps {
  children: React.ReactNode;
  roles?: string[];
}

const RestaurantGuard: React.FC<RestaurantGuardProps> = ({ children, roles = [] }) => {
  const { selectedRestaurant, isRestaurantSelected } = useRestaurant();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // For customers: must have selected a restaurant
  if (user?.role === UserRoleEnum.CUSTOMER && !isRestaurantSelected) {
    return <Navigate to="/restaurants" replace />;
  }

  // For staff/drivers: must be assigned to a restaurant
  if ((user?.role === UserRoleEnum.RESTAURANT_STAFF || user?.role === UserRoleEnum.DRIVER) && !selectedRestaurant) {
    return <Navigate to="/select-restaurant" replace />;
  }

  // Role-based access control
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RestaurantGuard;