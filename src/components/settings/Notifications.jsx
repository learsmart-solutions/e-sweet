import React, { useId } from "react";
import { useStore } from "../../context/StoreContext";
import whatsappIcon from "../../assets/icons/settings/whatsapp-20.svg";
import infoIcon from "../../assets/icons/settings/info-16.svg";

// SMS bubble icon with open tail and notch line in tomato red
const SmsIcon = ({ size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="#D7261E"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    <path d="M8 11.5h8M8 15h5" />
  </svg>
);

// Star icon in tomato red outline for promotions and offers
const StarIcon = ({ size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="#D7261E"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const WhatsAppImage = ({ size = 20 }) => (
  <img
    src={whatsappIcon}
    alt=""
    width={size}
    height={size}
    aria-hidden="true"
    className="size-5 shrink-0"
  />
);

const ToggleSwitch = ({
  id,
  checked,
  onChange,
  ariaLabel,
  ariaDescribedBy,
}) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato ${
      checked ? "bg-tomato" : "bg-[#E5DACD]"
    }`}
  >
    <span
      className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const NotificationRow = ({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}) => {
  const titleId = useId();
  const descId = useId();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle(!checked)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(!checked);
        }
      }}
      className="flex cursor-pointer select-none items-center gap-3.5 px-4 py-4 transition-colors hover:bg-[#FFFBF7] active:bg-[#FDF6ED] sm:gap-4 sm:px-6"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-[#FDF0E9]"
      >
        <Icon />
      </span>
      <span className="min-w-0 flex-1">
        <span
          id={titleId}
          className="block font-display text-[15px] font-bold leading-snug text-ink sm:text-[16px]"
        >
          {title}
        </span>
        <span
          id={descId}
          className="mt-0.5 block text-[13px] leading-relaxed text-muted sm:text-[14px]"
        >
          {description}
        </span>
      </span>
      <div className="shrink-0 pl-2">
        <ToggleSwitch
          checked={checked}
          onChange={onToggle}
          ariaLabel={title}
          ariaDescribedBy={descId}
        />
      </div>
    </div>
  );
};

const Notifications = ({
  notifications: propNotifications,
  onUpdateNotification,
  showToast,
}) => {
  const store = useStore();
  const currentNotifications = propNotifications ?? store.notifications ?? {
    whatsapp: true,
    sms: true,
    promotions: false,
  };
  const update = onUpdateNotification ?? store.updateNotification;

  const orderUpdatesId = useId();
  const promotionsId = useId();

  const handleToggle = (key, nextValue) => {
    // If the user tries to disable the last active order update channel,
    // prevent it and provide clear, gentle feedback.
    if ((key === "whatsapp" || key === "sms") && !nextValue) {
      const otherKey = key === "whatsapp" ? "sms" : "whatsapp";
      if (!currentNotifications[otherKey]) {
        if (showToast) {
          showToast("Keep at least one on so you know when your food is ready.");
        }
        return;
      }
    }

    if (update) {
      update(key, nextValue);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 pt-1 sm:pt-2">
      {/* ORDER UPDATES */}
      <section aria-labelledby={orderUpdatesId} className="flex flex-col gap-2.5">
        <h2
          id={orderUpdatesId}
          className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted"
        >
          Order updates
        </h2>
        <div className="overflow-hidden rounded-[18px] border border-[#F0E4D6] bg-cream-light divide-y divide-[#F0E4D6] sm:rounded-[20px]">
          <NotificationRow
            icon={WhatsAppImage}
            title="WhatsApp"
            description="Received, cooking, on the way, delivered"
            checked={currentNotifications.whatsapp}
            onToggle={(value) => handleToggle("whatsapp", value)}
          />
          <NotificationRow
            icon={SmsIcon}
            title="SMS"
            description="Backup if WhatsApp doesn't go through"
            checked={currentNotifications.sms}
            onToggle={(value) => handleToggle("sms", value)}
          />
        </div>
        <div className="flex items-center gap-2.5 rounded-[12px] bg-[#EAF3F8] px-4 py-3 sm:rounded-[14px] sm:py-3.5 text-[13px] sm:text-[13.5px] leading-relaxed text-ink">
          <span className="shrink-0 text-ink" aria-hidden="true">
            <img src={infoIcon} alt="" width="16" height="16" />
          </span>
          <span>Keep at least one on so you know when your food is ready.</span>
        </div>
      </section>

      {/* PROMOTIONS AND OFFERS */}
      <section aria-labelledby={promotionsId} className="flex flex-col gap-2.5">
        <h2
          id={promotionsId}
          className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted"
        >
          Promotions and offers
        </h2>
        <div className="overflow-hidden rounded-[18px] border border-[#F0E4D6] bg-cream-light sm:rounded-[20px]">
          <NotificationRow
            icon={StarIcon}
            title="Deals and new dishes"
            description="Weekly at most. Turn off any time — or reply STOP to any promo."
            checked={currentNotifications.promotions}
            onToggle={(value) => handleToggle("promotions", value)}
          />
        </div>
      </section>
    </div>
  );
};

export default Notifications;
