import { useEffect } from "react";
import type { ComponentType, ReactNode } from "react";

import { Form, Notification } from "@canonical/react-components";
import type { Props as ButtonProps } from "@canonical/react-components/dist/components/Button/Button";
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
  secondarySubmitLabel?: string;
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
  onCancel?: () => void;
  onValuesChanged?: (values: V) => void;
  resetOnSave?: boolean;
  saved?: boolean;
  saving?: boolean;
  savingLabel?: string;
  secondarySubmit?: () => void;
  secondarySubmitLabel?: string;
  submitAppearance?: string;
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
  secondarySubmitLabel,
  submitAppearance,
  submitLabel = "Save",
}: Props<V, E>): JSX.Element => {
  const { handleSubmit, resetForm, submitForm, values } = useFormikContext<V>();
  const formDisabled = useFormikFormDisabled({ allowAllEmpty, allowUnchanged });

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
    } else if ("__all__" in errors) {
      nonFieldError = errors["__all__"].join(" ");
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
          onCancel={onCancel}
          loadingLabel={savingLabel}
          secondarySubmit={
            secondarySubmit
              ? () => {
                  secondarySubmit();
                  submitForm();
                }
              : undefined
          }
          secondarySubmitLabel={secondarySubmitLabel}
          submitAppearance={submitAppearance}
          submitDisabled={loading || saving || formDisabled}
          submitLabel={submitLabel}
          success={saved}
        />
      )}
    </Form>
  );
};

export default FormikFormContent;
