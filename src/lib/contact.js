// Set the kitchen's real contact numbers here when they are shared.
// Use international format, digits only (no leading +).
export const CONTACT_PHONE = "";
// Customer care WhatsApp: 0706 277 9851 in international format.
export const WHATSAPP_NUMBER = "2347062779851";

export const contactPhoneLink = () =>
  CONTACT_PHONE ? `tel:+${CONTACT_PHONE}` : null;
