import PropTypes from "prop-types";
import React, { useState } from "react";

import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Form from "app/base/components/Form";
import FormikField from "app/base/components/FormikField";
import Link from "app/base/components/Link";
import Row from "app/base/components/Row";

const togglePassword = (event, passwordVisible, showPassword) => {
  event.preventDefault();
  showPassword(!passwordVisible);
};

export const UserFormFields = ({ editing, formikProps }) => {
  const [passwordVisible, showPassword] = useState(!editing);
  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <Row>
        <Col size="8">
          <FormikField
            formikProps={formikProps}
            fieldKey="username"
            help="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
            label="Username"
            required={true}
            type="text"
          />
          <FormikField
            formikProps={formikProps}
            fieldKey="fullName"
            label="Full name (optional)"
            type="text"
          />
          <FormikField
            formikProps={formikProps}
            fieldKey="email"
            label="Email address"
            type="email"
          />
          <FormikField
            formikProps={formikProps}
            fieldKey="isSuperuser"
            label="MAAS administrator"
            type="checkbox"
          />
          {editing && !passwordVisible && (
            <Link
              onClick={event =>
                togglePassword(event, passwordVisible, showPassword)
              }
            >
              Change password&hellip;
            </Link>
          )}
          {passwordVisible && (
            <>
              <FormikField
                formikProps={formikProps}
                fieldKey="password"
                label="Password"
                required={true}
                type="password"
              />
              <FormikField
                formikProps={formikProps}
                fieldKey="passwordConfirm"
                help="Enter the same password as before, for verification"
                label="Password (again)"
                required={true}
                type="password"
              />
            </>
          )}
        </Col>
      </Row>
      <div className="user-form__buttons">
        <Button
          appearance="base"
          className="u-no-margin--bottom"
          onClick={() => window.history.back()}
          type="button"
        >
          Cancel
        </Button>
        <Button
          appearance="positive"
          className="u-no-margin--bottom"
          type="submit"
          disabled={formikProps.isSubmitting}
        >
          Save user
        </Button>
      </div>
    </Form>
  );
};

UserFormFields.propTypes = {
  editing: PropTypes.bool,
  formikProps: PropTypes.shape({
    errors: PropTypes.shape({
      isSuperuser: PropTypes.string,
      email: PropTypes.string,
      fullName: PropTypes.string,
      password: PropTypes.string,
      passwordConfirm: PropTypes.string,
      username: PropTypes.string
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    touched: PropTypes.shape({
      isSuperuser: PropTypes.bool,
      email: PropTypes.bool,
      fullName: PropTypes.bool,
      password: PropTypes.bool,
      passwordConfirm: PropTypes.bool,
      username: PropTypes.bool
    }).isRequired,
    values: PropTypes.shape({
      isSuperuser: PropTypes.bool,
      email: PropTypes.string,
      fullName: PropTypes.string,
      password: PropTypes.string,
      passwordConfirm: PropTypes.string,
      username: PropTypes.string
    }).isRequired
  })
};

export default UserFormFields;
