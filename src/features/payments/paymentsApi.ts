// src/features/payments/paymentsApi.ts
import { baseApi } from '../../utils/baseApi';
import type {
  Payment,
  CreatePaymentRequest,
  InitializePaymentResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  PaymentListResponse,
  UpdatePaymentRequest,
  RefundResponse,
} from '../../types/payment';

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initialize payment
    initializePayment: builder.mutation<InitializePaymentResponse, CreatePaymentRequest>({
      query: (paymentData) => ({
        url: 'payments/initialize',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment', 'MyPayments'],
    }),

    // Verify payment
    verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: (verificationData) => ({
        url: 'payments/verify',
        method: 'POST',
        body: verificationData,
      }),
      invalidatesTags: ['Payment', 'MyPayments', 'Orders', 'Reservations', 'RoomBookings'],
    }),

    // Get all payments (Admin only)
    getAllPayments: builder.query<PaymentListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: 'payments',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Payment'],
    }),

    // Get payment by ID
    getPaymentById: builder.query<Payment, string>({
      query: (id) => ({
        url: `payments/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Payment', id }],
    }),

    // Get payment by reference
    getPaymentByReference: builder.query<Payment, string>({
      query: (reference) => ({
        url: `payments/reference/${reference}`,
        method: 'GET',
      }),
      providesTags: (result) => [{ type: 'Payment', id: result?.id }],
    }),

    // Get user payment history
    getUserPayments: builder.query<Payment[], string>({
      query: (userId) => ({
        url: `payments/user/${userId}`,
        method: 'GET',
      }),
      providesTags: ['MyPayments'],
    }),

    // Get current user payment history
    getMyPayments: builder.query<Payment[], void>({
      query: () => ({
        url: 'payments/my-payments',
        method: 'GET',
      }),
      providesTags: ['MyPayments'],
    }),

    // Get restaurant payments (Restaurant Owner only)
    getRestaurantPayments: builder.query<Payment[], void>({
      query: () => ({
        url: 'payments/restaurant/my-payments',
        method: 'GET',
      }),
      providesTags: ['Payment', 'MyRestaurantOrders'],
    }),

    // Update payment (Admin only)
    updatePayment: builder.mutation<Payment, { id: string; data: UpdatePaymentRequest }>({
      query: ({ id, data }) => ({
        url: `payments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Payment', id },
        'Payment',
      ],
    }),

    // Delete payment (Admin only)
    deletePayment: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment'],
    }),

    // Initiate refund (Admin & Restaurant Owner)
    initiateRefund: builder.mutation<RefundResponse, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `payments/${id}/refund`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Payment', id },
        'Payment',
        'MyPayments',
      ],
    }),

    // Get invoice (placeholder for PDF generation)
    getInvoice: builder.query<any, string>({
      query: (id) => ({
        url: `payments/${id}/invoice`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentByReferenceQuery,
  useGetUserPaymentsQuery,
  useGetMyPaymentsQuery,
  useGetRestaurantPaymentsQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useInitiateRefundMutation,
  useGetInvoiceQuery,
} = paymentsApi;

export { default as PaymentCallback } from './PaymentCallback';
