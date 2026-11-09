import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

const hours = [
  { days: "Mon – Thu", time: "09:00 – 21:00" },
  { days: "Fri – Sat", time: "09:00 – 21:00" },
  { days: "Sunday", time: "11:00 – 21:00" },
];

const address = "20A Idiroko Road, Sango Otta, Ogun State, Nigeria";
const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
  address,
)}&z=16&output=embed`;
const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  address,
)}`;

const VisitMap = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-[28px] bg-cream-light p-2 shadow-[0_22px_50px_rgba(80,50,20,0.12)] sm:p-3">
      <div className="relative h-[320px] overflow-hidden rounded-[22px] bg-[#e8dfd1] sm:h-[400px]">
        <iframe
          title="Map showing e'sweet Container Kitchen at 20A Idiroko Road, Sango Otta"
          src={mapEmbed}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />

        <motion.div
          initial={reduceMotion ? false : { y: 18, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.35, duration: 0.55, ease: "easeOut" }}
          className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/70 bg-cream-light/95 p-3.5 shadow-[0_14px_35px_rgba(30,20,10,0.22)] backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4"
        >
          <div className="flex items-start gap-3">
            <motion.span
              aria-hidden="true"
              initial={reduceMotion ? false : { y: -16, opacity: 0 }}
              whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                delay: 0.7,
                type: "spring",
                stiffness: 280,
                damping: 13,
              }}
              className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tomato text-white shadow-[0_4px_0_#a5130c]"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
                <path
                  d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="2.4" fill="currentColor" />
              </svg>
            </motion.span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-tomato">
                Find us here
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-ink sm:text-[14px]">
                20A Idiroko Road, Sango Otta, Ogun State.
              </p>
              <a
                href={directionsLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-tomato transition-colors hover:text-[#a5130c]"
              >
                Open in Google Maps
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Visit = () => (
  <section
    id="visit"
    className="scroll-mt-24 bg-cream px-5 py-20 sm:px-8 md:py-28 lg:px-16"
  >
    <div className="mx-auto grid w-full max-w-[1312px] items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:grid-cols-[560px_minmax(0,1fr)] xl:gap-[90px]">
      <Reveal className="order-2 lg:order-1" y={24}>
        <VisitMap />
      </Reveal>

      <div className="order-1 lg:order-2">
        <Reveal>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-tomato sm:text-[11px]">
            Visit the box
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,4.4vw,4rem)] font-black leading-[0.95] tracking-[-0.05em] text-ink">
            Find the red kitchen.
          </h2>
          <p className="mt-5 text-[15px] font-semibold leading-relaxed text-ink sm:text-[17px]">
            20A, Idiroko Road, Sango Otta, Ogun State.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-6">
            {hours.map((row) => (
              <div
                key={row.days}
                className="flex items-center justify-between gap-4 border-b border-dashed border-ink/15 py-3.5 text-[13.5px] sm:py-4 sm:text-[15.5px]"
              >
                <span className="font-semibold text-ink">{row.days}</span>
                <span className="text-ink/50">{row.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_4px_0_#a5130c] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
            >
              Order for pickup
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="tel:+2348000000000"
              className="inline-flex items-center justify-center rounded-full border-2 border-ink px-6 py-3.5 text-[14px] font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:bg-cream-light active:translate-y-0"
            >
              Call the window
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Visit;
