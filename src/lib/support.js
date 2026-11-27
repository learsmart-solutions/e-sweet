// Contact details and report-an-issue helpers for Settings > Help and support.
import { whatsappLink } from "./whatsapp";

export const SUPPORT_EMAIL = "support@esweet.ng";
export const SUPPORT_HOURS = "09:00–21:00";
export const SHOP_ADDRESS = "20A Idiroko Road, Sango Otta";

export const SUPPORT_CHAT_MESSAGE = "Hi e'sweet customer care! I need some help.";

// Shown after "Send report". See `sendReport` for what actually happens.
export const REPORT_SENT_MESSAGE = "Report sent · we'll reply on WhatsApp";

export const REPORT_CATEGORIES = [
  "App problem",
  "Payment",
  "My account",
  "Something else",
];
export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 1000;

export const supportEmailLink = (subject = "e'sweet support") =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

/** @returns {string} an error message, or "" when the description is fine. */
export const getDescriptionError = (value = "") =>
  value.trim().length < DESCRIPTION_MIN_LENGTH
    ? "Tell us a little more about the problem."
    : "";

export const buildReportMessage = ({
  category,
  description,
  screenshotName,
  user,
}) =>
  [
    "Hi e'sweet customer care! I'd like to report an issue.",
    "",
    `Topic: ${category}`,
    user?.name && `Name: ${user.name}`,
    user?.email && `Email: ${user.email}`,
    "",
    description.trim(),
    screenshotName &&
      `\n(I'll send a screenshot in this chat: ${screenshotName})`,
  ]
    .filter((line) => line !== undefined && line !== false && line !== null)
    .join("\n");

/**
 * Send a report to customer care.
 *
 * PROTOTYPE: there is no support API yet, so this opens WhatsApp with the
 * report already typed out, and the person presses send there. A screenshot
 * cannot travel in a link, so its file name is added to the message and the
 * person attaches it in the chat. When an API exists, replace the body (keep
 * the signature) and the UI will not need to change.
 *
 * @returns {{ ok: boolean }} ok is false when WhatsApp could not be opened.
 */
export const sendReport = (report) => {
  const link = whatsappLink(buildReportMessage(report));
  if (!link || typeof window === "undefined") return { ok: false };
  const opened = window.open(link, "_blank", "noopener,noreferrer");
  return { ok: opened !== null };
};
