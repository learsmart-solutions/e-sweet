import React, { useId, useRef } from "react";
import SettingsOverlay from "../../kit/SettingsOverlay";
import { buttonVariants } from "../../settingsStyles";
import { CloseIcon, TrashIcon } from "../../kit/icons";
import { formatNaira } from "../../../../context/StoreContext";

/**
 * What the person would lose, as lines for the "You will lose" box.
 *
 * Orders, saved addresses and referral credit are not stored yet (those
 * Settings pages are still to be built), so today only the generic line
 * shows. Pass the real counts in `data` once they exist:
 *   { orders: 12, referralCredit: 1000, addresses: 3 }
 */
const getLossLines = ({ orders = 0, referralCredit = 0, addresses = 0 } = {}) => {
  const lines = [];
  if (orders > 0) {
    lines.push(`All ${orders} past ${orders === 1 ? "order" : "orders"} and receipts`);
  }
  if (referralCredit > 0) lines.push(`${formatNaira(referralCredit)} referral credit`);
  if (addresses > 0) {
    lines.push(`Your ${addresses} saved ${addresses === 1 ? "address" : "addresses"}`);
  }
  if (lines.length === 0) lines.push("Your profile and food preferences");
  return lines;
};

/**
 * "Delete your account?" confirm. Bottom sheet on phones, centred dialog on
 * desktop. Focus starts on "Keep my account" so a stray Enter is safe.
 */
const DeleteAccountDialog = ({ accountData, onKeep, onDelete }) => {
  const titleId = useId();
  const noteId = useId();
  const keepRef = useRef(null);
  const lines = getLossLines(accountData);

  return (
    <SettingsOverlay
      open
      onClose={onKeep}
      role="alertdialog"
      phoneVariant="sheet"
      size="sm"
      labelledBy={titleId}
      describedBy={noteId}
      initialFocusRef={keepRef}
      footer={
        <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-2.5">
          <button
            type="button"
            onClick={onDelete}
            className={`${buttonVariants.red} w-full lg:flex-1`}
          >
            Delete my account
          </button>
          <button
            ref={keepRef}
            type="button"
            onClick={onKeep}
            className={`${buttonVariants.ghost} w-full lg:flex-1`}
          >
            Keep my account
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3 pt-3 text-center lg:pt-0">
        <span className="grid size-[52px] place-items-center rounded-full bg-tomato text-cream-light">
          <TrashIcon size={24} />
        </span>
        <h2
          id={titleId}
          className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink lg:text-[24px]"
        >
          Delete your account?
        </h2>

        <div className="w-full rounded-[14px] bg-cream p-3.5 text-left">
          <p className="mb-2 text-[13px] font-bold text-ink">You will lose:</p>
          <ul className="flex flex-col gap-1.5">
            {lines.map((line) => (
              <li key={line} className="flex items-center gap-2 text-[13px] text-ink">
                <CloseIcon size={13} className="text-tomato" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <p id={noteId} className="text-[12px] leading-[1.5] text-muted">
          This can&apos;t be undone. An order that is on its way will still be delivered.
        </p>
      </div>
    </SettingsOverlay>
  );
};

export default DeleteAccountDialog;
