import React from "react";

// Small inline icons for the Settings section pages. They draw with
// `currentColor`, so the colour comes from the surrounding text class
// (e.g. `text-tomato`). Every icon is decorative (`aria-hidden`); put the
// accessible name on the button or text next to it.
//
// All icons are 24x24 line icons with a 1.8 stroke, matching the existing
// icons in src/assets/icons/settings.
const Icon = ({ size = 18, children, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 ${className}`}
  >
    {children}
  </svg>
);

export const CameraIcon = (props) => (
  <Icon {...props}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
    <circle cx="12" cy="13" r="3.2" />
  </Icon>
);

export const LockIcon = (props) => (
  <Icon {...props}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Icon>
);

export const PhoneIcon = (props) => (
  <Icon {...props}>
    <path d="M5 4h3.2l1.5 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.5V17a2 2 0 0 1-2 2A13 13 0 0 1 4 6a2 2 0 0 1 1-2z" />
  </Icon>
);

export const MailIcon = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </Icon>
);

export const TrashIcon = (props) => (
  <Icon {...props}>
    <path d="M4.5 7h15M10 7V5h4v2M6.5 7l.8 11.2A1.5 1.5 0 0 0 8.8 19.5h6.4a1.5 1.5 0 0 0 1.5-1.3L17.5 7" />
    <path d="M10.2 11v5M13.8 11v5" />
  </Icon>
);

export const AlertIcon = (props) => (
  <Icon {...props}>
    <path d="M12 4.5 3.8 18.5h16.4z" />
    <path d="M12 10v4.2M12 16.8v.1" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

export const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const ImageIcon = (props) => (
  <Icon {...props}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m5 17 4.5-4.5L13 16l2.5-2.5L19 17" />
  </Icon>
);

export const UploadIcon = (props) => (
  <Icon {...props}>
    <path d="M12 16V5M7.5 9.5 12 5l4.5 4.5M5 19h14" />
  </Icon>
);

export const ChevronRightIcon = (props) => (
  <Icon {...props}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const ChevronDownIcon = (props) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const HelpIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2.9-1.2 1.7M12 16.6v.1" />
  </Icon>
);

export const DocumentIcon = (props) => (
  <Icon {...props}>
    <path d="M7 4h7l4 4v11.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5z" />
    <path d="M13.5 4v4.5H18M9.5 13h5M9.5 16h5" />
  </Icon>
);

export const ShieldIcon = (props) => (
  <Icon {...props}>
    <path d="M12 4 5.5 6.5V12c0 3.6 2.6 6.6 6.5 8 3.9-1.4 6.5-4.4 6.5-8V6.5z" />
  </Icon>
);
