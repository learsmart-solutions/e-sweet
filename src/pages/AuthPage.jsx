import React, { useState } from "react";
import BrandLogo from "../components/BrandLogo";
import { Link, navigate } from "../lib/router";
import { useStore } from "../context/StoreContext";
import FormError from "../components/FormError";
import {
  getConfirmPasswordError,
  getEmailError,
  getPasswordError,
  getPhoneError,
  getNameError,
  getReferralCodeError,
  PASSWORD_HINT,
} from "../lib/validation";
import jollofImg from "../assets/menu/smoky-jollof.png";
import yamImg from "../assets/menu/pounded-yam.png";
import zoboImg from "../assets/menu/chilled-zobo.png";

const copy = {
  signup: {
    eyebrow: "Your table is waiting.",
    intro:
      "Create an account once, then order jollof, suya and soups for pickup or delivery in a few taps.",
    notice: "Sign up to see the menu and start ordering.",
    title: "Create your account",
    subtitle: "New here? Sign up to see the menu and place your first order.",
    button: "Create account",
    switchPrompt: "Already have an account?",
    switchAction: "Log in",
    switchTo: "/login",
  },
  login: {
    eyebrow: "Good to see you again.",
    intro: "Log in and your usual is one tap away. The kitchen is warming up.",
    notice: "Please log in before you order.",
    title: "Welcome back",
    subtitle: "Log in to your e'sweet account to see the menu and order.",
    button: "Log in",
    switchPrompt: "New to e'sweet?",
    switchAction: "Sign up",
    switchTo: "/signup",
  },
};

const inputClass = (hasError, extra = "") =>
  `${extra} h-11 w-full rounded-xl border bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:ring-1 focus:ring-tomato ${
    hasError
      ? "border-tomato focus:border-tomato"
      : "border-ink focus:border-tomato"
  }`;

