import type { APIError } from "@/app/base/types";
import type { EventError } from "@/app/store/types/state";

type FlattenedError = string | null;

const flattenErrors = <E>(errors: E): FlattenedError => {
  if (Array.isArray(errors)) {
    return errors.join(" ");
  }
  return typeof errors === "string" ? errors : null;
};

const parseJSONError = (jsonError: string): FlattenedError => {
  try {
    const parsedError = JSON.parse(jsonError);
    if (typeof parsedError === "object") {
      const errorEntries = Object.entries(parsedError);
      const isAllError =
        errorEntries.length === 1 && errorEntries[0][0] === "__all__";
      return isAllError
        ? flattenErrors(errorEntries[0][1])
        : errorEntries
            .map(([key, value]) => `${key}: ${flattenErrors(value)}`)
            .join(" ");
    }
    return flattenErrors(parsedError);
  } catch {
    return jsonError;
  }
};

const formatObjectError = (
  errors: Record<string, unknown>,
  errorKey?: string
): FlattenedError => {
  if (errorKey && errorKey in errors) {
    return flattenErrors(errors[errorKey]);
  }
  const errorEntries = Object.entries(errors);
  return errorEntries.length > 0
    ? errorEntries
        .map(([key, value]) => `${key}: ${flattenErrors(value)}`)
        .join(" ")
    : null;
};

const parseObjectError = (
  errors: Record<string, unknown>,
  errorKey?: string
): FlattenedError => {
  if (Array.isArray(errors)) {
    return errors.join(" ");
  }
  if (errors instanceof Error) {
    return errors.message;
  }
  if (typeof errors === "object" && errors !== null) {
    return formatObjectError(errors, errorKey);
  }
  return null;
};

type ErrorFormatter = (errors: any, errorKey?: string) => FlattenedError;
const errorTypeFormatters: Record<string, ErrorFormatter> = {
  string: parseJSONError,
  object: parseObjectError,
};

export type ErrorType<E = null, I = any, K extends keyof I = any> =
  | APIError<E>
  | EventError<I, E, K>
  | Error;

/**
 * Formats errors of different types into a single string.
 * @param errors - The errors to format, which can be a string, array, object, or JSON string.
 * @param errorKey - The optional key to extract the error from if the errors are an object.
 * @returns The formatted error message or null if no errors are provided.
 */
export const formatErrors = <E, I, K extends keyof I>(
  errors?: ErrorType<E, I, K>,
  errorKey?: string
): FlattenedError => {
  if (!errors) {
    return null;
  }
  const errorType = typeof errors;
  const formatErrors = errorTypeFormatters[errorType];
  return formatErrors ? formatErrors(errors, errorKey) : null;
};
