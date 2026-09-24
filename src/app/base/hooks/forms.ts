import { useEffect, isValidElement, useCallback } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useFormikContext } from "formik";

import type { AnyObject, APIError } from "../types";

import type { ValidationErrorBodyResponse } from "@/app/apiclient";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import { simpleObjectEquality } from "@/app/settings/utils";

// NotFoundBodyResponse, BadRequestBodyResponse etc. share this same shape,
// but ValidationErrorBodyResponse is the one relevant to form field errors.
export const hasApiErrorDetails = (
  errors: unknown
): errors is ValidationErrorBodyResponse =>
  typeof errors === "object" &&
  errors !== null &&
  !Array.isArray(errors) &&
  Array.isArray((errors as ValidationErrorBodyResponse).details);

/**
 * Combines formik validation errors and errors returned from server
 * for use in formik forms. Supports both legacy errors (a flat object keyed
 * by field name, from redux) and errors from the newer API hooks (an object
 * with a `details` array of field-specific errors).
 * @param errors - The errors object in redux state, or from an API hook.
 */
export const useFormikErrors = <V = AnyObject, E = null>(
  errors?: APIError<E>
): void => {
  const { setFieldError, setFieldTouched, values } = useFormikContext<V>();
  const previousErrors = usePrevious(errors);

  const setError = useCallback(
    (field: string, errorString: string) => {
      setFieldError(field, errorString);
      setFieldTouched(field, true, false).catch((reason: unknown) => {
        throw new FormikFieldChangeError(
          field,
          "setFieldTouched",
          reason as string
        );
      });
    },
    [setFieldError, setFieldTouched]
  );

  useEffect(() => {
    // Only run this effect if the errors have changed.
    if (
      !errors ||
      typeof errors !== "object" ||
      isValidElement(errors) ||
      simpleObjectEquality(errors, previousErrors)
    ) {
      return;
    }
    if (hasApiErrorDetails(errors)) {
      errors.details?.forEach(({ field, message }) => {
        if (field) {
          setError(field, message);
        }
      });
      return;
    }
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      let errorString: string;
      if (Array.isArray(fieldErrors)) {
        errorString = fieldErrors.join(" ");
      } else {
        errorString = fieldErrors;
      }
      setError(field, errorString);
    });
  }, [
    errors,
    previousErrors,
    setError,
    setFieldError,
    setFieldTouched,
    values,
  ]);
};

/**
 * Returns whether a formik form should be disabled, given the current state
 * of the form.
 * @param allowAllEmpty - Whether all fields are allowed to be empty.
 * @param allowUnchanged - Whether the form is enabled even when unchanged.
 * @returns Form is disabled.
 */
export const useFormikFormDisabled = <V extends object>({
  allowAllEmpty = false,
  allowUnchanged = false,
}: {
  allowAllEmpty?: boolean;
  allowUnchanged?: boolean;
}): boolean => {
  const { initialValues, errors, values } = useFormikContext<V>();
  // As we delete keys from values below, we don't want to
  // mutate the actual form values
  const newValues = { ...values };
  let hasErrors = false;
  if (errors) {
    hasErrors = isValidElement(errors) || Object.keys(errors).length > 0;
  }
  if (allowAllEmpty) {
    // If all fields are allowed to be empty then remove the empty fields from
    // the values to compare.
    Object.keys(newValues).forEach((key) => {
      if (!newValues[key as keyof V]) {
        delete newValues[key as keyof V];
      }
    });
  }
  if (allowUnchanged) {
    return hasErrors;
  }
  let matchesInitial = false;
  // Now that fields have been removed then make sure there are some fields left
  // to compare.
  if (Object.keys(newValues).length) {
    matchesInitial = simpleObjectEquality(initialValues, newValues);
  }
  return matchesInitial || hasErrors;
};
