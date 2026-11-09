import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import floatJollof from "../../assets/float-jollof.png";
import floatFries from "../../assets/float-fries.png";
import floatSuya from "../../assets/float-suya.png";
import floatZobo from "../../assets/float-zobo.png";

const letters = "Hungry yet?".split("");

const HungryYet = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="order"
      className="relative overflow-hidden bg-sand px-5 py-24 sm:px-8 md:py-32 lg:py-36"
    >
      <img
        src={floatJollof}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="animate-float-slow pointer-events-none absolute -left-4 top-6 w-[76px] select-none sm:left-[2%] sm:top-[9%] sm:w-[130px] lg:left-[7%] lg:top-[16%] lg:w-[140px]"
      />
      <img
        src={floatFries}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="animate-float-mid pointer-events-none absolute -right-6 top-5 w-[84px] select-none sm:right-[2%] sm:top-[9%] sm:w-[140px] lg:right-[6%] lg:top-[16%] lg:w-[160px]"
      />
      <img
        src={floatSuya}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="animate-float-fast pointer-events-none absolute bottom-[8%] left-1 w-[68px] select-none sm:bottom-[12%] sm:left-[5%] sm:w-[100px] lg:bottom-[18%] lg:left-[13%] lg:w-[120px]"
      />
      <img
        src={floatZobo}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="animate-float-slow pointer-events-none absolute bottom-[7%] right-3 w-[52px] select-none [animation-delay:-4s] sm:bottom-[11%] sm:right-[5%] sm:w-[80px] lg:bottom-[18%] lg:right-[12%] lg:w-[80px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1040px] flex-col items-center text-center">
        <h2
          aria-label="Hungry yet?"
          className="whitespace-nowrap font-display text-[clamp(2.35rem,11vw,9.6rem)] font-black leading-[0.85] tracking-[-0.065em] text-tomato"
        >
          {letters.map((letter, index) =>
            letter === " " ? (
              <span key={`space-${index}`} className="inline-block w-[0.18em]" />
            ) : (
              <motion.span
                key={`${letter}-${index}`}
                aria-hidden="true"
                className="inline-block"
                initial={
                  reduceMotion ? false : { y: 42, opacity: 0, rotate: 3 }
                }
                whileInView={
                  reduceMotion ? undefined : { y: 0, opacity: 1, rotate: 0 }
                }
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  delay: index * 0.035,
                  type: "spring",
                  stiffness: 250,
                  damping: 18,
                }}
              >
                {letter}
              </motion.span>
            ),
          )}
        </h2>

        <motion.p
          initial={reduceMotion ? false : { y: 18, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="mt-3 text-[clamp(0.95rem,1.4vw,1.15rem)] text-ink/70 sm:mt-4"
        >
          Your order can be ready in about 15 minutes.
        </motion.p>

        <motion.a
          href="#menu"
          initial={reduceMotion ? false : { y: 18, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.42, duration: 0.6, ease: "easeOut" }}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-8 py-4 text-[15px] font-bold text-white shadow-[0_4px_0_#a5130c,0_16px_30px_rgba(180,30,20,0.24)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
        >
          Start your order
          <span aria-hidden="true">→</span>
        </motion.a>
      </div>
    </section>
  );
};

export default HungryYet;
