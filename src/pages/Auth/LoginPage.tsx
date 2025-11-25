import React from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import LoginForm from '../../features/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Welcome back! Please enter your details."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;