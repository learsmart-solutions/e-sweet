import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContainerMark } from "../SiteNav";
import { navigate } from "../../lib/router";
import { useStore } from "../../context/StoreContext";
import FormError from "../FormError";
import {
  getConfirmPasswordError,
  getEmailError,
  getPasswordError,
  getPhoneError,
  getNameError,
} from "../../lib/validation";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6 6 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

const inputClass = (hasError, extra = "") =>
  `${extra} h-11 w-full rounded-xl border bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:ring-1 focus:ring-tomato ${
    hasError
      ? "border-tomato focus:border-tomato"
      : "border-ink/60 focus:border-tomato"
  }`;

const AuthModal = ({ initialMode = "signin", onClose }) => {
  const { signup, login } = useStore();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const isSignup = mode === "signup";

  const clearError = (field) => {
    setError("");
    setErrors((current) => {
      if (!current[field]) return current;
      return { ...current, [field]: "" };
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (isSignup) {
      const nameError = getNameError(name);
      if (nameError) nextErrors.name = nameError;

      const phoneError = getPhoneError(phone);
      if (phoneError) nextErrors.phone = phoneError;

      const confirmError = getConfirmPasswordError(password, confirmPassword);
      if (confirmError) nextErrors.confirmPassword = confirmError;
    }

    const emailError = getEmailError(email);
    if (emailError) nextErrors.email = emailError;

    const passwordError = getPasswordError(password, isSignup);
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  useEffect(() => {
    setMode(initialMode);
    setConfirmPassword("");
    setError("");
    setErrors({});
  }, [initialMode]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const switchMode = () => {
    setMode((current) => (current === "signup" ? "signin" : "signup"));
    setConfirmPassword("");
    setError("");
    setErrors({});
  };

  const finish = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    navigate(next === "checkout" ? "/checkout" : "/menu", { scroll: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!validate()) return;

    if (isSignup) {
      signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      finish();
      return;
    }

    if (!login(email, password)) {
      setError("That email and password do not match. Try again.");
      return;
    }

    finish();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.2, 0.75, 0.2, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100svh-2rem)] w-full max-w-[440px] overflow-y-auto rounded-[20px] bg-cream-light shadow-[0_30px_80px_rgba(30,20,10,0.28)]"
      >
        <div className="relative rounded-t-[20px] bg-tomato px-6 pb-5 pt-5 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <CloseIcon />
          </button>

          <div className="flex items-center gap-2.5 pr-10">
            <ContainerMark />
            <span className="font-logo text-[23px] font-extrabold leading-none tracking-[-0.035em] text-white">
              e&apos;sweet
            </span>
          </div>
          <p
            id="auth-title"
            className="mt-4 max-w-[300px] text-[14px] leading-[1.45] text-white/90"
          >
            Sign in or create an account to place your order.
          </p>
        </div>

        <div className="px-6 py-5">
          <div className="flex rounded-full bg-sand p-1.5">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setConfirmPassword("");
                setError("");
                setErrors({});
              }}
              aria-pressed={!isSignup}
              className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold transition-all ${
                !isSignup
                  ? "bg-cream-light text-ink shadow-[0_4px_12px_rgba(80,50,20,0.1)]"
                  : "text-ink/45 hover:text-ink/70"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setConfirmPassword("");
                setError("");
                setErrors({});
              }}
              aria-pressed={isSignup}
              className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold transition-all ${
                isSignup
                  ? "bg-cream-light text-ink shadow-[0_4px_12px_rgba(80,50,20,0.1)]"
                  : "text-ink/45 hover:text-ink/70"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5">
            {isSignup && (
              <label className="mb-4 block">
                <span className="text-[12px] font-bold text-ink">
                  Full name
                </span>
                <input
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    clearError("name");
                  }}
                  onBlur={() => {
                    const nameError = getNameError(name);
                    if (nameError) {
                      setErrors((current) => ({
                        ...current,
                        name: nameError,
                      }));
                    }
                  }}
                  autoComplete="name"
                  placeholder="Ada Okafor"
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "auth-modal-name-error" : undefined
                  }
                  className={`mt-2 ${inputClass(Boolean(errors.name))}`}
                />
                <FormError id="auth-modal-name-error">{errors.name}</FormError>
              </label>
            )}

            <label className="mb-4 block">
              <span className="text-[12px] font-bold text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearError("email");
                }}
                onBlur={() => {
                  const emailError = getEmailError(email);
                  if (emailError) {
                    setErrors((current) => ({ ...current, email: emailError }));
                  }
                }}
                autoComplete="email"
                placeholder="ada@example.com"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "auth-modal-email-error" : undefined
                }
                className={`mt-2 ${inputClass(Boolean(errors.email))}`}
              />
              <FormError id="auth-modal-email-error">{errors.email}</FormError>
            </label>

            {isSignup && (
              <label className="mb-4 block">
                <span className="text-[12px] font-bold text-ink">Phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    clearError("phone");
                  }}
                  onBlur={() => {
                    const phoneError = getPhoneError(phone);
                    if (phoneError) {
                      setErrors((current) => ({
                        ...current,
                        phone: phoneError,
                      }));
                    }
                  }}
                  autoComplete="tel"
                  placeholder="0803 123 4567"
                  required
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? "auth-modal-phone-error" : undefined
                  }
                  className={`mt-2 ${inputClass(Boolean(errors.phone))}`}
                />
                <FormError id="auth-modal-phone-error">
                  {errors.phone}
                </FormError>
              </label>
            )}

            <label className="block">
              <span className="text-[12px] font-bold text-ink">Password</span>
              <span className="relative mt-2 block">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearError("password");
                    clearError("confirmPassword");
                  }}
                  onBlur={() => {
                    const passwordError = getPasswordError(password, isSignup);
                    if (passwordError) {
                      setErrors((current) => ({
                        ...current,
                        password: passwordError,
                      }));
                    }
                  }}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  required
                  aria-invalid={Boolean(errors.password || error)}
                  aria-describedby={
                    errors.password ? "auth-modal-password-error" : undefined
                  }
                  placeholder="••••••••"
                  className={inputClass(
                    Boolean(errors.password || error),
                    "pr-16",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-tomato"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
              <FormError id="auth-modal-password-error">
                {errors.password}
              </FormError>
            </label>

            {isSignup && (
              <label className="mt-4 block">
                <span className="text-[12px] font-bold text-ink">
                  Confirm password
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    clearError("confirmPassword");
                  }}
                  onBlur={() => {
                    const confirmError = getConfirmPasswordError(
                      password,
                      confirmPassword,
                    );
                    if (confirmError) {
                      setErrors((current) => ({
                        ...current,
                        confirmPassword: confirmError,
                      }));
                    }
                  }}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  required
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword
                      ? "auth-modal-confirm-password-error"
                      : undefined
                  }
                  className={`mt-2 ${inputClass(Boolean(errors.confirmPassword))}`}
                />
                <FormError id="auth-modal-confirm-password-error">
                  {errors.confirmPassword}
                </FormError>
              </label>
            )}

            {error && (
              <p
                aria-live="polite"
                className="mt-2 text-[12px] font-semibold text-tomato"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-tomato px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_4px_0_#a5130c,0_10px_20px_rgba(180,30,20,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
            >
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-center text-[12px] text-ink/50">
            {isSignup ? "Already have one?" : "New here?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-bold text-tomato hover:underline"
            >
              {isSignup ? "Sign in" : "Create account"}
            </button>
          </p>

          <p className="mt-3 text-center text-[10.5px] text-ink/35">
            Prototype: accounts are kept in this browser only.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
