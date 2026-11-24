import React, { useEffect, useRef } from "react";
import { Link } from "../../lib/router";
import { buttonVariants } from "./settingsStyles";
import lockIcon from "../../assets/icons/settings/lock-32.svg";
import lockIconLg from "../../assets/icons/settings/lock-36.svg";
import receiptIcon from "../../assets/icons/settings/receipt-18.svg";
import mapPinIcon from "../../assets/icons/settings/map-pin-18.svg";
import giftIcon from "../../assets/icons/settings/gift-18.svg";

// Phone shows the long benefit copy as a list, desktop the short copy as
// three tiles.
//
// Only benefits with `ready: true` are shown, so the page never promises a
// feature customers can't use yet. Flip each one on as its section ships.
// TODO: the ₦500 referral reward is a placeholder in the design (open
// question 1 in Figma). Confirm the amount before turning referral on.
const benefits = [
  {
    icon: receiptIcon,
    label: "Reorder past meals in one tap",
    short: "Reorder in one tap",
    ready: false,
  },
  {
    icon: mapPinIcon,
    label: "Save Home and Work addresses",
    short: "Save addresses",
    ready: false,
  },
  {
    icon: giftIcon,
    label: "Earn ₦500 for every friend",
    short: "Earn ₦500 credit",
    ready: false,
  },
];

const shownBenefits = benefits.filter((benefit) => benefit.ready);

// Shown when someone opens Settings without being signed in.
// `focusOnMount` moves focus to the heading right after signing out, so
// keyboard and screen-reader users land on the new screen. Phone and desktop
// each render a copy; only the visible one (with an offsetParent) takes focus.
const SignedOutPrompt = ({ focusOnMount = false }) => {
  const headingRef = useRef(null);

  useEffect(() => {
    if (focusOnMount && headingRef.current?.offsetParent) {
      headingRef.current.focus();
    }
  }, [focusOnMount]);

  return (
    <div className="flex w-full flex-col gap-4 lg:w-[520px] lg:gap-0">
      <div className="flex flex-col items-center gap-3.5 rounded-[24px] bg-cream-light p-6 text-center lg:gap-4 lg:rounded-[28px] lg:p-10">
        <span className="grid size-[72px] place-items-center rounded-full bg-tomato lg:size-20">
          <img
            src={lockIcon}
            alt=""
            width="32"
            height="32"
            className="lg:hidden"
          />
          <img
            src={lockIconLg}
            alt=""
            width="36"
            height="36"
            className="hidden lg:block"
          />
        </span>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink outline-none lg:text-[28px]"
        >
          Sign in to see your settings
        </h2>
        <p className="text-[14px] leading-5 text-muted lg:text-[15px] lg:leading-[22px]">
          Your profile and account details are kept safe in your account.
        </p>
        <div className="flex w-full flex-col gap-3.5 lg:flex-row-reverse lg:gap-2.5">
          <Link
            to="/login"
            className={`${buttonVariants.red} w-full lg:flex-1`}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className={`${buttonVariants.ghost} w-full lg:flex-1`}
          >
            Create an account
          </Link>
        </div>

        {shownBenefits.length > 0 && (
          <ul className="hidden w-full gap-3 lg:flex">
            {shownBenefits.map((benefit) => (
              <li
                key={benefit.short}
                className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-[14px] bg-cream p-3"
              >
                <img src={benefit.icon} alt="" width="18" height="18" />
                <span className="text-[12px] font-semibold text-ink">
                  {benefit.short}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {shownBenefits.length > 0 && (
        <ul className="flex flex-col gap-px overflow-hidden rounded-[18px] bg-sand lg:hidden">
          {shownBenefits.map((benefit) => (
            <li
              key={benefit.label}
              className="flex items-center gap-3 bg-cream-light px-4 py-3"
            >
              <img src={benefit.icon} alt="" width="18" height="18" />
              <span className="text-[14px] font-semibold text-ink">
                {benefit.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SignedOutPrompt;
