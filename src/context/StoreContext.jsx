import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { menuItems } from "../data/menu";
import { createOrderCode } from "../lib/orderCode";
import { TAKEAWAY_PACK_FEE } from "../lib/pricing";
import {
  grantWelcomeCoupon,
  makeReferralCode,
  markCouponUsed,
  readReferralAccount,
  takePendingReferral,
} from "../lib/referrals";

const StoreContext = createContext(null);

const USER_KEY = "esweet-user";
const ACCOUNT_KEY = "esweet-account";
const CART_KEY = "esweet-cart";
const ADDRESSES_KEY = "esweet-addresses";
const ORDERS_KEY = "esweet-orders";

const readJson = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing; the prototype should
    // still work for the current session.
  }
};

// Lives in lib/money so non-React modules (lib/referrals) can use it too.
export { formatNaira } from "../lib/money";

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(() => readJson(USER_KEY, null));
  const [cart, setCart] = useState(() => readJson(CART_KEY, {}));
  const [addresses, setAddresses] = useState(() =>
    readJson(ADDRESSES_KEY, []),
  );
  // Bumped after a coupon changes so `coupons` re-reads storage.
  const [couponsVersion, setCouponsVersion] = useState(0);
  // Orders are written by checkout. They start empty so a new account never
  // looks like it has someone else's order history. Developers can seed
  // esweet-orders locally to preview the filled state.
  const [orders, setOrders] = useState(() => {
    const stored = readJson(ORDERS_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    if (user) writeJson(USER_KEY, user);
    else if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    writeJson(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeJson(ADDRESSES_KEY, addresses);
  }, [addresses]);

  useEffect(() => {
    writeJson(ORDERS_KEY, orders);
  }, [orders]);

  const addAddress = (newAddr) => {
    const id = `addr-${Date.now()}`;
    const makeDefault = Boolean(newAddr.isDefault) || addresses.length === 0;
    const address = {
      ...newAddr,
      id,
      isDefault: makeDefault,
    };
    setAddresses((prev) => {
      const updated = makeDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : [...prev];
      return [...updated, address];
    });
    return address;
  };

  const updateAddress = (id, updatedFields) => {
    setAddresses((prev) => {
      const current = prev.find((addr) => addr.id === id);
      const keepDefault =
        Boolean(current?.isDefault) && updatedFields.isDefault === false;
      const willBeDefault = Boolean(updatedFields.isDefault) || keepDefault;
      const next = prev.map((addr) => {
        if (addr.id === id) {
          return {
            ...addr,
            ...updatedFields,
            isDefault: willBeDefault,
          };
        }
        if (willBeDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });

      if (next.length > 0 && !next.some((addr) => addr.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }

      return next;
    });
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => {
      const target = prev.find((a) => a.id === id);
      const remaining = prev.filter((a) => a.id !== id);
      if (target?.isDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  const addOrder = (order) => {
    if (!order) return null;
    const nextOrder = {
      ...order,
      id: order.id || createOrderCode(),
    };
    setOrders((current) => [nextOrder, ...current]);
    return nextOrder;
  };

  const addItem = (id) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }));
  };

  const removeItem = (id) => {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] || 0) - 1;
      if (quantity > 0) next[id] = quantity;
      else delete next[id];
      return next;
    });
  };

  const clearCart = () => setCart({});

  const signup = ({ name, email, phone, password }) => {
    const account = { name, email, phone, password };
    writeJson(ACCOUNT_KEY, account);

    // Signed up from a friend's /r/CODE link: their first order gets a
    // coupon. Your own code doesn't count.
    const invitedBy = takePendingReferral();
    if (invitedBy && invitedBy !== makeReferralCode({ name, email })) {
      grantWelcomeCoupon(email, invitedBy);
    }

    setUser({ name, email, phone });
  };

  const login = (email, password) => {
    const account = readJson(ACCOUNT_KEY, null);
    if (
      !account ||
      account.email.toLowerCase() !== email.trim().toLowerCase() ||
      account.password !== password
    ) {
      return false;
    }

    setUser({
      name: account.name,
      email: account.email,
      phone: account.phone,
    });
    return true;
  };

  const logout = () => setUser(null);

  // Every coupon on the account, used ones included. Checkout offers the
  // unused ones and applies at most one per order.
  const coupons = useMemo(
    () => (user ? readReferralAccount(user.email).coupons : []),
    // couponsVersion is how a redeemed coupon gets picked up.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, couponsVersion],
  );

  const redeemCoupon = (couponId, orderCode) => {
    if (!user) return;
    markCouponUsed(user.email, couponId, orderCode);
    setCouponsVersion((value) => value + 1);
  };

  const cartEntries = useMemo(
    () =>
      menuItems
        .filter((item) => cart[item.id] > 0)
        .map((item) => ({ ...item, quantity: cart[item.id] })),
    [cart],
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((total, quantity) => total + quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cartEntries.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [cartEntries],
  );

  // One take-away pack is charged per food item. Drinks do not need a
  // take-away pack, so they are excluded from the pack count.
  const packCount = useMemo(
    () =>
      cartEntries.reduce(
        (total, item) =>
          item.category === "Drinks" ? total : total + item.quantity,
        0,
      ),
    [cartEntries],
  );
  const packs = packCount * TAKEAWAY_PACK_FEE;
  const bagTotal = subtotal + packs;

  const value = {
    user,
    cart,
    cartEntries,
    cartCount,
    packCount,
    subtotal,
    packs,
    bagTotal,
    coupons,
    redeemCoupon,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    orders,
    addOrder,
    addItem,
    removeItem,
    clearCart,
    signup,
    login,
    logout,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return value;
};
