import React from "react";
import mark from "../assets/logo-mark.png";

// The e'sweet lockup: the supplied container mark (a high-resolution image)
// next to the wordmark drawn as live text in the logo font, so the lettering
// stays sharp at every size. It keeps the 540×140 proportions of the supplied
// lockup, so callers size it by height (e.g. "h-7 w-auto") as before.
const BrandLogo = ({ className = "h-7 w-auto", light = false }) => {
  const logo = (
    <svg
      viewBox="0 0 540 140"
      role="img"
      aria-label="e'sweet"
      className={`${className} shrink-0 select-none overflow-visible`}
    >
      <image href={mark} x="0" y="30" width="157" height="95" />
      {/* Sized to match the supplied artwork. textLength holds the layout if
          the logo font hasn't loaded and a fallback font is used. */}
      <g
        className="font-logo"
        fill="#d7261e"
        fontSize="100"
        fontWeight="800"
        aria-hidden="true"
      >
        <text x="192" y="102" textLength="55" lengthAdjust="spacingAndGlyphs">
          e
        </text>
        <text x="264" y="102" textLength="277" lengthAdjust="spacingAndGlyphs">
          sweet
        </text>
      </g>
      {/* The gold drop that stands in for the apostrophe. */}
      <path
        d="M248 38c0-6 4-9 8.5-9s8.5 3 8.5 9l-2 17c-.5 5-3 7-6.5 7s-6-2-6.5-7z"
        fill="#ffb727"
      />
    </svg>
  );

  if (!light) return logo;

  // On the tomato backgrounds (auth page and modal) the red mark would
  // disappear, so the full-colour lockup sits on a cream pill.
  return (
    <span className="inline-flex items-center rounded-lg bg-cream px-2 py-1 shadow-sm">
      {logo}
    </span>
  );
};

export default BrandLogo;
