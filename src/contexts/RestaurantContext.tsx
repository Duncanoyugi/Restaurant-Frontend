import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useGetAllRestaurantsQuery } from '../features/restaurants/unifiedRestaurantApi';

import type { Restaurant } from '../types/restaurant';

interface RestaurantContextType {
  selectedRestaurant: Restaurant | null;
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  setSelectedRestaurant: (restaurant: Restaurant) => void;
  clearSelectedRestaurant: () => void;
  fetchRestaurants: () => Promise<void>;
  fetchRestaurantById: (id: number) => Promise<Restaurant | null>;
  isRestaurantSelected: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(() => {
    const saved = localStorage.getItem('selectedRestaurant');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use RTK Query to fetch restaurants
  const { data: restaurantsData, isLoading: rtkLoading, error: fetchError } = useGetAllRestaurantsQuery();
  const restaurants = restaurantsData?.data || [];

  const fetchRestaurants = async () => {
    // RTK Query handles fetching automatically, this is kept for manual triggering if needed
  };

  const fetchRestaurantById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/restaurants/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
      }
      const data = await response.json();
      return data as Restaurant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurant');
      console.error('Error fetching restaurant:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSetSelectedRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
  };

  const handleClearSelectedRestaurant = () => {
    setSelectedRestaurant(null);
    localStorage.removeItem('selectedRestaurant');
  };

  // RTK Query automatically fetches when component mounts

  // Check if user needs to select a restaurant
  const isRestaurantSelected = !!selectedRestaurant;

  // No automatic redirects needed here - AppRouter handles all routing logic

  return (
    <RestaurantContext.Provider value={{
      selectedRestaurant,
      restaurants,
      loading: rtkLoading || loading,
      error: fetchError ? (fetchError instanceof Error ? fetchError.message : JSON.stringify(fetchError)) : error,
      setSelectedRestaurant: handleSetSelectedRestaurant,
      clearSelectedRestaurant: handleClearSelectedRestaurant,
      fetchRestaurants,
      fetchRestaurantById,
      isRestaurantSelected
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
