import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyPaymentMutation, useGetPaymentByReferenceQuery } from '../features/payments/paymentsApi';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { getPaymentRedirectPath } from '../features/payments/paymentRedirect';

const PaymentVerificationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');

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
            // Redirect based on payment type after a short delay
            const timer = setTimeout(() => {
                navigate(getPaymentRedirectPath(paymentData));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [verifySuccess, paymentData, navigate]);

    if (!reference) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4 flex justify-center">
                        <FaTimesCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Reference</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        No payment reference was found in the URL.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Go Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
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
                            Your payment has been verified. Redirecting you to your dashboard...
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
        </div>
    );
};

export default PaymentVerificationPage;
