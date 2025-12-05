import React, { useState } from 'react';
import { useRegisterMutation } from '../../features/auth/authApi';
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';
import Input from '../ui/input';
import PasswordInput from '../ui/PasswordInput';
import Button from '../ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Customer',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register(formData).unwrap();
      setIsSuccess(true);
      showToast('Registration successful! Please check your email for verification.', 'success');
      
      // ✅ CORRECTED: Redirect to OTP verification page instead of login
      setTimeout(() => {
        navigate('/verify-otp', { 
          state: { 
            email: formData.email 
          } 
        });
      }, 2000);
      
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Registration failed';
      setErrors(prev => ({
        ...prev,
        email: errorMessage,
      }));
      showToast(errorMessage, 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Registration Successful!</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We've sent a verification code to your email.<br />
          Redirecting to verification...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          type="text"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter your full name"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

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

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          placeholder="Enter your phone number"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          placeholder="Create a password"
          className="w-full px-4 py-3 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
          >
            <option value="Customer">Customer</option>
            <option value="Restaurant Owner">Restaurant Owner</option>
            <option value="Driver">Driver</option>
            <option value="Restaurant Staff">Restaurant Staff</option>
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
      </Button>

      <div className="text-center text-sm pt-4 border-t border-gray-200 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;