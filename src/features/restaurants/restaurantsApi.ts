// src/features/restaurants/restaurantsApi.ts
import { baseApi } from '../../utils/baseApi';

export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    cuisineType?: string;
    priceRange?: string;
    rating?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface RestaurantSearchParams {
    name?: string;
    cuisineType?: string;
    priceRange?: string;
    active?: boolean;
    page?: number;
    limit?: number;
}

export const restaurantsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all restaurants
        getAllRestaurants: builder.query<{ data: Restaurant[]; total: number }, RestaurantSearchParams | void>({
            query: (params) => {
                const searchParams = params || {};
                const queryParams = new URLSearchParams();
                if (searchParams.name) queryParams.append('name', searchParams.name);
                if (searchParams.cuisineType) queryParams.append('cuisineType', searchParams.cuisineType);
                if (searchParams.priceRange) queryParams.append('priceRange', searchParams.priceRange);
                if (searchParams.active !== undefined) queryParams.append('active', String(searchParams.active));
                if (searchParams.page) queryParams.append('page', String(searchParams.page));
                if (searchParams.limit) queryParams.append('limit', String(searchParams.limit));

                const queryString = queryParams.toString();
                return {
                    url: `restaurants${queryString ? `?${queryString}` : ''}`,
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Restaurants' as const, id })),
                        { type: 'Restaurants', id: 'LIST' },
                    ]
                    : [{ type: 'Restaurants', id: 'LIST' }],
            transformResponse: (response: any) => {
                if (Array.isArray(response)) {
                    return { data: response, total: response.length };
                }
                return {
                    data: response.data || [],
                    total: response.total || 0,
                };
            },
        }),

        // Get restaurant by ID
        getRestaurantById: builder.query<Restaurant, string>({
            query: (id) => `restaurants/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Restaurants', id }],
        }),

        // Create restaurant
        createRestaurant: builder.mutation<Restaurant, Partial<Restaurant>>({
            query: (data) => ({
                url: 'restaurants',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Restaurants', id: 'LIST' }],
        }),

        // Update restaurant
        updateRestaurant: builder.mutation<Restaurant, { id: string; data: Partial<Restaurant> }>({
            query: ({ id, data }) => ({
                url: `restaurants/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Restaurants', id },
                { type: 'Restaurants', id: 'LIST' },
            ],
        }),

        // Delete restaurant
        deleteRestaurant: builder.mutation<void, string>({
            query: (id) => ({
                url: `restaurants/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Restaurants', id },
                { type: 'Restaurants', id: 'LIST' },
            ],
        }),

        // Get restaurant statistics
        getRestaurantStatistics: builder.query<any, string>({
            query: (id) => `restaurants/${id}/statistics`,
            providesTags: (_result, _error, id) => [{ type: 'RestaurantStatistics', id }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllRestaurantsQuery,
    useGetRestaurantByIdQuery,
    useCreateRestaurantMutation,
    useUpdateRestaurantMutation,
    useDeleteRestaurantMutation,
    useGetRestaurantStatisticsQuery,
} = restaurantsApi;
