// Profile photo helpers: validate the file, then shrink it to a small square
// so it can be kept in localStorage with the rest of the account.

export const PHOTO_MAX_BYTES = 5 * 1024 * 1024; // "JPG or PNG, up to 5 MB"
export const PHOTO_TYPES = ["image/jpeg", "image/png"];
const PHOTO_SIZE = 256; // px, square. Plenty for a 72-96px avatar at 2x.

export const PHOTO_ERRORS = {
  type: "Use a JPG or PNG photo.",
  size: "That photo is over 5 MB.",
  upload: "Photo didn't upload. Check your connection.",
};

/** @returns {string} an error message, or "" when the file is fine. */
export const getPhotoError = (file) => {
  if (!file || !PHOTO_TYPES.includes(file.type)) return PHOTO_ERRORS.type;
  if (file.size > PHOTO_MAX_BYTES) return PHOTO_ERRORS.size;
  return "";
};

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    image.src = url;
  });

/**
 * Centre-crops the photo to a square and returns it as a JPEG data URL.
 * Rejects if the browser cannot read the image.
 */
export const photoToDataUrl = async (file) => {
  const image = await loadImage(file);
  const side = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - side) / 2;
  const sy = (image.naturalHeight - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;
  canvas.getContext("2d").drawImage(
    image,
    sx,
    sy,
    side,
    side,
    0,
    0,
    PHOTO_SIZE,
    PHOTO_SIZE,
  );
  return canvas.toDataURL("image/jpeg", 0.85);
};
