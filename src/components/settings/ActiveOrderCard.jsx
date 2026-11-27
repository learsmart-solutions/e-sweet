import React from "react";
import { Link } from "../../lib/router";
import { buttonVariants } from "./settingsStyles";
import truckIcon from "../../assets/icons/settings/truck.svg";

// Red card pinned to the top of Settings while an order is in progress.
//
// order = {
//   code: "ES-1042",
//   headline: "On the way · arrives ~12:40",
//   step: 2,        // stages completed so far
//   totalSteps: 3,  // bars in the progress strip
// }
//
// Settings renders this card when StoreContext has one order with status
// "active". The stage names are still open in Figma (open question 3).
const ActiveOrderCard = ({ order, trackTo }) => {
  const totalSteps = order.totalSteps ?? 3;

  return (
    <section
      aria-label={`Active order ${order.code}`}
      className="flex w-full flex-col items-start gap-3 rounded-[20px] bg-tomato p-4 text-cream-light"
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-[11px] font-bold tracking-[0.06em] opacity-85">
            ACTIVE ORDER · #{order.code}
          </p>
          <p className="font-display text-[18px] font-extrabold tracking-[-0.01em]">
            {order.headline}
          </p>
        </div>
        <img
          src={truckIcon}
          alt=""
          width="28"
          height="28"
          className="shrink-0"
        />
      </div>

      <div
        className="flex w-full gap-1.5"
        role="progressbar"
        aria-label="Order progress"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={order.step}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-[3px] bg-cream-light ${
              index < order.step ? "" : "opacity-35"
            }`}
          />
        ))}
      </div>

      <Link to={trackTo} className={buttonVariants.ink}>
        Track order →
      </Link>
    </section>
  );
};

export default ActiveOrderCard;
