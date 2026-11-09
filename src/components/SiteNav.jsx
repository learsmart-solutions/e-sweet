import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.nav
        initial={false}
        animate={{
          y: visible ? 0 : -120,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
        aria-label="Main"
        className="relative w-full max-w-[1312px]"
      >
        <div className="flex h-[54px] items-center justify-between rounded-full bg-cream-light/95 pl-3 pr-2 shadow-[0_12px_36px_rgba(40,80,110,0.16)] ring-1 ring-black/[0.03] backdrop-blur-md sm:h-[58px] sm:pl-5 sm:pr-3">
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

          <div className="hidden items-center gap-8 pr-4 md:flex">
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

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full bg-tomato text-cream shadow-[0_3px_0_#a5130c] transition-transform active:translate-y-px md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M5 8h14M5 12h14M5 16h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.2, 0.75, 0.2, 1] }}
              className="absolute inset-x-0 top-[calc(100%+10px)] rounded-[26px] bg-cream-light p-3 shadow-[0_18px_50px_rgba(30,20,10,0.18)] ring-1 ring-black/[0.04] md:hidden"
            >
              <div className="flex flex-col">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-ink/80 transition-colors hover:bg-cream hover:text-tomato"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-tomato">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

export default SiteNav;
