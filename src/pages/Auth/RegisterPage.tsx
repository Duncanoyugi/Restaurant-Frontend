import React from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import RegisterForm from '../../features/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join us today! Fill in your details to get started."
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;