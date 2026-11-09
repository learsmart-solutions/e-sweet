import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

const PhoneIcon = () => (
  <svg viewBox="0 0 32 32" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true">
    <rect
      x="9.5"
      y="4.5"
      width="13"
      height="23"
      rx="3.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M13.5 8.5h5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="16" cy="22.5" r="1.5" fill="#d7261e" />
  </svg>
);

const PotIcon = () => (
  <svg viewBox="0 0 32 32" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true">
    <path
      d="M8 15h16v7.5A4.5 4.5 0 0 1 19.5 27h-7A4.5 4.5 0 0 1 8 22.5V15Z"
      fill="#d7261e"
    />
    <path
      d="M7 13.5h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M11 10.5c0-1.7 1.3-2 1.3-3.5M16 10.5c0-1.7 1.3-2 1.3-3.5M21 10.5c0-1.7 1.3-2 1.3-3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M5 17h3M24 17h3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const BagIcon = () => (
  <svg viewBox="0 0 32 32" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true">
    <path
      d="M9 12h14l1.4 13.2a2 2 0 0 1-2 2.3H9.6a2 2 0 0 1-2-2.3L9 12Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 12V9.5a3.5 3.5 0 0 1 7 0V12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="16" cy="19" r="2.2" fill="#d7261e" />
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Order online",
    text: "Pick your dishes, sign in and choose pickup or delivery.",
    Icon: PhoneIcon,
  },
  {
    number: "02",
    title: "We cook it fresh",
    text: "Your order goes straight to the pass. No reheating, no shortcuts.",
    Icon: PotIcon,
  },
  {
    number: "03",
    title: "Grab it and go",
    text: "Collect at the window with your order code, or we ride it to you.",
    Icon: BagIcon,
  },
];

const HowItWorks = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how"
      className="scroll-mt-24 bg-cream-light px-5 py-20 sm:px-8 md:py-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1312px]">
        <Reveal className="mx-auto text-center">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-tomato sm:text-[11px]">
            How it works
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.3rem,5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.05em] text-ink">
            Take-out in three easy steps.
          </h2>
        </Reveal>

        <div className="relative mt-12 sm:mt-14">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-[7%] top-[58px] hidden h-[70px] w-[86%] md:block"
          >
            <motion.path
              d="M0 50 C 120 50 140 12 260 18 S 500 88 620 54 S 820 20 1000 46"
              fill="none"
              stroke="#d7261e"
              strokeWidth="3"
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              whileInView={
                reduceMotion ? undefined : { pathLength: 1, opacity: 1 }
              }
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>

          <div className="relative grid gap-5 md:grid-cols-3 md:gap-4 lg:gap-5">
            {steps.map((step, index) => (
              <motion.article
                key={step.number}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }
                }
                whileInView={
                  reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
                }
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  delay: index * 0.12,
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                }}
                className="relative z-10 rounded-2xl bg-cream p-6 shadow-[0_16px_36px_rgba(80,50,20,0.06)] lg:p-8"
              >
                <span className="absolute right-5 top-5 font-display text-[30px] font-black leading-none tracking-[-0.04em] text-[#e8c9a4] lg:right-6 lg:top-6 lg:text-[38px]">
                  {step.number}
                </span>

                <div className="mb-7 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0dcc0] text-ink lg:mb-8 lg:h-20 lg:w-20">
                  <step.Icon />
                </div>

                <h3 className="font-display text-[21px] font-black leading-tight tracking-[-0.025em] text-ink lg:text-[24px]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[300px] text-[13.5px] leading-[1.55] text-ink/60 lg:text-[15px]">
                  {step.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
