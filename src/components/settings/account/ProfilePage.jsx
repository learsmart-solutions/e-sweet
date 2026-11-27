import React, { useId, useState } from "react";
import { useStore } from "../../../context/StoreContext";
import { formatPhone, getNameError } from "../../../lib/validation";
import { PHOTO_ERRORS } from "../../../lib/photo";
import Avatar from "../kit/Avatar";
import Toast from "../kit/Toast";
import useToast from "../kit/useToast";
import { buttonVariants } from "../settingsStyles";
import { FieldLabel, HelperText, SectionCard, TextInput } from "../kit/SettingsForm";
import { CameraIcon, LockIcon, TrashIcon } from "../kit/icons";
import FormError from "../../FormError";
import ChangeContactFlow from "./profile/ChangeContactFlow";
import DeleteAccountDialog from "./profile/DeleteAccountDialog";
import PhotoPicker from "./profile/PhotoPicker";

export const sectionKey = "profile";

// A read-only row (phone, email) with a lock icon and a red change button.
// `shortLabel` is the phone wording and `longLabel` the desktop wording
// ("Change" vs "Change number"), as drawn in Figma. `accessibleLabel` is the
// full name a screen reader hears for the button.
const LockedField = ({
  label,
  value,
  shortLabel,
  longLabel,
  accessibleLabel,
  onChange,
  helper,
}) => {
  const labelId = useId();
  const helperId = useId();
  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={helperId}>
      <span id={labelId} className="mb-1.5 block text-[13px] font-bold text-ink">
        {label}
      </span>
      <div className="flex items-center gap-2.5 rounded-[14px] bg-sand/70 px-3.5 py-3">
        <LockIcon size={16} className="text-muted" />
        <span className="min-w-0 flex-1 truncate text-[15px] text-muted">{value}</span>
        <button
          type="button"
          onClick={onChange}
          aria-label={accessibleLabel}
          className="shrink-0 text-[13px] font-bold text-tomato hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
        >
          <span className="lg:hidden">{shortLabel}</span>
          <span className="hidden lg:inline">{longLabel}</span>
        </button>
      </div>
      <HelperText id={helperId}>{helper}</HelperText>
    </div>
  );
};

/**
 * Settings > Profile (/settings/profile).
 *
 * Name is edited in place and saved with "Save changes". Phone and email are
 * read-only here; "Change" starts a two-step code flow (ChangeContactFlow)
 * that saves on its own. The photo and "Delete account" also act on their
 * own, through a picker and a confirm.
 *
 * pages/Settings.jsx mounts this component twice (phone layout and desktop
 * layout; CSS shows one). Anything that must be unique, such as ids, comes
 * from useId, and overlays only open in the tree that was used.
 */
