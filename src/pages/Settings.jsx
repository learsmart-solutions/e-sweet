import React from "react";
import { Link } from "../lib/router";

const Settings = () => (
  <div className="min-h-svh bg-cream">
    <header className="border-b border-ink/10 bg-cream-light">
      <div className="mx-auto flex h-[68px] w-full max-w-[1312px] items-center justify-between px-4 sm:h-[76px] sm:px-8 lg:px-12">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-ink/65 transition-colors hover:text-tomato"
        >
          <span aria-hidden="true">←</span>
          Back to menu
        </Link>
        <span className="font-display text-[15px] font-black tracking-[-0.02em] text-ink">
          Settings
        </span>
      </div>
    </header>

    <main className="mx-auto w-full max-w-[720px] px-4 py-12 sm:px-8 sm:py-16">
      <p className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-tomato">
        Your account
      </p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-black leading-[0.95] tracking-[-0.055em] text-ink">
        Settings
      </h1>
      <p className="mt-4 max-w-[520px] text-[14px] leading-[1.65] text-ink/55">
        This is where your account settings will live. We&apos;re setting the
        page up now and will add the options here next.
      </p>
    </main>
  </div>
);

export default Settings;
