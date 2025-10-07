// Validate email
export const validateEmail = (email) => {
  if (email.trim()) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  return false;
};

// Validate password: at least 8 chars, 1 uppercase, 1 special character
export const validatePassword = (password) => {
  if (password.trim()) {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  }
  return false;
};
