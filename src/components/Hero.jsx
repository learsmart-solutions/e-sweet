import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import KitchenScene from "./KitchenScene";
import BrandHero from "./BrandHero";
import smokeOne from "../assets/smoke-1.png";
import smokeTwo from "../assets/smoke-2.png";
import smokeThree from "../assets/smoke-3.png";
import mobileContainerBg from "../assets/mobile-container-bg.png";
import mobileContainerOnly from "../assets/mobile-container-only.png";
import mobileSmokeOne from "../assets/mobile-smoke-1.png";
import mobileSmokeTwo from "../assets/mobile-smoke-2.png";
import mobileSmokeThree from "../assets/mobile-smoke-3.png";
import "../hero.css";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const range = (progress, start, end) =>
  clamp01((progress - start) / (end - start));
const inQuad = (t) => t * t;
const outCubic = (t) => 1 - Math.pow(1 - t, 3);

const useIsPhone = () => {
  const [isPhone, setIsPhone] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px) and (orientation: portrait)")
        .matches,
  );

  useEffect(() => {
    const query = window.matchMedia(
      "(max-width: 767px) and (orientation: portrait)",
    );
    const update = () => setIsPhone(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isPhone;
};

const useStageFit = (containerRef) => {
  const [fit, setFit] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;

      // Contain the 1440×900 artboard on every tablet/desktop viewport. The
      // whole container, road and billboard stay visible instead of cropping
      // the sides on portrait tablets.
      setFit(Math.min(width / 1440, height / 900));
    };

    measure();
    window.addEventListener("resize", measure);

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [containerRef]);

  return fit;
};

const puffs = [
  { left: "4%", top: "58%", size: 46, dx: "5vw", dur: 19, delay: -2, op: 0.4, rot: 11 },
  { left: "20%", top: "69%", size: 56, dx: "-4vw", dur: 23, delay: -9, op: 0.44, rot: -8 },
  { left: "41%", top: "63%", size: 64, dx: "3vw", dur: 21, delay: -5, op: 0.5, rot: 7 },
  { left: "62%", top: "70%", size: 48, dx: "-5vw", dur: 17, delay: -12, op: 0.44, rot: -12 },
  { left: "81%", top: "60%", size: 44, dx: "4vw", dur: 22, delay: -7, op: 0.38, rot: 9 },
  { left: "12%", top: "82%", size: 38, dx: "6vw", dur: 16, delay: -3, op: 0.38, rot: -6 },
  { left: "55%", top: "84%", size: 42, dx: "-3vw", dur: 20, delay: -10, op: 0.44, rot: 12 },
  { left: "88%", top: "80%", size: 36, dx: "-2vw", dur: 24, delay: -14, op: 0.34, rot: -10 },
];

const SmokePuffs = ({ opacity }) => (
  <motion.div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    style={{ opacity }}
  >
    {puffs.map((puff, index) => (
      <span
        key={index}
        className="smoke-puff"
        style={{
          left: puff.left,
          top: puff.top,
          width: `${puff.size}vmin`,
          height: `${puff.size}vmin`,
          "--dur": `${puff.dur}s`,
          "--delay": `${puff.delay}s`,
          "--puff-opacity": puff.op,
          "--dx": puff.dx,
          "--rot": `${puff.rot}deg`,
        }}
      />
    ))}
  </motion.div>
);

const SmokeFrame = ({ src, opacity, scale, smokeOpacity, zIndex }) => (
  <motion.div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
    style={{ opacity, scale, zIndex }}
  >
    <img src={src} alt="" draggable={false} className="hero-frame-img" />
    <div className="smoke-veil" />
    <SmokePuffs opacity={smokeOpacity} />
    <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_48%,rgba(10,6,8,0.35)_100%)]" />
  </motion.div>
);

const MobileFrame = ({
  src,
  opacity,
  scale,
  smokeOpacity = 0,
  zIndex,
  position = "center",
  veil = true,
}) => (
  <motion.div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
    style={{ opacity, scale, zIndex }}
  >
    <img
      src={src}
      alt=""
      draggable={false}
      className="hero-frame-img"
      style={{ objectPosition: position }}
    />
    {veil ? <div className="smoke-veil" /> : null}
    {smokeOpacity > 0 ? <SmokePuffs opacity={smokeOpacity} /> : null}
  </motion.div>
);

const MobileLandingScene = ({ opacity, scale, zIndex }) => (
  <motion.div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
    style={{ opacity, scale, zIndex }}
  >
    <div className="mobile-scene-drift">
      <img
        src={mobileContainerBg}
        alt=""
        draggable={false}
        className="mobile-scene-img"
      />
      <div className="mobile-container-shadow" />
      <div className="mobile-container-fall">
        <img
          src={mobileContainerOnly}
          alt=""
          draggable={false}
          className="mobile-scene-img"
        />
      </div>
    </div>
  </motion.div>
);

