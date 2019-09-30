import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { auth as authSelectors } from "app/base/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useFormikErrors } from "app/base/hooks";
import { user as userSelectors } from "app/base/selectors";
import Form from "app/base/components/Form";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import Link from "app/base/components/Link";

const togglePassword = (
  event,
  passwordVisible,
  showPassword,
  onShowPasswordFields
) => {
  event.preventDefault();
  onShowPasswordFields && onShowPasswordFields(!passwordVisible);
  showPassword(!passwordVisible);
};

export const UserFormFields = ({
  buttons: Buttons = FormCardButtons,
  editing,
  formikProps,
  includeCurrentPassword,
  includeUserType = true,
  onShowPasswordFields
}) => {
  const [passwordVisible, showPassword] = useState(!editing);
  const saving = useSelector(userSelectors.saving);
  const saved = useSelector(userSelectors.saved);
  const userErrors = useSelector(userSelectors.errors);
  const authErrors = useSelector(authSelectors.errors);
  let errors = userErrors;
  if (includeCurrentPassword) {
    errors = {
      ...authErrors,
      ...userErrors
    };
  }
  useFormikErrors(errors, formikProps);

  return (
    <Form onSubmit={formikProps.handleSubmit}>
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
        required={true}
        type="email"
      />
      {includeUserType && (
        <FormikField
          formikProps={formikProps}
          fieldKey="isSuperuser"
          label="MAAS administrator"
          type="checkbox"
        />
      )}
      {editing && !passwordVisible && (
        <Link
          onClick={event =>
            togglePassword(
              event,
              passwordVisible,
              showPassword,
              onShowPasswordFields
            )
          }
        >
          Change password&hellip;
        </Link>
      )}
      {passwordVisible && (
        <>
          {includeCurrentPassword && (
            <FormikField
              formikProps={formikProps}
              fieldKey="old_password"
              label="Current password"
              required={true}
              type="password"
            />
          )}
          <FormikField
            formikProps={formikProps}
            fieldKey="password"
            label={includeCurrentPassword ? "New password" : "Password"}
            required={true}
            type="password"
          />
          <FormikField
            formikProps={formikProps}
            fieldKey="passwordConfirm"
            help="Enter the same password as before, for verification"
            label={
              includeCurrentPassword
                ? "New password (again)"
                : "Password (again)"
            }
            required={true}
            type="password"
          />
        </>
      )}
      <Buttons
        actionDisabled={saving || formikFormDisabled(formikProps)}
        actionLabel="Save user"
        actionLoading={saving}
        actionSuccess={saved}
      />
    </Form>
  );
};

UserFormFields.propTypes = {
  buttons: PropTypes.func,
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
  }),
  includeCurrentPassword: PropTypes.bool,
  includeUserType: PropTypes.bool,
  onShowPasswordFields: PropTypes.func
};

export default UserFormFields;
