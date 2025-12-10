import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../utils/baseApi';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import bookingReducer from '../features/booking/bookingSlice';
import customerReducer from '../features/customer/customerSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import ordersReducer from '../features/orders/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    booking: bookingReducer,
    customer: customerReducer,
    notifications: notificationsReducer,
    orders: ordersReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;