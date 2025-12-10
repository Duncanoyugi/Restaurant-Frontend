import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentCallback from '../features/payments/PaymentCallback';

const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <PaymentCallback
        reference={reference || ''}
        redirectOnSuccess={true}
        redirectDelay={3000}
        className="w-full max-w-md"
      />
    </div>
  );
};

export default PaymentCallbackPage;
