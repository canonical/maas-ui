/**
 * Format errors of different types to a single string.
 *
 * @param {string|string[]|object} errors - the errors string/array/object
 * @returns {string} error message
 */

export const formatErrors = (errors) => {
  let errorMessage;

  if (errors) {
    if (Array.isArray(errors)) {
      errorMessage = errors.join(" ");
    } else if (typeof errors === "object") {
      errorMessage = Object.entries(errors)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" ");
    } else {
      errorMessage = errors;
    }
  }

  return errorMessage;
};
