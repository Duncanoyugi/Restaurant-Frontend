// frontend/src/api/authApi.ts
import { baseApi } from './baseApi';

// Define types locally if imports still fail
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
  token(arg0: string, token: any): unknown;
  user: User;
  accessToken: string;
  refreshToken?: string;
  requiresOtp?: boolean; // Add this field for OTP flow
};

// Update OTP specific types to match backend DTO
type VerifyOtpRequest = {
  email: string;
  otpCode: string; // Changed from 'otp' to 'otpCode'
};

type ResendOtpRequest = {
  email: string;
};

type OtpResponse = {
  message: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<{ accessToken: string }, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
    // Update OTP endpoints to match backend routes
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (credentials) => ({
        url: '/auth/verify-email', // Changed from '/auth/verify-otp'
        method: 'POST',
        body: credentials,
      }),
    }),
    resendOtp: builder.mutation<OtpResponse, ResendOtpRequest>({
      query: (credentials) => ({
        url: '/auth/resend-verification', // Changed from '/auth/resend-otp'
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useVerifyOtpMutation, // Add this export
  useResendOtpMutation, // Add this export
} = authApi;