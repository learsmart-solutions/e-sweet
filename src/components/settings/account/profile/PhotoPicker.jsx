import React, { useRef, useState } from "react";
import SettingsOverlay from "../../kit/SettingsOverlay";
import { buttonVariants } from "../../settingsStyles";
import { CameraIcon, ImageIcon, TrashIcon, UploadIcon } from "../../kit/icons";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import {
  PHOTO_ERRORS,
  getPhotoError,
  photoToDataUrl,
} from "../../../../lib/photo";

const ACCEPT = "image/png,image/jpeg";

/**
 * "Profile photo" chooser.
 *
 * Phone (bottom sheet): Take a photo / Choose from gallery / Remove photo.
 * Picking a file saves it straight away.
 *
 * Desktop (dialog): a drop zone. Choosing or dropping a file shows a preview
 * and "Save photo" confirms it.
 *
 * Props
 *  - hasPhoto: whether a photo is set (controls the Remove option).
 *  - onSave(dataUrl): a photo was chosen and processed.
 *  - onRemove(): go back to the initial.
 *  - onFail(message): the file could not be used (phone only; on desktop the
 *    message is shown inside the dialog so the person can try another file).
 *  - onClose(): dismissed without a change.
 */
const PhotoPicker = ({ hasPhoto, onSave, onRemove, onFail, onClose }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const problem = getPhotoError(file);
    let dataUrl = null;
    let failure = problem;
    if (!problem) {
      try {
        dataUrl = await photoToDataUrl(file);
      } catch {
        failure = PHOTO_ERRORS.upload;
      }
    }

    if (failure) {
      if (isDesktop) setError(failure);
      else onFail(failure);
      return;
    }
    setError("");
    if (isDesktop) setPreview(dataUrl);
    else onSave(dataUrl);
  };

  const onInputChange = (event) => {
    handleFile(event.target.files?.[0]);
    // Allow picking the same file again after an error.
    event.target.value = "";
  };

  const hiddenInputs = (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept={ACCEPT}
        capture="user"
        onChange={onInputChange}
        className="hidden"
        tabIndex={-1}
      />
      <input
        ref={galleryRef}
        type="file"
        accept={ACCEPT}
        onChange={onInputChange}
        className="hidden"
        tabIndex={-1}
      />
    </>
  );

  if (isDesktop) {
    return (
      <SettingsOverlay
        open
        onClose={onClose}
        title="Profile photo"
        phoneVariant="sheet"
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className={buttonVariants.ghost}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(preview)}
              disabled={!preview}
              className={`${buttonVariants.red} disabled:opacity-50`}
            >
              Save photo
            </button>
          </div>
        }
      >
        {hiddenInputs}
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFile(event.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center gap-1.5 rounded-[16px] border-[1.5px] border-dashed px-4 py-7 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato ${
            dragging ? "border-tomato bg-tomato/5" : "border-sand bg-cream"
          }`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Your new profile photo"
              width="96"
              height="96"
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <UploadIcon size={22} className="text-ink" />
          )}
          <span className="text-[14px] font-bold text-ink">
            {preview ? "Choose a different photo" : "Drag a photo here or click to choose"}
          </span>
          <span className="text-[12px] text-muted">
            JPG or PNG, up to 5 MB. Square photos look best.
          </span>
        </button>

        {error && (
          <p role="alert" className="mt-2 text-[12px] font-semibold text-tomato">
            {error}
          </p>
        )}

        {(hasPhoto || preview) && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-tomato hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
          >
            <TrashIcon size={15} />
            Remove photo · show my initial instead
          </button>
        )}
      </SettingsOverlay>
    );
  }

  const optionClass =
    "flex w-full items-center gap-3 border-t border-sand px-1 py-3.5 text-left text-[15px] font-bold first:border-t-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tomato";
  const iconClass =
    "grid size-9 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato";

  return (
    <SettingsOverlay
      open
      onClose={onClose}
      title="Profile photo"
      phoneVariant="sheet"
      footer={
        <button type="button" onClick={onClose} className={`${buttonVariants.ghost} w-full`}>
          Cancel
        </button>
      }
    >
      {hiddenInputs}
      <p className="pb-2 text-[13px] text-muted">
        JPG or PNG, up to 5 MB. Square photos look best.
      </p>
      <button type="button" onClick={() => cameraRef.current?.click()} className={`${optionClass} text-ink`}>
        <span className={iconClass}>
          <CameraIcon size={18} />
        </span>
        Take a photo
      </button>
      <button type="button" onClick={() => galleryRef.current?.click()} className={`${optionClass} text-ink`}>
        <span className={iconClass}>
          <ImageIcon size={18} />
        </span>
        Choose from gallery
      </button>
      {hasPhoto && (
        <button type="button" onClick={onRemove} className={`${optionClass} text-tomato`}>
          <span className={iconClass}>
            <TrashIcon size={18} />
          </span>
          <span className="flex flex-col">
            Remove photo
            <span className="text-[12px] font-normal text-muted">
              Show my initial instead
            </span>
          </span>
        </button>
      )}
    </SettingsOverlay>
  );
};

export default PhotoPicker;
