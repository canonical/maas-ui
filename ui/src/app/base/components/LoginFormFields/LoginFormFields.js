import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { formikFormDisabled } from "app/settings/utils";
import { useFormikErrors } from "app/base/hooks";
import { status } from "app/base/selectors";
import { ActionButton } from "@canonical/react-components";
import { Form } from "@canonical/react-components";
import FormikField from "app/base/components/FormikField";

export const LoginFormFields = ({ formikProps }) => {
  const authenticated = useSelector(status.authenticated);
  const authenticating = useSelector(status.authenticating);
  const errors = useSelector(status.error);

  useFormikErrors(errors, formikProps);

  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <FormikField
        formikProps={formikProps}
        fieldKey="username"
        label="Username"
        required={true}
        type="text"
      />
      <FormikField
        formikProps={formikProps}
        fieldKey="password"
        label="Password"
        required={true}
        type="password"
      />
      <div className="u-align--right" style={{ marginTop: "1rem" }}>
        <ActionButton
          appearance="positive"
          className="u-no-margin--bottom"
          disabled={authenticating || formikFormDisabled(formikProps)}
          loading={authenticating}
          success={authenticated}
          type="submit"
        >
          Login
        </ActionButton>
      </div>
    </Form>
  );
};

LoginFormFields.propTypes = {
  formikProps: PropTypes.shape({
    errors: PropTypes.shape({
      password: PropTypes.string,
      username: PropTypes.string
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    touched: PropTypes.shape({
      password: PropTypes.bool,
      username: PropTypes.bool
    }).isRequired,
    values: PropTypes.shape({
      password: PropTypes.string,
      username: PropTypes.string
    }).isRequired
  })
};

export default LoginFormFields;
