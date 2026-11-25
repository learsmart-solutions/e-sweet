import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import infoIcon from "../../assets/icons/settings/info-16.svg";
import checkIcon from "../../assets/icons/settings/check-12.svg";

const TOAST_MS = 2200;

const toneStyles = {
  info: "bg-sky",
  success: "bg-[#22C55E]",
  error: "bg-tomato",
};

const CloseGlyph = () => (
  <svg
    viewBox="0 0 16 16"
    width="12"
    height="12"
    fill="none"
    stroke="#FFFBF3"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="m4 4 8 8M12 4l-8 8" />
  </svg>
);

// Figma "Toast". Info is the default; success and error reuse the same
// component so order history and settings only ever mount one live region.
// Pass `toast = { id, message, tone }`; a new id restarts the timer even
// when the message is the same ("Code copied" twice in a row).
const Toast = ({ toast, onDone }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDone, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onDone]);

  const tone = toast?.tone ?? "info";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-[100] flex justify-center px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.2, 0.75, 0.2, 1] }}
            className="flex items-center gap-2.5 rounded-[14px] bg-ink py-3 pl-3 pr-[18px] shadow-[0_8px_12px_rgba(20,18,18,0.25)]"
          >
            <span
              className={`grid size-[26px] shrink-0 place-items-center rounded-full ${
                toneStyles[tone] ?? toneStyles.info
              }`}
            >
              {tone === "error" ? (
                <CloseGlyph />
              ) : tone === "success" ? (
                <img src={checkIcon} alt="" width="12" height="12" />
              ) : (
                <img src={infoIcon} alt="" width="16" height="16" />
              )}
            </span>
            <p className="text-[14px] font-semibold text-cream-light">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
