export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePhone = (phone: string): boolean => {
  // Allows +254712345678, 0712345678, (071) 2345678, 071-234-5678
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(phone);
};
