import React from "react";

const Icon = ({ size = 18, children, strokeWidth = 1.8, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const ArrowRightIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </Icon>
);

export const CloseIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

export const DownloadIcon = ({ size = 17 }) => (
  <Icon size={size}>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 20h14" />
  </Icon>
);

export const ShareIcon = ({ size = 17 }) => (
  <Icon size={size}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 10.5 6.8-4" />
    <path d="m8.6 13.5 6.8 4" />
  </Icon>
);

export const CameraIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.5" />
  </Icon>
);

export const ChatIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.8 9.8 0 0 1-3.2-.5L4 21l1.4-4.1A8.2 8.2 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
  </Icon>
);

export const CheckIcon = ({ size = 14 }) => (
  <Icon size={size} strokeWidth={2.2}>
    <path d="m5 12 4 4L19 6" />
  </Icon>
);

export const ReceiptIcon = ({ size = 32 }) => (
  <Icon size={size} strokeWidth={1.6}>
    <path d="M5 3h14v18l-2.3-1.7L14.4 21 12 19.3 9.6 21l-2.3-1.7L5 21V3Z" />
    <path d="M9 8h6M9 12h6" />
  </Icon>
);

export const ChevronRightIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
);
