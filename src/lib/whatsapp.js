// Set this to the chef's real number (international format, no +) to turn
// WhatsApp contact points on. Leave it empty to hide them everywhere.
export const WHATSAPP_NUMBER = "";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi e'sweet! I'd like to place an order.";

export const whatsappLink = (message = WHATSAPP_DEFAULT_MESSAGE) => {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
