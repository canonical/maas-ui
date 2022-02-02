import { useEffect, useRef } from "react";
import type { ReactNode, AriaAttributes } from "react";

import { Form, Notification } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router";

import type { FormikFormButtonsProps } from "app/base/components/FormikFormButtons";
import FormikFormButtons from "app/base/components/FormikFormButtons";
import {
  useCycled,
  useFormikErrors,
  useFormikFormDisabled,
  useSendAnalyticsWhen,
} from "app/base/hooks";
import type { APIError } from "app/base/types";

export type Props<V, E> = {
  allowAllEmpty?: boolean;
  allowUnchanged?: boolean;
  children?: ReactNode;
  className?: string;
  cleanup?: () => void;
  editable?: boolean;
  errors?: APIError<E>;
  inline?: boolean;
  loading?: boolean;
  onSaveAnalytics?: {
    action?: string;
    category?: string;
    label?: string;
  };
  onSuccess?: (values: V) => void;
  onValuesChanged?: (values: V) => void;
  resetOnSave?: boolean;
  saved?: boolean;
  savedRedirect?: string | null;
  saving?: boolean;
  submitDisabled?: boolean;
} & Pick<AriaAttributes, "aria-label"> &
  FormikFormButtonsProps<V>;

const generateNonFieldError = <V, E = null>(
  values: V,
  errors?: APIError<E>
) => {
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

const FormikFormContent = <V, E = null>({
  allowAllEmpty,
  allowUnchanged,
  cancelDisabled,
  children,
  className,
  cleanup,
  editable = true,
  errors,
  inline,
  loading,
  onSaveAnalytics = {},
  onSuccess,
  onValuesChanged,
  resetOnSave,
  saved = false,
  savedRedirect,
  saving,
  submitDisabled,
  "aria-label": ariaLabel,
  ...buttonsProps
}: Props<V, E>): JSX.Element => {
  const formikContext = useFormikContext<V>();
  if (process.env.NODE_ENV === "development") {
    withFormikDevtools(formikContext);
  }
  const dispatch = useDispatch();
  const onSuccessCalled = useRef(false);
  const { handleSubmit, initialValues, resetForm, values } = formikContext;
  const formDisabled = useFormikFormDisabled<V>({
    allowAllEmpty,
    allowUnchanged,
  });
  const [hasSaved, resetHasSaved] = useCycled(saved);
  const hasErrors = !!errors;

  // Run onValuesChanged function whenever formik values change.
  useEffect(() => {
    onValuesChanged && onValuesChanged(values);
  }, [values, onValuesChanged]);

  // Reset the form to initialValues once saved. This is used to explicitly
  // disable a form that has just been saved.
  useEffect(() => {
    if (resetOnSave && hasSaved) {
      resetForm({ values: initialValues });
      // Reset the hasSaved state so that it can start checking for whether it
      // has cycled again.
      resetHasSaved();
      // Reset the onSuccess called flag so that it will get called again the
      // next time the form is saved.
      onSuccessCalled.current = false;
    }
  }, [initialValues, resetForm, resetHasSaved, resetOnSave, hasSaved]);

  useEffect(() => {
    if (!hasErrors && hasSaved && !onSuccessCalled.current) {
      onSuccess && onSuccess(values);
      // Set the onSuccess has having been called so that it doesn't get called
      // more than once. A ref is used as we don't need to respond to the
      // changes of this state.
      onSuccessCalled.current = true;
    }
  }, [onSuccess, hasErrors, hasSaved, values]);

  // Send an analytics event when form is saved.
  useSendAnalyticsWhen(
    saved,
    onSaveAnalytics.category,
    onSaveAnalytics.action,
    onSaveAnalytics.label
  );

  // We use both formik validation errors (i.e. those associated with a given
  // form field) and errors returned from the server.
  useFormikErrors<V, E>(errors);
  const nonFieldError = generateNonFieldError<V, E>(values, errors);

  // Run cleanup function on component unmount.
  useEffect(() => {
    return () => {
      cleanup && dispatch(cleanup());
    };
  }, [cleanup, dispatch]);

  if (savedRedirect && hasSaved) {
    return <Redirect to={savedRedirect} />;
  }

  return (
    <Form
      className={className}
      inline={inline}
      onSubmit={handleSubmit}
      aria-label={ariaLabel}
    >
      {!!nonFieldError && (
        <Notification severity="negative" title="Error:">
          {nonFieldError}
        </Notification>
      )}
      {typeof children === "function"
        ? children({ ...formikContext })
        : children}
      {editable && (
        <FormikFormButtons
          {...buttonsProps}
          cancelDisabled={cancelDisabled === false ? false : saving}
          inline={inline}
          saved={saved}
          saving={saving}
          submitDisabled={loading || saving || formDisabled || submitDisabled}
        />
      )}
    </Form>
  );
};

export default FormikFormContent;