const ProfilePage = () => {
  const { user, updateProfile, deleteAccount } = useStore();
  const nameId = useId();
  const nameErrorId = useId();
  const { toast, showToast } = useToast();

  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState("");
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [changeKind, setChangeKind] = useState(null); // "phone" | "email" | null
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Save is only available once the name has actually changed.
  const dirty = name.trim() !== user.name;

  const handleSave = (event) => {
    event.preventDefault();
    if (!dirty) return;
    const problem = getNameError(name);
    setNameError(problem);
    if (problem) return;
    updateProfile({ name: name.trim() });
    setName(name.trim());
    showToast("Name updated");
  };

  const handleCancel = () => {
    setName(user.name);
    setNameError("");
  };

  const failPhoto = (message) => {
    setPhotoOpen(false);
    setPhotoFailed(true);
    showToast(message || PHOTO_ERRORS.upload, "error");
  };

  const savePhoto = (dataUrl) => {
    updateProfile({ photo: dataUrl });
    setPhotoOpen(false);
    setPhotoFailed(false);
    showToast("Photo updated");
  };

  const removePhoto = () => {
    updateProfile({ photo: null });
    setPhotoOpen(false);
    setPhotoFailed(false);
    showToast("Photo removed");
  };

  const finishChange = (value) => {
    updateProfile({ [changeKind]: value });
    showToast(changeKind === "phone" ? "Phone number updated" : "Email updated");
    setChangeKind(null);
  };

  return (
    <div className="flex min-h-[calc(100svh-6rem)] flex-col gap-5 lg:min-h-0">
      <form onSubmit={handleSave} noValidate className="flex flex-1 flex-col">
        <SectionCard className="flex flex-col gap-5 lg:flex-row lg:gap-8">
          <div className="flex flex-col items-center gap-1.5 lg:w-[140px] lg:shrink-0">
            <div className="relative">
              <Avatar name={user.name} photo={user.photo} size={80} />
              <button
                type="button"
                onClick={() => setPhotoOpen(true)}
                aria-label="Change photo"
                className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full border-2 border-cream bg-ink text-cream-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato lg:border-cream-light"
              >
                <CameraIcon size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPhotoOpen(true)}
              className="text-[13px] font-bold text-tomato hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
            >
              {photoFailed ? "Upload failed · Try again" : "Change photo"}
            </button>
            <p className="hidden text-center text-[11px] leading-[1.4] text-muted lg:block">
              JPG or PNG, up to 5 MB
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div>
              <FieldLabel htmlFor={nameId}>Full name</FieldLabel>
              <TextInput
                id={nameId}
                value={name}
                autoComplete="name"
                invalid={Boolean(nameError)}
                aria-describedby={nameError ? nameErrorId : undefined}
                onChange={(event) => {
                  setName(event.target.value);
                  setNameError("");
                }}
              />
              <FormError id={nameErrorId}>{nameError}</FormError>
              {!nameError && <HelperText>Shown on receipts and to riders</HelperText>}
            </div>

            <LockedField
              label="Phone number"
              value={formatPhone(user.phone)}
              shortLabel="Change"
              longLabel="Change number"
              accessibleLabel="Change phone number"
              onChange={() => setChangeKind("phone")}
              helper={
                <>
                  <span className="lg:hidden">
                    You log in with this number. Changing it needs a code.
                  </span>
                  <span className="hidden lg:inline">
                    You log in with this number. We&apos;ll send a 6-digit code to the new one.
                  </span>
                </>
              }
            />

            <LockedField
              label="Email address"
              value={user.email}
              shortLabel="Change"
              longLabel="Change email"
              accessibleLabel="Change email address"
              onChange={() => setChangeKind("email")}
              helper="Added at sign-up. Used for receipts and account recovery. Changing it needs a code."
            />

            {/* Desktop: Cancel and Save sit inside the card. */}
            <div className="hidden justify-end gap-3 lg:flex">
              <button type="button" onClick={handleCancel} className={buttonVariants.ghost}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={!dirty}
                className={`${buttonVariants.red} disabled:opacity-50 disabled:shadow-none`}
              >
                Save changes
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Phone: red text link, then Save pinned to the bottom of the screen. */}
        <div className="flex justify-center py-6 lg:hidden">
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-tomato hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
          >
            <TrashIcon size={15} />
            Delete account
          </button>
        </div>
        <div className="sticky bottom-0 -mx-4 -mb-6 mt-auto border-t border-sand bg-cream px-4 pb-5 pt-3 lg:hidden">
          <button
            type="submit"
            disabled={!dirty}
            className={`${buttonVariants.red} w-full disabled:opacity-50 disabled:shadow-none`}
          >
            Save changes
          </button>
        </div>
      </form>

      {/* Desktop: red-outlined card below the form. */}
      <section className="hidden items-center gap-4 rounded-[20px] border border-tomato/40 bg-cream-light px-6 py-4 lg:flex">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[16px] font-extrabold text-tomato">Delete account</h2>
          <p className="text-[13px] text-muted">
            Removes your order history, saved addresses and any referral credit. This
            can&apos;t be undone.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] border-tomato px-4 py-2.5 text-[14px] font-bold text-tomato transition-colors hover:bg-tomato/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
        >
          <TrashIcon size={15} />
          Delete account
        </button>
      </section>

      {photoOpen && (
        <PhotoPicker
          hasPhoto={Boolean(user.photo)}
          onSave={savePhoto}
          onRemove={removePhoto}
          onFail={failPhoto}
          onClose={() => setPhotoOpen(false)}
        />
      )}

      {changeKind && (
        <ChangeContactFlow
          key={changeKind}
          kind={changeKind}
          currentValue={user[changeKind]}
          onClose={() => setChangeKind(null)}
          onDone={finishChange}
        />
      )}

      {deleteOpen && (
        <DeleteAccountDialog
          onKeep={() => setDeleteOpen(false)}
          onDelete={() => {
            setDeleteOpen(false);
            deleteAccount();
          }}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default ProfilePage;
