import React, { useImperativeHandle, useRef } from "react";
import { CODE_LENGTH } from "../../../../lib/verification";

const onlyDigits = (text = "") => text.replace(/\D/g, "");

/**
 * Six separate boxes for a one-time code.
 *
 * - `value` is a plain string of digits (no gaps, at most CODE_LENGTH).
 * - Typing moves to the next box, Backspace steps back, arrow keys move
 *   between boxes, and pasting a whole code fills every box.
 * - The first box has `autoComplete="one-time-code"` so phones can offer the
 *   code from the incoming SMS.
 * - The parent can call `ref.current.focus()` to focus the first empty box.
 */
const CodeInput = React.forwardRef(
  ({ value, onChange, invalid = false, disabled = false }, ref) => {
    const boxes = useRef([]);

    const focusBox = (index) =>
      boxes.current[Math.max(0, Math.min(CODE_LENGTH - 1, index))]?.focus();

    useImperativeHandle(ref, () => ({
      focus: () => focusBox(value.length),
    }));

    const handleChange = (index, text) => {
      const digits = onlyDigits(text);
      if (!digits) return;
      const digit = digits[digits.length - 1];
      onChange((value.slice(0, index) + digit + value.slice(index + 1)).slice(0, CODE_LENGTH));
      focusBox(index + 1);
    };

    const handleKeyDown = (index, event) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        if (value[index]) {
          onChange(value.slice(0, index) + value.slice(index + 1));
        } else if (index > 0) {
          onChange(value.slice(0, index - 1) + value.slice(index));
          focusBox(index - 1);
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusBox(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        focusBox(index + 1);
      }
    };

    const handlePaste = (event) => {
      const digits = onlyDigits(event.clipboardData.getData("text")).slice(0, CODE_LENGTH);
      if (!digits) return;
      event.preventDefault();
      onChange(digits);
      focusBox(digits.length);
    };

    return (
      <div role="group" aria-label={`${CODE_LENGTH}-digit code`} className="flex gap-2.5">
        {Array.from({ length: CODE_LENGTH }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              boxes.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            value={value[index] ?? ""}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            // Never leave a gap: a click on a later box lands on the first
            // empty one instead.
            onFocus={(event) => {
              if (index > value.length) focusBox(value.length);
              else event.target.select();
            }}
            className={`size-11 rounded-xl border-[1.5px] bg-cream-light text-center font-display text-[20px] font-extrabold text-ink focus-visible:border-tomato focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato disabled:opacity-50 sm:size-12 ${
              invalid ? "border-tomato" : "border-ink"
            }`}
          />
        ))}
      </div>
    );
  },
);
CodeInput.displayName = "CodeInput";

export default CodeInput;
