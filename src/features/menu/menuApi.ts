// src/features/menu/menuApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  MenuItem,
  Category,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  BulkMenuItemsDto,
  MenuSearchDto,
  CategorySearchDto,
  PaginatedResponse,
  PriceRangeResponse,
  MenuStatisticsResponse,
  RestaurantMenuResponse,
} from '../../types/menu';

export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // CATEGORY ENDPOINTS
    // =========================================================================
    
    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (data) => ({
        url: 'menu/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    
    getCategories: builder.query<Category[], CategorySearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.name) params.append('name', searchDto.name);
        if (searchDto?.active !== undefined) params.append('active', searchDto.active.toString());
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        
        const queryString = params.toString();
        return {
          url: `menu/categories${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Categories' as const, id })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),
    
    getCategoryById: builder.query<Category, string>({
      query: (id) => `menu/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Categories', id }],
    }),
    
    updateCategory: builder.mutation<Category, { id: string; data: UpdateCategoryDto }>({
      query: ({ id, data }) => ({
        url: `menu/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),
    
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `menu/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),
    
    // =========================================================================
    // MENU ITEM ENDPOINTS
    // =========================================================================
    
    createMenuItem: builder.mutation<MenuItem, CreateMenuItemDto>({
      query: (data) => ({
        url: 'menu/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MenuItems'],
    }),
    
    createBulkMenuItems: builder.mutation<MenuItem[], BulkMenuItemsDto>({
      query: (data) => ({
        url: 'menu/items/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MenuItems'],
    }),
    
    getMenuItems: builder.query<PaginatedResponse<MenuItem>, MenuSearchDto | void>({
      query: (searchDto = {}) => {
        const params = new URLSearchParams();
        
        if (searchDto?.restaurantId) params.append('restaurantId', searchDto.restaurantId);
        if (searchDto?.categoryId) params.append('categoryId', searchDto.categoryId);
        if (searchDto?.name) params.append('name', searchDto.name);
        if (searchDto?.minPrice !== undefined) params.append('minPrice', searchDto.minPrice.toString());
        if (searchDto?.maxPrice !== undefined) params.append('maxPrice', searchDto.maxPrice.toString());
        if (searchDto?.available !== undefined) params.append('available', searchDto.available.toString());
        if (searchDto?.isFeatured !== undefined) params.append('isFeatured', searchDto.isFeatured.toString());
        if (searchDto?.page) params.append('page', searchDto.page.toString());
        if (searchDto?.limit) params.append('limit', searchDto.limit.toString());
        
        const queryString = params.toString();
        return {
          url: `menu/items${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'MenuItems' as const, id })),
              { type: 'MenuItems', id: 'LIST' },
            ]
          : [{ type: 'MenuItems', id: 'LIST' }],
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
          limit: response.limit || 20,
          totalPages: Math.ceil((response.total || 0) / (response.limit || 20)),
        };
      },
    }),
    
    getMenuItemById: builder.query<MenuItem, string>({
      query: (id) => `menu/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'MenuItems', id }],
    }),
    
    updateMenuItem: builder.mutation<MenuItem, { id: string; data: UpdateMenuItemDto }>({
      query: ({ id, data }) => ({
        url: `menu/items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'MenuItems', id },
        { type: 'MenuItems', id: 'LIST' },
      ],
    }),
    
    toggleMenuItemAvailability: builder.mutation<MenuItem, string>({
      query: (id) => ({
        url: `menu/items/${id}/toggle-availability`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'MenuItems', id },
        { type: 'MenuItems', id: 'LIST' },
      ],
    }),
    
    deleteMenuItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `menu/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'MenuItems', id },
        { type: 'MenuItems', id: 'LIST' },
      ],
    }),
    
    // =========================================================================
    // RESTAURANT-SPECIFIC ENDPOINTS
    // =========================================================================
    
    getRestaurantMenu: builder.query<RestaurantMenuResponse, { restaurantId: string; categoryId?: string }>({
      query: ({ restaurantId, categoryId }) => {
        const params = new URLSearchParams();
        if (categoryId) params.append('categoryId', categoryId);
        
        const queryString = params.toString();
        return {
          url: `menu/restaurant/${restaurantId}${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'RestaurantMenu', id: restaurantId },
        'MenuItems',
        'Categories',
      ],
    }),
    
    getRestaurantFeaturedItems: builder.query<MenuItem[], { restaurantId: string; limit?: number }>({
      query: ({ restaurantId, limit = 10 }) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        
        return {
          url: `menu/restaurant/${restaurantId}/featured?${params.toString()}`,
        };
      },
      providesTags: (_result, _error, { restaurantId }) => [
        { type: 'RestaurantFeatured', id: restaurantId },
        'MenuItems',
      ],
    }),
    
    getRestaurantPriceRange: builder.query<PriceRangeResponse, string>({
      query: (restaurantId) => `menu/restaurant/${restaurantId}/price-range`,
      providesTags: (_result, _error, restaurantId) => [
        { type: 'RestaurantPriceRange', id: restaurantId },
      ],
    }),
    
    getRestaurantMenuStatistics: builder.query<MenuStatisticsResponse, string>({
      query: (restaurantId) => `menu/restaurant/${restaurantId}/statistics`,
      providesTags: (_result, _error, restaurantId) => [
        { type: 'RestaurantStatistics', id: restaurantId },
      ],
    }),
    
    // =========================================================================
    // SEARCH AND FILTER ENDPOINTS
    // =========================================================================
    
    searchMenuItems: builder.query<MenuItem[], { query: string; restaurantId?: string }>({
      query: ({ query, restaurantId }) => {
        const params = new URLSearchParams();
        params.append('q', query);
        if (restaurantId) params.append('restaurantId', restaurantId);
        
        return {
          url: `menu/search?${params.toString()}`,
        };
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'MenuItems', id }))
          : ['MenuItems'],
    }),
    
    filterMenuItemsByAllergens: builder.query<MenuItem[], { restaurantId: string; allergens: string[] }>({
      query: ({ restaurantId, allergens }) => {
        const params = new URLSearchParams();
        params.append('restaurantId', restaurantId);
        params.append('allergens', allergens.join(','));
        
        return {
          url: `menu/filter/allergens?${params.toString()}`,
        };
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'MenuItems', id }))
          : ['MenuItems'],
    }),
    
    getGlobalFeaturedItems: builder.query<MenuItem[], number | void>({
      query: (limit = 10) => {
        const params = new URLSearchParams();
        // Handle optional parameter properly
        const limitValue = limit || 10;
        params.append('limit', limitValue.toString());
        
        return {
          url: `menu/featured?${params.toString()}`,
        };
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'MenuItems', id }))
          : ['MenuItems'],
    }),
    
    // =========================================================================
    // RESTAURANT OWNER SPECIFIC ENDPOINTS
    // =========================================================================
    
    getMyRestaurantMenu: builder.query<RestaurantMenuResponse, void>({
      query: () => 'menu/my-restaurant/menu',
      providesTags: ['MyRestaurantMenu', 'MenuItems', 'Categories'],
    }),
    
    getMyRestaurantStatistics: builder.query<MenuStatisticsResponse, void>({
      query: () => 'menu/my-restaurant/statistics',
      providesTags: ['MyRestaurantStatistics'],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Category hooks
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  
  // Menu item hooks
  useCreateMenuItemMutation,
  useCreateBulkMenuItemsMutation,
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,
  useDeleteMenuItemMutation,
  
  // Restaurant-specific hooks
  useGetRestaurantMenuQuery,
  useGetRestaurantFeaturedItemsQuery,
  useGetRestaurantPriceRangeQuery,
  useGetRestaurantMenuStatisticsQuery,
  
  // Search and filter hooks
  useSearchMenuItemsQuery,
  useFilterMenuItemsByAllergensQuery,
  useGetGlobalFeaturedItemsQuery,
  
  // Restaurant owner hooks
  useGetMyRestaurantMenuQuery,
  useGetMyRestaurantStatisticsQuery,
} = menuApi;