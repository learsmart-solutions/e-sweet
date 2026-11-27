import React from "react";

// Form building blocks shared by the Settings section pages (Profile, Food
// preferences, Help and support). They follow the Figma form components so
// the three pages stay visually identical. Colours and radii come from the
// theme tokens in src/index.css.

export const FieldLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-[13px] font-bold text-ink"
  >
    {children}
  </label>
);

export const HelperText = ({ id, children }) => (
  <p id={id} className="mt-1.5 text-[12px] leading-[1.45] text-muted">
    {children}
  </p>
);

const fieldBase =
  "w-full rounded-[14px] border-[1.5px] bg-cream-light px-3.5 py-3 text-[15px] leading-[1.4] text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato lg:bg-cream";

export const TextInput = React.forwardRef(
  ({ invalid = false, className = "", ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`${fieldBase} ${
        invalid ? "border-tomato" : "border-ink"
      } ${className}`}
      {...props}
    />
  ),
);
TextInput.displayName = "TextInput";

export const TextArea = React.forwardRef(
  ({ invalid = false, className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`${fieldBase} resize-none ${
        invalid ? "border-tomato" : "border-ink"
      } ${className}`}
      {...props}
    />
  ),
);
TextArea.displayName = "TextArea";

// Rounded pill used for quick picks (kitchen-note shortcuts, report
// categories). `selected` is the filled ink state from the design.
export const Chip = ({ selected = false, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato ${
      selected
        ? "border-ink bg-ink text-cream-light"
        : "border-sand bg-cream-light text-ink hover:border-ink/40"
    }`}
  >
    {children}
  </button>
);

// White rounded panel that holds the form on desktop. On phones the page
// background shows through, so the card is transparent below `lg`.
export const SectionCard = ({ children, className = "" }) => (
  <div
    className={`lg:rounded-[24px] lg:bg-cream-light lg:p-7 ${className}`}
  >
    {children}
  </div>
);

// Phone: a bar pinned to the bottom of the screen holding the primary
// action. Desktop: a plain right-aligned button row inside the card.
// The page root must be a flex column with a min-height so `mt-auto` can
// push the bar to the bottom (see the section pages).
export const ActionBar = ({ children }) => (
  <div className="sticky bottom-0 -mx-4 -mb-6 mt-auto border-t border-sand bg-cream px-4 pb-5 pt-3 lg:static lg:mx-0 lg:mb-0 lg:mt-6 lg:flex lg:justify-end lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0">
    {children}
  </div>
);
