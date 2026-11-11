import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContainerMark } from "../SiteNav";
import { navigate } from "../../lib/router";
import { useStore } from "../../context/StoreContext";

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

const AuthModal = ({ initialMode = "signin", onClose }) => {
  const { signup, login } = useStore();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  useEffect(() => {
    setMode(initialMode);
    setError("");
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
    setError("");
  };

  const finish = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    navigate(next === "checkout" ? "/checkout" : "/menu", { scroll: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (isSignup) {
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        setError("Please fill in every field to create your account.");
        return;
      }
      if (password.length < 6) {
        setError("Use at least 6 characters for your password.");
        return;
      }
      signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      finish();
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!login(email, password)) {
      setError("That password is not right. Try again.");
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
                setError("");
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
                setError("");
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
                <span className="text-[12px] font-bold text-ink">Full name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="Ada Okafor"
                  className="mt-2 h-11 w-full rounded-xl border border-ink/60 bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
                />
              </label>
            )}

            <label className="mb-4 block">
              <span className="text-[12px] font-bold text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="ada@example.com"
                className="mt-2 h-11 w-full rounded-xl border border-ink/60 bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
              />
            </label>

            {isSignup && (
              <label className="mb-4 block">
                <span className="text-[12px] font-bold text-ink">Phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  placeholder="0803 123 4567"
                  className="mt-2 h-11 w-full rounded-xl border border-ink/60 bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
                />
              </label>
            )}

            <label className="block">
              <span className="text-[12px] font-bold text-ink">Password</span>
              <span className="relative mt-2 block">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  className={`h-11 w-full rounded-xl border bg-cream-light px-3.5 pr-16 text-[13px] text-ink outline-none transition-colors focus:ring-1 ${
                    error
                      ? "border-tomato focus:border-tomato focus:ring-tomato"
                      : "border-ink/60 focus:border-tomato focus:ring-tomato"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-tomato"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

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
