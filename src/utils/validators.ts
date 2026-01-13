export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePhone = (phone: string): boolean => {
  // Allow optional leading +, then digits, spaces, dashes, dots, or parentheses
  const charRegex = /^\+?[\d\s\-().]{7,20}$/;
  if (!charRegex.test(phone.trim())) return false;
  
  // Ensure there are between 7 and 15 actual digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};
