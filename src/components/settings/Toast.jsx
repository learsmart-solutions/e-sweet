import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import infoIcon from "../../assets/icons/settings/info-16.svg";

const TOAST_MS = 2200;

// Figma "Toast" (Type=Info). Pass `toast = { id, message }`; a new id
// restarts the timer even when the message is the same ("Code copied"
// twice in a row). The live region stays mounted so screen readers
// announce each message.
const Toast = ({ toast, onDone }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDone, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onDone]);

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
            <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-sky">
              <img src={infoIcon} alt="" width="16" height="16" />
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
