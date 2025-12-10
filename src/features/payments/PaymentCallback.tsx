import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyPaymentMutation, useGetPaymentByReferenceQuery } from './paymentsApi';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Button from '../../components/ui/Button';

interface PaymentCallbackProps {
    reference: string;
    onSuccess?: (paymentData: any) => void;
    onError?: (error: any) => void;
    redirectOnSuccess?: boolean;
    redirectDelay?: number;
    className?: string;
}

const PaymentCallback: React.FC<PaymentCallbackProps> = ({
    reference,
    onSuccess,
    onError,
    redirectOnSuccess = true,
    redirectDelay = 3000,
    className = ''
}) => {
    const navigate = useNavigate();
    const [verifyPayment, { isLoading: isVerifying, isError: verifyError, isSuccess: verifySuccess }] = useVerifyPaymentMutation();
    const { data: paymentData, isLoading: isFetchingPayment } = useGetPaymentByReferenceQuery(reference || '', {
        skip: !verifySuccess || !reference,
    });

    const [verificationTried, setVerificationTried] = useState(false);

    useEffect(() => {
        if (reference && !verificationTried) {
            verifyPayment({ reference });
            setVerificationTried(true);
        }
    }, [reference, verifyPayment, verificationTried]);

    useEffect(() => {
        if (verifySuccess && paymentData) {
            onSuccess?.(paymentData);

            if (redirectOnSuccess) {
                const timer = setTimeout(() => {
                    // Determine redirect based on payment type
                    let redirectPath = '/dashboard';

                    if (paymentData.orderId) {
                        // Food order payment - redirect to orders
                        redirectPath = '/dashboard/orders';
                    } else if (paymentData.reservationId) {
                        // Table reservation payment - redirect to reservations
                        redirectPath = '/dashboard/reservations';
                    } else if (paymentData.roomBookingId) {
                        // Room booking payment - redirect to room bookings
                        redirectPath = '/dashboard/room-bookings';
                    } else {
                        // Check metadata or session storage for payment type
                        const pendingBooking = sessionStorage.getItem('pendingRoomBooking');
                        if (pendingBooking) {
                            redirectPath = '/dashboard/room-bookings';
                            sessionStorage.removeItem('pendingRoomBooking');
                        } else {
                            // Default fallback to dashboard
                            redirectPath = '/dashboard';
                        }
                    }

                    navigate(redirectPath);
                }, redirectDelay);
                return () => clearTimeout(timer);
            }
        }
    }, [verifySuccess, paymentData, navigate, onSuccess, redirectOnSuccess, redirectDelay]);

    useEffect(() => {
        if (verifyError) {
            onError?.(verifyError);
        }
    }, [verifyError, onError]);

    if (!reference) {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center ${className}`}>
                <div className="text-red-500 text-6xl mb-4 flex justify-center">
                    <FaTimesCircle />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Reference</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No payment reference was found.
                </p>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Go Home
                </Button>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center ${className}`}>
            {(isVerifying || (verifySuccess && isFetchingPayment)) && (
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <FaSpinner className="animate-spin text-primary-600 text-6xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verifying Payment...</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we confirm your payment status.
                    </p>
                </div>
            )}

            {verifySuccess && paymentData && (
                <div className="space-y-4">
                    <div className="text-green-500 text-6xl mb-4 flex justify-center">
                        <FaCheckCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful!</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your payment has been verified. {redirectOnSuccess ? 'Redirecting you to your dashboard...' : ''}
                    </p>
                </div>
            )}

            {verifyError && (
                <div className="space-y-4">
                    <div className="text-red-500 text-6xl mb-4 flex justify-center">
                        <FaTimesCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We couldn't verify your payment. Please contact support if you believe this is an error.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button variant="outline" onClick={() => navigate('/checkout')}>
                            Back to Checkout
                        </Button>
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentCallback;
