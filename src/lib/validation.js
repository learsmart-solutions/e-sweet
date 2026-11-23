const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "");

export const isValidEmail = (value = "") => EMAIL_PATTERN.test(value.trim());

export const isValidPhone = (value = "") =>
  /^\+?\d{10,15}$/.test(normalizePhone(value));

export const getEmailError = (value = "") => {
  if (!value.trim()) return "Enter your email address.";
  if (!isValidEmail(value)) return "Enter a valid email address.";
  return "";
};

export const getPhoneError = (value = "") => {
  if (!value.trim()) return "Enter your phone number.";
  if (!isValidPhone(value)) return "Enter a valid phone number.";
  return "";
};

export const getNameError = (value = "") =>
  value.trim().length < 2 ? "Enter your full name." : "";

export const getPasswordError = (value = "", isSignup = false) => {
  if (!value) return "Enter your password.";
  if (isSignup && value.length < 6)
    return "Use at least 6 characters for your password.";
  return "";
};

export const getConfirmPasswordError = (password, confirmation) => {
  if (!confirmation) return "Confirm your password.";
  if (password !== confirmation) return "Passwords do not match.";
  return "";
};
