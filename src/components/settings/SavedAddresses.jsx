import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../../context/StoreContext";

// Icons matching Figma node 429-10536
export const HomeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#D7261E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const WorkIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#D7261E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export const PinIcon = ({ stroke = "#D7261E", size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EditPencilIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#D7261E"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const PlusIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const RiderIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="18.5" cy="17.5" r="3.5" />
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="15" cy="5" r="1.5" />
    <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
  </svg>
);

const getAddressIcon = (label = "") => {
  const norm = label.toLowerCase().trim();
  if (norm === "home") return <HomeIcon />;
  if (norm === "work") return <WorkIcon />;
  return <PinIcon stroke="#D7261E" size={18} />;
};

// 1. Empty State
export const EmptyAddressesState = ({ onAdd }) => (
  <div className="flex w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#E5D7CC] bg-[#FFFBF7]/60 px-6 py-12 text-center sm:py-16">
    <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#F6E8DF]">
      <PinIcon stroke="#D7261E" size={26} />
    </div>
    <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink sm:text-[24px]">
      No saved addresses
    </h2>
    <p className="mt-1.5 max-w-[400px] text-[14px] leading-relaxed text-muted sm:text-[15px]">
      Save Home or Work once and checkout takes two taps. Add a landmark so
      riders find you fast.
    </p>
    <button
      type="button"
      onClick={onAdd}
      className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-tomato px-7 py-3.5 text-[15px] font-bold text-cream-light shadow-[0_12px_16px_rgba(215,38,30,0.38)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
    >
      <PlusIcon size={16} />
      Add an address
    </button>
  </div>
);

// 2. Address Card
export const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const { label, street, area, landmark, isDefault } = address;
  const fullAddress = [street, area].filter(Boolean).join(", ");

  return (
    <div
      className={`relative flex flex-col justify-between gap-4 rounded-[22px] bg-cream-light p-5 transition-shadow hover:shadow-[0_8px_24px_rgba(30,20,10,0.06)] sm:p-6 ${
        isDefault ? "border-2 border-tomato" : "border border-[#E9DFD5]"
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center shrink-0">
              {getAddressIcon(label)}
            </span>
            <span className="font-display text-[18px] font-bold tracking-[-0.01em] text-ink">
              {label}
            </span>
          </div>
          {isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full bg-tomato px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
              <CheckIcon />
              Default
            </span>
          )}
        </div>

        {/* Address text */}
        <p className="text-[14px] font-medium leading-snug text-ink sm:text-[15px]">
          {fullAddress}
        </p>

        {/* Landmark / Delivery note */}
        {landmark && (
          <div className="flex items-start gap-2 rounded-[14px] bg-[#FAF2EB] px-3.5 py-2.5 text-[13px] leading-relaxed text-muted">
            <span className="mt-0.5 shrink-0 text-muted/70">
              <PinIcon stroke="currentColor" size={14} />
            </span>
            <span className="min-w-0 flex-1">{landmark}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between border-t border-sand/70 pt-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink transition-colors hover:text-tomato focus-visible:outline-tomato"
          >
            <EditPencilIcon />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(address)}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-tomato transition-colors hover:text-[#bf1f18] focus-visible:outline-tomato"
          >
            <TrashIcon />
            Delete
          </button>
        </div>
        {!isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-[13px] font-bold text-tomato transition-colors hover:text-[#bf1f18] focus-visible:outline-tomato"
          >
            Set as default
          </button>
        )}
      </div>
    </div>
  );
};

// 3. Add New Address Dashed Card
export const AddAddressCard = ({ onAdd }) => (
  <button
    type="button"
    onClick={onAdd}
    className="group flex min-h-[175px] w-full flex-col items-center justify-center gap-2 rounded-[22px] border-2 border-dashed border-[#D5C6B7] bg-[#FAF5EE]/50 p-6 text-center transition-all hover:border-ink/50 hover:bg-[#FAF5EE] focus-visible:outline-tomato"
  >
    <span className="grid size-9 place-items-center rounded-full bg-cream transition-transform group-hover:scale-110">
      <PlusIcon size={20} />
    </span>
    <span className="font-display text-[15px] font-extrabold text-ink">
      Add a new address
    </span>
  </button>
);

// Form inside AddressModal initialized via useState without set-state-in-effect
const AddressModalForm = ({
  mode,
  initialData,
  onClose,
  onSave,
  onDeleteRequest,
}) => {
  const isEdit = mode === "edit";

  const [labelType, setLabelType] = useState(() => {
    const lbl = initialData?.label;
    if (lbl === "Home" || lbl === "Work") return lbl;
    return lbl ? "Other" : "Home";
  });

  const [customLabel, setCustomLabel] = useState(() => {
    const lbl = initialData?.label;
    if (lbl && lbl !== "Home" && lbl !== "Work") return lbl;
    return "";
  });

  const [street, setStreet] = useState(() => initialData?.street || "");
  const [area, setArea] = useState(() => initialData?.area || "");
  const [landmark, setLandmark] = useState(() => initialData?.landmark || "");
  const [isDefault, setIsDefault] = useState(() =>
    Boolean(initialData?.isDefault),
  );
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);
  const streetInputRef = useRef(null);

  const streetId = useId();
  const areaId = useId();
  const landmarkId = useId();
  const customLabelId = useId();

  // Focus street input on mount, setup focus trap & Esc handler
  useEffect(() => {
    const timer = setTimeout(() => {
      streetInputRef.current?.focus();
    }, 50);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!modalRef.current.contains(active)) {
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
      clearTimeout(timer);
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!area.trim()) {
      newErrors.area = "Area or town is required";
    }
    if (labelType === "Other" && !customLabel.trim()) {
      newErrors.customLabel = "Enter a name for this address (e.g. Mum's place)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalLabel =
      labelType === "Other" ? customLabel.trim() || "Other" : labelType;

    onSave({
      label: finalLabel,
      street: street.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
      isDefault,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/55 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.2, 0.75, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-[500px] flex-col overflow-y-auto rounded-[28px] bg-cream-light p-6 shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <h2
            id="address-modal-title"
            className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink sm:text-[24px]"
          >
            {isEdit ? "Edit address" : "Add address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full border border-sand bg-cream text-ink transition-colors hover:bg-sand/60"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Label selector */}
          <div>
            <span className="block text-[13px] font-bold text-ink">
              Label
            </span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {["Home", "Work", "Other"].map((lbl) => {
                const isSelected = labelType === lbl;
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => {
                      setLabelType(lbl);
                      setErrors((prev) => ({ ...prev, customLabel: "" }));
                    }}
                    className={`rounded-full px-5 py-2 text-[13px] font-bold transition-all ${
                      isSelected
                        ? "bg-ink text-cream"
                        : "border border-[#D5C7B8] bg-white text-ink hover:border-ink/60"
                    }`}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
            {labelType === "Other" && (
              <div className="mt-2.5">
                <label htmlFor={customLabelId} className="sr-only">
                  Custom label name
                </label>
                <input
                  id={customLabelId}
                  type="text"
                  placeholder="e.g. Mum's place, Gym"
                  value={customLabel}
                  onChange={(e) => {
                    setCustomLabel(e.target.value);
                    setErrors((prev) => ({ ...prev, customLabel: "" }));
                  }}
                  className="w-full rounded-[14px] border border-[#D5C7B8] bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-muted/60 focus:border-tomato focus:outline-none focus:ring-1 focus:ring-tomato"
                />
                {errors.customLabel && (
                  <p className="mt-1 text-[12px] font-semibold text-tomato">
                    {errors.customLabel}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Street & Area */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor={streetId}
                className="block text-[13px] font-bold text-ink"
              >
                Street address
              </label>
              <input
                ref={streetInputRef}
                id={streetId}
                type="text"
                placeholder="e.g. 20A Idiroko Road"
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value);
                  setErrors((prev) => ({ ...prev, street: "" }));
                }}
                className={`mt-1.5 w-full rounded-[14px] border bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-1 ${
                  errors.street
                    ? "border-tomato focus:border-tomato focus:ring-tomato"
                    : "border-[#D5C7B8] focus:border-tomato focus:ring-tomato"
                }`}
              />
              {errors.street && (
                <p className="mt-1 text-[12px] font-semibold text-tomato">
                  {errors.street}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={areaId}
                className="block text-[13px] font-bold text-ink"
              >
                Area / town
              </label>
              <input
                id={areaId}
                type="text"
                placeholder="e.g. Sango Otta, Ogun State"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setErrors((prev) => ({ ...prev, area: "" }));
                }}
                className={`mt-1.5 w-full rounded-[14px] border bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-1 ${
                  errors.area
                    ? "border-tomato focus:border-tomato focus:ring-tomato"
                    : "border-[#D5C7B8] focus:border-tomato focus:ring-tomato"
                }`}
              />
              {errors.area && (
                <p className="mt-1 text-[12px] font-semibold text-tomato">
                  {errors.area}
                </p>
              )}
            </div>
          </div>

          {/* Landmark / Delivery notes */}
          <div>
            <label
              htmlFor={landmarkId}
              className="block text-[13px] font-bold text-ink"
            >
              Landmark / delivery notes
            </label>
            <input
              id={landmarkId}
              type="text"
              placeholder="e.g. Blue gate opposite the pharmacy. Call when near."
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="mt-1.5 w-full rounded-[14px] border border-[#D5C7B8] bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-muted/60 focus:border-tomato focus:outline-none focus:ring-1 focus:ring-tomato"
            />
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted">
              <span className="text-muted/80">
                <RiderIcon />
              </span>
              Riders rely on this to find you.
            </p>
          </div>

          {/* Set as default toggle */}
          <div className="flex items-center justify-between rounded-[16px] bg-[#FAF2EB] px-4 py-3">
            <span className="text-[14px] font-bold text-ink">
              Set as default address
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isDefault}
              onClick={() => setIsDefault((prev) => !prev)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-tomato ${
                isDefault ? "bg-tomato" : "bg-[#D1C2B4]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                  isDefault ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-2 flex items-center justify-between pt-2">
            {isEdit ? (
              <button
                type="button"
                onClick={() => onDeleteRequest(initialData)}
                className="inline-flex items-center gap-1.5 text-[14px] font-bold text-tomato transition-colors hover:text-[#bf1f18]"
              >
                <TrashIcon />
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border-[1.5px] border-ink bg-transparent px-5 py-2.5 text-[14px] font-bold text-ink transition-colors hover:bg-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-tomato px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(215,38,30,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
              >
                Save address
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// 4. Add / Edit Address Modal Wrapper
export const AddressModal = ({
  open,
  mode = "add",
  initialData = null,
  onClose,
  onSave,
  onDeleteRequest,
}) => (
  <AnimatePresence>
    {open && (
      <AddressModalForm
        key={initialData?.id || (mode === "add" ? "new-address" : "modal")}
        mode={mode}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
        onDeleteRequest={onDeleteRequest}
      />
    )}
  </AnimatePresence>
);

// 5. Delete Confirmation Dialog
export const DeleteAddressDialog = ({
  open,
  address,
  addresses = [],
  onCancel,
  onConfirm,
}) => {
  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    cancelBtnRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }
      if (event.key !== "Tab") return;

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
    };
  }, [open, onCancel]);

  if (!address) return null;

  const fullAddress = [address.street, address.area].filter(Boolean).join(", ");
  const isDefault = address.isDefault;
  const remaining = addresses.filter((a) => a.id !== address.id);
  const nextDefault = remaining[0];

  let helperDesc = `${fullAddress} will be removed.`;
  if (isDefault && nextDefault) {
    helperDesc = `${fullAddress} will be removed. ${nextDefault.label} becomes your default address.`;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-ink/55 px-6"
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
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.75, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[380px] flex-col items-center gap-3 rounded-[26px] bg-cream-light p-6 text-center sm:max-w-[420px] sm:p-7"
          >
            <div className="grid size-14 place-items-center rounded-full bg-[#FDF0E9]">
              <PinIcon stroke="#D7261E" size={26} />
            </div>

            <h2
              id="delete-dialog-title"
              className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink"
            >
              Delete &ldquo;{address.label}&rdquo;?
            </h2>

            <p
              id="delete-dialog-description"
              className="max-w-[320px] text-[14px] leading-relaxed text-muted"
            >
              {helperDesc}
            </p>

            <div className="mt-2 flex w-full items-center justify-center gap-3">
              <button
                ref={cancelBtnRef}
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-full border-[1.5px] border-ink bg-transparent py-3 text-[14px] font-bold text-ink transition-colors hover:bg-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onConfirm(address.id)}
                className="flex-1 rounded-full bg-tomato py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(215,38,30,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
              >
                Delete address
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 6. Main Container Component
const SavedAddresses = ({ openModalRef }) => {
  const {
    addresses = [],
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useStore();

  const [modalState, setModalState] = useState({
    open: false,
    mode: "add",
    address: null,
  });

  const [deleteDialogState, setDeleteDialogState] = useState({
    open: false,
    address: null,
  });

  const openAddModal = () => {
    setModalState({ open: true, mode: "add", address: null });
  };

  const openEditModal = (address) => {
    setModalState({ open: true, mode: "edit", address });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  const openDeleteDialog = (address) => {
    closeModal();
    setDeleteDialogState({ open: true, address });
  };

  const closeDeleteDialog = () => {
    setDeleteDialogState({ open: false, address: null });
  };

  const handleSaveAddress = (data) => {
    if (modalState.mode === "edit" && modalState.address?.id) {
      updateAddress(modalState.address.id, data);
    } else {
      addAddress(data);
    }
    closeModal();
  };

  const handleConfirmDelete = (id) => {
    deleteAddress(id);
    closeDeleteDialog();
  };

  useEffect(() => {
    if (openModalRef) {
      openModalRef.current = openAddModal;
    }
    return () => {
      if (openModalRef) openModalRef.current = null;
    };
  }, [openModalRef]);

  const isEmpty = addresses.length === 0;

  return (
    <div className="w-full">
      {isEmpty ? (
        <EmptyAddressesState onAdd={openAddModal} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={openEditModal}
              onDelete={openDeleteDialog}
              onSetDefault={setDefaultAddress}
            />
          ))}
          <AddAddressCard onAdd={openAddModal} />
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddressModal
        open={modalState.open}
        mode={modalState.mode}
        initialData={modalState.address}
        onClose={closeModal}
        onSave={handleSaveAddress}
        onDeleteRequest={openDeleteDialog}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteAddressDialog
        open={deleteDialogState.open}
        address={deleteDialogState.address}
        addresses={addresses}
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SavedAddresses;
