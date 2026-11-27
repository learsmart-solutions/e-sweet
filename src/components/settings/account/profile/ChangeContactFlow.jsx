import React, { useEffect, useId, useRef, useState } from "react";
import SettingsOverlay from "../../kit/SettingsOverlay";
import { TextInput, FieldLabel, HelperText } from "../../kit/SettingsForm";
import { AlertIcon, ClockIcon, MailIcon, PhoneIcon } from "../../kit/icons";
import { buttonVariants } from "../../settingsStyles";
import FormError from "../../../FormError";
import CodeInput from "./CodeInput";
import {
  CODE_LENGTH,
  MAX_ATTEMPTS,
  RESEND_SECONDS,
  checkCode,
  formatCountdown,
  requestCode,
} from "../../../../lib/verification";
import {
  formatPhone,
  getEmailError,
  getPhoneError,
} from "../../../../lib/validation";

// Everything that differs between the two flows lives here, so the component
// below has one code path for both.
const FLOWS = {
  phone: {
    title: "Change phone number",
    channel: "sms",
    newHeading: "Your new number",
    intro:
      "We'll text a 6-digit code to the new number. Your current number stays active until you confirm.",
    currentLabel: "Current number",
    inputLabel: "New phone number",
    helper: "Use a number that can receive SMS.",
    sentVia: "Sent by SMS to",
    checkWhere: "the SMS",
    Icon: PhoneIcon,
  },
  email: {
    title: "Change email",
    channel: "email",
    newHeading: "Your new email",
    intro:
      "We'll email a 6-digit code to the new address. Your current email stays active until you confirm.",
    currentLabel: "Current email",
    inputLabel: "New email address",
    helper: "Receipts and account recovery go here.",
    sentVia: "Emailed to",
    checkWhere: "your email",
    Icon: MailIcon,
  },
};

// Nigerian numbers are typed without the country code (+234 is shown beside
// the box) and without the leading 0, e.g. "806 555 0192".
const toNational = (text) => {
  let digits = text.replace(/\D/g, "");
  if (digits.startsWith("234") && digits.length > 10) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
};

const formatNational = (digits) =>
  [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)]
    .filter(Boolean)
    .join(" ");

const lastTenDigits = (value = "") => value.replace(/\D/g, "").slice(-10);

/**
 * Two-step "change phone / change email" flow from the Profile page.
 *
 *   Step 1 - type the new number or address, "Send code".
 *   Step 2 - type the 6-digit code, "Verify and save".
 *
 * The current value stays in place until the code is confirmed. Up to
 * MAX_ATTEMPTS wrong codes are allowed before a new code must be requested.
 * `onDone(newValue)` is called once with the confirmed value (a Nigerian
 * number is returned as 0XXXXXXXXXX).
 */
