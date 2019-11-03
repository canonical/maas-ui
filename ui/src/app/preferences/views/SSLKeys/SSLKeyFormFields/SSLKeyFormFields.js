import {
  Col,
  Form,
  Notification,
  Row,
  Textarea
} from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import "./SSLKeyFormFields.scss";
import { sslkey as sslkeySelectors } from "app/preferences/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useFormikErrors } from "app/base/hooks";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";

export const SSLKeyFormFields = ({ editing, formikProps }) => {
  const saving = useSelector(sslkeySelectors.saving);
  const saved = useSelector(sslkeySelectors.saved);
  const errors = useSelector(sslkeySelectors.errors);
  useFormikErrors(errors, formikProps);
  const hasError = errors && typeof errors === "string";

  return (
    <>
      {hasError && (
        <Notification type="negative" status="Error:">
          {errors}
        </Notification>
      )}
      <Form onSubmit={formikProps.handleSubmit}>
        <Row>
          <Col size="5">
            <FormikField
              className="ssl-key-form-fields__key"
              component={Textarea}
              formikProps={formikProps}
              fieldKey="key"
              label="SSL key"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </Col>
          <Col size="3">
            <p className="p-form-help-text" style={{ marginTop: "0.5rem" }}>
              You will be able to access Windows winrm service with a registered
              key.
            </p>
          </Col>
        </Row>
        <FormCardButtons
          actionDisabled={saving || formikFormDisabled(formikProps)}
          actionLabel="Save SSL key"
          actionLoading={saving}
          actionSuccess={saved}
        />
      </Form>
    </>
  );
};

SSLKeyFormFields.propTypes = {
  editing: PropTypes.bool,
  formikProps: PropTypes.shape({
    errors: PropTypes.shape({
      key: PropTypes.string
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    touched: PropTypes.shape({
      key: PropTypes.bool
    }).isRequired,
    values: PropTypes.shape({
      key: PropTypes.string
    }).isRequired
  })
};

export default SSLKeyFormFields;
