// Utility helpers to determine where to send the user after a successful payment
// (order vs reservation vs room booking). The backend may or may not populate
// relation objects (payment.order/payment.reservation/payment.roomBooking) and may
// store metadata as a JSON string, so we normalize multiple shapes.

export type PaymentRedirectPath =
  | '/dashboard/orders'
  | '/dashboard/reservations'
  | '/dashboard/room-bookings'
  | '/dashboard';

export function parsePaymentMetadata(metadata: unknown): Record<string, any> {
  if (!metadata) return {};
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, any>) : {};
    } catch {
      return {};
    }
  }
  if (typeof metadata === 'object') return metadata as Record<string, any>;
  return {};
}

function getMetadataPaymentType(metadata: Record<string, any>): string | undefined {
  // Backend uses paymentType, Paystack payload may use payment_type.
  return (
    metadata.paymentType ||
    metadata.payment_type ||
    metadata.type ||
    metadata.paymentTypeEnum
  );
}

export function getPaymentRedirectPath(paymentData: any): PaymentRedirectPath {
  const metadata = parsePaymentMetadata(paymentData?.metadata);
  const paymentType = getMetadataPaymentType(metadata);

  const hasOrder = Boolean(paymentData?.order || paymentData?.orderId || metadata.orderId);
  const hasReservation = Boolean(
    paymentData?.reservation || paymentData?.reservationId || metadata.reservationId
  );
  const hasRoomBooking = Boolean(
    paymentData?.roomBooking || paymentData?.roomBookingId || metadata.roomBookingId
  );

  if (hasOrder || paymentType === 'order') return '/dashboard/orders';
  if (hasReservation || paymentType === 'reservation') return '/dashboard/reservations';
  if (hasRoomBooking || paymentType === 'room_booking') return '/dashboard/room-bookings';

  // Default fallback
  return '/dashboard';
}

