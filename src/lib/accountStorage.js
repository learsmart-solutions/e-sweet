// Small constants and a helper used by StoreContext's updateProfile and
// deleteAccount (added with the Profile page).

// Profile fields saved on the account record, so they survive signing out
// and back in. (`user` is rebuilt from the account on login.)
export const ACCOUNT_FIELDS = ["name", "email", "phone", "photo"];

// Written by the Food preferences page (src/lib/foodPreferences.js). Listed
// here only so deleting an account can clear it too. Keep the two in sync.
export const FOOD_PREFERENCES_KEY = "esweet-food-preferences";

export const removeKey = (key) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
};
