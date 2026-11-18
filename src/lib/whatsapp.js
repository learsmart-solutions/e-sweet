import { WHATSAPP_NUMBER } from "./contact";

export { WHATSAPP_NUMBER } from "./contact";

export const WHATSAPP_CONTACT_LABEL = "Customer care";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi e'sweet customer care! I'd like to place an order.";

export const whatsappLink = (message = WHATSAPP_DEFAULT_MESSAGE) => {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
