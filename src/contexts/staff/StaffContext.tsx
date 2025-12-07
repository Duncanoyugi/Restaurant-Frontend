import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { UserRoleEnum } from '../../features/auth/authSlice';
import { useGetStaffProfileQuery } from '../../features/users/usersApi';

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  openingTime?: string;
  closingTime?: string;
  totalTables?: number;
  availableTables?: number;
  todaysOrders?: number;
  todaysReservations?: number;
}

interface StaffContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  refreshRestaurant: () => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const useStaffContext = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaffContext must be used within StaffProvider');
  }
  return context;
};

interface StaffProviderProps {
  children: ReactNode;
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: staffProfile, isLoading, refetch } = useGetStaffProfileQuery(user?.id || '', {
    skip: !isAuthenticated || !user?.id || user?.role !== UserRoleEnum.RESTAURANT_STAFF,
  });

  useEffect(() => {
    if (staffProfile?.restaurant) {
      const restaurantData: Restaurant = {
        id: staffProfile.restaurant.id,
        name: staffProfile.restaurant.name,
        address: staffProfile.restaurant.address || '',
        phone: '',
        openingTime: '',
        closingTime: '',
        // These fields might need to be calculated or fetched separately
        totalTables: 15, // Placeholder
        availableTables: 5, // Placeholder
        todaysOrders: 24, // Placeholder
        todaysReservations: 18, // Placeholder
      };
      setRestaurant(restaurantData);
      setError(null);
    } else if (!isLoading && user?.role === UserRoleEnum.RESTAURANT_STAFF) {
      setError('Unable to load restaurant information');
    }
  }, [staffProfile, isLoading, user?.role]);

  const refreshRestaurant = () => {
    refetch();
  };

  return (
    <StaffContext.Provider value={{ restaurant, isLoading, error, refreshRestaurant }}>
      {children}
    </StaffContext.Provider>
  );
};