import React, { useEffect, useRef, useState } from "react";
import { ContainerMark } from "../SiteNav";
import { Link } from "../../lib/router";
import { buttonVariants, getInitial } from "./settingsStyles";
import { SETTINGS_PATH } from "./sections";
import chevronDownIcon from "../../assets/icons/settings/chevron-down-12.svg";

// Landing sections are hash anchors on the home page, so they load "/"
// in full and the browser scrolls to the anchor.
const links = [
  { label: "Our story", href: "/#story" },
  { label: "Menu", to: "/menu" },
  { label: "How it works", href: "/#how" },
  { label: "Visit", href: "/#visit" },
];

const linkClass =
  "text-[15px] font-semibold text-ink transition-colors hover:text-tomato";

// Desktop-only pill nav from the Figma "Nav bar" component, in its
// signed-in and signed-out states.
const SettingsDesktopNav = ({ user, onSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "";

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (event) => {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (
        event.type === "pointerdown" &&
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setMenuOpen(false);
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  return (
    <nav
      aria-label="Main"
      className="relative z-20 flex h-[70px] w-full items-center justify-between rounded-full bg-cream-light py-2.5 pl-[22px] pr-2.5 shadow-[0_10px_20px_rgba(61,20,10,0.3)]"
    >
      <Link
        to="/"
        className="flex items-center gap-2.5"
        aria-label="e'sweet home"
      >
        <ContainerMark />
        <span className="font-logo text-[24px] font-extrabold leading-none tracking-[-0.035em] text-tomato">
          e&apos;sweet
        </span>
      </Link>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[30px]">
        {links.map((link) =>
          link.to ? (
            <Link key={link.label} to={link.to} className={linkClass}>
              {link.label}
            </Link>
          ) : (
            <a key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ),
        )}
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-cream"
              >
                <span
                  aria-hidden="true"
                  className="grid size-[38px] place-items-center rounded-full bg-tomato font-display text-[16px] font-extrabold text-cream-light"
                >
                  {getInitial(user.name)}
                </span>
                {firstName}
                <img src={chevronDownIcon} alt="" width="12" height="12" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Account"
                  className="absolute right-0 top-[calc(100%+8px)] w-[170px] rounded-2xl bg-cream-light p-2 shadow-[0_16px_40px_rgba(30,20,10,0.16)] ring-1 ring-ink/10"
                >
                  <Link
                    to={`${SETTINGS_PATH}/orders`}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-ink/70 hover:bg-cream hover:text-tomato"
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-ink/70 hover:bg-cream hover:text-tomato"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
            <Link to="/menu" className={buttonVariants.red}>
              Order now →
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-full px-[18px] py-4 text-[15px] font-bold text-ink transition-colors hover:text-tomato"
            >
              Log in
            </Link>
            <Link to="/signup" className={buttonVariants.red}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default SettingsDesktopNav;
