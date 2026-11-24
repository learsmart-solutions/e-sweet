import React from "react";
import { Link } from "../../lib/router";
import { LegalInfo } from "./SettingsParts";
import { getInitial } from "./settingsStyles";
import { settingsItems } from "./sections";

// Desktop left nav. Every desktop Settings screen shares this shell
// (Figma note 5).
const SettingsSidebar = ({ user, phone, activeKey }) => (
  <aside className="sticky top-6 flex min-h-[min(742px,calc(100svh-48px))] w-[280px] shrink-0 flex-col gap-1 self-start rounded-[24px] bg-cream-light p-3">
    <div className="flex items-center gap-3 px-2 pb-4 pt-2">
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-tomato font-display text-[20px] font-extrabold text-cream-light"
      >
        {getInitial(user.name)}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-display text-[17px] font-extrabold tracking-[-0.02em] text-ink">
          {user.name}
        </span>
        {phone && (
          <span className="truncate text-[13px] text-muted">{phone}</span>
        )}
      </span>
    </div>

    <nav aria-label="Settings" className="flex flex-col gap-1">
      {settingsItems.map((item) => {
        const active = item.key === activeKey;
        return (
          <Link
            key={item.key}
            to={item.to}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[15px] transition-colors ${
              active
                ? "bg-ink font-bold text-cream-light"
                : "font-semibold text-ink hover:bg-cream"
            }`}
          >
            <img
              src={active ? item.navActiveIcon : item.navIcon}
              alt=""
              width="18"
              height="18"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>

    <div className="mt-auto">
      <LegalInfo compact />
    </div>
  </aside>
);

export default SettingsSidebar;
