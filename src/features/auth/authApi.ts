// src/api/authApi.ts
import { baseApi } from '../../utils/baseApi';
import { setCredentials, logout } from './authSlice';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  emailVerified: boolean;
  status: string;
  averageRating?: number;
  totalDeliveries?: number;
  isOnline?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
};

type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
  requiresOtp?: boolean;
  message?: string;
  // Add token property for backward compatibility
  token?: string;
};

type VerifyOtpRequest = {
  email: string;
  otpCode: string;
};

type ResendOtpRequest = {
  email: string;
};

type OtpResponse = {
  message: string;
  success: boolean;
};

type RefreshTokenRequest = {
  refreshToken: string;
};

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken?: string;
};

type LogoutResponse = {
  message: string;
  success: boolean;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Add transformResponse to handle backend response format
      transformResponse: (response: any) => {
        // If backend returns 'access_token' or 'token' instead of 'accessToken', normalize it
        return {
          ...response,
          accessToken: response.accessToken || response.access_token || response.token,
          token: response.token || response.accessToken || response.access_token, // Keep token for backward compatibility
        };
      },
      // Add error transformation for better debugging
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'Login failed',
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({
            user: data.user,
            accessToken: data.accessToken,
          }));
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      // Add the same transformResponse for register
      transformResponse: (response: any) => {
        return {
          ...response,
          accessToken: response.accessToken || response.access_token || response.token,
          token: response.token || response.accessToken || response.access_token,
        };
      },
      invalidatesTags: ['Auth'],
    }),
    
    getProfile: builder.query<User, void>({
      query: () => 'auth/profile',
      providesTags: ['Auth', 'User', 'Profile'],
    }),
    
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: 'auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
    
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (credentials) => ({
        url: 'auth/verify-email',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        return {
          ...response,
          accessToken: response.accessToken || response.access_token || response.token,
          token: response.token || response.accessToken || response.access_token,
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken) {
            dispatch(setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            }));
          }
        } catch (error) {
          console.error('OTP verification failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    
    resendOtp: builder.mutation<OtpResponse, ResendOtpRequest>({
      query: (credentials) => ({
        url: 'auth/resend-verification',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          console.error('Logout failed:', error);
          // Still logout on client side
          dispatch(logout());
        }
      },
      invalidatesTags: ['Auth', 'User', 'Profile', 'Cart'],
    }),
    
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: 'auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User', 'Profile'],
    }),
    
    changePassword: builder.mutation<{ message: string }, { 
      currentPassword: string; 
      newPassword: string 
    }>({
      query: (data) => ({
        url: 'auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    resetPassword: builder.mutation<{ message: string }, { 
      token: string; 
      password: string 
    }>({
      query: (data) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;