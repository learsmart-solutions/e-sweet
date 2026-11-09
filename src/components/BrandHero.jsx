import React from "react";
import { motion, useTransform } from "framer-motion";
import orbitImg from "../assets/orbit.png";
import mobileOrbitImg from "../assets/mobile-orbit.png";

const BrandHero = ({ reveal, orbitOpacity }) => {
  const y = useTransform(reveal, [0, 1], [42, 0]);
  const scale = useTransform(reveal, [0, 1], [0.97, 1]);
  const pointerEvents = useTransform(reveal, (value) =>
    value > 0.15 ? "auto" : "none",
  );

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-transparent px-5 pb-16 pt-24 text-center sm:pt-28"
      style={{ opacity: reveal, y, scale, pointerEvents }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[195%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none md:block sm:w-[142%] lg:w-[112%]">
        <motion.img
          src={orbitImg}
          alt=""
          draggable={false}
          style={{ opacity: orbitOpacity }}
          className="animate-orbit h-auto w-full will-change-transform"
        />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 w-[142vw] max-w-none -translate-x-1/2 -translate-y-1/2 select-none md:hidden">
        <motion.img
          src={mobileOrbitImg}
          alt=""
          draggable={false}
          style={{ opacity: orbitOpacity }}
          className="animate-orbit-mobile h-auto w-full will-change-transform"
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <h1
          aria-label="e'sweet"
          className="font-logo text-[clamp(5rem,12.3vw,11.5rem)] font-extrabold leading-[0.8] tracking-[-0.045em] text-tomato [text-shadow:0_5px_0_#b0150f,0_15px_0_rgba(150,15,10,0.22),0_28px_36px_rgba(90,20,10,0.16)]"
        >
          e<span className="brand-tick" aria-hidden="true" />
          sweet
        </h1>

        <p className="mt-5 font-display text-[clamp(1.55rem,3.3vw,3.25rem)] font-black uppercase leading-none tracking-[-0.045em] text-ink sm:mt-6">
          Eat sweet
        </p>

        <p className="mt-4 max-w-[600px] text-[clamp(0.85rem,1.15vw,1.05rem)] leading-[1.6] text-ink/75">
          Smoky jollof, asun rice and soups cooked fresh inside a 40 ft shipping
          container. Order take-out online and pick it up hot, or have it
          brought to your door.
        </p>

        <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row">
          <a
            href="#menu"
            className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-tomato px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_4px_0_#a5130c,0_14px_26px_rgba(180,30,20,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
          >
            Order take-out
            <span aria-hidden="true">→</span>
          </a>

          <a
            href="#menu"
            className="inline-flex min-w-[190px] items-center justify-center rounded-full border-2 border-ink bg-cream-light px-7 py-3.5 text-[15px] font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:bg-cream active:translate-y-0"
          >
            See the menu
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default BrandHero;
