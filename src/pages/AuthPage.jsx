import React, { useState } from "react";
import { ContainerMark } from "../components/SiteNav";
import { Link, navigate } from "../lib/router";
import { useStore } from "../context/StoreContext";
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
    subtitle:
      "New here? Sign up to see the menu and place your first order.",
    button: "Create account",
    switchPrompt: "Already have an account?",
    switchAction: "Log in",
    switchTo: "/login",
  },
  login: {
    eyebrow: "Good to see you again.",
    intro:
      "Log in and your usual is one tap away. The kitchen is warming up.",
    notice: "Please log in before you order.",
    title: "Welcome back",
    subtitle: "Log in to your e'sweet account to see the menu and order.",
    button: "Log in",
    switchPrompt: "New to e'sweet?",
    switchAction: "Sign up",
    switchTo: "/signup",
  },
};

const AuthPage = ({ mode = "signup" }) => {
  const isSignup = mode === "signup";
  const content = copy[mode];
  const { signup, login } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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
      signup({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      navigate("/menu");
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

    navigate("/menu");
  };

  return (
    <div className="grid min-h-svh bg-cream lg:grid-cols-[46%_54%]">
      <aside className="relative overflow-hidden bg-tomato px-5 py-6 text-white lg:flex lg:flex-col lg:px-12 lg:py-10">
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <ContainerMark />
          <span className="font-logo text-[25px] font-extrabold leading-none tracking-[-0.035em] text-white">
            e&apos;sweet
          </span>
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

      <main className="flex min-h-svh flex-col px-5 py-6 sm:px-8 lg:px-16 lg:py-10">
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
                <span className="text-[12px] font-bold text-ink">Full name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="Ada Okafor"
                  className="mt-2 h-11 w-full rounded-xl border border-ink bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
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
                className="mt-2 h-11 w-full rounded-xl border border-ink bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
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
                  className="mt-2 h-11 w-full rounded-xl border border-ink bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
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
                      : "border-ink focus:border-tomato focus:ring-tomato"
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
              <p aria-live="polite" className="mt-2 text-[12px] font-semibold text-tomato">
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
