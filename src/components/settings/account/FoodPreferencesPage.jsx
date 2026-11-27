import React, { useId, useState } from "react";
import Toast from "../kit/Toast";
import useToast from "../kit/useToast";
import { buttonVariants } from "../settingsStyles";
import {
  ActionBar,
  Chip,
  FieldLabel,
  HelperText,
  SectionCard,
  TextArea,
} from "../kit/SettingsForm";
import { AlertIcon } from "../kit/icons";
import {
  ALLERGIES_MAX_LENGTH,
  NOTE_MAX_LENGTH,
  QUICK_NOTES,
  hasPhrase,
  readFoodPreferences,
  togglePhrase,
  writeFoodPreferences,
} from "../../../lib/foodPreferences";

export const sectionKey = "food-preferences";

// Show "123/240" only when the limit is close, so the form stays calm.
const CounterText = ({ id, length, max }) =>
  length > max - 40 ? (
    <p id={id} className="mt-1 text-right text-[11px] text-muted">
      {length}/{max}
    </p>
  ) : null;

/**
 * Settings > Food preferences (/settings/food-preferences).
 *
 * A default kitchen note (with quick-pick pills) and an optional allergies
 * field. "Save preferences" stores both; checkout then prefills its note box
 * with them (see BagDrawer). Nothing is saved until the button is pressed.
 *
 * pages/Settings.jsx mounts this component twice (phone and desktop
 * layouts), so ids come from useId. Both copies read the saved values on
 * mount, so they agree.
 */
const FoodPreferencesPage = () => {
  const noteId = useId();
  const noteHelpId = useId();
  const noteCountId = useId();
  const allergiesId = useId();
  const allergiesCountId = useId();
  const { toast, showToast } = useToast();

  const [saved, setSaved] = useState(readFoodPreferences);
  const [note, setNote] = useState(saved.note);
  const [allergies, setAllergies] = useState(saved.allergies);

  const dirty =
    note.trim() !== saved.note.trim() ||
    allergies.trim() !== saved.allergies.trim();

  const handleQuickNote = (phrase) => {
    const next = togglePhrase(note, phrase);
    // A pill never pushes the note past its limit.
    if (next.length <= NOTE_MAX_LENGTH) setNote(next);
  };

  const handleCancel = () => {
    setNote(saved.note);
    setAllergies(saved.allergies);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!dirty) return;
    const next = { note: note.trim(), allergies: allergies.trim() };
    if (!writeFoodPreferences(next)) {
      showToast("Couldn't save your preferences. Try again.", "error");
      return;
    }
    setSaved(next);
    setNote(next.note);
    setAllergies(next.allergies);
    showToast("Food preferences saved");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex min-h-[calc(100svh-6rem)] flex-col lg:min-h-0"
    >
      <SectionCard className="flex flex-1 flex-col gap-5 lg:flex-none">
        <div>
          <FieldLabel htmlFor={noteId}>Default kitchen note</FieldLabel>
          <TextArea
            id={noteId}
            value={note}
            rows={1}
            maxLength={NOTE_MAX_LENGTH}
            placeholder="Less pepper, extra plantain..."
            aria-describedby={`${noteHelpId} ${noteCountId}`}
            onChange={(event) => setNote(event.target.value)}
            className="field-sizing-content min-h-[86px] lg:min-h-[56px]"
          />
          <CounterText id={noteCountId} length={note.length} max={NOTE_MAX_LENGTH} />
          <HelperText id={noteHelpId}>
            Added to every order automatically. You can still change it at checkout.
          </HelperText>

          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick notes">
            {QUICK_NOTES.map((phrase) => (
              <Chip
                key={phrase}
                selected={hasPhrase(note, phrase)}
                onClick={() => handleQuickNote(phrase)}
              >
                {phrase}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel htmlFor={allergiesId}>Allergies (optional)</FieldLabel>
          <TextArea
            id={allergiesId}
            value={allergies}
            rows={1}
            maxLength={ALLERGIES_MAX_LENGTH}
            placeholder="e.g. Peanuts (groundnut), shellfish"
            aria-describedby={allergiesCountId}
            onChange={(event) => setAllergies(event.target.value)}
            className="field-sizing-content min-h-[86px] lg:min-h-[56px]"
          />
          <CounterText
            id={allergiesCountId}
            length={allergies.length}
            max={ALLERGIES_MAX_LENGTH}
          />
        </div>

        <p
          role="note"
          className="flex items-start gap-2.5 rounded-[12px] bg-[#ffe9c4] px-3.5 py-3 text-[12px] leading-[1.45] text-ink"
        >
          <AlertIcon size={16} className="mt-px" />
          We share this with the kitchen. Our kitchen handles nuts, so we can&apos;t
          promise zero traces.
        </p>

        <ActionBar>
          <button
            type="button"
            onClick={handleCancel}
            className={`${buttonVariants.ghost} hidden lg:inline-flex`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!dirty}
            className={`${buttonVariants.red} w-full disabled:opacity-50 disabled:shadow-none lg:w-auto`}
          >
            Save preferences
          </button>
        </ActionBar>
      </SectionCard>

      <Toast toast={toast} />
    </form>
  );
};

export default FoodPreferencesPage;
