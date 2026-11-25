import React from "react";
import { buttonVariants } from "./settingsStyles";
import wifiOffIcon18 from "../../assets/icons/settings/wifi-off-18.svg";
import wifiOffIcon44 from "../../assets/icons/settings/wifi-off-44.svg";

// From the Figma "Error — no internet" frame (Order history). Every section
// page can use these two pieces.

// Ink strip under the phone top bar. On phone it runs edge to edge (the
// Settings <main> has 16px side padding, hence -mx-4); on desktop it sits
// in the content column as a rounded bar.
export const OfflineBanner = ({
  message = "Showing what we saved. Some info may be out of date.",
  desktop = false,
}) => (
  <div
    role="status"
    className={`flex items-center gap-2.5 bg-ink px-4 py-3 text-cream-light ${
      desktop ? "rounded-[16px]" : "-mx-4 -mt-2"
    }`}
  >
    <img
      src={wifiOffIcon18}
      alt=""
      width="18"
      height="18"
      className="shrink-0"
    />
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <p className="text-[14px] font-bold">You&rsquo;re offline</p>
      <p className="text-[12px]">{message}</p>
    </div>
  </div>
);

// Full screen when nothing has loaded yet.
export const NoInternet = ({ what = "this page", onRetry, desktop = false }) => (
  <div
    className={`flex w-full flex-col items-center gap-3.5 px-6 py-10 text-center ${
      desktop ? "rounded-[24px] bg-cream-light" : ""
    }`}
  >
    <span className="grid size-24 place-items-center rounded-full bg-sand">
      <img src={wifiOffIcon44} alt="" width="44" height="44" />
    </span>
    <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">
      No internet connection
    </h2>
    <p className="max-w-[327px] text-[14px] leading-5 text-muted">
      We couldn&rsquo;t load {what}. Check your data or Wi&#8209;Fi and try
      again.
    </p>
    <button type="button" onClick={onRetry} className={buttonVariants.ink}>
      Try again
    </button>
  </div>
);
