import React from "react";
import { getOrderStatusLabel, getOrderStatusTone } from "./orderUtils";

const toneClasses = {
  active: "bg-tomato text-white",
  delivered: "bg-[#F1E4D7] text-ink",
  cancelled: "bg-ink text-cream-light",
};

const OrderStatusPill = ({ order, className = "" }) => {
  const tone = getOrderStatusTone(order);

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold leading-none ${toneClasses[tone]} ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {getOrderStatusLabel(order)}
    </span>
  );
};

export default OrderStatusPill;
