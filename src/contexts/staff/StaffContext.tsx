import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';

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
  useAppSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Mock restaurant data
    const mockRestaurant: Restaurant = {
      id: '1',
      name: 'Fine Dining Restaurant',
      address: '123 Main Street, Nairobi',
      phone: '+254 712 345 678',
      openingTime: '08:00',
      closingTime: '22:00',
      totalTables: 15,
      availableTables: 5,
      todaysOrders: 24,
      todaysReservations: 18
    };
    
    setIsLoading(true);
    setTimeout(() => {
      setRestaurant(mockRestaurant);
      setIsLoading(false);
    }, 500);
  }, []);

  const refreshRestaurant = () => {
    console.log('Refreshing restaurant data...');
  };

  return (
    <StaffContext.Provider value={{ restaurant, isLoading, error, refreshRestaurant }}>
      {children}
    </StaffContext.Provider>
  );
};