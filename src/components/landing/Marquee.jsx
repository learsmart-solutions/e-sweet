import React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const items = [
  "Smoky jollof",
  "Beef suya",
  "Pounded yam & egusi",
  "Puff-puff",
  "Asun rice",
  "Zobo",
];

const Marquee = () => {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, {
    stiffness: 300,
    damping: 30,
    mass: 0.4,
  });

  const tilt = useTransform(smoothVelocity, (value) => {
    if (reduceMotion) return 0;
    const clamped = Math.max(-2500, Math.min(2500, value));
    return (clamped / 2500) * -2.5;
  });

  return (
    <section
      aria-label="Menu highlights"
      className="relative z-20 -mt-4 overflow-hidden bg-cream-hero py-2 sm:-mt-6"
    >
      <div className="origin-center -rotate-[1.4deg] scale-x-[1.06]">
        <motion.div style={{ rotate: tilt }} className="bg-tomato">
          <div className="flex w-max animate-marquee items-center py-2.5 sm:py-3.5">
            {[0, 1].map((group) => (
              <div
                key={group}
                aria-hidden={group === 1}
                className="flex shrink-0 items-center"
              >
                {items.map((item) => (
                  <React.Fragment key={`${group}-${item}`}>
                    <span className="whitespace-nowrap px-5 font-display text-[clamp(1.35rem,3.1vw,2.7rem)] font-black leading-none tracking-[-0.035em] text-cream sm:px-8">
                      {item}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[clamp(1rem,2vw,1.7rem)] leading-none text-gold"
                    >
                      ✳
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Marquee;
