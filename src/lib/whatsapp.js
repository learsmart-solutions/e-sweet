// TODO: Replace with the chef's number when it is shared.
export const WHATSAPP_NUMBER = "2348000000000";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi e'sweet! I'd like to place an order.";

export const whatsappLink = (message = WHATSAPP_DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
