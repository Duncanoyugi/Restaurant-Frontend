// src/types/menu.ts

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  imageUrl: string;
  available: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  preparationTime: number;
  calories?: number;
  allergens: string[];
  restaurantId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;

  // Optional relations
  restaurant?: any;
  category?: string;
  reviews?: any[];
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  restaurantId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Optional relations
  menuItems?: MenuItem[];
  restaurant?: any;
};

// Request DTOs
export type CreateMenuItemDto = {
  name: string;
  description: string;
  ingredients: string;
  price: number;
  imageUrl: string;
  available?: boolean;
  isFeatured?: boolean;
  preparationTime: number;
  calories?: number;
  allergens?: string[];
  restaurantId: string;
  categoryId: string;
};

export type UpdateMenuItemDto = Partial<CreateMenuItemDto>;

export type CreateCategoryDto = {
  name: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  sortOrder?: number;
  restaurantId?: string;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export type BulkMenuItemsDto = {
  items: CreateMenuItemDto[];
};

// Search DTOs
export type MenuSearchDto = {
  restaurantId?: string;
  categoryId?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
};

export type CategorySearchDto = {
  name?: string;
  active?: boolean;
  restaurantId?: string;
};

// Response types
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PriceRangeResponse = {
  min: number;
  max: number;
};

export type MenuStatisticsResponse = {
  totalItems: number;
  availableItems: number;
  featuredItems: number;
  categoriesCount: number;
  priceRange: PriceRangeResponse;
};

export type RestaurantMenuResponse = {
  categories: Category[];
  menuItems: MenuItem[];
};