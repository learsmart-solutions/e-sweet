import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buttonVariants } from "./settingsStyles";
import logoutDialogIcon from "../../assets/icons/settings/logout-dialog.svg";
import logoutDialogIconLg from "../../assets/icons/settings/logout-dialog-26.svg";

// "Sign out of e'sweet?" confirm. Phone stacks the buttons with Sign out on
// top; desktop puts them side by side with Sign out on the right.
const SignOutDialog = ({ open, email, onCancel, onConfirm }) => {
  const dialogRef = useRef(null);
  const stayRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Start on the safe choice so a stray Enter does not sign people out.
    stayRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }
      if (event.key !== "Tab") return;

      // aria-modal promises the page behind is out of reach, so keep Tab
      // cycling between the dialog's buttons.
      const buttons = dialogRef.current?.querySelectorAll("button");
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
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
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      // After signing out, the button that opened the dialog has gone (the
      // page swaps to the signed-out prompt, which takes focus itself).
      if (previouslyFocused?.isConnected) previouslyFocused.focus?.();
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/55 px-6 lg:bg-ink/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
        >
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sign-out-title"
            aria-describedby="sign-out-description"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.75, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-[327px] flex-col items-center gap-3 rounded-[24px] bg-cream-light p-6 text-center lg:max-w-[440px] lg:gap-3.5 lg:rounded-[26px] lg:p-7"
          >
            <span className="grid size-[52px] place-items-center rounded-full bg-cream lg:size-14">
              <img
                src={logoutDialogIcon}
                alt=""
                width="24"
                height="24"
                className="lg:hidden"
              />
              <img
                src={logoutDialogIconLg}
                alt=""
                width="26"
                height="26"
                className="hidden lg:block"
              />
            </span>
            <h2
              id="sign-out-title"
              className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink lg:text-[24px]"
            >
              Sign out of e&rsquo;sweet?
            </h2>
            <p
              id="sign-out-description"
              className="text-[14px] leading-5 text-muted"
            >
              Your bag stays saved on this{" "}
              <span className="lg:hidden">phone</span>
              <span className="hidden lg:inline">device</span>.
              {email ? ` Sign in with ${email} to order again.` : ""}
            </p>
            <div className="flex w-full flex-col gap-3 lg:flex-row-reverse lg:gap-2.5">
              <button
                type="button"
                onClick={onConfirm}
                className={`${buttonVariants.ink} w-full lg:flex-1`}
              >
                Sign out
              </button>
              <button
                ref={stayRef}
                type="button"
                onClick={onCancel}
                className={`${buttonVariants.ghost} w-full lg:flex-1`}
              >
                Stay signed in
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignOutDialog;
