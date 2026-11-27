import React, { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import arrowLeftIcon from "../../../assets/icons/settings/arrow-left.svg";
import { CloseIcon } from "./icons";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Controls the person can actually reach. Hidden ones (such as the file
// inputs behind a "Choose photo" button) must not count as the first or last
// stop when Tab is kept inside the overlay.
const getFocusable = (root) =>
  Array.from(root?.querySelectorAll(FOCUSABLE) ?? []).filter(
    (element) => element.offsetParent !== null,
  );

/**
 * Shared overlay for the Settings section pages.
 *
 * One component, two looks (the Figma frames draw each flow both ways):
 *  - Desktop (lg and up): a centred dialog with a close button.
 *  - Phone, `phoneVariant="screen"`: a full-screen page with a back arrow,
 *    used for multi-step flows such as "Change phone number".
 *  - Phone, `phoneVariant="sheet"`: a bottom sheet, used for quick choices
 *    such as the photo picker and the delete-account confirm.
 *
 * Behaviour matches SignOutDialog: Escape closes, Tab stays inside, the page
 * behind does not scroll, and focus returns to the opener when it closes.
 *
 * Props
 *  - open: whether the overlay is shown.
 *  - onClose: called for Escape, the backdrop, the back arrow and the X.
 *  - title: heading text. Rendered in the header for `screen`; for `sheet`
 *    and desktop dialogs the header is only drawn when `title` is given.
 *  - role: "dialog" (default) or "alertdialog" for destructive confirms.
 *  - phoneVariant: "screen" (default) or "sheet".
 *  - labelledBy / describedBy: ids of elements inside `children` that name
 *    and describe the overlay, for overlays that draw their own heading
 *    instead of using `title` (such as the delete-account confirm).
 *  - initialFocusRef: element to focus on open (default: first control).
 *  - footer: node pinned to the bottom of the panel (buttons).
 *  - size: "md" (default, 480px) or "sm" (440px) desktop dialog width.
 *  - closeOnBackdrop: set to false to keep an in-progress flow open when the
 *    backdrop is clicked (default true).
 */
const SettingsOverlay = ({
  open,
  onClose,
  title,
  role = "dialog",
  phoneVariant = "screen",
  labelledBy,
  describedBy,
  initialFocusRef,
  footer,
  size = "md",
  closeOnBackdrop = true,
  children,
}) => {
  const titleId = useId();
  const panelRef = useRef(null);
  // Keep the latest onClose without re-running the focus/scroll effect each
  // render, which would steal focus from the field being typed in.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const target = initialFocusRef?.current ?? getFocusable(panelRef.current)[0];
    target?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const controls = getFocusable(panelRef.current);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = document.activeElement;
      if (!panelRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus?.();
    };
  }, [open, initialFocusRef]);

  const isScreen = phoneVariant === "screen";
  const widthClass = size === "sm" ? "lg:max-w-[440px]" : "lg:max-w-[480px]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-[110] flex bg-ink/55 lg:items-center lg:justify-center lg:bg-ink/50 lg:p-6 ${
            isScreen ? "" : "items-end"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={closeOnBackdrop ? onClose : undefined}
        >
          <motion.div
            ref={panelRef}
            role={role}
            aria-modal="true"
            aria-labelledby={title ? titleId : labelledBy}
            aria-describedby={describedBy}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.2, 0.75, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
            className={`flex w-full flex-col overflow-hidden ${widthClass} lg:max-h-[calc(100svh-48px)] lg:rounded-[26px] lg:bg-cream-light ${
              isScreen
                ? "h-full bg-cream lg:h-auto"
                : "max-h-[92svh] rounded-t-[28px] bg-cream-light"
            }`}
          >
            {!isScreen && (
              <span
                aria-hidden="true"
                className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-sand lg:hidden"
              />
            )}

            {title && (
              <header
                className={`flex shrink-0 items-center gap-3 ${
                  isScreen ? "h-16 px-4" : "px-5 pb-1 pt-4"
                } lg:h-auto lg:px-7 lg:pb-0 lg:pt-7`}
              >
                {isScreen && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Back"
                    className="grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-cream-light transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato lg:hidden"
                  >
                    <img src={arrowLeftIcon} alt="" width="20" height="20" />
                  </button>
                )}
                <h2
                  id={titleId}
                  className={`min-w-0 flex-1 font-display font-extrabold tracking-[-0.02em] text-ink ${
                    isScreen ? "text-[22px]" : "text-[20px]"
                  } lg:text-[24px]`}
                >
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="hidden size-9 shrink-0 place-items-center rounded-full border-[1.5px] border-ink text-ink transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato lg:grid"
                >
                  <CloseIcon size={16} />
                </button>
              </header>
            )}

            <div
              className={`min-h-0 flex-1 overflow-y-auto ${
                isScreen ? "px-4 pb-4 pt-2" : "px-5 pb-4 pt-2"
              } lg:px-7 lg:pb-2 lg:pt-4`}
            >
              {children}
            </div>

            {footer && (
              <div
                className={`shrink-0 ${
                  isScreen
                    ? "border-t border-sand bg-cream px-4 pb-5 pt-3"
                    : "px-5 pb-5 pt-2"
                } lg:border-0 lg:bg-transparent lg:px-7 lg:pb-7 lg:pt-3`}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsOverlay;
