// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../utils/baseApi'; // CHANGE: Import baseApi instead of api
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import bookingReducer from '../features/booking/bookingSlice';
import customerReducer from '../features/customer/customerSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    booking: bookingReducer,
    customer: customerReducer,
    notifications: notificationsReducer,
    [baseApi.reducerPath]: baseApi.reducer, // CHANGE: Use baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware), // CHANGE: Use baseApi.middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;