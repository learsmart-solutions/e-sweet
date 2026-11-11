import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { menuItems } from "../data/menu";

const StoreContext = createContext(null);

const USER_KEY = "esweet-user";
const ACCOUNT_KEY = "esweet-account";
const CART_KEY = "esweet-cart";

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

export const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(() => readJson(USER_KEY, null));
  const [cart, setCart] = useState(() => readJson(CART_KEY, {}));

  useEffect(() => {
    if (user) writeJson(USER_KEY, user);
    else if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    writeJson(CART_KEY, cart);
  }, [cart]);

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

  const packs = cartCount > 0 ? 400 : 0;
  const bagTotal = subtotal + packs;

  const value = {
    user,
    cart,
    cartEntries,
    cartCount,
    subtotal,
    packs,
    bagTotal,
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
