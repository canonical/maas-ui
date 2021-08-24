const flattenErrors = (errors: unknown): string | null => {
  if (Array.isArray(errors)) {
    return errors.join(" ");
  }
  if (typeof errors === "string") {
    return errors;
  }
  return null;
};

/**
 * Format errors of different types to a single string.
 *
 * @param errors - the errors string/array/object
 * @returns error message
 */
export const formatErrors = <E>(
  errors?: E,
  errorKey?: keyof E
): string | null => {
  let errorMessage: string | null = null;
  if (errors) {
    if (Array.isArray(errors)) {
      errorMessage = errors.join(" ");
    } else if (typeof errors === "object") {
      if (errorKey && errorKey in errors) {
        errorMessage = flattenErrors(errors[errorKey]);
      } else {
        errorMessage = Object.entries(errors)
          .map(([key, value]) => `${key}: ${flattenErrors(value)}`)
          .join(" ");
      }
    } else if (typeof errors === "string") {
      errorMessage = errors;
    }
  }

  return errorMessage;
};
