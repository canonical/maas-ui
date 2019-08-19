import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Form from "app/base/components/Form";
import FormikField from "app/base/components/FormikField";
import Link from "app/base/components/Link";
import Row from "app/base/components/Row";
import selectors from "app/settings/selectors";

const togglePassword = (event, passwordVisible, showPassword) => {
  event.preventDefault();
  showPassword(!passwordVisible);
};

export const UserFormFields = ({ editing, formikProps }) => {
  const [passwordVisible, showPassword] = useState(!editing);
  const saving = useSelector(selectors.users.saving);
  const saved = useSelector(selectors.users.saved);
  const errors = useSelector(selectors.users.errors);

  useEffect(() => {
    if (Object.keys(errors).length) {
      const formikErrors = {};
      const invalidValues = {};
      Object.keys(errors).forEach(field => {
        formikErrors[field] = errors[field].join(" ");
        invalidValues[field] = formikProps.values[field];
      });
      formikProps.setStatus({ serverErrors: formikErrors, invalidValues });
    }
  }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps

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
            label="Full name"
            type="text"
          />
          <FormikField
            formikProps={formikProps}
            fieldKey="email"
            label="Email address"
            required={true}
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
        <ActionButton
          appearance="positive"
          className="u-no-margin--bottom"
          disabled={formikFormDisabled(formikProps)}
          loading={saving}
          success={saved}
          type="submit"
        >
          Save user
        </ActionButton>
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
