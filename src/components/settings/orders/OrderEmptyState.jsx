import React from "react";
import { Link } from "../../../lib/router";
import { ArrowRightIcon, ReceiptIcon } from "./orderIcons";

const OrderEmptyState = () => (
  <section className="flex w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#E5D7CC] bg-[#FFFBF7]/60 px-6 py-12 text-center sm:py-16">
    <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#F6E8DF] text-ink">
      <ReceiptIcon size={30} />
    </div>
    <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink sm:text-[24px]">
      No orders yet
    </h2>
    <p className="mt-2 max-w-[440px] text-[14px] leading-relaxed text-muted sm:text-[15px]">
      Your past orders, receipts and quick reorders will show up here.
    </p>
    <Link
      to="/menu"
      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-6 py-3.5 text-[15px] font-bold text-cream-light shadow-[0_12px_16px_rgba(215,38,30,0.38)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
    >
      Browse the menu
      <ArrowRightIcon size={17} />
    </Link>
  </section>
);

export default OrderEmptyState;
