import React, { useState } from "react";
import { ContainerMark } from "../SiteNav";
import { Link, navigate } from "../../lib/router";
import { formatNaira, useStore } from "../../context/StoreContext";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" aria-hidden="true">
    <circle
      cx="10.8"
      cy="10.8"
      r="6.3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    />
    <path
      d="m16 16 4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

const BagIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
    <path
      d="M5.5 8.5h13l1 11h-15l1-11Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 8.5V7a3 3 0 0 1 6 0v1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MenuNav = ({ search, onSearchChange }) => {
  const { user, cartCount, bagTotal, logout } = useStore();
  const [userOpen, setUserOpen] = useState(false);
  const firstName = user?.name?.split(" ")[0] || "";
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "G";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream-light/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] w-full max-w-[1312px] items-center gap-3 px-4 sm:h-[76px] sm:gap-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="e'sweet home"
        >
          <ContainerMark />
          <span className="font-logo text-[21px] font-extrabold leading-none tracking-[-0.035em] text-tomato sm:text-[23px]">
            e&apos;sweet
          </span>
        </Link>

        <div className="mx-auto hidden w-full max-w-[440px] md:block">
          <label className="flex h-10 items-center gap-2.5 rounded-full bg-cream px-4 text-ink/45 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-tomato/40">
            <SearchIcon />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search jollof, chicken, zobo..."
              className="h-full w-full bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-ink/35"
            />
          </label>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-3">
          <div className="relative">
            {user ? (
              <button
                type="button"
                onClick={() => setUserOpen((value) => !value)}
                aria-expanded={userOpen}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-[13px] font-bold text-ink/75 transition-colors hover:text-tomato"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-tomato text-[12px] font-black text-white">
                  {initial}
                </span>
                <span className="hidden max-w-[72px] truncate sm:inline">
                  {firstName}
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-[13px] font-bold text-ink/75 transition-colors hover:text-tomato"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sand text-[12px] font-black text-ink/60">
                  G
                </span>
                <span className="hidden sm:inline">Log in</span>
              </Link>
            )}

            {user && userOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[150px] rounded-2xl bg-cream-light p-2 shadow-[0_16px_40px_rgba(30,20,10,0.16)] ring-1 ring-ink/10">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/35">
                  {user.email}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setUserOpen(false);
                    navigate("/");
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-ink/70 hover:bg-cream hover:text-tomato"
                >
                  Log out
                </button>
              </div>
            )}
          </div>

          <Link
            to="/bag"
            scroll={false}
            aria-label={`Open bag${cartCount ? `, ${cartCount} items` : ""}`}
            className="relative inline-flex h-10 items-center gap-2 rounded-full bg-ink px-3.5 text-[12px] font-bold text-cream transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:px-4"
          >
            <BagIcon />
            <span>{cartCount ? formatNaira(bagTotal) : "Bag"}</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-tomato px-1 text-[10px] font-black text-white ring-2 ring-cream-light">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MenuNav;