const MobileLandingDust = ({ opacity }) => (
  <motion.div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
    style={{ opacity }}
  >
    <div className="mobile-dust">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  </motion.div>
);

const Hero = ({ onNavChange }) => {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const fit = useStageFit(stickyRef);
  const reduceMotion = useReducedMotion();
  const isPhone = useIsPhone();

  const staticReveal = useMotionValue(1);
  const staticOrbit = useMotionValue(0.9);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const navShownRef = useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const show = progress > 0.94;
    if (show !== navShownRef.current) {
      navShownRef.current = show;
      onNavChange?.(show);
    }
  });

  useEffect(() => {
    if (reduceMotion) onNavChange?.(true);
  }, [reduceMotion, onNavChange]);

  // Intro copy clears before the camera moves.
  const copyOpacity = useTransform(scrollYProgress, (p) =>
    1 - range(p, 0.025, 0.13),
  );
  const copyY = useTransform(scrollYProgress, (p) =>
    -30 * range(p, 0.025, 0.13),
  );

  // Camera pushes into the serving window, then the smoke frames take over.
  const cameraScale = useTransform(scrollYProgress, (p) =>
    1 + 3.4 * inQuad(range(p, 0.05, 0.29)),
  );
  const cameraOpacity = useTransform(scrollYProgress, (p) =>
    1 - range(p, 0.255, 0.325),
  );

  const frameOneOpacity = useTransform(scrollYProgress, (p) =>
    range(p, 0.24, 0.33) * (1 - range(p, 0.4, 0.49)),
  );
  const frameOneScale = useTransform(scrollYProgress, (p) =>
    1.07 - 0.07 * outCubic(range(p, 0.24, 0.52)),
  );
  const frameOneSmoke = useTransform(scrollYProgress, (p) =>
    range(p, 0.24, 0.33) * (1 - range(p, 0.36, 0.46)),
  );

  const frameTwoOpacity = useTransform(scrollYProgress, (p) =>
    range(p, 0.4, 0.49) * (1 - range(p, 0.57, 0.66)),
  );
  const frameTwoScale = useTransform(scrollYProgress, (p) =>
    1.06 - 0.06 * outCubic(range(p, 0.4, 0.68)),
  );
  const frameTwoSmoke = useTransform(scrollYProgress, (p) =>
    range(p, 0.4, 0.49) * (1 - range(p, 0.54, 0.64)),
  );

  const frameThreeOpacity = useTransform(scrollYProgress, (p) =>
    range(p, 0.57, 0.66) * (1 - range(p, 0.78, 0.89)),
  );
  const frameThreeScale = useTransform(scrollYProgress, (p) =>
    1.05 - 0.05 * outCubic(range(p, 0.57, 0.86)),
  );
  const frameThreeSmoke = useTransform(scrollYProgress, (p) =>
    range(p, 0.57, 0.66) * (1 - range(p, 0.74, 0.86)),
  );

  // Phone storyboard: the supplied 375×812 frames are already the close-up
  // crops, so the phone timeline cross-fades them instead of zooming the
  // desktop artboard.
  const mobileBaseOpacity = useTransform(scrollYProgress, (p) =>
    1 - range(p, 0.06, 0.16),
  );
  const mobileBaseScale = useTransform(scrollYProgress, (p) =>
    1 + 0.06 * range(p, 0, 0.16),
  );
  const mobileFrameOneOpacity = useTransform(scrollYProgress, (p) =>
    range(p, 0.14, 0.22) * (1 - range(p, 0.34, 0.44)),
  );
  const mobileFrameOneScale = useTransform(scrollYProgress, (p) =>
    1.04 - 0.04 * range(p, 0.14, 0.44),
  );
  const mobileFrameOneSmoke = useTransform(scrollYProgress, (p) =>
    range(p, 0.14, 0.22) * (1 - range(p, 0.3, 0.4)),
  );
  const mobileFrameTwoOpacity = useTransform(scrollYProgress, (p) =>
    range(p, 0.38, 0.46) * (1 - range(p, 0.58, 0.68)),
  );
  const mobileFrameTwoScale = useTransform(scrollYProgress, (p) =>
    1.05 - 0.05 * range(p, 0.38, 0.68),
  );
  const mobileFrameTwoSmoke = useTransform(scrollYProgress, (p) =>
    range(p, 0.38, 0.46) * (1 - range(p, 0.54, 0.64)),
  );
  const mobileFrameThreeOpacity = useTransform(scrollYProgress, (p) =>
    range(p, 0.62, 0.7) * (1 - range(p, 0.8, 0.9)),
  );
  const mobileFrameThreeScale = useTransform(scrollYProgress, (p) =>
    1.04 - 0.04 * range(p, 0.62, 0.88),
  );
  const mobileFrameThreeSmoke = useTransform(scrollYProgress, (p) =>
    range(p, 0.62, 0.7) * (1 - range(p, 0.76, 0.86)),
  );

  // The steam lifts into the cream brand reveal.
  const creamOpacity = useTransform(scrollYProgress, (p) =>
    range(p, 0.8, 0.9),
  );
  const heroReveal = useTransform(scrollYProgress, (p) =>
    range(p, 0.88, 0.975),
  );
  const orbitOpacity = useTransform(scrollYProgress, (p) =>
    0.2 + 0.8 * range(p, 0.86, 0.96),
  );

  if (reduceMotion) {
    return (
      <section
        id="top"
        ref={sectionRef}
        className="relative min-h-svh overflow-hidden bg-cream-hero"
      >
        <BrandHero reveal={staticReveal} orbitOpacity={staticOrbit} />
      </section>
    );
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`relative bg-[#120b18] ${
        isPhone ? "h-[320vh]" : "h-[420vh]"
      }`}
    >
      <div className="es-sticky" ref={stickyRef}>
        {isPhone ? (
          <>
            <MobileLandingScene
              opacity={mobileBaseOpacity}
              scale={mobileBaseScale}
              zIndex={1}
            />

            <MobileLandingDust opacity={mobileBaseOpacity} />

            <MobileFrame
              src={mobileSmokeOne}
              opacity={mobileFrameOneOpacity}
              scale={mobileFrameOneScale}
              smokeOpacity={mobileFrameOneSmoke}
              zIndex={10}
            />

            <MobileFrame
              src={mobileSmokeTwo}
              opacity={mobileFrameTwoOpacity}
              scale={mobileFrameTwoScale}
              smokeOpacity={mobileFrameTwoSmoke}
              zIndex={11}
            />

            <MobileFrame
              src={mobileSmokeThree}
              opacity={mobileFrameThreeOpacity}
              scale={mobileFrameThreeScale}
              smokeOpacity={mobileFrameThreeSmoke}
              zIndex={12}
            />
          </>
        ) : (
          <>
            <div
              className="es-stage-fit"
              style={{ transform: `translate(-50%, -50%) scale(${fit})` }}
            >
              <div className="es-stage">
                <motion.div
                  className="es-camera"
                  style={{
                    scale: cameraScale,
                    opacity: cameraOpacity,
                    transformOrigin: "50% 46%",
                  }}
                >
                  <KitchenScene />
                </motion.div>
              </div>
            </div>

            <SmokeFrame
              src={smokeOne}
              opacity={frameOneOpacity}
              scale={frameOneScale}
              smokeOpacity={frameOneSmoke}
              zIndex={10}
            />

            <SmokeFrame
              src={smokeTwo}
              opacity={frameTwoOpacity}
              scale={frameTwoScale}
              smokeOpacity={frameTwoSmoke}
              zIndex={11}
            />

            <SmokeFrame
              src={smokeThree}
              opacity={frameThreeOpacity}
              scale={frameThreeScale}
              smokeOpacity={frameThreeSmoke}
              zIndex={12}
            />
          </>
        )}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15] bg-cream-hero"
          style={{ opacity: creamOpacity }}
        />

        <BrandHero reveal={heroReveal} orbitOpacity={orbitOpacity} />

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden md:block"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.85, ease: [0.2, 0.75, 0.2, 1] }}
            className="absolute bottom-4 left-5 max-w-[min(560px,84vw)] sm:bottom-5 sm:left-8 md:bottom-6 md:left-12"
          >
            <p className="mb-2.5 font-display text-[clamp(9px,0.78vw,11px)] font-semibold uppercase tracking-[0.28em] text-[#e7ad63] [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
              Container kitchen · Lagos
            </p>

            <h1 className="font-display text-[clamp(1.9rem,4.7vw,3.2rem)] font-black leading-[0.92] tracking-[-0.03em] text-cream [text-shadow:0_10px_30px_rgba(0,0,0,0.35)]">
              Good food lives
              <br />
              in this box.
            </h1>

            <p className="mt-3 text-[clamp(12px,0.95vw,15px)] text-cream/80">
              Scroll to step inside.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 right-5 z-30 hidden flex-col items-center gap-3 text-cream/80 sm:flex md:right-10"
          style={{ opacity: copyOpacity }}
          aria-hidden="true"
        >
          <div className="relative h-11 w-[26px] rounded-full border-2 border-cream/80">
            <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-cream" />
          </div>
          <span className="font-display text-[9px] font-semibold uppercase tracking-[0.32em]">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