const AuthPage = ({ mode = "signup" }) => {
  const isSignup = mode === "signup";
  const content = copy[mode];
  const { signup, login } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage.getItem("esweet-pending-referral") || "";
    } catch {
      return "";
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

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

      const referralError = getReferralCodeError(referralCode);
      if (referralError) nextErrors.referralCode = referralError;
    }

    const emailError = getEmailError(email);
    if (emailError) nextErrors.email = emailError;

    const passwordError = getPasswordError(password, isSignup);
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
        referralCode: referralCode.trim(),
      });
      navigate("/menu");
      return;
    }

    if (!login(email, password)) {
      setError("That email and password do not match. Try again.");
      return;
    }

    navigate("/menu");
  };

  return (
    <div className="grid min-h-svh bg-cream lg:grid-cols-[46%_54%]">
      <aside className="relative overflow-hidden bg-tomato px-5 py-6 text-white lg:flex lg:flex-col lg:px-12 lg:py-10">
        <Link to="/" className="relative z-10 flex items-center">
          <BrandLogo className="h-[28px] w-auto" light />
        </Link>

        <div className="relative z-10 mt-8 max-w-[490px] lg:mt-24">
          <h1 className="font-display text-[clamp(2.15rem,9vw,2.8rem)] font-black leading-[0.94] tracking-[-0.055em] lg:text-[clamp(3rem,5vw,4.7rem)] lg:leading-[0.9] lg:tracking-[-0.065em]">
            {content.eyebrow}
          </h1>
          <p className="mt-3 max-w-[430px] text-[14px] leading-[1.55] text-white/80 lg:mt-6 lg:text-[15px] lg:leading-[1.65] lg:text-white/75">
            {content.intro}
          </p>
        </div>

        <div className="relative mt-auto hidden h-[250px] w-full max-w-[620px] lg:block">
          <img
            src={jollofImg}
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-[44%] rotate-[-8deg] drop-shadow-[0_24px_28px_rgba(80,10,5,0.22)]"
          />
          <img
            src={yamImg}
            alt=""
            aria-hidden="true"
            className="absolute bottom-[13%] left-[40%] w-[23%] rotate-[7deg] drop-shadow-[0_18px_22px_rgba(80,10,5,0.18)]"
          />
          <img
            src={zoboImg}
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-[64%] w-[19%] rotate-[4deg] drop-shadow-[0_16px_20px_rgba(80,10,5,0.2)]"
          />
        </div>
      </aside>

      <main className="flex min-h-svh flex-col px-5 pb-24 pt-6 sm:px-8 lg:px-16 lg:pb-10 lg:pt-10">
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-ink/70 transition-colors hover:text-tomato"
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-8 lg:py-10">
          <div className="flex rounded-full bg-sand p-1.5">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              aria-pressed={isSignup}
              className={`flex-1 rounded-full py-2.5 text-[13px] font-bold transition-all ${
                isSignup
                  ? "bg-cream-light text-ink shadow-[0_4px_12px_rgba(80,50,20,0.1)]"
                  : "text-ink/45 hover:text-ink/70"
              }`}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              aria-pressed={!isSignup}
              className={`flex-1 rounded-full py-2.5 text-[13px] font-bold transition-all ${
                !isSignup
                  ? "bg-cream-light text-ink shadow-[0_4px_12px_rgba(80,50,20,0.1)]"
                  : "text-ink/45 hover:text-ink/70"
              }`}
            >
              Log in
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-[#efb544] bg-[#fff8e8] px-4 py-3 text-[12.5px] font-semibold text-ink/80">
            {content.notice}
          </div>

          <h2 className="mt-7 font-display text-[clamp(2rem,3.3vw,2.7rem)] font-black leading-none tracking-[-0.055em] text-ink">
            {content.title}
          </h2>
          <p className="mt-2 text-[13.5px] leading-[1.55] text-ink/50">
            {content.subtitle}
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7">
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
                  aria-describedby={errors.name ? "auth-name-error" : undefined}
                  className={`mt-2 ${inputClass(Boolean(errors.name))}`}
                />
                <FormError id="auth-name-error">{errors.name}</FormError>
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
                aria-describedby={errors.email ? "auth-email-error" : undefined}
                className={`mt-2 ${inputClass(Boolean(errors.email))}`}
              />
              <FormError id="auth-email-error">{errors.email}</FormError>
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
                    errors.phone ? "auth-phone-error" : undefined
                  }
                  className={`mt-2 ${inputClass(Boolean(errors.phone))}`}
                />
                <FormError id="auth-phone-error">{errors.phone}</FormError>
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
                    [
                      isSignup && "auth-password-hint",
                      errors.password && "auth-password-error",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
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
              {isSignup && (
                <p
                  id="auth-password-hint"
                  className="mt-1.5 text-[11px] text-ink/55"
                >
                  {PASSWORD_HINT}
                </p>
              )}
              <FormError id="auth-password-error">{errors.password}</FormError>
            </label>

            {isSignup && (
              <>
                <label className="mt-4 block">
                  <span className="text-[12px] font-bold text-ink">
                    Confirm password
                  </span>
                  <span className="relative mt-2 block">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
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
                      placeholder="••••••••"
                      required
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword
                          ? "auth-confirm-password-error"
                          : undefined
                      }
                      className={inputClass(
                        Boolean(errors.confirmPassword),
                        "pr-16",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-tomato"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </span>
                  <FormError id="auth-confirm-password-error">
                    {errors.confirmPassword}
                  </FormError>
                </label>

                <label className="mt-4 block">
                  <span className="text-[12px] font-bold text-ink">
                    Referral code (optional)
                  </span>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(event) => {
                      setReferralCode(event.target.value.toUpperCase());
                      clearError("referralCode");
                    }}
                    onBlur={() => {
                      const referralError = getReferralCodeError(referralCode);
                      if (referralError) {
                        setErrors((current) => ({
                          ...current,
                          referralCode: referralError,
                        }));
                      }
                    }}
                    autoCapitalize="characters"
                    placeholder="Enter referral code"
                    aria-invalid={Boolean(errors.referralCode)}
                    aria-describedby={
                      errors.referralCode ? "auth-referral-error" : undefined
                    }
                    className={`mt-2 ${inputClass(Boolean(errors.referralCode))}`}
                  />
                  <FormError id="auth-referral-error">
                    {errors.referralCode}
                  </FormError>
                </label>
              </>
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
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-tomato px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_4px_0_#a5130c,0_10px_20px_rgba(180,30,20,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
            >
              {content.button}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="mt-5 text-center text-[12.5px] text-ink/50">
            {content.switchPrompt}{" "}
            <Link
              to={content.switchTo}
              className="font-bold text-tomato hover:underline"
            >
              {content.switchAction}
            </Link>
          </p>

          <p className="mt-4 text-center text-[11px] text-ink/35">
            Prototype: accounts are kept in this browser only.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
