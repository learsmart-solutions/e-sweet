// One-time-code checks used when someone changes their phone number or
// email on the Profile page.
//
// PROTOTYPE: there is no backend yet, so no SMS or email is actually sent
// and any code is checked against DEMO_CODE. When the API exists, replace
// the bodies of `requestCode` and `checkCode` (keep the signatures) and the
// UI will not need to change.

export const CODE_LENGTH = 6;
export const RESEND_SECONDS = 45;
export const MAX_ATTEMPTS = 3;

// Accepted by the prototype. Documented in docs/settings-pages.md.
export const DEMO_CODE = "123456";

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ask the server to send a code.
 * @param {{ channel: "sms" | "email", target: string }} request
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export const requestCode = async () => {
  await pause(500);
  return { ok: true };
};

/**
 * Check a code the person typed.
 * @param {{ channel: "sms" | "email", target: string, code: string }} request
 * @returns {Promise<{ ok: boolean }>}
 */
export const checkCode = async ({ code }) => {
  await pause(450);
  return { ok: code === DEMO_CODE };
};

// 45 -> "0:45", 5 -> "0:05"
export const formatCountdown = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
