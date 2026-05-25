export type ReviewSortBy = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Constants for better IntelliSense
export const ReviewSortByEnum = {
  NEWEST: 'newest' as ReviewSortBy,
  OLDEST: 'oldest' as ReviewSortBy,
  HIGHEST_RATING: 'highest_rating' as ReviewSortBy,
  LOWEST_RATING: 'lowest_rating' as ReviewSortBy,
};

export const ReviewStatusEnum = {
  PENDING: 'PENDING' as ReviewStatus,
  APPROVED: 'APPROVED' as ReviewStatus,
  REJECTED: 'REJECTED' as ReviewStatus,
};

// Core types
export type Review = {
  id: string;
  userId: string;
  restaurantId?: string;
  menuItemId?: string;
  orderId?: string;
  rating: number;
  comment: string;
  images: string[];
  status: ReviewStatus;
  verified: boolean;
  adminResponse?: string;
  responseDate?: string;
  helpfulCount: number;
  reportedCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  
  // Relations
  user?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  restaurant?: {
    id: string;
    name: string;
  };
  menuItem?: {
    id: string;
    name: string;
  };
  order?: {
    id: string;
    orderNumber: string;
  };
};

export type ReviewResponse = {
  id: string;
  reviewId: string;
  adminId: string;
  response: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  review?: Review;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
};

// Request DTOs
export type CreateReviewDto = {
  restaurantId?: string;
  menuItemId?: string;
  orderId?: string;
  rating: number;
  comment: string;
  images?: string[];
};

export type UpdateReviewDto = {
  rating?: number;
  comment?: string;
  images?: string[];
  status?: ReviewStatus;
};

export type CreateReviewResponseDto = {
  reviewId: string;
  response: string;
};

export type UpdateReviewResponseDto = {
  response: string;
};

export type ReviewQueryDto = {
  page?: number;
  limit?: number;
  sortBy?: ReviewSortBy;
  minRating?: number;
  maxRating?: number;
  search?: string;
  hasImages?: boolean;
  verified?: boolean;
  status?: ReviewStatus;
  userId?: string;
  restaurantId?: string;
  menuItemId?: string;
};

// Search DTOs
export type ReviewSearchDto = ReviewQueryDto;

// Response types
export type ReviewPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ReviewStatistics = {
  totalReviews: number;
  averageRating: number;
  reviewsWithImages: number;
  verifiedReviews: number;
  ratingDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  monthlyTrend?: Array<{
    month: string;
    count: number;
    averageRating: number;
  }>;
};

export type RestaurantReviewStats = {
  restaurantId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  recentReviews: Review[];
};

export type MenuItemReviewStats = {
  menuItemId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
};