import React from "react";
import { Link } from "../../lib/router";
import { APP_VERSION } from "./sections";
import { getInitial } from "./settingsStyles";
import arrowLeftIcon from "../../assets/icons/settings/arrow-left.svg";
import logoutIcon16 from "../../assets/icons/settings/logout-16.svg";
import logoutIcon18 from "../../assets/icons/settings/logout-18.svg";
import chevronRightIcon from "../../assets/icons/settings/chevron-right.svg";
import chevronRightRedIcon from "../../assets/icons/settings/chevron-right-red.svg";

export const PhoneTopBar = ({
  title = "Settings",
  backTo = "/menu",
  onSignOut,
}) => (
  <div className="flex h-16 items-center gap-3 px-4">
    <Link
      to={backTo}
      aria-label="Back"
      className="grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-cream-light transition-colors hover:bg-cream"
    >
      <img src={arrowLeftIcon} alt="" width="20" height="20" />
    </Link>
    <h1 className="min-w-0 flex-1 truncate font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink">
      {title}
    </h1>
    {onSignOut && <SignOutButton onClick={onSignOut} />}
  </div>
);

// The outlined "Sign out" pill used in the phone top bar and the desktop
// header. `size="lg"` is the desktop version.
export const SignOutButton = ({ onClick, size = "sm" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex shrink-0 items-center rounded-full border-[1.5px] border-ink bg-cream-light font-bold text-ink transition-colors hover:bg-cream ${
      size === "lg"
        ? "gap-2 px-4 py-2.5 text-[14px]"
        : "gap-1.5 px-3 py-2 text-[13px]"
    }`}
  >
    <img src={logoutIcon16} alt="" width="16" height="16" />
    Sign out
  </button>
);

export const ProfileSummary = ({ name, phone, editTo }) => (
  <Link
    to={editTo}
    className="group flex w-full items-center gap-3.5 rounded-[20px] bg-cream-light p-4 transition-shadow hover:shadow-[0_8px_24px_rgba(30,20,10,0.08)]"
  >
    <span
      aria-hidden="true"
      className="grid size-14 shrink-0 place-items-center rounded-full bg-tomato font-display text-[25px] font-extrabold text-cream-light"
    >
      {getInitial(name)}
    </span>
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="truncate font-display text-[20px] font-extrabold tracking-[-0.02em] text-ink">
        {name}
      </span>
      {phone && (
        <span className="truncate text-[14px] text-muted">{phone}</span>
      )}
    </span>
    <span className="flex shrink-0 items-center gap-1 text-[14px] font-bold text-tomato">
      Edit
      <img
        src={chevronRightRedIcon}
        alt=""
        width="16"
        height="16"
        className="transition-transform group-hover:translate-x-0.5"
      />
    </span>
  </Link>
);

// Rows stack with a 1px gap on a sand fill, which draws the dividers
// (see the Figma "Settings row" component notes).
export const SettingsGroup = ({ title, items }) => (
  <section className="flex w-full flex-col gap-2">
    <h2 className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
      {title}
    </h2>
    <ul className="flex flex-col gap-px overflow-hidden rounded-[18px] bg-sand">
      {items.map((item) => (
        <li key={item.key}>
          <SettingsRow {...item} />
        </li>
      ))}
    </ul>
  </section>
);

export const SettingsRow = ({ label, description, icon, to }) => (
  <Link
    to={to}
    className="flex w-full items-center gap-3 bg-cream-light px-4 py-3 transition-colors hover:bg-[#fff8ec] focus-visible:relative focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tomato"
  >
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream">
      <img src={icon} alt="" width="20" height="20" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="text-[15px] font-semibold text-ink">{label}</span>
      <span className="text-[13px] text-muted">{description}</span>
    </span>
    <img
      src={chevronRightIcon}
      alt=""
      width="20"
      height="20"
      className="shrink-0"
    />
  </Link>
);

// Terms and privacy pages do not exist yet, so these are plain text until
// the legal copy is ready.
export const LegalInfo = ({ compact = false }) =>
  compact ? (
    <div className="flex flex-col gap-1 px-3.5 py-2 text-[12px] text-muted">
      <p>Terms of service · Privacy policy</p>
      <p>e&apos;sweet · version {APP_VERSION}</p>
    </div>
  ) : (
    <div className="flex flex-col gap-1.5 p-1 text-[12px] text-muted">
      <p className="flex gap-4">
        <span className="underline decoration-from-font underline-offset-2">
          Terms of service
        </span>
        <span className="underline decoration-from-font underline-offset-2">
          Privacy policy
        </span>
      </p>
      <p>e&apos;sweet · version {APP_VERSION}</p>
    </div>
  );

export const BottomSignOutButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-ink bg-cream-light px-4 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-cream"
  >
    <img src={logoutIcon18} alt="" width="18" height="18" />
    Sign out
  </button>
);
