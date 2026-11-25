import React from "react";
import OrderStatusPill from "./OrderStatusPill";
import { ArrowRightIcon } from "./orderIcons";
import { formatActiveDate, getActiveSummary } from "./orderUtils";

const OrderActiveCard = ({ order, onTrack }) => (
  <section
    aria-label={`Active order ${order.id}`}
    className="flex w-full flex-col items-start rounded-[22px] border-2 border-tomato bg-cream-light p-4 sm:p-5"
  >
    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
      Active · #{order.id} · {formatActiveDate(order)}
    </p>
    <p className="mt-1 line-clamp-2 font-display text-[18px] font-bold leading-snug tracking-[-0.01em] text-ink">
      {getActiveSummary(order)}
    </p>
    <div className="mt-2.5">
      <OrderStatusPill order={order} />
    </div>
    <button
      type="button"
      onClick={onTrack}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[15px] font-bold text-cream transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
    >
      Track order
      <ArrowRightIcon size={17} />
    </button>
  </section>
);

export default OrderActiveCard;
