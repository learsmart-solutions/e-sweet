import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertIcon, CheckIcon } from "./icons";

/**
 * Dark confirmation pill from the Figma frames. Pair with `useToast`.
 *
 * Success toasts sit near the top on phones (under the header) and error
 * toasts sit just above the pinned action bar, as drawn. On desktop both
 * sit bottom-centre. Errors use role="alert" so screen readers announce
 * them straight away; success uses a polite status message.
 */
const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        key={toast.id}
        role={toast.tone === "error" ? "alert" : "status"}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className={`pointer-events-none fixed left-1/2 z-[120] flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-2.5 rounded-[14px] bg-ink px-3.5 py-2.5 text-[13px] font-semibold text-cream-light shadow-[0_12px_28px_rgba(21,19,18,0.28)] lg:bottom-8 lg:top-auto ${
          toast.tone === "error" ? "bottom-24" : "top-20"
        }`}
      >
        <span
          className={`grid size-5 shrink-0 place-items-center rounded-full ${
            toast.tone === "error" ? "bg-tomato" : "bg-[#2f8f5b]"
          }`}
        >
          {toast.tone === "error" ? (
            <AlertIcon size={12} />
          ) : (
            <CheckIcon size={12} />
          )}
        </span>
        <span>{toast.message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Toast;
