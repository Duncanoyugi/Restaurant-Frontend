// src/features/inventory/inventoryApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  InventoryItem,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  InventorySearchResponse,
  InventorySearchRequest,
  SupplierSearchRequest,
  StockTransaction,
  CreateStockTransactionRequest,
  StockAdjustmentRequest,
  StockTransferRequest,
  StockTransferResponse,
  LowStockItem,
  ExpiringItem,
  InventoryValue,
  CategoryBreakdown,
  StockMovementReport,
  InventoryAnalytics,
  MyRestaurantInventorySearchRequest,
} from '../../types/inventory';

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Supplier endpoints
    createSupplier: builder.mutation<Supplier, CreateSupplierRequest>({
      query: (data) => ({
        url: 'inventory/suppliers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Suppliers'],
    }),

    getAllSuppliers: builder.query<Supplier[], SupplierSearchRequest>({
      query: (params = {}) => ({
        url: 'inventory/suppliers',
        method: 'GET',
        params,
      }),
      providesTags: ['Suppliers'],
    }),

    getSupplierById: builder.query<Supplier, string>({
      query: (id) => ({
        url: `inventory/suppliers/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Suppliers', id }],
    }),

    updateSupplier: builder.mutation<Supplier, { id: string; data: UpdateSupplierRequest }>({
      query: ({ id, data }) => ({
        url: `inventory/suppliers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Suppliers', id },
        'Suppliers',
      ],
    }),

    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `inventory/suppliers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Suppliers'],
    }),

    // Inventory Item endpoints
    createInventoryItem: builder.mutation<InventoryItem, CreateInventoryItemRequest>({
      query: (data) => ({
        url: 'inventory/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['InventoryItems', 'LowStockItems', 'InventoryAnalytics'],
    }),

    getAllInventoryItems: builder.query<InventorySearchResponse, InventorySearchRequest>({
      query: (params = {}) => ({
        url: 'inventory/items',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      }),
      providesTags: ['InventoryItems'],
    }),

    getInventoryItemById: builder.query<InventoryItem, string>({
      query: (id) => ({
        url: `inventory/items/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'InventoryItems', id }],
    }),

    updateInventoryItem: builder.mutation<InventoryItem, { id: string; data: UpdateInventoryItemRequest }>({
      query: ({ id, data }) => ({
        url: `inventory/items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'InventoryItems', id },
        'InventoryItems',
        'LowStockItems',
        'InventoryAnalytics',
      ],
    }),

    deleteInventoryItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `inventory/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InventoryItems', 'LowStockItems', 'InventoryAnalytics'],
    }),

    // Stock Transaction endpoints
    createStockTransaction: builder.mutation<{ transaction: StockTransaction; inventoryItem: InventoryItem }, CreateStockTransactionRequest>({
      query: (data) => ({
        url: 'inventory/transactions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'StockTransactions',
        'InventoryItems',
        'LowStockItems',
        'InventoryAnalytics'
      ],
    }),

    getStockTransactions: builder.query<StockTransaction[], { itemId: string; days?: number }>({
      query: ({ itemId, days = 30 }) => ({
        url: `inventory/items/${itemId}/transactions`,
        method: 'GET',
        params: { days },
      }),
      providesTags: ['StockTransactions'],
    }),

    // Stock Management endpoints
    adjustStock: builder.mutation<{ transaction: StockTransaction; inventoryItem: InventoryItem }, StockAdjustmentRequest>({
      query: (data) => ({
        url: 'inventory/adjust-stock',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'StockTransactions',
        'InventoryItems',
        'LowStockItems',
        'InventoryAnalytics'
      ],
    }),

    transferStock: builder.mutation<StockTransferResponse, StockTransferRequest>({
      query: (data) => ({
        url: 'inventory/transfer-stock',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'StockTransactions',
        'InventoryItems',
        'LowStockItems',
        'InventoryAnalytics'
      ],
    }),

    // Analytics and Reporting endpoints
    getLowStockItems: builder.query<LowStockItem[], string>({
      query: (restaurantId) => ({
        url: `inventory/restaurant/${restaurantId}/low-stock`,
        method: 'GET',
      }),
      providesTags: ['LowStockItems'],
    }),

    getExpiringItems: builder.query<ExpiringItem[], { restaurantId: string; days?: number }>({
      query: ({ restaurantId, days = 7 }) => ({
        url: `inventory/restaurant/${restaurantId}/expiring`,
        method: 'GET',
        params: { days },
      }),
      providesTags: ['ExpiringItems'],
    }),

    getInventoryValue: builder.query<InventoryValue, string>({
      query: (restaurantId) => ({
        url: `inventory/restaurant/${restaurantId}/value`,
        method: 'GET',
      }),
      providesTags: ['InventoryAnalytics'],
    }),

    getCategoryBreakdown: builder.query<CategoryBreakdown[], string>({
      query: (restaurantId) => ({
        url: `inventory/restaurant/${restaurantId}/category-breakdown`,
        method: 'GET',
      }),
      providesTags: ['InventoryAnalytics'],
    }),

    getStockMovementReport: builder.query<StockMovementReport, { restaurantId: string; days?: number }>({
      query: ({ restaurantId, days = 30 }) => ({
        url: `inventory/restaurant/${restaurantId}/stock-movement`,
        method: 'GET',
        params: { days },
      }),
      providesTags: ['InventoryAnalytics'],
    }),

    getItemsNeedingReorder: builder.query<InventoryItem[], string>({
      query: (restaurantId) => ({
        url: `inventory/restaurant/${restaurantId}/reorder-items`,
        method: 'GET',
      }),
      providesTags: ['LowStockItems'],
    }),

    // Restaurant-specific endpoints
    getMyRestaurantInventoryItems: builder.query<InventorySearchResponse, MyRestaurantInventorySearchRequest>({
      query: (params = {}) => ({
        url: 'inventory/my-restaurant/items',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      }),
      providesTags: ['MyRestaurantInventory'],
    }),

    getMyRestaurantLowStockItems: builder.query<LowStockItem[], void>({
      query: () => ({
        url: 'inventory/my-restaurant/low-stock',
        method: 'GET',
      }),
      providesTags: ['MyRestaurantLowStock'],
    }),

    getMyRestaurantInventoryAnalytics: builder.query<InventoryAnalytics, void>({
      query: () => ({
        url: 'inventory/my-restaurant/analytics',
        method: 'GET',
      }),
      providesTags: ['MyRestaurantAnalytics'],
    }),

    // Helper methods
    checkItemStock: builder.query<{ isLowStock: boolean; currentQuantity: number; threshold: number }, string>({
      query: (itemId) => ({
        url: `inventory/items/${itemId}/stock-status`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  // Supplier hooks
  useCreateSupplierMutation,
  useGetAllSuppliersQuery,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,

  // Inventory Item hooks
  useCreateInventoryItemMutation,
  useGetAllInventoryItemsQuery,
  useGetInventoryItemByIdQuery,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,

  // Stock Transaction hooks
  useCreateStockTransactionMutation,
  useGetStockTransactionsQuery,

  // Stock Management hooks
  useAdjustStockMutation,
  useTransferStockMutation,

  // Analytics and Reporting hooks
  useGetLowStockItemsQuery,
  useGetExpiringItemsQuery,
  useGetInventoryValueQuery,
  useGetCategoryBreakdownQuery,
  useGetStockMovementReportQuery,
  useGetItemsNeedingReorderQuery,

  // Restaurant-specific hooks
  useGetMyRestaurantInventoryItemsQuery,
  useGetMyRestaurantLowStockItemsQuery,
  useGetMyRestaurantInventoryAnalyticsQuery,

  // Helper hooks
  useCheckItemStockQuery,
} = inventoryApi;