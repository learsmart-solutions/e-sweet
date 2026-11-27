// Saved food preferences: a default kitchen note and allergies. Edited on
// Settings > Food preferences, and used to prefill the "Note for the
// kitchen" box at checkout.
//
// Stored in localStorage under KEY (cleared when the account is deleted, see
// StoreContext.deleteAccount).

const KEY = "esweet-food-preferences";

export const NOTE_MAX_LENGTH = 240;
export const ALLERGIES_MAX_LENGTH = 160;

// The pills under the note. Tapping one adds or removes its phrase.
export const QUICK_NOTES = [
  "Less pepper",
  "Extra pepper",
  "No onions",
  "Sauce on the side",
];

// Picking one of a pair removes the other.
const OPPOSITES = {
  "Less pepper": "Extra pepper",
  "Extra pepper": "Less pepper",
};

const EMPTY = { note: "", allergies: "" };

export const readFoodPreferences = () => {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : null;
    return {
      note: typeof saved?.note === "string" ? saved.note : "",
      allergies: typeof saved?.allergies === "string" ? saved.allergies : "",
    };
  } catch {
    return EMPTY;
  }
};

/** @returns {boolean} false when the browser would not store it. */
export const writeFoodPreferences = ({ note, allergies }) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ note, allergies }));
    return true;
  } catch {
    return false;
  }
};

/**
 * The text that goes in the checkout "Note for the kitchen" box: the default
 * note, then the allergies on their own line so the kitchen cannot miss them.
 */
export const buildKitchenNote = ({ note = "", allergies = "" } = {}) =>
  [note.trim(), allergies.trim() && `Allergies: ${allergies.trim()}`]
    .filter(Boolean)
    .join("\n");

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches the phrase plus a trailing ", please" and punctuation, so
// "Less pepper, please." is removed as one piece.
const phrasePattern = (phrase) =>
  new RegExp(
    `\\b${escapeRegExp(phrase)}\\b(?:\\s*,?\\s*please)?[.,;!]*`,
    "i",
  );

/** Is this quick note already in the text (any capitalisation)? */
export const hasPhrase = (note, phrase) => phrasePattern(phrase).test(note);

const removePhrase = (note, phrase) =>
  note
    .replace(phrasePattern(phrase), "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s.,;]+/, "")
    .trim();

/** Add the phrase as a new sentence, or remove it if it is already there. */
export const togglePhrase = (note, phrase) => {
  if (hasPhrase(note, phrase)) return removePhrase(note, phrase);

  let base = note;
  const opposite = OPPOSITES[phrase];
  if (opposite && hasPhrase(base, opposite)) base = removePhrase(base, opposite);

  base = base.trim();
  if (!base) return `${phrase}.`;
  return /[.!?]$/.test(base) ? `${base} ${phrase}.` : `${base}. ${phrase}.`;
};
