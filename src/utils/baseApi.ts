// src/utils/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state first, fallback to localStorage
    const state = getState() as RootState;
    let token = state.auth?.accessToken;

    // Fallback to localStorage if not in Redux state
    if (!token) {
      token = localStorage.getItem('accessToken');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Only set Content-Type if not already set (for FormData uploads)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  },
  credentials: 'include', // Include credentials for cookie-based auth if needed
});

// Enhanced base query with retry logic for 401 errors
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token or redirect to login
  if (result.error && result.error.status === 401) {
    console.warn('Authentication failed - 401 error received');

    // Clear invalid token
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // Optionally dispatch logout action
    // api.dispatch(logout());

    // You could implement token refresh logic here
    // For now, we'll just let the error propagate
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Profile',
    'Cart',

    // Menu related tags
    'MenuItems',
    'Categories',
    'RestaurantMenu',
    'RestaurantFeatured',
    'RestaurantPriceRange',
    'RestaurantStatistics',
    'MyRestaurantMenu',
    'MyRestaurantStatistics',

    // Order related tags
    'Orders',
    'MyOrders',
    'MyDeliveries',
    'MyRestaurantOrders',
    'KitchenOrders',
    'DeliveryOrders',
    'OrderStatusHistory',
    'OrderStatistics',
    'RestaurantOrdersToday',

    // Reservation related tags
    'Tables',
    'Reservations',
    'MyReservations',
    'MyRestaurantReservations',
    'MyRestaurantTables',
    'ReservationStats',
    'UpcomingReservations',
    'DailyReservations',

    // Restaurant related tags
    'Restaurants',
    'RestaurantStaff',
    'Shifts',
    'RestaurantStatistics',

    // Room related tags
    'Rooms',
    'RoomBookings',
    'RoomOccupancy',
    'UpcomingCheckIns',
    'UpcomingCheckOuts',

    // Payment related tags
    'Payment',
    'MyPayments',
    'PaymentHistory',

    // Location related tags
    'Countries',
    'States',
    'Cities',
    'Addresses',
    'MyAddresses',
    'UserAddresses',
    'RestaurantCities',
    'KenyanCities',
    'LocationStats',

    // Delivery related tags
    'VehicleInfo',
    'DeliveryTracking',
    'OrderTracking',
    'ActiveTracking',
    'AvailableDrivers',
    'DriverStats',
    'MyDriverStats',
    'DeliveryPerformance',
    'MyActiveDeliveries',
    'DriverDeliveries',
    'ActiveDeliveries',

    // Inventory related tags
    'Suppliers',
    'InventoryItems',
    'StockTransactions',
    'LowStockItems',
    'ExpiringItems',
    'InventoryAnalytics',
    'MyRestaurantInventory',
    'MyRestaurantLowStock',
    'MyRestaurantAnalytics',

    // Notification related tags
    'Notifications',
    'AdminNotifications',
    'RestaurantNotifications',
    'DriverNotifications',
    'NotificationCount',
    'NotificationStats',

    // Analytics related tags (NEW)
    'ActivityLogs',
    'DashboardAnalytics',
    'RevenueAnalytics',
    'OrderAnalytics',
    'CustomerAnalytics',
    'MenuPerformanceAnalytics',
    'UserBehaviorAnalytics',
    'MyBehaviorAnalytics',

    // Add Review related tags here (after 'RestaurantStatistics')
    'Reviews',
    'ReviewResponses',
    'ReviewStats',
    'RestaurantReviews',
    'MenuItemReviews',
    'MyReviews',

    // User related tags
    'Users',
    'User',
    'UserProfile',
    'UserStatistics',
    'UserRoles',
    'OnlineUsers',

    // Role-specific tags
    'CustomerOrders',
    'CustomerReviews',
    'CustomerAddresses',
    'CustomerFavorites',
    'CustomerLoyalty',

    'DriverDeliveries',
    'ActiveDeliveries',
    'DriverEarnings',
    'DriverPerformance',
    'VehicleInfo',

    'StaffShifts',
    'RestaurantStaff',
    'OwnerRestaurants',

    'CustomerLoyalty',
    'CustomerFavorites',

    // Other tags
    'Favorites',
    'Stats',
  ],
  endpoints: () => ({}),
});