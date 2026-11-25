import { useEffect, useRef } from "react";

// Shared focus trap, Escape handling and body-scroll lock for the order
// history dialogs. Focus returns to the control that opened the dialog when
// it is still on the page.
//
// Dialogs can stack (the mobile order detail opens the report/reorder
// dialogs), so only the topmost dialog handles Escape and Tab. The body lock
// is reference-counted so unmounting them in either order cannot leave the
// page stuck.
const dialogStack = [];
let bodyLockCount = 0;
let bodyOriginalOverflow = "";

const useDialogA11y = ({ open, onClose, initialFocusRef }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const dialogId = Symbol("dialog");
    dialogStack.push(dialogId);

    if (bodyLockCount === 0) {
      bodyOriginalOverflow = document.body.style.overflow;
    }
    bodyLockCount += 1;
    document.body.style.overflow = "hidden";

    const previouslyFocused = document.activeElement;
    const focusTimer = setTimeout(() => {
      initialFocusRef?.current?.focus();
    }, 0);

    const onKeyDown = (event) => {
      if (dialogStack[dialogStack.length - 1] !== dialogId) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]):not([type="file"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialogRef.current.contains(active)) {
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
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);

      const stackIndex = dialogStack.indexOf(dialogId);
      if (stackIndex !== -1) dialogStack.splice(stackIndex, 1);

      bodyLockCount = Math.max(0, bodyLockCount - 1);
      if (bodyLockCount === 0) {
        document.body.style.overflow = bodyOriginalOverflow;
      }

      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose, initialFocusRef]);

  return dialogRef;
};

export default useDialogA11y;
