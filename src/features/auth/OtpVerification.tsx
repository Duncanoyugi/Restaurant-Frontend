import React, { useState, useEffect, useRef } from 'react';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../api/authApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from './authSlice';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface OtpVerificationProps {
  email: string;
  onBackToLogin: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onBackToLogin }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pastedDigits.length === 6) {
      const newOtp = [...otp];
      pastedDigits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
      setError('');
      
      // Focus the last input
      inputRefs.current[5]?.focus();
      
      // Auto-submit
      setTimeout(() => handleVerifyOtp(newOtp.join('')), 100);
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const otpValue = otpCode || otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    try {
      const response = await verifyOtp({ email, otp: otpValue }).unwrap();
      dispatch(setCredentials({
        ...response,
        user: {
          ...response.user,
          role: response.user.role as any,
        },
      }));
      navigate('/dashboard');
    } catch (error: any) {
      setError(error?.data?.message || 'Invalid OTP code. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      await resendOtp({ email }).unwrap();
      setCountdown(60); // 60 seconds countdown
      setError('');
    } catch (error: any) {
      setError(error?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Verify Your Email</h3>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a 6-digit verification code to<br />
          <strong>{email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        {/* OTP Inputs */}
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Verify Button */}
        <Button
          type="button"
          variant="primary"
          loading={isLoading}
          disabled={!isOtpComplete || isLoading}
          className="w-full"
          onClick={() => handleVerifyOtp()}
        >
          Verify OTP
        </Button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            {countdown > 0 ? (
              <span className="text-gray-500">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm font-medium text-gray-600 hover:text-gray-500"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;