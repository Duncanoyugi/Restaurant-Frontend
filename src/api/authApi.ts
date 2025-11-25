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
  user: User;
  accessToken: string;
  refreshToken?: string;
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
} = authApi;