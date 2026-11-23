import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "../lib/router";

const links = [
  { label: "Our story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "How it works", href: "#how" },
  { label: "Visit", href: "#visit" },
];

export const ContainerMark = () => (
  <svg
    viewBox="0 0 30 24"
    aria-hidden="true"
    className="h-[22px] w-[28px] shrink-0 drop-shadow-[0_2px_0_rgba(0,0,0,0.14)] sm:h-[24px] sm:w-[30px]"
  >
    <rect width="30" height="24" rx="4" fill="#d7261e" />
    <path
      d="M7 7h16M7 12h10M7 17h16"
      stroke="#fffbf3"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </svg>
);

const SiteNav = ({ visible }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.nav
          initial={false}
          animate={{
            y: visible ? 0 : -120,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
          style={{ pointerEvents: visible ? "auto" : "none" }}
          // While hidden, keep the links out of the tab order and the
          // accessibility tree, not just visually transparent.
          inert={!visible}
          aria-label="Main"
          className="relative w-full max-w-[1312px]"
        >
          <div className="relative flex h-[54px] items-center justify-between rounded-full bg-cream-light/95 pl-3 pr-2 shadow-[0_12px_36px_rgba(40,80,110,0.16)] ring-1 ring-black/[0.03] sm:h-[58px] sm:pl-5 sm:pr-3">
            <a
              href="#top"
              className="flex items-center gap-2.5 sm:gap-3"
              aria-label="e'sweet home"
            >
              <ContainerMark />
              <span className="font-logo text-[22px] font-extrabold leading-none tracking-[-0.035em] text-tomato sm:text-[24px]">
                e&apos;sweet
              </span>
            </a>

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-semibold tracking-[-0.01em] text-ink/75 transition-colors duration-200 hover:text-tomato"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-[13.5px] font-bold text-ink/75 transition-colors hover:text-tomato"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-tomato px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_3px_0_#a5130c] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
              >
                Sign up
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-tomato text-cream shadow-[0_3px_0_#a5130c] transition-transform active:translate-y-px md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M5 8h14M5 12h14M5 16h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{
              opacity: 0,
              scale: 0.82,
              x: 80,
              y: -20,
              transformOrigin: "top right",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.82,
              x: 80,
              y: -20,
              transition: { duration: 0.22, ease: "easeIn" },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 28,
            }}
            className="fixed inset-0 z-[100] flex h-screen h-dvh w-full flex-col overflow-hidden bg-cream-light md:hidden"
          >
            <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-ink/10 px-4 sm:px-6">
              <a
                href="#top"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 sm:gap-3"
                aria-label="e'sweet home"
              >
                <ContainerMark />
                <span className="font-logo text-[22px] font-extrabold leading-none tracking-[-0.035em] text-tomato sm:text-[24px]">
                  e&apos;sweet
                </span>
              </a>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full bg-tomato text-cream shadow-[0_3px_0_#a5130c] transition-transform active:translate-y-px"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 py-6">
              <nav aria-label="Mobile links" className="flex flex-col gap-1.5">
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-tomato">
                  Menu
                </p>
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[20px] font-bold tracking-[-0.02em] text-ink transition-colors hover:bg-cream active:bg-cream"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="text-tomato">
                      →
                    </span>
                  </a>
                ))}
                <Link
                  to="/menu"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center justify-between rounded-2xl bg-tomato/[0.08] px-4 py-3.5 text-[20px] font-bold tracking-[-0.02em] text-tomato transition-colors hover:bg-tomato/15"
                >
                  <span>Order full menu</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </nav>

              <div className="mt-8 border-t border-ink/10 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-2xl border border-ink/15 bg-cream px-4 py-3.5 text-[15px] font-bold text-ink shadow-sm transition-transform active:scale-[0.98]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-2xl bg-tomato px-4 py-3.5 text-[15px] font-bold text-white shadow-[0_3px_0_#a5130c] transition-transform active:scale-[0.98]"
                  >
                    Sign up
                  </Link>
                </div>

                <p className="mt-6 text-center text-[12px] font-medium text-ink/45">
                  Fresh Nigerian street food · Open daily 11am – 9pm
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SiteNav;
