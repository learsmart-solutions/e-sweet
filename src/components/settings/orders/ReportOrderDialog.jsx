import React, { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FormError from "../../FormError";
import useDialogA11y from "./useDialogA11y";
import {
  CameraIcon,
  ChatIcon,
  CloseIcon,
} from "./orderIcons";
import { formatNaira } from "../../../lib/money";
import { formatOrderDate, getOrderTotal } from "./orderUtils";

const issues = [
  "Missing item",
  "Wrong item",
  "Late delivery",
  "Quality",
  "Something else",
];

const ReportOrderForm = ({ order, onClose, onSent }) => {
  const [issue, setIssue] = useState("Missing item");
  const [details, setDetails] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [error, setError] = useState("");
  const detailsRef = useRef(null);
  const fileRef = useRef(null);

  const titleId = useId();
  const orderFieldId = useId();
  const detailsId = useId();
  const detailsErrorId = useId();

  const dialogRef = useDialogA11y({
    open: true,
    onClose,
    initialFocusRef: detailsRef,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!details.trim()) {
      setError("Tell us what happened so we can help.");
      detailsRef.current?.focus();
      return;
    }
    onSent({ issue, details: details.trim(), photoName });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[130] flex items-end justify-center bg-ink/55 px-0 sm:items-center sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.2, 0.75, 0.2, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full max-w-[600px] overflow-y-auto rounded-t-[28px] bg-cream-light p-5 sm:rounded-[24px] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink"
          >
            Report an order
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close report dialog"
            className="grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-cream-light text-ink transition-colors hover:bg-cream"
          >
            <CloseIcon size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <label
            htmlFor={orderFieldId}
            className="block text-[13px] font-bold text-ink"
          >
            Order
          </label>
          <input
            id={orderFieldId}
            type="text"
            readOnly
            value={`#${order.id} · ${formatOrderDate(order.date)} · ${formatNaira(
              getOrderTotal(order),
            )}`}
            className="mt-2 w-full rounded-[14px] border-[1.5px] border-ink bg-[#FDF0E9] px-4 py-3 text-[14px] text-muted"
          />
          <p className="mt-1 text-[12px] text-muted">Filled in for you</p>

          <fieldset className="mt-4">
            <legend className="text-[13px] font-bold text-ink">
              What went wrong?
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {issues.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={issue === option}
                  onClick={() => setIssue(option)}
                  className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                    issue === option
                      ? "bg-ink text-cream"
                      : "border-[1.5px] border-ink bg-cream-light text-ink hover:bg-cream"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor={detailsId}
            className="mt-4 block text-[13px] font-bold text-ink"
          >
            Tell us more
          </label>
          <textarea
            ref={detailsRef}
            id={detailsId}
            rows={4}
            value={details}
            onChange={(event) => {
              setDetails(event.target.value);
              setError("");
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? detailsErrorId : undefined}
            placeholder="e.g. The asun was not in my bag. Everything else was fine."
            className={`mt-2 w-full resize-none rounded-[14px] border-[1.5px] bg-cream-light px-4 py-3 text-[14px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-1 ${
              error
                ? "border-tomato focus:border-tomato focus:ring-tomato"
                : "border-ink focus:border-tomato focus:ring-tomato"
            }`}
          />
          <FormError id={detailsErrorId}>{error}</FormError>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "")}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-dashed border-[#CDBFAF] bg-transparent px-4 py-3 text-[13px] font-semibold text-muted transition-colors hover:border-ink/50 hover:text-ink"
          >
            <CameraIcon size={17} />
            {photoName || "Add a photo (optional)"}
          </button>

          <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-muted">
            <span className="mt-0.5 shrink-0">
              <ChatIcon size={15} />
            </span>
            We&apos;ll open WhatsApp with these details so they reach the kitchen.
            Attach your photo in the chat.
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border-[1.5px] border-ink bg-transparent px-5 py-3 text-[14px] font-bold text-ink transition-colors hover:bg-cream sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-tomato px-5 py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(215,38,30,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0 sm:w-auto"
            >
              Send report
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ReportOrderDialog = ({ open, order, onClose, onSent }) => (
  <AnimatePresence>
    {open && order && (
      <ReportOrderForm
        key={order.id}
        order={order}
        onClose={onClose}
        onSent={onSent}
      />
    )}
  </AnimatePresence>
);

export default ReportOrderDialog;
