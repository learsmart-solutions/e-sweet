import React, { useId, useRef, useState } from "react";
import { Link } from "../../../../lib/router";
import { Chip, FieldLabel, HelperText, TextArea, TextInput } from "../../kit/SettingsForm";
import { CameraIcon, CloseIcon } from "../../kit/icons";
import FormError from "../../../FormError";
import { formatPhone } from "../../../../lib/validation";
import {
  DESCRIPTION_MAX_LENGTH,
  REPORT_CATEGORIES,
  getDescriptionError,
  sendReport,
} from "../../../../lib/support";

/**
 * The "Report an issue" form: what it is about, a description, and (phone
 * only) an optional screenshot and the number we reply to.
 *
 * `variant="card"` is the desktop version, drawn inline on the page.
 * `variant="screen"` is the phone version, shown inside a full-screen
 * SettingsOverlay. The submit button lives outside this component (in the
 * page card or in the overlay footer) and points here with the `form`
 * attribute, so the parent passes the `formId` it used.
 *
 * Calls `onSent()` after WhatsApp opened and `onFail()` when it could not.
 */
const ReportForm = ({ formId, variant, user, onSent, onFail, descriptionRef }) => {
  const isScreen = variant === "screen";
  const descriptionId = useId();
  const errorId = useId();
  const fileRef = useRef(null);

  const [category, setCategory] = useState(REPORT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const problem = getDescriptionError(description);
    setError(problem);
    if (problem) {
      descriptionRef?.current?.focus();
      return;
    }

    const { ok } = sendReport({
      category,
      description,
      screenshotName: screenshot?.name,
      user,
    });
    if (!ok) {
      onFail();
      return;
    }
    setCategory(REPORT_CATEGORIES[0]);
    setDescription("");
    setScreenshot(null);
    onSent();
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      <div>
        <p id={`${descriptionId}-topic`} className="mb-2 text-[13px] font-bold text-ink">
          What is it about?
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby={`${descriptionId}-topic`}
        >
          {REPORT_CATEGORIES.map((name) => (
            <Chip key={name} selected={category === name} onClick={() => setCategory(name)}>
              {name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={descriptionId}>Describe the problem</FieldLabel>
        <TextArea
          id={descriptionId}
          ref={descriptionRef}
          value={description}
          rows={4}
          maxLength={DESCRIPTION_MAX_LENGTH}
          invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder="Describe the problem…"
          onChange={(event) => {
            setDescription(event.target.value);
            setError("");
          }}
          className="min-h-[120px] lg:min-h-[96px]"
        />
        <FormError id={errorId}>{error}</FormError>
      </div>

      {isScreen && (
        <>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              tabIndex={-1}
              className="hidden"
              onChange={(event) => {
                setScreenshot(event.target.files?.[0] ?? null);
                event.target.value = "";
              }}
            />
            {screenshot ? (
              <div className="flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-sand bg-cream-light px-3.5 py-3 text-[14px] text-ink">
                <CameraIcon size={16} className="text-muted" />
                <span className="min-w-0 flex-1 truncate">{screenshot.name}</span>
                <button
                  type="button"
                  onClick={() => setScreenshot(null)}
                  aria-label="Remove screenshot"
                  className="grid size-6 place-items-center rounded-full text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-ink/40 px-3.5 py-3 text-[14px] font-semibold text-ink transition-colors hover:bg-cream-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
              >
                <CameraIcon size={16} />
                Add a screenshot (optional)
              </button>
            )}
            {screenshot && (
              <HelperText>
                You&apos;ll attach this in the WhatsApp chat after we open it.
              </HelperText>
            )}
          </div>

          <div>
            <FieldLabel htmlFor={`${descriptionId}-reply`}>Reply to</FieldLabel>
            <TextInput
              id={`${descriptionId}-reply`}
              value={`${formatPhone(user.phone)} (WhatsApp)`}
              readOnly
              className="text-ink/80"
            />
            <HelperText>
              We reply on WhatsApp.{" "}
              <Link to="/settings/profile" className="font-bold text-tomato hover:underline">
                Change in Profile.
              </Link>
            </HelperText>
          </div>
        </>
      )}
    </form>
  );
};

export default ReportForm;
