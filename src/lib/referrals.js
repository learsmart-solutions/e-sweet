// Referral codes and the coupons they earn.
//
// How it works: you share your code, a friend signs up with it and gets a
// coupon for their first order; when they order, you get a coupon too.
// Coupons do not stack: an order can use one coupon, never several.
//
// There is no backend yet, so this file stands in for it. Coupons and
// friends are kept in localStorage per account, and `fetchReferral` acts
// like the network request the page will make once the API exists.

// TODO: both amounts are placeholders in the design (Figma open question 1).
// Confirm them before launch.
export const REFERRAL_REWARD = 500;
export const FRIEND_MIN_ORDER = 3000;

const STORE_KEY = "esweet-referrals";
const PENDING_KEY = "esweet-pending-referral";
const REQUEST_DELAY_MS = 700;

// No 0/O or 1/I, so a code read out over the phone can't be misheard.
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_PATTERN = /^[A-Z]{3}-[2-9A-Z]{3}$/;

const hash = (text) => {
  let value = 2166136261;
  for (const char of text) {
    value ^= char.codePointAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
};

// "Ada Okafor" + email → "ADA-2K7". The same account always gets the same
// code.
export const makeReferralCode = ({ name = "", email = "" }) => {
  const letters = name
    .normalize("NFD")
    .replace(/[^a-z]/gi, "")
    .toUpperCase();
  const prefix = `${letters}ESW`.slice(0, 3);

  let seed = hash(email.trim().toLowerCase());
  let suffix = "";
  for (let index = 0; index < 3; index += 1) {
    suffix += CODE_ALPHABET[seed % CODE_ALPHABET.length];
    seed = Math.floor(seed / CODE_ALPHABET.length);
  }
  return `${prefix}-${suffix}`;
};

export const normalizeReferralCode = (code = "") => {
  const clean = decodeURIComponent(code).trim().toUpperCase();
  return CODE_PATTERN.test(clean) ? clean : null;
};

export const referralLink = (code) =>
  typeof window === "undefined"
    ? `/r/${code}`
    : `${window.location.origin}/r/${code}`;

// ---- Storage ------------------------------------------------------------

const readAll = () => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
};

const writeAll = (value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing.
  }
};

const accountKey = (email = "") => email.trim().toLowerCase();

export const readReferralAccount = (email) => {
  const saved = readAll()[accountKey(email)] || {};
  return {
    coupons: Array.isArray(saved.coupons) ? saved.coupons : [],
    friends: Array.isArray(saved.friends) ? saved.friends : [],
  };
};

const updateAccount = (email, update) => {
  const all = readAll();
  all[accountKey(email)] = update(readReferralAccount(email));
  writeAll(all);
};

// coupon = {
//   id, amount, minOrder,
//   source: "welcome" | "friend",
//   fromCode,     // welcome: the code the account signed up with
//   friendName,   // friend: who ordered
//   usedOn: null | { orderCode, at },
// }
export const isCouponReady = (coupon) => !coupon.usedOn;

export const couponLabel = (coupon) =>
  coupon.source === "welcome"
    ? "Welcome gift"
    : `${coupon.friendName || "A friend"} ordered`;

// A new account that signed up with a friend's code gets one coupon for
// its first order over FRIEND_MIN_ORDER.
//
// TODO (API): the prototype trusts any well-formed code, so /r/AAA-222
// earns a coupon even though nobody owns that code. The server must check
// that the code belongs to a real account, isn't the new account's own,
// and that each person (not just each email) gets the welcome coupon once.
export const grantWelcomeCoupon = (email, fromCode) =>
  updateAccount(email, (account) =>
    account.coupons.some((coupon) => coupon.source === "welcome")
      ? account
      : {
          ...account,
          coupons: [
            ...account.coupons,
            {
              id: `cpn-${Date.now().toString(36)}`,
              source: "welcome",
              fromCode,
              amount: REFERRAL_REWARD,
              minOrder: FRIEND_MIN_ORDER,
              usedOn: null,
            },
          ],
        },
  );

export const markCouponUsed = (email, couponId, orderCode) =>
  updateAccount(email, (account) => ({
    ...account,
    coupons: account.coupons.map((coupon) =>
      coupon.id === couponId
        ? { ...coupon, usedOn: { orderCode, at: new Date().toISOString() } }
        : coupon,
    ),
  }));

// ---- Invite links -------------------------------------------------------

// Opening /r/CODE keeps the code until the visitor signs up.
export const savePendingReferral = (code) => {
  const clean = normalizeReferralCode(code);
  if (!clean || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_KEY, clean);
  } catch {
    // Without storage the invite is simply not applied.
  }
};

export const takePendingReferral = () => {
  if (typeof window === "undefined") return null;
  try {
    const code = window.localStorage.getItem(PENDING_KEY);
    window.localStorage.removeItem(PENDING_KEY);
    return normalizeReferralCode(code || "");
  } catch {
    return null;
  }
};

// ---- Request ------------------------------------------------------------

export class OfflineError extends Error {
  constructor() {
    super("No internet connection");
    this.name = "OfflineError";
  }
}

const isOffline = () =>
  typeof navigator !== "undefined" && navigator.onLine === false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Stand-in for `GET /me/referral`. It takes a moment and fails when the
// device is offline, like the real request will, so the loading and
// no-internet screens behave the same once the API is wired in.
export const fetchReferral = async (user) => {
  if (isOffline()) throw new OfflineError();
  await wait(REQUEST_DELAY_MS);
  if (isOffline()) throw new OfflineError();

  const code = makeReferralCode(user);
  const { coupons, friends } = readReferralAccount(user.email);
  return { code, link: referralLink(code), coupons, friends };
};
