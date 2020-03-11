import { Form, Notification } from "@canonical/react-components";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { useFormikErrors, useFormikFormDisabled } from "app/base/hooks";
import FormikFormButtons from "app/base/components/FormikFormButtons";

const FormikFormContent = ({
  allowAllEmpty,
  buttons: Buttons = FormikFormButtons,
  buttonsBordered,
  children,
  errors,
  initialValues,
  onCancel,
  onValuesChanged,
  resetOnSave,
  saving,
  saved,
  secondarySubmit,
  secondarySubmitLabel,
  submitAppearance,
  submitLabel = "Save"
}) => {
  const { handleSubmit, resetForm, submitForm, values } = useFormikContext();
  const formDisabled = useFormikFormDisabled(allowAllEmpty);

  useFormikErrors(errors);

  useEffect(() => {
    onValuesChanged && onValuesChanged(values);
  }, [values, onValuesChanged]);

  useEffect(() => {
    if (resetOnSave && saved) {
      resetForm({ values: initialValues });
    }
  }, [initialValues, resetForm, resetOnSave, saved]);

  let nonFieldError;
  if (errors) {
    if (typeof errors === "string") {
      nonFieldError = errors;
    } else if (errors["__all__"]) {
      nonFieldError = errors["__all__"].join(" ");
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {nonFieldError && (
        <Notification type="negative" status="Error:">
          {nonFieldError}
        </Notification>
      )}
      <div>{children}</div>
      <Buttons
        bordered={buttonsBordered}
        loading={saving}
        onCancel={onCancel}
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
        submitDisabled={saving || formDisabled}
        submitLabel={submitLabel}
        success={saved}
      />
    </Form>
  );
};

FormikFormContent.propTypes = {
  allowAllEmpty: PropTypes.bool,
  buttons: PropTypes.func,
  buttonsBordered: PropTypes.bool,
  children: PropTypes.node,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onCancel: PropTypes.func,
  onValuesChanged: PropTypes.func,
  saving: PropTypes.bool,
  saved: PropTypes.bool,
  secondarySubmit: PropTypes.func,
  secondarySubmitLabel: PropTypes.string,
  submitAppearance: PropTypes.string,
  submitLabel: PropTypes.string
};

export default FormikFormContent;
