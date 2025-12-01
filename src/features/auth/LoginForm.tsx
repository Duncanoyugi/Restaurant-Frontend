import React, { useState } from 'react';
import { useLoginMutation } from '../../api/authApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from './authSlice';
import { validateEmail } from '../../utils/validators';
import Input from '../../components/ui/input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import OtpVerification from './OtpVerification';
import { useToast } from '../../contexts/ToastContext';

type LoginStep = 'credentials' | 'otp';

const LoginForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [requiresOtp, setRequiresOtp] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Create login payload WITHOUT rememberMe
      const loginPayload = {
        email: formData.email,
        password: formData.password
      };

      const response = await login(loginPayload).unwrap();
      
      // Check if OTP is required (first-time login or email not verified)
      if (response.requiresOtp || !response.user.emailVerified) {
        // User needs to verify OTP
        setRequiresOtp(true);
        setCurrentStep('otp');
        showToast('Please verify your email with the OTP code sent to your inbox.', 'info');
      } else {
        // Regular login successful
        dispatch(setCredentials({
          ...response,
          user: {
            ...response.user,
            role: response.user.role as any,
          },
        }));
        
        // Use rememberMe to determine token storage
        if (formData.rememberMe) {
          // Store in localStorage for persistent login
          localStorage.setItem('authToken', String(response.token ?? ''));
          localStorage.setItem('user', JSON.stringify(response.user));
        } else {
          // Store in sessionStorage for session-only login
          sessionStorage.setItem('authToken', String(response.token ?? ''));
          sessionStorage.setItem('user', JSON.stringify(response.user));
        }
        
        showToast('Login successful! Welcome back.', 'success');
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle different error scenarios
      if (error?.data?.requiresOtp) {
        setRequiresOtp(true);
        setCurrentStep('otp');
        showToast('Please verify your email with the OTP code.', 'info');
      } else {
        const errorMessage = error?.data?.message || 'Login failed. Please check your credentials.';
        setErrors({
          email: errorMessage,
          password: '',
        });
        showToast(errorMessage, 'error');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBackToLogin = () => {
    setCurrentStep('credentials');
    setRequiresOtp(false);
  };

  // Render OTP verification step
  if (currentStep === 'otp' && requiresOtp) {
    return (
      <OtpVerification 
        email={formData.email} 
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  // Render credentials step
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Email ID"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="Enter your email address"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          placeholder="Enter your password"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Remember me & Forgot password - side by side */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-600"
          />
          <label 
            htmlFor="remember-me" 
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? 'SIGNING IN...' : 'LOGIN'}
      </Button>

      <div className="text-center text-sm pt-4 border-t border-gray-200 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
        </span>
        <Link
          to="/register"
          className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;