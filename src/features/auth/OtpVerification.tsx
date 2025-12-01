import React, { useState, useEffect, useRef } from 'react';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../api/authApi';
import Button from '../../components/ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

interface OtpVerificationProps {
  email: string;
  onBackToLogin?: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onBackToLogin }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Get email from location state if not provided via props
  const userEmail = email || location.state?.email;

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
      // Send otpCode instead of otp to match backend DTO
      await verifyOtp({ 
        email: userEmail, 
        otpCode: otpValue  // Changed from 'otp' to 'otpCode'
      }).unwrap();
      
      showToast('Email verified successfully! Please login to continue.', 'success');
      navigate('/login', { 
        state: { 
          email: userEmail,
          message: 'Email verified successfully! Please login to continue.'
        } 
      });
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
      await resendOtp({ email: userEmail }).unwrap();
      setCountdown(60); // 60 seconds countdown
      setError('');
      showToast('OTP resent successfully!', 'success');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Verify Your Email</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-digit verification code to<br />
          <strong>{userEmail}</strong>
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
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the code?{' '}
            {countdown > 0 ? (
              <span className="text-gray-500 dark:text-gray-400">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </p>
        </div>

        {/* Back to Login - Only show if onBackToLogin prop is provided */}
        {onBackToLogin && (
          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;