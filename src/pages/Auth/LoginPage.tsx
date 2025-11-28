import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import LoginForm from '../../features/auth/LoginForm';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const message = (location.state as any)?.message;

  useEffect(() => {
    if (message) {
      // You can show a toast notification here if you have one
      console.log('Registration message:', message);
    }
  }, [message]);

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle={message || "Welcome back! Please enter your details."}
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;