const ChangeContactFlow = ({ kind, currentValue, onClose, onDone }) => {
  const flow = FLOWS[kind];
  const isPhone = kind === "phone";
  const formId = useId();
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef(null);
  const codeRef = useRef(null);

  const [step, setStep] = useState(1);
  const [entry, setEntry] = useState(""); // national digits, or email text
  const [entryError, setEntryError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [busy, setBusy] = useState(false);

  const locked = attempts >= MAX_ATTEMPTS;
  const target = isPhone ? `0${entry}` : entry.trim();
  const targetLabel = isPhone ? formatPhone(target) : target;
  const currentLabel = isPhone ? formatPhone(currentValue) : currentValue;

  // Resend countdown, only while the code step is showing.
  useEffect(() => {
    if (step !== 2 || secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  // Put the cursor where the person will type next.
  useEffect(() => {
    if (step === 2) codeRef.current?.focus();
    else inputRef.current?.focus();
  }, [step]);

  const validateEntry = () => {
    if (isPhone) {
      if (!entry) return "Enter the new phone number.";
      const problem = getPhoneError(target);
      if (problem) return problem;
      if (lastTenDigits(target) === lastTenDigits(currentValue)) {
        return "That's already your number.";
      }
      return "";
    }
    const problem = getEmailError(entry);
    if (problem) return problem;
    if (entry.trim().toLowerCase() === (currentValue || "").toLowerCase()) {
      return "That's already your email address.";
    }
    return "";
  };

  const sendCode = async () => {
    setBusy(true);
    const result = await requestCode({ channel: flow.channel, target });
    setBusy(false);
    if (!result.ok) {
      setEntryError("We couldn't send a code. Check your connection and try again.");
      return false;
    }
    setCode("");
    setCodeError("");
    setAttempts(0);
    setSecondsLeft(RESEND_SECONDS);
    return true;
  };

  const handleSendCode = async () => {
    const problem = validateEntry();
    setEntryError(problem);
    if (problem) {
      inputRef.current?.focus();
      return;
    }
    if (await sendCode()) setStep(2);
  };

  const handleVerify = async () => {
    if (code.length < CODE_LENGTH) {
      setCodeError(`Enter all ${CODE_LENGTH} digits.`);
      return;
    }
    setBusy(true);
    const result = await checkCode({ channel: flow.channel, target, code });
    setBusy(false);

    if (result.ok) {
      onDone(target);
      return;
    }
    const used = attempts + 1;
    const left = MAX_ATTEMPTS - used;
    setAttempts(used);
    setCodeError(
      left > 0
        ? `That code doesn't match. Check ${flow.checkWhere} and try again. ${left} ${left === 1 ? "try" : "tries"} left.`
        : "Too many wrong codes. Request a new code to try again.",
    );
  };

  const handleResend = async () => {
    if (await sendCode()) codeRef.current?.focus();
  };

  // After a wrong code the primary button reads "Try again" and clears the
  // boxes, as drawn in Figma.
  const wrongCode = Boolean(codeError) && code.length === CODE_LENGTH;
  const clearCode = () => {
    setCode("");
    setCodeError("");
    codeRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (busy) return;
    if (step === 1) handleSendCode();
    else if (wrongCode && !locked) clearCode();
    else handleVerify();
  };

  let primaryLabel;
  if (step === 1) primaryLabel = busy ? "Sending…" : "Send code →";
  else if (busy) primaryLabel = "Checking…";
  else primaryLabel = wrongCode && !locked ? "Try again" : "Verify and save";

  const footer = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onClose}
        className={`${buttonVariants.ghost} hidden lg:inline-flex`}
      >
        Cancel
      </button>
      <button
        type="submit"
        form={formId}
        disabled={busy || (step === 2 && locked)}
        className={`${buttonVariants.red} w-full disabled:opacity-60 lg:ml-auto lg:w-auto`}
      >
        {primaryLabel}
      </button>
    </div>
  );

  return (
    <SettingsOverlay
      open
      onClose={onClose}
      title={flow.title}
      phoneVariant="screen"
      footer={footer}
      closeOnBackdrop={false}
      initialFocusRef={inputRef}
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 pt-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-tomato">
          Step {step} of 2
        </p>

        {step === 1 ? (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink">
                {flow.newHeading}
              </h3>
              <p className="text-[14px] leading-5 text-muted">{flow.intro}</p>
            </div>

            <div className="flex items-center gap-3 rounded-[14px] bg-sand/70 px-3.5 py-3">
              <flow.Icon size={18} className="text-muted" />
              <div className="flex min-w-0 flex-col">
                <span className="text-[11px] text-muted">{flow.currentLabel}</span>
                <span className="truncate text-[14px] font-bold text-ink">
                  {currentLabel}
                </span>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor={inputId}>{flow.inputLabel}</FieldLabel>
              {isPhone ? (
                <div
                  className={`flex items-center gap-2.5 rounded-[14px] border-[1.5px] bg-cream-light px-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-tomato lg:bg-cream ${
                    entryError ? "border-tomato" : "border-tomato/70"
                  }`}
                >
                  <span className="flex items-center gap-1.5 border-r border-sand py-3 pr-3 text-[15px] font-semibold text-ink">
                    <span aria-hidden="true">🇳🇬</span>
                    +234
                  </span>
                  <input
                    id={inputId}
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="806 555 0192"
                    value={formatNational(entry)}
                    onChange={(event) => {
                      setEntry(toNational(event.target.value));
                      setEntryError("");
                    }}
                    aria-invalid={Boolean(entryError) || undefined}
                    aria-describedby={entryError ? errorId : undefined}
                    className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-muted/70"
                  />
                </div>
              ) : (
                <TextInput
                  id={inputId}
                  ref={inputRef}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={entry}
                  invalid={Boolean(entryError)}
                  aria-describedby={entryError ? errorId : undefined}
                  onChange={(event) => {
                    setEntry(event.target.value);
                    setEntryError("");
                  }}
                />
              )}
              <FormError id={errorId}>{entryError}</FormError>
              {!entryError && <HelperText>{flow.helper}</HelperText>}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink">
                Enter the code
              </h3>
              <p className="text-[14px] leading-5 text-muted">
                {flow.sentVia} <span className="break-all">{targetLabel}</span>.{" "}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-bold text-tomato hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
                >
                  Change
                </button>
              </p>
            </div>

            <CodeInput
              ref={codeRef}
              value={code}
              invalid={Boolean(codeError)}
              disabled={busy || locked}
              onChange={(next) => {
                setCode(next);
                if (codeError && next.length < CODE_LENGTH) setCodeError("");
              }}
            />

            {codeError && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-[12px] bg-tomato/10 px-3 py-2.5 text-[12px] font-semibold leading-[1.45] text-tomato"
              >
                <AlertIcon size={16} className="mt-px" />
                {codeError}
              </p>
            )}

            <p className="flex items-center gap-1.5 text-[13px] text-muted">
              {secondsLeft > 0 && !locked ? (
                <>
                  <ClockIcon size={14} />
                  Resend code in {formatCountdown(secondsLeft)}
                </>
              ) : (
                <>
                  Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={busy}
                    className="font-bold text-tomato hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato disabled:opacity-60"
                  >
                    Resend code
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </form>
    </SettingsOverlay>
  );
};

export default ChangeContactFlow;
