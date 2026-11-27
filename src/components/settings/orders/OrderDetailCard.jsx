import React from "react";
import OrderStatusPill from "./OrderStatusPill";
import OrderThumbnail from "./OrderThumbnail";
import {
  ArrowRightIcon,
  DownloadIcon,
  ShareIcon,
} from "./orderIcons";
import { formatNaira } from "../../../lib/money";
import { TAKEAWAY_PACK_FEE } from "../../../lib/pricing";
import {
  getOrderDeliveryFee,
  getOrderMeta,
  getOrderPackCount,
  getOrderPackFee,
  getOrderSubtotal,
  getOrderTotal,
} from "./orderUtils";

const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-ink bg-transparent px-4 py-3 text-[14px] font-bold text-ink transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato";

const redButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-5 py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(215,38,30,0.35)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato";

const OrderDetailCard = ({
  order,
  onDownload,
  onShare,
  onReport,
  onReorder,
  className = "",
}) => {
  const subtotal = getOrderSubtotal(order);
  const packCount = getOrderPackCount(order);
  const packFee = getOrderPackFee(order);
  const deliveryFee = getOrderDeliveryFee(order);
  const total = getOrderTotal(order);

  return (
    <article
      className={`flex w-full flex-col gap-5 rounded-[24px] border border-[#F0E4D6] bg-cream-light p-4 sm:p-5 ${className}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
            Order #{order.id}
          </h2>
          <p className="mt-1 text-[13px] text-muted">{getOrderMeta(order)}</p>
        </div>
        <OrderStatusPill order={order} />
      </header>

      <ul className="flex flex-col gap-3.5">
        {(order.items ?? []).map((item, index) => (
          <li
            key={`${order.id}-${item.menuItemId || item.name}-${index}`}
            className="flex items-start gap-3"
          >
            <OrderThumbnail item={item} size={44} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-snug text-ink">
                {item.name}
              </p>
              {item.customisation && (
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                  {item.customisation}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[12px] text-muted">×{item.qty}</p>
              <p className="mt-0.5 text-[14px] font-bold text-ink">
                {formatNaira(Number(item.unitPrice || 0) * Number(item.qty || 0))}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[16px] bg-[#FAF2EB] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
            Address
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">
            {order.address || "—"}
          </p>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
            Payment
          </p>
          <p className="mt-1 text-[13px] font-semibold text-ink">
            {order.payment || "—"}
          </p>

          {order.kitchenNote && (
            <>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                Kitchen note
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">
                {order.kitchenNote}
              </p>
            </>
          )}
        </div>

        <div className="rounded-[16px] bg-[#FAF2EB] p-4">
          <dl className="flex flex-col gap-2 text-[13px] text-ink">
            <div className="flex items-baseline justify-between gap-3">
              <dt>Subtotal</dt>
              <dd className="font-semibold">{formatNaira(subtotal)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt>
                Packs ({packCount} × {formatNaira(TAKEAWAY_PACK_FEE)})
              </dt>
              <dd className="font-semibold">{formatNaira(packFee)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt>Delivery fee</dt>
              <dd className="font-semibold">{formatNaira(deliveryFee)}</dd>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-[#EADCCD] pt-2 text-[15px] font-extrabold">
              <dt>Total</dt>
              <dd>{formatNaira(total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onDownload(order)}
            className={outlineButton}
          >
            <DownloadIcon />
            Download receipt
          </button>
          <button
            type="button"
            onClick={() => onShare(order)}
            className={outlineButton}
          >
            <ShareIcon />
            Share receipt
          </button>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onReport(order)}
            className={outlineButton}
          >
            Report an order
          </button>
          <button
            type="button"
            onClick={() => onReorder(order)}
            className={redButton}
          >
            Reorder
            <ArrowRightIcon size={17} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default OrderDetailCard;
