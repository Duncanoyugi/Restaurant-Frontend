import { ApiClient } from '@/shared/utils/api';
import { PaymentMethod } from '@/shared/types/payment';

interface PaymentInitializationData {
  amount: number;
  orderId?: number;
  reservationId?: number;
  roomBookingId?: number;
  method: PaymentMethod;
  customerEmail: string;
  customerName: string;
  currency?: string;
}

export const paymentIntegration = {
  initializePayment: async (
    paymentMethod: string,
    amount: number,
    orderId: string,
    paymentData?: { email?: string; name?: string; orderId?: number; reservationId?: number; roomBookingId?: number }
  ) => {
    switch (paymentMethod) {
      case 'card':
        return await initializeCardPayment(amount, paymentData);
      case 'mpesa':
        return await initializeMpesaPayment(amount, paymentData);
      case 'cash':
        return { success: true, message: 'Cash payment will be collected on delivery', reference: `CASH-${orderId}-${amount}-${Date.now()}` };
      default:
        throw new Error('Invalid payment method');
    }
  },

  verifyPayment: async (paymentMethod: string, reference: string) => {
    switch (paymentMethod) {
      case 'card':
        return await verifyCardPayment(reference);
      case 'mpesa':
        return await verifyMpesaPayment(reference);
      case 'cash':
        return { verified: true, status: 'COMPLETED' };
      default:
        throw new Error('Invalid payment method');
    }
  },
};

const initializeCardPayment = async (
  amount: number,
  paymentData?: { email?: string; name?: string; orderId?: number; reservationId?: number; roomBookingId?: number }
) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const paymentPayload: PaymentInitializationData = {
      amount: amount,
      method: PaymentMethod.CARD,
      customerEmail: paymentData?.email || user?.email || '',
      customerName: paymentData?.name || user?.first_name 
        ? `${user.first_name} ${user.last_name || ''}` 
        : 'Customer',
      orderId: paymentData?.orderId,
      reservationId: paymentData?.reservationId,
      roomBookingId: paymentData?.roomBookingId,
    };

    const response = await ApiClient.request<{
      success: boolean;
      message?: string;
      data?: {
        authorizationUrl: string;
        accessCode: string;
        reference: string;
        paymentId: string;
      };
    }>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentPayload),
    });

    console.log('Payment initialize response:', response);

    if (!response.success || !response.data?.authorizationUrl) {
      console.error('Payment initialization failed:', response.message);
      throw new Error(response.message || 'Failed to initialize payment');
    }

    console.log('Redirecting to Paystack:', response.data.authorizationUrl);
    return {
      success: true,
      paymentUrl: response.data.authorizationUrl,
      reference: response.data.reference,
      accessCode: response.data.accessCode,
    };
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize payment');
  }
};

const initializeMpesaPayment = async (
  amount: number,
  paymentData?: { email?: string; name?: string; orderId?: number; reservationId?: number; roomBookingId?: number }
) => {
  return {
    success: true,
    stkPushSent: true,
    reference: `MPESA-${paymentData?.orderId || 'unknown'}-${amount}-${Date.now()}`,
  };
};

const verifyCardPayment = async (reference: string) => {
  try {
    const response = await ApiClient.request<{
      success: boolean;
      message?: string;
      data?: {
        status: string;
        paymentId: string;
        amount: number;
        paidAt?: string;
        reference: string;
      };
    }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ reference }),
    });

    return {
      verified: response.success && response.data?.status === 'success',
      status: response.data?.status || 'pending',
      reference: reference,
      amount: response.data?.amount,
      paidAt: response.data?.paidAt,
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { verified: false, status: 'failed', reference };
  }
};

const verifyMpesaPayment = async (reference: string) => {
  return { verified: true, status: 'COMPLETED', reference };
};

export default paymentIntegration;