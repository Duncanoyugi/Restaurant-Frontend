import React from 'react';
import AuthLayout from '@/shared/layouts/AuthLayout';
import RegisterForm from '@/modules/auth/components/RegisterForm';

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