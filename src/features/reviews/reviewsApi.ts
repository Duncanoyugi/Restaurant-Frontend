// src/features/reviews/reviewsApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Review,
  ReviewResponse,
  CreateReviewDto,
  UpdateReviewDto,
  CreateReviewResponseDto,
  UpdateReviewResponseDto,
  ReviewSearchDto,
  ReviewPaginatedResponse,
  ReviewStatistics,
  RestaurantReviewStats,
  MenuItemReviewStats,
} from '../../types/reviews';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // REVIEW ENDPOINTS
    // =========================================================================
    
    // Create a new review
    createReview: builder.mutation<Review, CreateReviewDto>({
      query: (data) => ({
        url: 'reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reviews', 'MyReviews', 'Stats'],
    }),
    
    // Get all reviews with filtering
    getAllReviews: builder.query<ReviewPaginatedResponse<Review>, ReviewSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        if (searchDto?.sortBy) params.append('sortBy', searchDto.sortBy);
        if (searchDto?.minRating !== undefined) params.append('minRating', searchDto.minRating.toString());
        if (searchDto?.maxRating !== undefined) params.append('maxRating', searchDto.maxRating.toString());
        if (searchDto?.search) params.append('search', searchDto.search);
        if (searchDto?.hasImages !== undefined) params.append('hasImages', searchDto.hasImages.toString());
        if (searchDto?.verified !== undefined) params.append('verified', searchDto.verified.toString());
        if (searchDto?.status) params.append('status', searchDto.status);
        if (searchDto?.userId) params.append('userId', searchDto.userId);
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.menuItemId) params.append('menuItemId', searchDto.menuItemId);
        
        const queryString = params.toString();
        return {
          url: `reviews${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Reviews' as const, id })),
              { type: 'Reviews', id: 'LIST' },
            ]
          : [{ type: 'Reviews', id: 'LIST' }],
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
          data: response.data || response.reviews || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),
    
    // Get reviews by restaurant
    getRestaurantReviews: builder.query<ReviewPaginatedResponse<Review>, { restaurantId: string; query?: ReviewSearchDto }>({
      query: ({ restaurantId, query = {} }) => {
        const params = new URLSearchParams();
        
        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.sortBy) params.append('sortBy', query.sortBy);
        if (query?.minRating !== undefined) params.append('minRating', query.minRating.toString());
        if (query?.maxRating !== undefined) params.append('maxRating', query.maxRating.toString());
        if (query?.hasImages !== undefined) params.append('hasImages', query.hasImages.toString());
        
        const queryString = params.toString();
        return {
          url: `reviews/restaurant/${restaurantId}${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'RestaurantReviews', id: restaurantId },
        { type: 'Reviews', id: 'LIST' },
      ],
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
          data: response.data || response.reviews || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),
    
    // Get reviews by menu item
    getMenuItemReviews: builder.query<ReviewPaginatedResponse<Review>, { menuItemId: string; query?: ReviewSearchDto }>({
      query: ({ menuItemId, query = {} }) => {
        const params = new URLSearchParams();
        
        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.sortBy) params.append('sortBy', query.sortBy);
        if (query?.minRating !== undefined) params.append('minRating', query.minRating.toString());
        if (query?.maxRating !== undefined) params.append('maxRating', query.maxRating.toString());
        
        const queryString = params.toString();
        return {
          url: `reviews/menu-item/${menuItemId}${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (_result, _error, { menuItemId }) => [
        { type: 'MenuItemReviews', id: menuItemId },
        { type: 'Reviews', id: 'LIST' },
      ],
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
          data: response.data || response.reviews || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),
    
    // Get review by ID
    getReviewById: builder.query<Review, string>({
      query: (id) => `reviews/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Reviews', id }],
    }),
    
    // Update review by ID
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
    
    // Delete review by ID
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Reviews', id },
        { type: 'Reviews', id: 'LIST' },
        { type: 'MyReviews', id: 'LIST' },
        { type: 'Stats', id: 'REVIEWS' },
      ],
    }),
    
    // =========================================================================
    // STATISTICS ENDPOINTS
    // =========================================================================
    
    // Get global review statistics
    getReviewStatistics: builder.query<ReviewStatistics, void>({
      query: () => 'reviews/statistics',
      providesTags: [{ type: 'ReviewStats', id: 'GLOBAL' }],
    }),
    
    // Get restaurant review statistics
    getRestaurantReviewStats: builder.query<RestaurantReviewStats, string>({
      query: (restaurantId) => `reviews/stats/restaurant/${restaurantId}`,
      providesTags: (_result, _error, restaurantId) => [
        { type: 'ReviewStats', id: restaurantId },
        { type: 'RestaurantStatistics', id: restaurantId },
      ],
    }),
    
    // Get menu item review statistics
    getMenuItemReviewStats: builder.query<MenuItemReviewStats, string>({
      query: (menuItemId) => `reviews/stats/menu-item/${menuItemId}`,
      providesTags: (_result, _error, menuItemId) => [
        { type: 'ReviewStats', id: `MENU-${menuItemId}` },
        { type: 'MenuItems', id: menuItemId },
      ],
    }),
    
    // =========================================================================
    // RESPONSE ENDPOINTS
    // =========================================================================
    
    // Add admin/owner response to review
    addReviewResponse: builder.mutation<ReviewResponse, CreateReviewResponseDto>({
      query: (data) => ({
        url: 'reviews/response',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ReviewResponses', 'Reviews'],
    }),
    
    // Update review response
    updateReviewResponse: builder.mutation<ReviewResponse, { id: string; data: UpdateReviewResponseDto }>({
      query: ({ id, data }) => ({
        url: `reviews/response/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ReviewResponses', id },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),
    
    // Delete review response
    deleteReviewResponse: builder.mutation<void, string>({
      query: (id) => ({
        url: `reviews/response/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ReviewResponses', id },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),
    
    // =========================================================================
    // MODERATION ENDPOINTS
    // =========================================================================
    
    // Verify/Approve review
    verifyReview: builder.mutation<Review, string>({
      query: (id) => ({
        url: `reviews/${id}/verify`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Reviews', id },
        { type: 'Reviews', id: 'LIST' },
        { type: 'ReviewStats', id: 'GLOBAL' },
      ],
    }),
    
    // Reject review
    rejectReview: builder.mutation<Review, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `reviews/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Reviews', id },
        { type: 'Reviews', id: 'LIST' },
        { type: 'ReviewStats', id: 'GLOBAL' },
      ],
    }),
    
    // =========================================================================
    // USER SPECIFIC ENDPOINTS
    // =========================================================================
    
    // Get current user's reviews
    getMyReviews: builder.query<ReviewPaginatedResponse<Review>, ReviewSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        if (searchDto?.sortBy) params.append('sortBy', searchDto.sortBy);
        
        const queryString = params.toString();
        return {
          url: `reviews/my${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'MyReviews' as const, id })),
              { type: 'MyReviews', id: 'LIST' },
            ]
          : [{ type: 'MyReviews', id: 'LIST' }],
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
          data: response.data || response.reviews || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),
    
    // Check if user can review
    canReview: builder.query<
      { canReview: boolean; existingReviewId?: string },
      { restaurantId?: string; menuItemId?: string; orderId?: string }
    >({
      query: ({ restaurantId, menuItemId, orderId }) => {
        const params = new URLSearchParams();
        if (restaurantId) params.append('restaurantId', restaurantId);
        if (menuItemId) params.append('menuItemId', menuItemId);
        if (orderId) params.append('orderId', orderId);
        
        const queryString = params.toString();
        return {
          url: `reviews/can-review${queryString ? `?${queryString}` : ''}`,
        };
      },
    }),
    
    // Mark review as helpful
    markHelpful: builder.mutation<{ success: boolean; helpfulCount: number }, string>({
      query: (reviewId) => ({
        url: `reviews/${reviewId}/helpful`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, reviewId) => [{ type: 'Reviews', id: reviewId }],
    }),
    
    // Report review
    reportReview: builder.mutation<{ success: boolean; reportedCount: number }, { reviewId: string; reason: string }>({
      query: ({ reviewId, reason }) => ({
        url: `reviews/${reviewId}/report`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { reviewId }) => [{ type: 'Reviews', id: reviewId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Review hooks
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useGetRestaurantReviewsQuery,
  useGetMenuItemReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  
  // Statistics hooks
  useGetReviewStatisticsQuery,
  useGetRestaurantReviewStatsQuery,
  useGetMenuItemReviewStatsQuery,
  
  // Response hooks
  useAddReviewResponseMutation,
  useUpdateReviewResponseMutation,
  useDeleteReviewResponseMutation,
  
  // Moderation hooks
  useVerifyReviewMutation,
  useRejectReviewMutation,
  
  // User hooks
  useGetMyReviewsQuery,
  useCanReviewQuery,
  useMarkHelpfulMutation,
  useReportReviewMutation,
} = reviewsApi;