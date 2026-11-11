import React from "react";
import { formatNaira } from "../../context/StoreContext";

const MenuCard = ({ item, quantity, onAdd, onRemove }) => {
  const badgeTone =
    item.badgeTone === "ink" ? "bg-ink text-cream" : "bg-tomato text-white";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] bg-cream-light shadow-[0_8px_24px_rgba(80,50,20,0.055)] ring-1 ring-ink/[0.045] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] bg-sand p-4">
        {item.badge && (
          <span
            className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${badgeTone}`}
          >
            {item.badge}
          </span>
        )}
        <img
          src={item.image}
          alt={item.name}
          draggable={false}
          loading="eager"
          decoding="async"
          className={`h-full w-full object-contain drop-shadow-[0_14px_16px_rgba(80,50,20,0.18)] transition-transform duration-300 group-hover:scale-[1.025] ${
            item.imageBlend === "multiply" ? "mix-blend-multiply" : ""
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[16px] font-black leading-tight tracking-[-0.025em] text-ink sm:text-[17px]">
          {item.name}
        </h3>
        <p className="mt-1.5 min-h-[38px] text-[12px] leading-[1.45] text-ink/55">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="font-display text-[18px] font-black tracking-[-0.02em] text-ink">
            {formatNaira(item.price)}
          </p>

          {quantity > 0 ? (
            <div className="inline-flex h-9 items-center gap-1 rounded-full bg-ink px-1.5 text-cream">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove one ${item.name}`}
                className="grid h-6 w-6 place-items-center rounded-full text-[16px] leading-none transition-colors hover:bg-cream/15"
              >
                −
              </button>
              <span className="min-w-4 text-center text-[12px] font-bold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onAdd(item.id)}
                aria-label={`Add one ${item.name}`}
                className="grid h-6 w-6 place-items-center rounded-full text-[16px] leading-none transition-colors hover:bg-cream/15"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAdd(item.id)}
              aria-label={`Add ${item.name} to your bag`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-tomato px-4 text-[12px] font-bold text-white shadow-[0_3px_0_#a5130c] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
            >
              Add
              <span aria-hidden="true">+</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default MenuCard;
