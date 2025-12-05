export const PaymentMethod = {
  CARD: 'card',
  BANK: 'bank',
  USSD: 'ussd',
  MOBILE_MONEY: 'mobile_money',
  BANK_TRANSFER: 'bank_transfer',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentType = {
  ORDER: 'order',
  RESERVATION: 'reservation',
  ROOM_BOOKING: 'room_booking',
  GENERAL: 'general',
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

export interface Payment {
  id: string;
  userId: string;
  orderId?: string;
  reservationId?: string;
  roomBookingId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  accessCode?: string;
  authorizationUrl?: string;
  customerEmail: string;
  customerName: string;
  channel?: string;
  gatewayResponse?: string;
  paidAt?: string;
  metadata?: Record<string, any>;
  invoices: Invoice[];
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  paymentId: string;
  invoiceNumber: string;
  issuedAt: string;
  sentAt: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  userId: string;
  orderId?: string;
  reservationId?: string;
  roomBookingId?: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  customerEmail: string;
  customerName: string;
  callbackUrl?: string;
}

export interface InitializePaymentResponse {
  success: boolean;
  message: string;
  data: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
    paymentId: string;
  };
}

export interface VerifyPaymentRequest {
  reference: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    status: PaymentStatus;
    paymentId: string;
    amount: number;
    paidAt?: string;
    reference: string;
  };
}

export interface PaymentListResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus;
  gatewayResponse?: string;
  channel?: string;
  paidAt?: string;
}

export interface RefundResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface WebhookEvent {
  event: string;
  data: Record<string, any>;
}