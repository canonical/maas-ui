import { useEffect } from "react";
import type { ComponentType, ReactNode } from "react";

import { Form, Notification } from "@canonical/react-components";
import type { Props as ButtonProps } from "@canonical/react-components/dist/components/Button/Button";
import type { FormikContextType } from "formik";
import { useFormikContext } from "formik";

import FormikFormButtons from "app/base/components/FormikFormButtons";
import { useFormikErrors, useFormikFormDisabled } from "app/base/hooks";

export type FormErrors =
  | string
  | {
      __all__: string[];
      [x: string]: unknown;
    };

export type ButtonComponentProps = {
  bordered?: boolean;
  cancelDisabled?: boolean;
  helpLabel?: string;
  helpLink?: string;
  loading?: boolean;
  onCancel?: () => void;
  loadingLabel?: string;
  secondarySubmit?: () => void;
  secondarySubmitDisabled?: boolean;
  secondarySubmitLabel?: string;
  secondarySubmitTooltip?: string | null;
  submitAppearance?: ButtonProps["appearance"];
  submitDisabled?: boolean;
  submitLabel?: string;
  success?: boolean;
};

export type Props<V, E = FormErrors> = {
  allowAllEmpty?: boolean;
  allowUnchanged?: boolean;
  buttons?: ComponentType<ButtonComponentProps>;
  buttonsBordered?: boolean;
  buttonsHelpLabel?: string;
  buttonsHelpLink?: string;
  children?: ReactNode;
  editable?: boolean;
  errors?: E;
  initialValues: V;
  inline?: boolean;
  loading?: boolean;
  onCancel?: (formikContext: FormikContextType<V>) => void;
  onValuesChanged?: (values: V) => void;
  resetOnSave?: boolean;
  saved?: boolean;
  saving?: boolean;
  savingLabel?: string;
  secondarySubmit?: () => void;
  secondarySubmitDisabled?: boolean;
  secondarySubmitLabel?: string;
  secondarySubmitTooltip?: string | null;
  submitAppearance?: string;
  submitDisabled?: boolean;
  submitLabel?: string;
};

const FormikFormContent = <V, E = FormErrors>({
  allowAllEmpty,
  allowUnchanged,
  buttons: Buttons = FormikFormButtons,
  buttonsBordered,
  buttonsHelpLabel,
  buttonsHelpLink,
  children,
  editable,
  errors,
  inline,
  initialValues,
  loading,
  onCancel,
  onValuesChanged,
  resetOnSave,
  saving,
  savingLabel,
  saved,
  secondarySubmit,
  secondarySubmitDisabled,
  secondarySubmitLabel,
  secondarySubmitTooltip,
  submitAppearance,
  submitDisabled = false,
  submitLabel = "Save",
}: Props<V, E>): JSX.Element => {
  const formikContext = useFormikContext<V>();
  const { handleSubmit, resetForm, submitForm, values } = formikContext;
  const formDisabled = useFormikFormDisabled<V>({
    allowAllEmpty,
    allowUnchanged,
  });

  useFormikErrors(errors);

  useEffect(() => {
    onValuesChanged && onValuesChanged(values);
  }, [values, onValuesChanged]);

  useEffect(() => {
    if (resetOnSave && saved) {
      resetForm({ values: initialValues });
    }
  }, [initialValues, resetForm, resetOnSave, saved]);

  let nonFieldError: string;
  if (errors) {
    if (typeof errors === "string") {
      nonFieldError = errors;
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
      nonFieldError = otherErrors.join(", ");
    }
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
        <Buttons
          bordered={buttonsBordered}
          cancelDisabled={saving}
          helpLabel={buttonsHelpLabel}
          helpLink={buttonsHelpLink}
          loading={saving}
          onCancel={onCancel ? () => onCancel(formikContext) : undefined}
          loadingLabel={savingLabel}
          secondarySubmit={
            secondarySubmit
              ? () => {
                  secondarySubmit();
                  submitForm();
                }
              : undefined
          }
          secondarySubmitDisabled={secondarySubmitDisabled}
          secondarySubmitLabel={secondarySubmitLabel}
          secondarySubmitTooltip={secondarySubmitTooltip}
          submitAppearance={submitAppearance}
          submitDisabled={loading || saving || formDisabled || submitDisabled}
          submitLabel={submitLabel}
          success={saved}
        />
      )}
    </Form>
  );
};

export default FormikFormContent;
