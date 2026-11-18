// Set this to the customer care WhatsApp number (international format, no +)
// to turn the contact points on. Leave it empty to hide them everywhere.
export const WHATSAPP_NUMBER = "";

export const WHATSAPP_CONTACT_LABEL = "Customer care";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi e'sweet customer care! I'd like to place an order.";

export const whatsappLink = (message = WHATSAPP_DEFAULT_MESSAGE) => {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
