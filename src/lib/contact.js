// Set the kitchen's real contact numbers here when they are shared.
// Use international format, digits only (no leading +).
export const CONTACT_PHONE = "";
export const WHATSAPP_NUMBER = "";

export const contactPhoneLink = () =>
  CONTACT_PHONE ? `tel:+${CONTACT_PHONE}` : null;
