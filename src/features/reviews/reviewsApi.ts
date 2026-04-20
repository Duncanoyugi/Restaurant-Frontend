import { baseApi } from '../../utils/baseApi';
import type {
  Review,
  UpdateReviewDto,
  ReviewSearchDto,
  ReviewPaginatedResponse,
  RestaurantReviewStats,
} from '../../types/reviews';

const normalizeReviews = (response: any): ReviewPaginatedResponse<Review> => {
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: 1,
      limit: response.length || 10,
      totalPages: 1,
    };
  }

  const data = response?.data || response?.reviews || [];
  const pagination = response?.pagination;
  const total = response?.total || pagination?.total || data.length || 0;
  const limit = response?.limit || pagination?.limit || 10;
  const page = response?.page || pagination?.page || 1;

  return {
    data,
    total,
    page,
    limit,
    totalPages: response?.totalPages || pagination?.pages || Math.max(1, Math.ceil(total / limit)),
  };
};

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<ReviewPaginatedResponse<Review>, ReviewSearchDto | void>({
      query: (searchDto) => ({
        url: 'reviews',
        params: searchDto || {},
      }),
      transformResponse: normalizeReviews,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Reviews' as const, id })),
              { type: 'Reviews', id: 'LIST' },
            ]
          : [{ type: 'Reviews', id: 'LIST' }],
    }),

    getRestaurantReviews: builder.query<ReviewPaginatedResponse<Review>, { restaurantId: string; query?: ReviewSearchDto }>({
      query: ({ restaurantId, query = {} }) => ({
        url: `reviews/restaurant/${restaurantId}`,
        params: query,
      }),
      transformResponse: normalizeReviews,
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'RestaurantReviews', id: restaurantId },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),

    getMenuItemReviews: builder.query<ReviewPaginatedResponse<Review>, { menuItemId: string; query?: ReviewSearchDto }>({
      query: ({ menuItemId, query = {} }) => ({
        url: `reviews/menu-item/${menuItemId}`,
        params: query,
      }),
      transformResponse: normalizeReviews,
      providesTags: (_result, _error, { menuItemId }) => [
        { type: 'MenuItemReviews', id: menuItemId },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),

    getReviewById: builder.query<Review, string>({
      query: (id) => `reviews/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Reviews', id }],
    }),

    updateReview: builder.mutation<Review, { id: string; data: UpdateReviewDto }>({
      query: ({ id, data }) => ({
        url: `reviews/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Reviews', id },
        { type: 'Reviews', id: 'LIST' },
        { type: 'MyReviews', id: 'LIST' },
      ],
    }),

    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Reviews', id },
        { type: 'Reviews', id: 'LIST' },
        { type: 'MyReviews', id: 'LIST' },
      ],
    }),

    getRestaurantReviewStats: builder.query<RestaurantReviewStats, string>({
      query: (restaurantId) => `reviews/stats/restaurant/${restaurantId}`,
      providesTags: (_result, _error, restaurantId) => [
        { type: 'ReviewStats', id: restaurantId },
        { type: 'RestaurantStatistics', id: restaurantId },
      ],
    }),

    verifyReview: builder.mutation<Review, string>({
      query: (id) => ({
        url: `reviews/${id}/verify`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Reviews', id },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),

    addReviewResponse: builder.mutation<Review, { reviewId: string; adminResponse: string }>({
      query: ({ reviewId, adminResponse }) => ({
        url: `reviews/${reviewId}/response`,
        method: 'POST',
        body: { adminResponse },
      }),
      invalidatesTags: (_result, _error, { reviewId }) => [
        { type: 'Reviews', id: reviewId },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),

    getMyReviews: builder.query<ReviewPaginatedResponse<Review>, ReviewSearchDto | void>({
      query: (searchDto) => ({
        url: 'reviews/my',
        params: searchDto || {},
      }),
      transformResponse: normalizeReviews,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'MyReviews' as const, id })),
              { type: 'MyReviews', id: 'LIST' },
            ]
          : [{ type: 'MyReviews', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllReviewsQuery,
  useGetRestaurantReviewsQuery,
  useGetMenuItemReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetRestaurantReviewStatsQuery,
  useVerifyReviewMutation,
  useAddReviewResponseMutation,
  useGetMyReviewsQuery,
} = reviewsApi;
