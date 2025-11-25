import React, { useState } from 'react';
import Input from './input';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        error={error}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordInput;