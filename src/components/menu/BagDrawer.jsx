import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, navigate } from "../../lib/router";
import { formatNaira, useStore } from "../../context/StoreContext";

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" aria-hidden="true">
    <path
      d="M19 12H5m6-6-6 6 6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6 6 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

const OptionCard = ({
  selected,
  onClick,
  title,
  detail,
  radio = false,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
      selected
        ? "border-tomato bg-tomato/[0.045] ring-1 ring-tomato"
        : "border-ink/15 bg-cream-light hover:border-ink/30"
    } ${radio ? "flex items-start gap-2.5" : ""} ${className}`}
  >
    {radio && (
      <span
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
          selected ? "border-tomato bg-tomato" : "border-ink/25"
        }`}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block text-[13px] font-bold text-ink">{title}</span>
      {detail && (
        <span className="mt-0.5 block text-[11px] leading-[1.35] text-ink/50">
          {detail}
        </span>
      )}
    </span>
  </button>
);

const QuantityControl = ({ item, onAdd, onRemove, compact = false }) => (
  <div
    className={`inline-flex items-center gap-1 rounded-full bg-ink px-1.5 text-cream ${
      compact ? "h-8" : "h-9"
    }`}
  >
    <button
      type="button"
      onClick={() => onRemove(item.id)}
      aria-label={`Remove one ${item.name}`}
      className="grid h-6 w-6 place-items-center rounded-full text-[16px] leading-none transition-colors hover:bg-cream/15"
    >
      −
    </button>
    <span className="min-w-4 text-center text-[12px] font-bold">
      {item.quantity}
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
);

const SummaryLine = ({ label, value, strong = false }) => (
  <div
    className={`flex items-center justify-between ${
      strong ? "text-ink" : "text-ink/55"
    }`}
  >
    <span className={strong ? "text-[14px] font-bold" : ""}>{label}</span>
    <span className={strong ? "font-display text-[20px] font-black" : "font-semibold text-ink"}>
      {value}
    </span>
  </div>
);

const BagDrawer = ({ open, step = "order", onClose }) => {
  const {
    user,
    cartEntries,
    cartCount,
    subtotal,
    packs,
    addItem,
    removeItem,
    clearCart,
  } = useStore();
  const [fulfilment, setFulfilment] = useState("delivery");
  const [when, setWhen] = useState("asap");
  const [payment, setPayment] = useState("online");
  const [address, setAddress] = useState(
    "14 Admiralty Way, Lekki Phase 1",
  );
  const [phone, setPhone] = useState(user?.phone || "0803 123 4567");
  const [note, setNote] = useState("");
  const [placed, setPlaced] = useState(false);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [placedTime, setPlacedTime] = useState("");
  const [orderCode, setOrderCode] = useState("");

  const isCheckout = step === "checkout";
  const orderTotal = subtotal + packs;
  const deliveryFee = isCheckout && fulfilment === "delivery" ? 1500 : 0;
  const total = orderTotal + deliveryFee;

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setPlaced(false);
  }, [open]);

  const goBack = () => {
    if (isCheckout) navigate("/bag", { scroll: false });
    else onClose();
  };

  const goToCheckout = () => {
    if (!cartCount) return;
    if (!user) {
      navigate("/checkout-auth?next=checkout", { scroll: false });
      return;
    }
    navigate("/checkout", { scroll: false });
  };

  const placeOrder = () => {
    if (!cartCount) return;
    if (!user) {
      navigate("/checkout-auth?next=checkout", { scroll: false });
      return;
    }
    const ready = new Date(Date.now() + 20 * 60 * 1000);
    setPlacedTime(
      ready.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    setOrderCode(`ES-${Math.floor(1000 + Math.random() * 9000)}`);
    setPlacedTotal(total);
    setPlaced(true);
    clearCart();
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-sand text-[24px]">
        🛍️
      </span>
      <h3 className="mt-5 font-display text-[22px] font-black tracking-[-0.04em]">
        Your bag is empty.
      </h3>
      <p className="mt-2 max-w-[250px] text-[13px] leading-[1.5] text-ink/55">
        Add a dish from the menu and it will show up here.
      </p>
      <Link
        to="/menu"
        scroll={false}
        onClick={onClose}
        className="mt-5 rounded-full bg-tomato px-5 py-3 text-[13px] font-bold text-white shadow-[0_3px_0_#a5130c]"
      >
        Browse menu
      </Link>
    </div>
  );

  if (placed) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-placed-title"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.24, ease: [0.2, 0.75, 0.2, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[calc(100svh-2rem)] w-full max-w-[440px] overflow-y-auto rounded-[20px] bg-cream-light px-6 py-6 text-center shadow-[0_30px_80px_rgba(30,20,10,0.28)]"
            >
              <div className="relative mx-auto h-[86px] w-full max-w-[300px]">
                <span className="absolute left-3 top-6 h-1.5 w-4 -rotate-[18deg] rounded-full bg-gold" />
                <span className="absolute left-12 top-1 h-1.5 w-4 rotate-[24deg] rounded-full bg-tomato" />
                <span className="absolute left-20 top-8 h-1.5 w-3 rotate-[42deg] rounded-full bg-ink" />
                <span className="absolute right-3 top-6 h-1.5 w-4 rotate-[18deg] rounded-full bg-gold" />
                <span className="absolute right-12 top-1 h-1.5 w-4 -rotate-[24deg] rounded-full bg-tomato" />
                <span className="absolute right-20 top-8 h-1.5 w-3 -rotate-[42deg] rounded-full bg-ink" />
                <span className="absolute left-1 top-12 h-1.5 w-3 rotate-[10deg] rounded-full bg-tomato" />
                <span className="absolute right-1 top-12 h-1.5 w-3 -rotate-[10deg] rounded-full bg-gold" />
                <span className="absolute left-1/2 top-0 grid h-[72px] w-[72px] -translate-x-1/2 place-items-center rounded-full bg-tomato text-[34px] font-black text-white shadow-[0_8px_0_#a5130c]">
                  ✓
                </span>
              </div>

              <h2
                id="order-placed-title"
                className="mt-2 font-display text-[30px] font-black tracking-[-0.05em] text-ink"
              >
                Order placed!
              </h2>
              <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-[1.55] text-ink/55">
                {fulfilment === "delivery"
                  ? `We'll ride it to you around ${placedTime}.`
                  : `It'll be ready at the window around ${placedTime}.`}{" "}
                Total {formatNaira(placedTotal)}.
              </p>

              <div className="mt-5 rounded-2xl border border-dashed border-[#e7b56a] bg-cream px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/40">
                  Order code
                </p>
                <p className="mt-1 font-display text-[30px] font-black leading-none tracking-[-0.04em] text-tomato">
                  {orderCode}
                </p>
              </div>

              <div className="mt-5 flex items-start">
                {["Received", "Cooking", "On the way"].map((label, index) => (
                  <div key={label} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      <span
                        className={`h-0.5 flex-1 ${
                          index === 0 ? "bg-transparent" : "bg-tomato"
                        }`}
                      />
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${
                          index < 2 ? "bg-tomato" : "bg-sand"
                        }`}
                      />
                      <span
                        className={`h-0.5 flex-1 ${
                          index === 2 ? "bg-transparent" : "bg-tomato"
                        }`}
                      />
                    </div>
                    <span className="mt-2 text-[11px] font-semibold text-ink/65">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-ink px-5 py-3.5 text-[14px] font-bold text-cream transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black active:translate-y-0"
              >
                Back to the menu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex justify-end bg-ink/20 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 330, damping: 34 }}
            onClick={(event) => event.stopPropagation()}
            className="flex h-svh w-full max-w-[440px] flex-col bg-cream-light shadow-[-18px_0_60px_rgba(30,20,10,0.16)]"
          >
            <div className="flex h-[68px] shrink-0 items-center gap-3 border-b border-ink/10 px-4 sm:h-[76px] sm:px-5">
              {isCheckout && (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Back to your order"
                  className="grid h-9 w-9 place-items-center rounded-full text-ink/65 transition-colors hover:bg-cream hover:text-ink"
                >
                  <ArrowLeft />
                </button>
              )}
              <h2
                id="bag-title"
                className="font-display text-[21px] font-black tracking-[-0.035em] text-ink"
              >
                {isCheckout ? "Checkout" : "Your order"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close bag"
                className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/65 transition-colors hover:bg-cream hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>

            <>
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  {cartCount === 0 ? (
                    emptyState
                  ) : isCheckout ? (
                    <div className="space-y-5">
                      <section>
                        <h3 className="text-[12px] font-bold text-ink">
                          How do you want it?
                        </h3>
                        <div className="mt-2 grid grid-cols-2 gap-2.5">
                          <OptionCard
                            selected={fulfilment === "pickup"}
                            onClick={() => setFulfilment("pickup")}
                            title="Pickup"
                            detail="At the window · free"
                          />
                          <OptionCard
                            selected={fulfilment === "delivery"}
                            onClick={() => setFulfilment("delivery")}
                            title="Delivery"
                            detail="Lekki & VI · ₦1,500"
                          />
                        </div>
                      </section>

                      <section>
                        <h3 className="text-[12px] font-bold text-ink">
                          When?
                        </h3>
                        <div className="mt-2 grid grid-cols-2 gap-2.5">
                          <OptionCard
                            selected={when === "asap"}
                            onClick={() => setWhen("asap")}
                            title="ASAP"
                            detail="~15–20 min"
                          />
                          <OptionCard
                            selected={when === "schedule"}
                            onClick={() => setWhen("schedule")}
                            title="Schedule"
                            detail="Pick a time"
                          />
                        </div>
                      </section>

                      {fulfilment === "delivery" && (
                        <section>
                          <label
                            htmlFor="checkout-address"
                            className="text-[12px] font-bold text-ink"
                          >
                            Delivery address
                          </label>
                          <input
                            id="checkout-address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
                          />
                        </section>
                      )}

                      <section>
                        <label
                          htmlFor="checkout-phone"
                          className="text-[12px] font-bold text-ink"
                        >
                          Phone number
                        </label>
                        <input
                          id="checkout-phone"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          inputMode="tel"
                          className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-cream-light px-3.5 text-[13px] text-ink outline-none transition-colors focus:border-tomato focus:ring-1 focus:ring-tomato"
                        />
                      </section>

                      <section>
                        <h3 className="text-[12px] font-bold text-ink">
                          Payment
                        </h3>
                        <div className="mt-2 space-y-2.5">
                          <OptionCard
                            selected={payment === "online"}
                            onClick={() => setPayment("online")}
                            title="Pay online"
                            detail="Card, transfer or USSD"
                            radio
                          />
                          <OptionCard
                            selected={payment === "delivery"}
                            onClick={() => setPayment("delivery")}
                            title="Pay on delivery"
                            detail="Cash, transfer or POS"
                            radio
                          />
                        </div>
                      </section>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-2.5">
                        {cartEntries.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 rounded-2xl bg-cream p-2.5"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-[58px] w-[58px] shrink-0 rounded-xl bg-sand object-contain p-1"
                            />
                            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-[13px] font-bold leading-tight text-ink">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-[11px] font-medium text-ink/50">
                                  {formatNaira(item.price)} × {item.quantity} ={" "}
                                  <span className="font-bold text-ink">
                                    {formatNaira(item.price * item.quantity)}
                                  </span>
                                </p>
                              </div>
                              <QuantityControl
                                item={item}
                                onAdd={addItem}
                                onRemove={removeItem}
                                compact
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <label className="mt-5 block">
                        <span className="text-[12px] font-bold text-ink">
                          Note for the kitchen
                        </span>
                        <textarea
                          value={note}
                          onChange={(event) => setNote(event.target.value)}
                          placeholder="Less pepper, extra plantain..."
                          rows={3}
                          className="mt-2 w-full resize-none rounded-xl border border-ink/15 bg-cream-light px-3.5 py-3 text-[13px] leading-[1.5] text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-tomato focus:ring-1 focus:ring-tomato"
                        />
                      </label>

                      <Link
                        to="/menu"
                        scroll={false}
                        onClick={onClose}
                        className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-tomato hover:underline"
                      >
                        <span aria-hidden="true">←</span> Add more items
                      </Link>
                    </div>
                  )}
                </div>

                {cartCount > 0 && (
                  <div className="shrink-0 border-t border-ink/10 bg-cream-light px-5 pb-5 pt-4">
                    <div className="space-y-1.5 text-[12.5px]">
                      <SummaryLine
                        label="Subtotal"
                        value={formatNaira(subtotal)}
                      />
                      <SummaryLine
                        label="Take-away packs"
                        value={formatNaira(packs)}
                      />
                      {isCheckout && (
                        <SummaryLine
                          label="Delivery"
                          value={formatNaira(deliveryFee)}
                        />
                      )}
                      <div className="mt-2 border-t border-dashed border-ink/15 pt-2.5">
                        <SummaryLine
                          label="Total"
                          value={formatNaira(isCheckout ? total : orderTotal)}
                          strong
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={isCheckout ? placeOrder : goToCheckout}
                      className="mt-4 w-full rounded-xl bg-tomato px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_4px_0_#a5130c,0_10px_20px_rgba(180,30,20,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
                    >
                      {isCheckout
                        ? `Place order · ${formatNaira(total)}`
                        : `Checkout · ${formatNaira(orderTotal)} →`}
                    </button>
                  </div>
                )}
            </>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BagDrawer;
