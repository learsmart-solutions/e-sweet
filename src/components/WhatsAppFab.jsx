import React from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import {
  WHATSAPP_CONTACT_LABEL,
  WHATSAPP_DEFAULT_MESSAGE,
  whatsappLink,
} from "../lib/whatsapp";

const WhatsAppFab = ({ hidden = false, message = WHATSAPP_DEFAULT_MESSAGE }) => {
  const href = whatsappLink(message);
  if (hidden || !href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with ${WHATSAPP_CONTACT_LABEL} on WhatsApp`}
      title={`Chat with ${WHATSAPP_CONTACT_LABEL} on WhatsApp`}
      className="group fixed bottom-4 right-4 z-[70] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.38)] ring-4 ring-white/70 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5a] active:translate-y-0 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-2 text-[12px] font-bold text-cream opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block">
        {WHATSAPP_CONTACT_LABEL} on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppFab;
