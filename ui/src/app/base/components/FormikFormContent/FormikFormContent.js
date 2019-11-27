import { Form, Notification } from "@canonical/react-components";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { useFormikErrors, useFormikFormDisabled } from "app/base/hooks";
import FormikFormButtons from "app/base/components/FormikFormButtons";

const FormikFormContent = ({
  allowAllEmpty,
  buttons: Buttons = FormikFormButtons,
  children,
  errors,
  onValuesChanged,
  saving,
  saved,
  submitLabel = "Save"
}) => {
  const { handleSubmit, values } = useFormikContext();
  const formDisabled = useFormikFormDisabled(allowAllEmpty);

  useFormikErrors(errors);

  useEffect(() => {
    onValuesChanged && onValuesChanged(values);
  }, [values, onValuesChanged]);

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
        actionDisabled={saving || formDisabled}
        actionLabel={submitLabel}
        actionLoading={saving}
        actionSuccess={saved}
      />
    </Form>
  );
};

FormikFormContent.propTypes = {
  allowAllEmpty: PropTypes.bool,
  buttons: PropTypes.func,
  children: PropTypes.node.isRequired,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onValuesChanged: PropTypes.func,
  saving: PropTypes.bool,
  saved: PropTypes.bool,
  submitLabel: PropTypes.string
};

export default FormikFormContent;
