import { baseApi } from '../../utils/baseApi';
import type {
  User,
  UserProfile,
  CreateUserDto,
  UpdateUserDto,
  UserSearchDto,
  UserPaginatedResponse,
  UserStatistics,
  
  // Role-specific types
  CustomerUser,
  DriverUser,
  RestaurantStaffUser,
  CustomerProfile,
  DriverProfile,
  StaffProfile,
  AdminProfile,
  UpdateCustomerDto,
  UpdateDriverDto,
  UpdateStaffDto,
  VehicleInfo,
  StaffShift,
  DriverSearchDto,
} from '../../types/user';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // COMMON USER OPERATIONS (All authenticated users)
    // =========================================================================
    
    // Get current user profile
    getMyProfile: builder.query<UserProfile, void>({
      query: () => 'users/me',
      providesTags: ['User', 'Profile'],
    }),
    
    // Update current user profile
    updateMyProfile: builder.mutation<User, UpdateUserDto>({
      query: (data) => ({
        url: 'users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User', 'Profile'],
    }),
    
    // Change password
    changePassword: builder.mutation<void, { 
      currentPassword: string; 
      newPassword: string 
    }>({
      query: (data) => ({
        url: 'users/me/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    // Upload profile image
    uploadProfileImage: builder.mutation<{ imageUrl: string }, FormData>({
      query: (formData) => ({
        url: 'users/me/profile-image',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User', 'Profile'],
    }),
    
    // Update online status
    updateOnlineStatus: builder.mutation<User, { isOnline: boolean }>({
      query: (data) => ({
        url: 'users/me/online-status',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    // =========================================================================
    // ADMIN USER MANAGEMENT (Admin only)
    // =========================================================================
    
    // Create a new user
    createUser: builder.mutation<User, CreateUserDto>({
      query: (data) => ({
        url: 'users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'UserStatistics'],
    }),
    
    // Get all users with filtering
    getAllUsers: builder.query<UserPaginatedResponse<User>, UserSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.name) params.append('name', searchDto.name);
        if (searchDto?.email) params.append('email', searchDto.email);
        if (searchDto?.phone) params.append('phone', searchDto.phone);
        if (searchDto?.role) params.append('role', searchDto.role);
        if (searchDto?.status) params.append('status', searchDto.status);
        if (searchDto?.emailVerified !== undefined) params.append('emailVerified', searchDto.emailVerified.toString());
        if (searchDto?.isOnline !== undefined) params.append('isOnline', searchDto.isOnline.toString());
        if (searchDto?.isAvailable !== undefined) params.append('isAvailable', searchDto.isAvailable.toString());
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `users${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return {
            data: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1,
          };
        }
        return {
          data: response.data || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),
    
    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    
    // Update any user
    updateUser: builder.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        { type: 'UserStatistics', id: 'GLOBAL' },
      ],
    }),
    
    // Delete user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        { type: 'UserStatistics', id: 'GLOBAL' },
      ],
    }),
    
    // =========================================================================
    // CUSTOMER SPECIFIC OPERATIONS
    // =========================================================================
    
    // Get customer profile
    getCustomerProfile: builder.query<CustomerProfile, string>({
      query: (id) => `users/customers/${id}/profile`,
      providesTags: (_result, _error, id) => [
        { type: 'UserProfile', id },
        { type: 'CustomerOrders', id },
        { type: 'CustomerReviews', id },
        { type: 'CustomerFavorites', id },
      ],
    }),
    
    // Update customer
    updateCustomer: builder.mutation<CustomerUser, { id: string; data: UpdateCustomerDto }>({
      query: ({ id, data }) => ({
        url: `users/customers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'UserProfile', id },
      ],
    }),
    
    // Get customer orders
    getCustomerOrders: builder.query<any[], { customerId: string; status?: string }>({
      query: ({ customerId, status }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        
        const queryString = params.toString();
        return {
          url: `users/customers/${customerId}/orders${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (_result, _error, { customerId }) => [
        { type: 'CustomerOrders', id: customerId },
      ],
    }),
    
    // Get customer reviews
    getCustomerReviews: builder.query<any[], string>({
      query: (customerId) => `users/customers/${customerId}/reviews`,
      providesTags: (_result, _error, customerId) => [
        { type: 'CustomerReviews', id: customerId },
      ],
    }),
    
    // Get customer favorites
    getCustomerFavorites: builder.query<any[], string>({
      query: (customerId) => `users/customers/${customerId}/favorites`,
      providesTags: (_result, _error, customerId) => [
        { type: 'CustomerFavorites', id: customerId },
      ],
    }),
    
    // =========================================================================
    // DRIVER SPECIFIC OPERATIONS
    // =========================================================================
    
    // Get driver profile
    getDriverProfile: builder.query<DriverProfile, string>({
      query: (id) => `users/drivers/${id}/profile`,
      providesTags: (_result, _error, id) => [
        { type: 'UserProfile', id },
        { type: 'DriverDeliveries', id },
        { type: 'DriverEarnings', id },
        { type: 'DriverPerformance', id },
        { type: 'VehicleInfo', id },
      ],
    }),
    
    // Update driver
    updateDriver: builder.mutation<DriverUser, { id: string; data: UpdateDriverDto }>({
      query: ({ id, data }) => ({
        url: `users/drivers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'UserProfile', id },
        { type: 'VehicleInfo', id },
      ],
    }),
    
    // Get available drivers
    getAvailableDrivers: builder.query<DriverUser[], void>({
      query: () => 'users/drivers/available',
      providesTags: ['DriverDeliveries'],
    }),
    
    // Search drivers
    searchDrivers: builder.query<UserPaginatedResponse<DriverUser>, DriverSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.name) params.append('name', searchDto.name);
        if (searchDto?.available !== undefined) params.append('available', searchDto.available.toString());
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `users/drivers${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'DriverDeliveries', id: 'LIST' },
            ]
          : [{ type: 'DriverDeliveries', id: 'LIST' }],
    }),
    
    // Update driver vehicle info
    updateDriverVehicleInfo: builder.mutation<VehicleInfo, { driverId: string; data: Partial<VehicleInfo> }>({
      query: ({ driverId, data }) => ({
        url: `users/drivers/${driverId}/vehicle`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { driverId }) => [
        { type: 'VehicleInfo', id: driverId },
        { type: 'UserProfile', id: driverId },
      ],
    }),
    
    // Update driver location
    updateDriverLocation: builder.mutation<void, { 
      driverId: string; 
      latitude: number; 
      longitude: number 
    }>({
      query: ({ driverId, latitude, longitude }) => ({
        url: `users/drivers/${driverId}/location`,
        method: 'PATCH',
        body: { latitude, longitude },
      }),
      invalidatesTags: (_result, _error, { driverId }) => [
        { type: 'UserProfile', id: driverId },
      ],
    }),
    
    // Get driver earnings
    getDriverEarnings: builder.query<any, { driverId: string; period?: 'day' | 'week' | 'month' }>({
      query: ({ driverId, period = 'month' }) => {
        const params = new URLSearchParams();
        params.append('period', period);
        
        return {
          url: `users/drivers/${driverId}/earnings?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { driverId }) => [
        { type: 'DriverEarnings', id: driverId },
      ],
    }),
    
    // =========================================================================
    // RESTAURANT STAFF SPECIFIC OPERATIONS
    // =========================================================================
    
    // Get staff profile
    getStaffProfile: builder.query<StaffProfile, string>({
      query: (id) => `users/staff/${id}/profile`,
      providesTags: (_result, _error, id) => [
        { type: 'UserProfile', id },
        { type: 'StaffShifts', id },
        { type: 'RestaurantStaff', id },
      ],
    }),
    
    // Update staff
    updateStaff: builder.mutation<RestaurantStaffUser, { id: string; data: UpdateStaffDto }>({
      query: ({ id, data }) => ({
        url: `users/staff/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'UserProfile', id },
        { type: 'RestaurantStaff', id: 'LIST' },
      ],
    }),
    
    // Get staff by restaurant
    getStaffByRestaurant: builder.query<RestaurantStaffUser[], string>({
      query: (restaurantId) => `users/staff/restaurant/${restaurantId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RestaurantStaff' as const, id })),
              { type: 'RestaurantStaff', id: 'LIST' },
            ]
          : [{ type: 'RestaurantStaff', id: 'LIST' }],
    }),
    
    // Get staff shifts
    getStaffShifts: builder.query<StaffShift[], { staffId: string; startDate?: string; endDate?: string }>({
      query: ({ staffId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const queryString = params.toString();
        return {
          url: `users/staff/${staffId}/shifts${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (_result, _error, { staffId }) => [
        { type: 'StaffShifts', id: staffId },
      ],
    }),
    
    // Update staff shift
    updateStaffShift: builder.mutation<StaffShift, { staffId: string; shiftId: string; data: Partial<StaffShift> }>({
      query: ({ staffId, shiftId, data }) => ({
        url: `users/staff/${staffId}/shifts/${shiftId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { staffId }) => [
        { type: 'StaffShifts', id: staffId },
        { type: 'UserProfile', id: staffId },
      ],
    }),
    
    // =========================================================================
    // ADMIN SPECIFIC OPERATIONS
    // =========================================================================
    
    // Get admin profile
    getAdminProfile: builder.query<AdminProfile, string>({
      query: (id) => `users/admins/${id}/profile`,
      providesTags: (_result, _error, id) => [{ type: 'UserProfile', id }],
    }),
    
    // Get user statistics (admin only)
    getUserStatistics: builder.query<UserStatistics, void>({
      query: () => 'users/statistics',
      providesTags: [{ type: 'UserStatistics', id: 'GLOBAL' }],
    }),
    
    // Get online users
    getOnlineUsers: builder.query<User[], void>({
      query: () => 'users/online',
      providesTags: ['OnlineUsers'],
    }),
    
    // Change user status (admin only)
    changeUserStatus: builder.mutation<User, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'UserStatistics', id: 'GLOBAL' },
      ],
    }),
    
    // Change user role (admin only)
    changeUserRole: builder.mutation<User, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'UserStatistics', id: 'GLOBAL' },
      ],
    }),
    
    // Verify user email (admin only)
    verifyUserEmail: builder.mutation<User, string>({
      query: (id) => ({
        url: `users/${id}/verify-email`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'UserProfile', id },
      ],
    }),
    
    // Search users (admin only)
    searchUsers: builder.query<User[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => {
        const params = new URLSearchParams();
        params.append('q', query);
        params.append('limit', limit.toString());
        
        return {
          url: `users/search?${params.toString()}`,
        };
      },
    }),
    
    // =========================================================================
    // UTILITY ENDPOINTS
    // =========================================================================
    
    // Check if email exists
    checkEmailExists: builder.query<{ exists: boolean }, string>({
      query: (email) => {
        const params = new URLSearchParams();
        params.append('email', email);
        
        return {
          url: `users/check-email?${params.toString()}`,
        };
      },
    }),
    
    // Check if phone exists
    checkPhoneExists: builder.query<{ exists: boolean }, string>({
      query: (phone) => {
        const params = new URLSearchParams();
        params.append('phone', phone);
        
        return {
          url: `users/check-phone?${params.toString()}`,
        };
      },
    }),
    
    // Get user by email
    getUserByEmail: builder.query<User, string>({
      query: (email) => {
        const params = new URLSearchParams();
        params.append('email', email);
        
        return {
          url: `users/find-by-email?${params.toString()}`,
        };
      },
      providesTags: (result) =>
        result ? [{ type: 'Users', id: result.id }] : [],
    }),
    
    // Get user by phone
    getUserByPhone: builder.query<User, string>({
      query: (phone) => {
        const params = new URLSearchParams();
        params.append('phone', phone);
        
        return {
          url: `users/find-by-phone?${params.toString()}`,
        };
      },
      providesTags: (result) =>
        result ? [{ type: 'Users', id: result.id }] : [],
    }),
  }),
  overrideExisting: false,
});

// Export all hooks with renamed conflicting ones
export const {
  // Common user hooks
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
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
  useUpdateDriverLocationMutation,
  useGetDriverEarningsQuery,
  
  // Staff hooks
  useGetStaffProfileQuery,
  useUpdateStaffMutation,
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
} = usersApi;