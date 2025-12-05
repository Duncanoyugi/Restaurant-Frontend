// src/features/index.ts

// Export all from auth (this comes first)
export * from './auth/authApi';
export * from './auth/authSlice';

// Export from menu
export * from './menu/menuApi';

// Export from orders
export * from './orders/ordersApi';

// Export from reservations
export * from './reservations/reservationsApi';

// Export from restaurant
export * from './restaurant/restaurantApi';

// Export from booking
export * from './booking/roomsApi';
export * from './booking/bookingSlice';

// Export from cart
export * from './cart/cartSlice';

// Export from payments
export * from './payments/paymentsApi';

// Export from location
export * from './location/locationApi';

// Export from delivery (but rename conflicting exports)
export {
  // Rename conflicting exports
  useUpdateDriverLocationMutation as useUpdateDeliveryDriverLocationMutation,
  // Export everything else normally
} from './delivery/deliveryApi';

// Export from inventory
export * from './inventory/inventoryApi';

// Export from notifications
export * from './notifications/notificationsApi';
export * from './notifications/notificationsSlice';

// Export from analytics
export * from './analytics/analyticsApi';

// Export from reviews
export * from './reviews/reviewsApi';

// Export from users (rename conflicting exports)
export {
  // Common user hooks
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  // Rename conflicting change password hook
  useChangePasswordMutation as useChangeUserPasswordMutation,
  useUploadProfileImageMutation,
  useUpdateOnlineStatusMutation,
  
  // Admin management hooks
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  
  // Customer hooks
  useGetCustomerProfileQuery,
  useUpdateCustomerMutation,
  useGetCustomerOrdersQuery,
  useGetCustomerReviewsQuery,
  useGetCustomerFavoritesQuery,
  
  // Driver hooks
  useGetDriverProfileQuery,
  useUpdateDriverMutation,
  useGetAvailableDriversQuery,
  useSearchDriversQuery,
  useUpdateDriverVehicleInfoMutation,
  // Rename conflicting location update hook
  useUpdateDriverLocationMutation as useUpdateUserDriverLocationMutation,
  useGetDriverEarningsQuery,
  
  // Staff hooks
  useGetStaffProfileQuery,
  // Rename conflicting staff update hook
  useUpdateStaffMutation as useUpdateUserStaffMutation,
  useGetStaffByRestaurantQuery,
  useGetStaffShiftsQuery,
  useUpdateStaffShiftMutation,
  
  // Admin hooks
  useGetAdminProfileQuery,
  useGetUserStatisticsQuery,
  useGetOnlineUsersQuery,
  useChangeUserStatusMutation,
  useChangeUserRoleMutation,
  useVerifyUserEmailMutation,
  useSearchUsersQuery,
  
  // Utility hooks
  useCheckEmailExistsQuery,
  useCheckPhoneExistsQuery,
  useGetUserByEmailQuery,
  useGetUserByPhoneQuery,
} from './users/usersApi';