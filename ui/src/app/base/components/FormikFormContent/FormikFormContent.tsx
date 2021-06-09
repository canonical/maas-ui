import { useEffect } from "react";
import type { ReactNode } from "react";

import { Form, Notification } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router";

import type { FormikFormButtonsProps } from "app/base/components/FormikFormButtons";
import FormikFormButtons from "app/base/components/FormikFormButtons";
import {
  useFormikErrors,
  useFormikFormDisabled,
  useSendAnalyticsWhen,
} from "app/base/hooks";

export type FormErrors =
  | string
  | {
      __all__?: string[];
      [x: string]: unknown;
    };

export type Props<V> = {
  allowAllEmpty?: boolean;
  allowUnchanged?: boolean;
  children?: ReactNode;
  cleanup?: () => void;
  editable?: boolean;
  errors?: FormErrors;
  inline?: boolean;
  loading?: boolean;
  onSaveAnalytics?: {
    action?: string;
    category?: string;
    label?: string;
  };
  onValuesChanged?: (values: V) => void;
  resetOnSave?: boolean;
  saved?: boolean;
  savedRedirect?: string;
  saving?: boolean;
  secondarySubmit?: () => void;
  submitDisabled?: boolean;
} & FormikFormButtonsProps<V>;

const generateNonFieldError = <V,>(values: V, errors?: FormErrors) => {
  if (errors) {
    if (typeof errors === "string") {
      return errors;
    } else if (typeof errors === "object") {
      let otherErrors: string[] = [];
      // Display any errors for keys that don't match form fields.
      Object.entries(errors).forEach(([key, value]) => {
        if (!(key in values)) {
          if (typeof value === "string") {
            otherErrors.push(value);
          }
          if (Array.isArray(value)) {
            otherErrors = otherErrors.concat(value);
          }
        }
      });
      return otherErrors.join(", ");
    }
  }
  return null;
};

const FormikFormContent = <V,>({
  allowAllEmpty,
  allowUnchanged,
  children,
  cleanup,
  editable = true,
  errors,
  inline,
  loading,
  onSaveAnalytics = {},
  onValuesChanged,
  resetOnSave,
  saved,
  savedRedirect,
  saving,
  secondarySubmit,
  submitDisabled,
  ...buttonsProps
}: Props<V>): JSX.Element => {
  const dispatch = useDispatch();
  const { handleSubmit, initialValues, resetForm, submitForm, values } =
    useFormikContext<V>();
  const formDisabled = useFormikFormDisabled<V>({
    allowAllEmpty,
    allowUnchanged,
  });

  // Run onValuesChanged function whenever formik values change.
  useEffect(() => {
    onValuesChanged && onValuesChanged(values);
  }, [values, onValuesChanged]);

  // Reset the form to initialValues once saved. This is used to explicitly
  // disable a form that has just been saved.
  useEffect(() => {
    if (resetOnSave && saved) {
      resetForm({ values: initialValues });
    }
  }, [initialValues, resetForm, resetOnSave, saved]);

  // Send an analytics event when form is saved.
  useSendAnalyticsWhen(
    saved,
    onSaveAnalytics.category,
    onSaveAnalytics.action,
    onSaveAnalytics.label
  );

  // We use both formik validation errors (i.e. those associated with a given
  // form field) and errors returned from the server.
  useFormikErrors(errors);
  const nonFieldError = generateNonFieldError<V>(values, errors);

  // Run cleanup function on component unmount.
  useEffect(() => {
    return () => {
      cleanup && dispatch(cleanup());
    };
  }, [cleanup, dispatch]);

  if (savedRedirect && saved) {
    return <Redirect to={savedRedirect} />;
  }

  return (
    <Form inline={inline} onSubmit={handleSubmit}>
      {!!nonFieldError && (
        <Notification type="negative" status="Error:">
          {nonFieldError}
        </Notification>
      )}
      {children}
      {editable && (
        <FormikFormButtons
          {...buttonsProps}
          cancelDisabled={saving}
          inline={inline}
          saved={saved}
          saving={saving}
          secondarySubmit={
            secondarySubmit
              ? () => {
                  secondarySubmit();
                  submitForm();
                }
              : undefined
          }
          submitDisabled={loading || saving || formDisabled || submitDisabled}
        />
      )}
    </Form>
  );
};

export default FormikFormContent;
