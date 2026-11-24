import React, { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

const testimonials = [
  {
    quote: "The jollof tastes like a Saturday party. I order every Friday.",
    author: "Tolu A.",
  },
  {
    quote: "Fast pickup, hot food, and the shawarma is unreal.",
    author: "Chinedu O.",
  },
  {
    quote: "Love that I can order ahead and skip the queue at lunch.",
    author: "Amaka E.",
  },
];

const nextOrder = (order) => [...order.slice(1), order[0]];

const TestimonialStack = () => {
  const [order, setOrder] = useState([0, 1, 2]);
  const [hovering, setHovering] = useState(false);
  const reduceMotion = useReducedMotion();

  const advance = useCallback(() => {
    setOrder((current) => nextOrder(current));
  }, []);

  useEffect(() => {
    if (!hovering || reduceMotion) return undefined;

    const first = window.setTimeout(advance, 420);
    const interval = window.setInterval(advance, 1350);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [advance, hovering, reduceMotion]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advance();
    }
  };

  return (
    <Reveal delay={0.08} y={24}>
      <div
        className="relative mx-auto h-[340px] w-full max-w-[430px] cursor-pointer rounded-[26px] outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-4 focus-visible:ring-offset-tomato sm:h-[370px]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={advance}
        onKeyDown={handleKeyDown}
        role="group"
        aria-label="Customer reviews. Hover or tap to shuffle."
        tabIndex={0}
      >
        {testimonials.map((testimonial, index) => {
          const position = order.indexOf(index);
          return (
            <motion.div
              key={testimonial.author}
              className="absolute inset-x-0 top-0 h-[290px] sm:h-[315px]"
              style={{ zIndex: testimonials.length - position }}
              animate={{
                y: position * 18,
                scale: 1 - position * 0.035,
                rotate: position === 0 ? 0 : position === 1 ? -1.1 : 1.2,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 220, damping: 26, mass: 0.8 }
              }
            >
              <figure className="testimonial-card flex h-full flex-col bg-cream p-7 text-ink shadow-[0_22px_45px_rgba(90,10,5,0.24)] sm:p-8">
                <div
                  aria-label="5 out of 5 stars"
                  className="flex items-center gap-1 text-[15px] leading-none text-gold"
                >
                  <span aria-hidden="true">★★★★★</span>
                </div>

                <blockquote className="mt-5 flex-1 font-display text-[19px] font-extrabold leading-[1.3] tracking-[-0.02em] text-ink sm:text-[21px]">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-5 text-[13px] font-semibold text-ink/45 sm:text-[14px]">
                  {testimonial.author}
                </figcaption>
              </figure>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/55">
        Hover or tap to shuffle
      </p>
    </Reveal>
  );
};

const Testimonials = () => (
  <section className="overflow-hidden bg-tomato px-5 py-20 text-cream sm:px-8 md:py-28 lg:px-16">
    <div className="mx-auto w-full max-w-[1312px]">
      <Reveal className="text-center">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-gold sm:text-[11px]">
          Word on the street
        </p>
        <h2 className="mt-4 font-display text-[clamp(2.4rem,5.2vw,4.6rem)] font-black leading-[0.92] tracking-[-0.05em] text-cream">
          People queue for this box.
        </h2>
      </Reveal>

      <div className="mt-12 sm:mt-14">
        <TestimonialStack />
      </div>
    </div>
  </section>
);

export default Testimonials;
