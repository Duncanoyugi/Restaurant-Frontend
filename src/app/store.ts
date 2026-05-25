import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/utils/baseApi';
import authReducer from '@/modules/auth/api/authSlice';
import cartReducer from '@/modules/cart/api/cartSlice';
import bookingReducer from '@/modules/rooms/api/bookingSlice';
import customerReducer from '@/modules/customer/api/customerSlice';
import notificationsReducer from '@/modules/notifications/api/notificationsSlice';
import ordersReducer from '@/modules/orders/api/ordersSlice';

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