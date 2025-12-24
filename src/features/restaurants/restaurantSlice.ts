import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RestaurantState {
  selectedRestaurant: any | null;
  restaurants: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  selectedRestaurant: null,
  restaurants: [],
  loading: false,
  error: null,
};

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setSelectedRestaurant: (state, action: PayloadAction<any>) => {
      state.selectedRestaurant = action.payload;
      localStorage.setItem('selectedRestaurant', JSON.stringify(action.payload));
    },
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
      localStorage.removeItem('selectedRestaurant');
    },
    setRestaurants: (state, action: PayloadAction<any[]>) => {
      state.restaurants = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedRestaurant,
  clearSelectedRestaurant,
  setRestaurants,
  setLoading,
  setError,
} = restaurantSlice.actions;

// Commented out because restaurant reducer was removed from store
// export const selectSelectedRestaurant = (state: RootState) => state.restaurant.selectedRestaurant;
// export const selectRestaurants = (state: RootState) => state.restaurant.restaurants;
// export const selectRestaurantLoading = (state: RootState) => state.restaurant.loading;
// export const selectRestaurantError = (state: RootState) => state.restaurant.error;

export default restaurantSlice.reducer;