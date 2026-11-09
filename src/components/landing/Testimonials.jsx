import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

const testimonials = [
  {
    quote: "The jollof tastes like a Saturday party. I order every Friday.",
    author: "Tolu A.",
    rotate: "lg:-rotate-2",
  },
  {
    quote: "Fast pickup, hot food, and the shawarma is unreal.",
    author: "Chinedu O.",
    rotate: "lg:rotate-[0.6deg]",
  },
  {
    quote: "Love that I can order ahead and skip the queue at lunch.",
    author: "Amaka E.",
    rotate: "lg:rotate-[1.4deg]",
  },
];

const Testimonials = () => {
  const reduceMotion = useReducedMotion();

  return (
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

        <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.author}
              delay={0.08 + index * 0.1}
              y={24}
              className="h-full"
            >
              <div
                className={`h-full transition-transform duration-500 hover:rotate-0 ${testimonial.rotate}`}
              >
                <motion.figure
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, -7, 0],
                          rotate: [
                            0,
                            index % 2 === 0 ? 0.6 : -0.6,
                            0,
                          ],
                        }
                  }
                  transition={{
                    duration: 6.5 + index * 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.45,
                  }}
                  whileHover={{ scale: 1.015 }}
                  className="testimonial-card h-full bg-cream p-7 text-ink shadow-[0_22px_45px_rgba(90,10,5,0.24)] sm:p-8"
                >
                  <div
                    aria-label="5 out of 5 stars"
                    className="flex items-center gap-1 text-[15px] leading-none text-gold"
                  >
                    <span aria-hidden="true">★★★★★</span>
                  </div>

                  <blockquote className="mt-5 font-display text-[19px] font-extrabold leading-[1.3] tracking-[-0.02em] text-ink sm:text-[21px]">
                    “{testimonial.quote}”
                  </blockquote>

                  <figcaption className="mt-5 text-[13px] font-semibold text-ink/45 sm:text-[14px]">
                    {testimonial.author}
                  </figcaption>
                </motion.figure>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
