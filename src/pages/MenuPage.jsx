import React, { useEffect, useMemo, useState } from "react";
import MenuNav from "../components/menu/MenuNav";
import MenuCard from "../components/menu/MenuCard";
import BagDrawer from "../components/menu/BagDrawer";
import AuthModal from "../components/auth/AuthModal";
import { ContainerMark } from "../components/SiteNav";
import { Link, navigate } from "../lib/router";
import { menuItems } from "../data/menu";
import { useStore } from "../context/StoreContext";
import containerImg from "../assets/layers/container.png";

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

const MenuFooter = () => (
  <footer className="bg-ink px-5 pb-9 pt-9 text-cream sm:px-8 lg:px-12">
    <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Link to="/" className="flex items-center gap-2.5" aria-label="e'sweet home">
        <ContainerMark />
        <span className="font-logo text-[22px] font-extrabold leading-none tracking-[-0.035em] text-tomato">
          e&apos;sweet
        </span>
      </Link>
      <p className="text-[12px] text-cream/50">
        20A, Idiroko Road Sango Ota, Ogun State.
      </p>
    </div>
  </footer>
);

const MenuPage = ({
  bagOpen = false,
  bagStep = "order",
  authMode = null,
}) => {
  const { cart, addItem, removeItem } = useStore();
  const [search, setSearch] = useState("");
  const overlayOpen = bagOpen || Boolean(authMode);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesQuery =
        !query ||
        `${item.name} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(query);
      return matchesQuery;
    });
  }, [search]);

  useEffect(() => {
    if (!overlayOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlayOpen]);

  const closeBag = () =>
    navigate("/menu", { replace: true, scroll: false });

  return (
    <div className="min-h-svh bg-cream">
      <div className={overlayOpen ? "pointer-events-none blur-[2px]" : ""}>
        <MenuNav search={search} onSearchChange={setSearch} />

        <main className="mx-auto w-full max-w-[1312px] px-4 pb-12 sm:px-8 lg:px-12">
          <div className="pt-4 md:hidden">
            <label className="flex h-10 items-center gap-2.5 rounded-full bg-cream-light px-4 text-ink/45 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-tomato/40">
              <SearchIcon />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jollof, chicken, zobo..."
                className="h-full w-full bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-ink/35"
              />
            </label>
          </div>

          <section className="grid items-center gap-8 py-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:py-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cream-light px-3 py-1.5 text-[11px] font-semibold text-ink/55 ring-1 ring-ink/[0.06]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25a35a]" />
                Open now · ready in ~15 min
              </div>

              <h1 className="mt-5 max-w-[720px] font-display text-[clamp(2.7rem,5.2vw,4.2rem)] font-black leading-[0.91] tracking-[-0.065em] text-ink">
                Take-out, straight from the kitchen.
              </h1>
              <p className="mt-4 max-w-[560px] text-[14px] leading-[1.65] text-ink/60 sm:text-[15px]">
                Order ahead, skip the queue and pick up hot at the window, or
                get it delivered across Sango Ota, Ogun State.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Pickup is free", "Delivery from ₦1,500", "Cooked to order"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-full bg-sand px-3 py-1.5 text-[11px] font-semibold text-ink/60"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] lg:justify-self-end">
              <div className="overflow-hidden rounded-[26px] shadow-[0_22px_45px_rgba(80,45,20,0.16)]">
                <img
                  src={containerImg}
                  alt="The e'sweet container kitchen at night"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </section>

          <section aria-label="Menu items">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-tomato">
                  From the window
                </p>
                <h2 className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-black leading-none tracking-[-0.05em] text-ink">
                  Everything on the menu
                </h2>
              </div>
              <p className="hidden text-[12px] font-semibold text-ink/40 sm:block">
                {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"}
              </p>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    quantity={cart[item.id] || 0}
                    onAdd={addItem}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-cream-light px-6 py-16 text-center ring-1 ring-ink/[0.05]">
                <p className="font-display text-[22px] font-black tracking-[-0.04em]">
                  Nothing matches that search.
                </p>
                <p className="mt-2 text-[13px] text-ink/50">
                  Try another dish or drink.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-full bg-tomato px-5 py-3 text-[13px] font-bold text-white shadow-[0_3px_0_#a5130c]"
                >
                  Show everything
                </button>
              </div>
            )}
          </section>
        </main>

        <MenuFooter />
      </div>

      <BagDrawer open={bagOpen} step={bagStep} onClose={closeBag} />
      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => navigate("/menu", { scroll: false })}
        />
      )}
    </div>
  );
};

export default MenuPage;
