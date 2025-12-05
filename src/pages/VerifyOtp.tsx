import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import OtpVerification from '../components/Forms/OtpVerification';

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    // If no email is provided, redirect to register
    return <Navigate to="/register" replace />;
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <OtpVerification email={email} />
    </AuthLayout>
  );
};

export default VerifyOtp;