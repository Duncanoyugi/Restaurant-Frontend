import { baseApi } from '../../utils/baseApi';
import type {
  User,
  UserProfile,
  CreateUserDto,
  UpdateUserDto,
  UserSearchDto,
  UserPaginatedResponse,
  UserStatistics,
} from '../../types/user';

const buildUserSearchParams = (searchDto: UserSearchDto | void) => {
  const params = new URLSearchParams();

  if (searchDto?.name) params.append('name', searchDto.name);
  if (searchDto?.email) params.append('email', searchDto.email);
  if (searchDto?.phone) params.append('phone', searchDto.phone);
  if (searchDto?.role) params.append('role', searchDto.role);
  if (searchDto?.status) params.append('status', searchDto.status);
  if (searchDto?.emailVerified !== undefined) params.append('emailVerified', String(searchDto.emailVerified));
  if (searchDto?.isOnline !== undefined) params.append('isOnline', String(searchDto.isOnline));
  if (searchDto?.isAvailable !== undefined) params.append('isAvailable', String(searchDto.isAvailable));
  if (searchDto?.page) params.append('page', String(searchDto.page));
  if (searchDto?.limit) params.append('limit', String(searchDto.limit));

  return params.toString();
};

const normalizePaginatedUsers = (response: any): UserPaginatedResponse<User> => {
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: 1,
      limit: response.length || 10,
      totalPages: 1,
    };
  }

  const data = response?.data || [];
  const total = response?.total || data.length || 0;
  const limit = response?.limit || 10;
  const page = response?.page || 1;

  return {
    data,
    total,
    page,
    limit,
    totalPages: response?.totalPages || Math.max(1, Math.ceil(total / limit)),
  };
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserProfile, void>({
      query: () => 'users/me/profile',
      providesTags: ['User', 'Profile'],
    }),

    updateMyProfile: builder.mutation<User, UpdateUserDto>({
      query: (data) => ({
        url: 'users/me/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User', 'Profile'],
    }),

    changePassword: builder.mutation<{ message: string }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: 'users/me/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    updateOnlineStatus: builder.mutation<User, { isOnline: boolean }>({
      query: (data) => ({
        url: 'users/me/online-status',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User', 'OnlineUsers'],
    }),

    createUser: builder.mutation<User, CreateUserDto>({
      query: (data) => ({
        url: 'users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'UserStatistics'],
    }),

    getAllUsers: builder.query<UserPaginatedResponse<User>, UserSearchDto | void>({
      query: (searchDto = {}) => {
        const queryString = buildUserSearchParams(searchDto);
        return {
          url: `users${queryString ? `?${queryString}` : ''}`,
        };
      },
      transformResponse: normalizePaginatedUsers,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

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

    getUserStatistics: builder.query<UserStatistics, void>({
      query: () => 'users/statistics',
      providesTags: [{ type: 'UserStatistics', id: 'GLOBAL' }],
    }),

    getOnlineUsers: builder.query<User[], void>({
      query: () => 'users/online',
      providesTags: ['OnlineUsers'],
    }),

    searchUsers: builder.query<User[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: `users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      }),
    }),

    checkEmailExists: builder.query<{ exists: boolean }, string>({
      query: (email) => `users/check-email?email=${encodeURIComponent(email)}`,
    }),

    checkPhoneExists: builder.query<{ exists: boolean }, string>({
      query: (phone) => `users/check-phone?phone=${encodeURIComponent(phone)}`,
    }),

    getUserByEmail: builder.query<User | null, string>({
      query: (email) => `users/find-by-email?email=${encodeURIComponent(email)}`,
      providesTags: (result) => (result ? [{ type: 'Users', id: result.id }] : []),
    }),

    getUserByPhone: builder.query<User | null, string>({
      query: (phone) => `users/find-by-phone?phone=${encodeURIComponent(phone)}`,
      providesTags: (result) => (result ? [{ type: 'Users', id: result.id }] : []),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
  useUpdateOnlineStatusMutation,
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserStatisticsQuery,
  useGetOnlineUsersQuery,
  useSearchUsersQuery,
  useCheckEmailExistsQuery,
  useCheckPhoneExistsQuery,
  useGetUserByEmailQuery,
  useGetUserByPhoneQuery,
} = usersApi;
