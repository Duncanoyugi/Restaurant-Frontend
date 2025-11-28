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

type LoginStep = 'credentials' | 'otp';

const LoginForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [requiresOtp, setRequiresOtp] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      const response = await login(formData).unwrap();
      
      // Check if OTP is required (first-time login or email not verified)
      if (response.requiresOtp || !response.user.emailVerified) {
        // User needs to verify OTP
        setRequiresOtp(true);
        setCurrentStep('otp');
      } else {
        // Regular login successful
        dispatch(setCredentials({
          ...response,
          user: {
            ...response.user,
            role: response.user.role as any,
          },
        }));
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle different error scenarios
      if (error?.data?.requiresOtp) {
        setRequiresOtp(true);
        setCurrentStep('otp');
      } else {
        setErrors({
          email: error?.data?.message || 'Login failed',
          password: '',
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        className="w-full"
      >
        Sign in
      </Button>

      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;