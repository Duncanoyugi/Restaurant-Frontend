// frontend/src/pages/Auth/ResetPasswordPage.tsx - UPDATED
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import PasswordInput from '../components/ui/PasswordInput';
import Input from '../components/ui/input';
import Button from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { useResetPasswordMutation } from '../features/auth/authApi';

const ResetPasswordPage: React.FC = () => {
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast('Reset link is missing the email address.', 'error');
      return;
    }

    if (!otpCode.trim()) {
      showToast('Enter the OTP sent to your email.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long!', 'error');
      return;
    }

    try {
      await resetPassword({
        email,
        otpCode,
        newPassword: password,
      }).unwrap();
      showToast('Password reset successfully! You can now login with your new password.', 'success');
      navigate('/login');
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to reset password', 'error');
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a new password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {email && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Resetting password for: <strong>{email}</strong>
            </p>
          </div>
        )}

        <Input
          label="OTP Code"
          name="otpCode"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          required
          placeholder="Enter the code sent to your email"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        <PasswordInput
          label="New Password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your new password"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm your new password"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
        </Button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Make sure your new password is strong and unique.
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
