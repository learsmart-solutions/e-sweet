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

// Shows a Nigerian number the way customers write it: 0803 123 4567.
// Numbers in any other shape are returned as they were entered.
export const formatPhone = (value = "") => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("234")) {
    digits = `0${digits.slice(3)}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return value.trim();
};
