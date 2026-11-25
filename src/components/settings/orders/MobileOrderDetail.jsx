import React, { useId, useRef } from "react";
import arrowLeftIcon from "../../../assets/icons/settings/arrow-left.svg";
import OrderDetailCard from "./OrderDetailCard";
import useDialogA11y from "./useDialogA11y";

const MobileOrderDetail = ({ open, order, onClose, detailProps }) => {
  const backRef = useRef(null);
  const titleId = useId();
  const dialogRef = useDialogA11y({
    open: open && Boolean(order),
    onClose,
    initialFocusRef: backRef,
  });

  if (!open || !order || !detailProps) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[120] flex flex-col bg-cream lg:hidden"
    >
      <div className="flex h-16 shrink-0 items-center gap-3 px-4">
        <button
          ref={backRef}
          type="button"
          onClick={onClose}
          aria-label="Back to order history"
          className="grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-cream-light transition-colors hover:bg-cream"
        >
          <img src={arrowLeftIcon} alt="" width="20" height="20" />
        </button>
        <h1
          id={titleId}
          className="min-w-0 flex-1 truncate font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink"
        >
          Order details
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        <OrderDetailCard {...detailProps} />
      </div>
    </div>
  );
};

export default MobileOrderDetail;
