// The Settings home rows and the desktop left nav both read from this list,
// so a new section only has to be added here.
//
// `to` paths are reserved for the section pages the team is building next.
// Until a page exists, its route shows the "coming soon" panel in
// pages/Settings.jsx.
import userIcon from "../../assets/icons/settings/user.svg";
import mapPinIcon from "../../assets/icons/settings/map-pin.svg";
import receiptIcon from "../../assets/icons/settings/receipt.svg";
import giftIcon from "../../assets/icons/settings/gift.svg";
import bellIcon from "../../assets/icons/settings/bell.svg";
import utensilsIcon from "../../assets/icons/settings/utensils.svg";
import helpIcon from "../../assets/icons/settings/help.svg";
import navUserIcon from "../../assets/icons/settings/nav-user.svg";
import navUserActiveIcon from "../../assets/icons/settings/nav-user-active.svg";
import navMapPinIcon from "../../assets/icons/settings/nav-map-pin.svg";
import navMapPinActiveIcon from "../../assets/icons/settings/nav-map-pin-active.svg";
import navReceiptIcon from "../../assets/icons/settings/nav-receipt.svg";
import navReceiptActiveIcon from "../../assets/icons/settings/nav-receipt-active.svg";
import navGiftIcon from "../../assets/icons/settings/nav-gift.svg";
import navGiftActiveIcon from "../../assets/icons/settings/nav-gift-active.svg";
import navBellIcon from "../../assets/icons/settings/nav-bell.svg";
import navBellActiveIcon from "../../assets/icons/settings/nav-bell-active.svg";
import navUtensilsIcon from "../../assets/icons/settings/nav-utensils.svg";
import navUtensilsActiveIcon from "../../assets/icons/settings/nav-utensils-active.svg";
import navHelpIcon from "../../assets/icons/settings/nav-help.svg";
import navHelpActiveIcon from "../../assets/icons/settings/nav-help-active.svg";

export const SETTINGS_PATH = "/settings";

export const settingsGroups = [
  {
    title: "Account",
    items: [
      {
        key: "profile",
        label: "Profile",
        description: "Name, photo, phone, email",
        to: `${SETTINGS_PATH}/profile`,
        icon: userIcon,
        navIcon: navUserIcon,
        navActiveIcon: navUserActiveIcon,
      },
      {
        key: "addresses",
        label: "Saved addresses",
        description: "Home, work and other delivery spots",
        to: `${SETTINGS_PATH}/addresses`,
        icon: mapPinIcon,
        navIcon: navMapPinIcon,
        navActiveIcon: navMapPinActiveIcon,
      },
      {
        key: "orders",
        label: "Order history",
        description: "Receipts, reorder, report an order",
        to: `${SETTINGS_PATH}/orders`,
        icon: receiptIcon,
        navIcon: navReceiptIcon,
        navActiveIcon: navReceiptActiveIcon,
      },
    ],
  },
  {
    title: "Rewards",
    items: [
      {
        key: "referral",
        label: "Referral",
        description: "Invite friends and earn credit",
        to: `${SETTINGS_PATH}/referral`,
        icon: giftIcon,
        navIcon: navGiftIcon,
        navActiveIcon: navGiftActiveIcon,
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        key: "notifications",
        label: "Notifications",
        description: "Order updates on · promos off",
        to: `${SETTINGS_PATH}/notifications`,
        icon: bellIcon,
        navIcon: navBellIcon,
        navActiveIcon: navBellActiveIcon,
      },
      {
        key: "food-preferences",
        label: "Food preferences",
        description: "Kitchen note and allergies",
        to: `${SETTINGS_PATH}/food-preferences`,
        icon: utensilsIcon,
        navIcon: navUtensilsIcon,
        navActiveIcon: navUtensilsActiveIcon,
      },
    ],
  },
  {
    title: "Help",
    items: [
      {
        key: "help",
        label: "Help and support",
        description: "WhatsApp, FAQ, report an issue",
        to: `${SETTINGS_PATH}/help`,
        icon: helpIcon,
        navIcon: navHelpIcon,
        navActiveIcon: navHelpActiveIcon,
      },
    ],
  },
];

export const settingsItems = settingsGroups.flatMap((group) => group.items);

export const APP_VERSION = "1.0.0";
