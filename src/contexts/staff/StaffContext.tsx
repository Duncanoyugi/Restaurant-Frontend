import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { UserRoleEnum } from '../../features/auth/authSlice';
import { useGetDefaultRestaurantQuery, useGetAllStaffQuery } from '../../features/restaurants/unifiedRestaurantApi';

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

export function useStaffContext() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaffContext must be used within StaffProvider');
  }
  return context;
}

interface StaffProviderProps {
  children: ReactNode;
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the default restaurant first
  const { data: defaultRestaurant, isLoading: restaurantLoading } = useGetDefaultRestaurantQuery(undefined, {
    skip: !isAuthenticated || user?.role !== UserRoleEnum.RESTAURANT_STAFF,
  });

  // Then get all staff for that restaurant
  const { data: allStaff, isLoading: staffLoading, refetch } = useGetAllStaffQuery(defaultRestaurant?.id || '', {
    skip: !isAuthenticated || !defaultRestaurant?.id || user?.role !== UserRoleEnum.RESTAURANT_STAFF,
  });

  useEffect(() => {
    if (defaultRestaurant && allStaff && user) {
      // Find the staff member that matches the current user
      const currentStaff = allStaff.find(staff => staff.userId === user.id);

      if (currentStaff) {
        const restaurantData: Restaurant = {
          id: defaultRestaurant.id,
          name: defaultRestaurant.name,
          address: defaultRestaurant.streetAddress || '',
          phone: defaultRestaurant.phone || '',
          openingTime: defaultRestaurant.openingTime || '',
          closingTime: defaultRestaurant.closingTime || '',
          // These fields might need to be calculated or fetched separately
          totalTables: 15, // Placeholder
          availableTables: 5, // Placeholder
          todaysOrders: 24, // Placeholder
          todaysReservations: 18, // Placeholder
        };
        setRestaurant(restaurantData);
        setError(null);
      } else {
        setError('Staff member not found in restaurant');
      }
    } else if (!restaurantLoading && !staffLoading && user?.role === UserRoleEnum.RESTAURANT_STAFF) {
      setError('Unable to load restaurant information');
    }
  }, [defaultRestaurant, allStaff, restaurantLoading, staffLoading, user]);

  const refreshRestaurant = () => {
    refetch();
  };

  const isLoading = restaurantLoading || staffLoading;

  return (
    <StaffContext.Provider value={{ restaurant, isLoading, error, refreshRestaurant }}>
      {children}
    </StaffContext.Provider>
  );
};