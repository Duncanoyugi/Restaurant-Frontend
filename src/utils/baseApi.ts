// src/utils/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    // First try to get token from Redux state
    let token = (getState() as RootState).auth?.accessToken;

    // Debug logging
    console.log('🔐 baseApi - Token from Redux:', token);
    console.log('🔐 baseApi - Full auth state:', (getState() as RootState).auth);
    console.log('🔐 baseApi - isAuthenticated:', (getState() as RootState).auth?.isAuthenticated);

    // If no token in Redux, try localStorage as fallback
    if (!token) {
      token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
      console.log('🔐 baseApi - Token from localStorage:', token);
    }

    // Check localStorage directly
    const lsToken = localStorage.getItem('accessToken');
    const lsUser = localStorage.getItem('user');
    console.log('🔐 baseApi - Direct localStorage check - token:', !!lsToken, 'user:', !!lsUser);

    if (token) {
      console.log('🔐 baseApi - Setting Authorization header with token:', token.substring(0, 20) + '...');
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.log('🔐 baseApi - No token available in Redux or localStorage - USER NOT LOGGED IN');
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Custom base query with debugging
const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  console.log('🌐 API Request Details:');
  console.log('🌐 URL:', args?.url);
  console.log('🌐 Method:', args?.method);
  console.log('🌐 Params:', args?.params);
  console.log('🌐 Body:', args?.body);
  
  const result = await baseQuery(args, api, extraOptions);
  
  console.log('🌐 API Response:');
  console.log('🌐 Status:', result?.meta?.response?.status);
  console.log('🌐 Headers:', result?.meta?.response?.headers);
  
  if (result.error) {
    console.error('🌐 API Error:', result.error);
    console.error('🌐 Error Status:', result.error.status);
    console.error('🌐 Error Data:', result.error.data);
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery, // Use custom base query with debugging
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