const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "");

export const isValidEmail = (value = "") => EMAIL_PATTERN.test(value.trim());

// Standard Nigerian mobile numbers:
// - Local format: 11 digits starting with 070, 071, 080, 081, 090, 091
// - International format: +234 or 234 followed by 70, 71, 80, 81, 90, 91 and
//   8 digits. People often keep the leading 0 after the country code
//   (+234 0803 123 4567), so that is accepted too.
export const isValidPhone = (value = "") =>
  /^(?:\+?2340?|0)[789][01]\d{8}$/.test(normalizePhone(value));

export const getEmailError = (value = "") => {
  if (!value.trim()) return "Enter your email address.";
  if (!isValidEmail(value)) return "Enter a valid email address.";
  return "";
};

export const getPhoneError = (value = "") => {
  if (!value.trim()) return "Enter your phone number.";
  if (!isValidPhone(value))
    return "Enter a valid Nigerian phone number (e.g. 0803 123 4567).";
  return "";
};

export const getNameError = (value = "") =>
  value.trim().length < 2 ? "Enter your full name." : "";

// Shown under the signup password field, so people see every rule before
// they type rather than discovering them one error at a time.
export const PASSWORD_HINT =
  "At least 8 characters, with a capital letter and a symbol.";

export const getPasswordError = (value = "", isSignup = false) => {
  if (!value) return "Enter your password.";
  if (isSignup) {
    if (value.length < 8) return "Use at least 8 characters for your password.";
    if (!/[A-Z]/.test(value))
      return "Password must contain at least one uppercase letter.";
    if (!/[^A-Za-z0-9]/.test(value))
      return "Password must contain at least one special character.";
  }
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
