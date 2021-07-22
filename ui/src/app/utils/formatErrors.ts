import type { APIError } from "app/base/types";

const flattenErrors = (errors: string | string[]): string => {
  if (Array.isArray(errors)) {
    return errors.join(" ");
  }
  return errors;
};

/**
 * Format errors of different types to a single string.
 *
 * @param errors - the errors string/array/object
 * @returns error message
 */
export const formatErrors = (
  errors?: APIError,
  errorKey?: string
): string | null => {
  let errorMessage: string | null = null;
  if (errors) {
    if (Array.isArray(errors)) {
      errorMessage = errors?.join(" ");
    } else if (typeof errors === "object" && errors !== null) {
      if (errorKey) {
        errorMessage = flattenErrors(errors[errorKey]);
      } else {
        errorMessage = Object.entries<string | string[]>(errors)
          .map(([key, value]) => `${key}: ${flattenErrors(value)}`)
          .join(" ");
      }
    } else if (typeof errors === "string") {
      errorMessage = errors;
    }
  }

  return errorMessage;
};
