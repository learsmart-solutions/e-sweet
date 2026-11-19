import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { dishes } from "../../data/menu";
import { Link } from "../../lib/router";
import { useStore } from "../../context/StoreContext";
import usePauseOffscreen from "../../hooks/usePauseOffscreen";

const DishRail = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [maxX, setMaxX] = useState(0);
  const [toast, setToast] = useState(null);
  const { user } = useStore();

  usePauseOffscreen(sectionRef);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleAdd = () => {
    setToast({ type: user ? "menu" : "auth" });
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, (progress) => -maxX * progress);

  // Decode the dish art before the rail reaches the viewport so the first
  // horizontal pass never hitches on image decoding.
  useEffect(() => {
    dishes.forEach((dish) => {
      const image = new Image();
      image.src = dish.image;
      const decoded = image.decode?.();
      if (decoded) decoded.catch(() => {});
    });
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return;
      setMaxX(
        Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth),
      );
    };

    measure();
    window.addEventListener("resize", measure);

    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative h-[300vh] scroll-mt-24 bg-ink text-cream lg:h-[340vh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="relative mx-auto flex h-full w-full max-w-[1312px] flex-col justify-start px-5 pb-4 pt-20 sm:px-8 sm:pb-5 sm:pt-24 lg:px-16">
          <div className="flex shrink-0 flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-[#f0523c] sm:text-[11px]">
                From the window
              </p>
              <h2 className="menu-heading mt-3 font-display text-[clamp(2.35rem,5.8vw,5.5rem)] font-black leading-[0.88] tracking-[-0.055em] text-cream">
                Crowd favourites
              </h2>
            </div>

            <Link
              to="/menu"
              className="hidden items-center gap-2 rounded-full bg-tomato px-5 py-3 text-[13px] font-bold text-white shadow-[0_3px_0_#a5130c] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0 sm:inline-flex sm:px-6 sm:text-[14px]"
            >
              Full menu
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            ref={viewportRef}
            className="mt-6 shrink-0 overflow-hidden sm:mt-7"
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="dish-track flex w-max gap-4 sm:gap-5"
            >
              {dishes.map((dish) => (
                <article
                  key={dish.id}
                  className="group flex w-[78vw] max-w-[300px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-card p-3.5 transition-transform duration-300 hover:-translate-y-1 [@media(max-height:650px)]:w-[64vw] sm:w-[250px] sm:p-4"
                >
                  <div className="relative -mx-3.5 -mt-3.5 aspect-[300/230] w-[calc(100%+1.75rem)] shrink-0 sm:-mx-4 sm:-mt-4 sm:w-[calc(100%+2rem)]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      draggable={false}
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-contain p-[5%] drop-shadow-[0_16px_18px_rgba(0,0,0,0.42)]"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div
                        aria-hidden="true"
                        className="plate-shine aspect-square w-[64%] rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-1 flex-col px-1">
                    <h3 className="font-display text-[17px] font-black leading-tight tracking-[-0.02em] text-cream sm:text-[18px]">
                      {dish.name}
                    </h3>
                    <p className="mt-1.5 min-h-[40px] text-[12.5px] leading-[1.5] text-cream/55">
                      {dish.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <p className="font-display text-[20px] font-black tracking-[-0.02em] text-gold">
                        ₦{dish.price}
                      </p>
                      <button
                        type="button"
                        onClick={handleAdd}
                        aria-label={`Add ${dish.name} to your order`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-tomato text-[19px] font-medium leading-none text-white shadow-[0_3px_0_#a5130c] transition-transform duration-200 hover:scale-105 active:translate-y-0.5"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>

          <Link
            to="/menu"
            className="absolute inset-x-5 bottom-5 inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_3px_0_#a5130c] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0 sm:hidden"
          >
            Full menu
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.2, 0.75, 0.2, 1] }}
            className="fixed inset-x-4 bottom-24 z-[75] mx-auto max-w-[420px] rounded-2xl bg-cream-light p-4 text-ink shadow-[0_18px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/10 sm:bottom-6"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tomato text-[16px] font-black text-white">
                {toast.type === "auth" ? "!" : "→"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold leading-[1.35]">
                  {toast.type === "auth"
                    ? "Log in or sign up to place your order."
                    : "Open the full menu to add this dish."}
                </p>
                <p className="mt-1 text-[11.5px] leading-[1.4] text-ink/50">
                  {toast.type === "auth"
                    ? "Create an account or sign in, then add dishes to your bag."
                    : "Every dish and its add button is on the full menu."}
                </p>
                {toast.type === "auth" ? (
                  <div className="mt-3 flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setToast(null)}
                      className="rounded-full bg-tomato px-4 py-2 text-[12px] font-bold text-white shadow-[0_3px_0_#a5130c]"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setToast(null)}
                      className="rounded-full bg-ink px-4 py-2 text-[12px] font-bold text-cream"
                    >
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/menu"
                    onClick={() => setToast(null)}
                    className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-[12px] font-bold text-cream"
                  >
                    Open menu
                  </Link>
                )}
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Dismiss notification"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink/45 transition-colors hover:bg-cream hover:text-ink"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DishRail;
