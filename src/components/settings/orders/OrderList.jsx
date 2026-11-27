import React from "react";
import OrderStatusPill from "./OrderStatusPill";
import OrderThumbnail from "./OrderThumbnail";
import { formatNaira } from "../../../lib/money";
import { formatOrderDate, getOrderShortTitle, getOrderTotal } from "./orderUtils";

const OrderList = ({ orders, selectedId, onSelect }) => (
  <section className="flex w-full flex-col gap-3">
    <h2 className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
      Past orders
    </h2>
    <div className="overflow-hidden rounded-[20px] border border-[#F0E4D6] bg-cream-light">
      {orders.map((order, index) => {
        const selected = order.id === selectedId;
        return (
          <button
            key={order.id}
            type="button"
            onClick={() => onSelect(order)}
            aria-pressed={selected}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
              index > 0 ? "border-t border-[#F0E4D6]" : ""
            } ${
              selected
                ? "bg-[#FFF8F0] shadow-[inset_0_0_0_1px_#EFE4D8]"
                : "bg-transparent hover:bg-[#FFFBF7]"
            }`}
          >
            <OrderThumbnail item={order.items?.[0]} size={40} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[15px] font-bold text-ink">
                {getOrderShortTitle(order)}
              </span>
              <span className="mt-0.5 block text-[12px] text-muted">
                {formatOrderDate(order.date)} · {formatNaira(getOrderTotal(order))}
              </span>
              <span className="mt-1.5 block sm:hidden">
                <OrderStatusPill order={order} />
              </span>
            </span>
            <span className="ml-auto hidden sm:block">
              <OrderStatusPill order={order} />
            </span>
          </button>
        );
      })}
    </div>
  </section>
);

export default OrderList;
