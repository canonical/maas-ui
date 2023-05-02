import type { APIError } from "app/base/types";
import type { EventError } from "app/store/types/state";

const flattenErrors = <E>(errors: E): string | null => {
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

export type ErrorType<E = null, I = any, K extends keyof I = any> =
  | APIError<E>
  | EventError<I, E, K>;

export const formatErrors = <E, I, K extends keyof I>(
  errors?: ErrorType<E, I, K>,
  errorKey?: string
): string | null => {
  let errorMessage: string | null = null;
  if (errors) {
    if (Array.isArray(errors)) {
      errorMessage = errors.join(" ");
    } else if (typeof errors === "object") {
      if (errorKey && errorKey in errors) {
        errorMessage = flattenErrors(errors[errorKey as keyof typeof errors]);
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
