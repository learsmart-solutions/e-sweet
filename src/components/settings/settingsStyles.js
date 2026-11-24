export const getInitial = (name = "") => name.trim()[0]?.toUpperCase() || "E";

// Shared pill-button styles from the Figma "Button" component.
// Red = primary, Ink = secondary, Ghost = outline on light backgrounds.
const buttonBase =
  "inline-flex items-center justify-center rounded-full px-[25px] py-4 text-[16px] font-bold leading-none transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato";

export const buttonVariants = {
  red: `${buttonBase} bg-tomato text-cream-light shadow-[0_12px_13px_rgba(215,38,30,0.45)] hover:bg-[#bf1f18]`,
  ink: `${buttonBase} bg-ink text-cream`,
  ghost: `${buttonBase} border-2 border-ink bg-cream-light/75 text-ink hover:bg-cream-light`,
};
