import React, { useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OrderThumbnail from "./OrderThumbnail";
import useDialogA11y from "./useDialogA11y";
import { CheckIcon, CloseIcon } from "./orderIcons";
import {
  getAvailableItems,
  getItemAvailability,
  getUnavailableItems,
} from "./orderUtils";

const ReorderForm = ({ order, onClose, onGoToBag }) => {
  const keepBrowsingRef = useRef(null);
  const titleId = useId();

  const dialogRef = useDialogA11y({
    open: true,
    onClose,
    initialFocusRef: keepBrowsingRef,
  });

  const availableItems = getAvailableItems(order);
  const unavailableItems = getUnavailableItems(order);
  const totalItems = (order.items ?? []).length;
  const namesFor = (entries) => entries.map(({ item }) => item.name).join(", ");
  const soldOutItems = unavailableItems.filter(
    ({ reason }) => reason === "sold-out",
  );
  const removedItems = unavailableItems.filter(
    ({ reason }) => reason === "removed",
  );
  const skippedCopy = [
    soldOutItems.length > 0
      ? `${namesFor(soldOutItems)} ${
          soldOutItems.length === 1 ? "is" : "are"
        } sold out today, so we skipped ${
          soldOutItems.length === 1 ? "it" : "them"
        }.`
      : "",
    removedItems.length > 0
      ? `${namesFor(removedItems)} ${
          removedItems.length === 1 ? "is" : "are"
        } no longer on the menu, so we skipped ${
          removedItems.length === 1 ? "it" : "them"
        }.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const copy = skippedCopy
    ? `${skippedCopy} Everything else is in your bag.`
    : "Everything from this order is in your bag.";

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
        className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[28px] bg-cream-light p-5 sm:rounded-[24px] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[24px]"
          >
            {availableItems.length} of {totalItems} items added to your bag
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reorder dialog"
            className="grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-cream-light text-ink transition-colors hover:bg-cream"
          >
            <CloseIcon size={17} />
          </button>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-muted">{copy}</p>

        <ul className="mt-4 divide-y divide-[#F0E4D6]">
          {(order.items ?? []).map((item, index) => {
            const availability = getItemAvailability(item);
            return (
              <li
                key={`${order.id}-reorder-${item.menuItemId || item.name}-${index}`}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <OrderThumbnail item={item} size={40} />
                <span className="min-w-0 flex-1 text-[14px] font-bold text-ink">
                  {item.name}
                  {Number(item.qty) > 1 ? ` ×${item.qty}` : ""}
                </span>
                {availability === "available" ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#22C55E] text-white">
                    <CheckIcon size={13} />
                  </span>
                ) : (
                  <span className="max-w-[120px] shrink-0 text-right text-[12px] font-bold text-tomato">
                    {availability === "sold-out"
                      ? "Sold out · skipped"
                      : "No longer on menu · skipped"}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <button
            ref={keepBrowsingRef}
            type="button"
            onClick={onClose}
            className="w-full rounded-full border-[1.5px] border-ink bg-transparent px-5 py-3 text-[14px] font-bold text-ink transition-colors hover:bg-cream sm:w-auto"
          >
            Keep browsing
          </button>
          <button
            type="button"
            onClick={onGoToBag}
            className="w-full rounded-full bg-tomato px-5 py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(215,38,30,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0 sm:w-auto"
          >
            Go to bag
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReorderDialog = ({ open, order, onClose, onGoToBag }) => (
  <AnimatePresence>
    {open && order && (
      <ReorderForm
        key={order.id}
        order={order}
        onClose={onClose}
        onGoToBag={onGoToBag}
      />
    )}
  </AnimatePresence>
);

export default ReorderDialog;
