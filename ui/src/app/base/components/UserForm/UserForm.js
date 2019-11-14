import { Link } from "@canonical/react-components";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { auth as authSelectors } from "app/base/selectors";
import { user as userSelectors } from "app/base/selectors";
import { UserShape } from "app/base/proptypes";
import FormikForm from "app/base/components/FormikForm";
import FormikField from "app/base/components/FormikField";

const schemaFields = {
  email: Yup.string()
    .email("Must be a valid email address")
    .required("Email is required"),
  fullName: Yup.string(),
  is_superuser: Yup.boolean(),
  password: Yup.string().min(8, "Passwords must be 8 characters or more"),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must be the same"
  ),
  username: Yup.string()
    .max(150, "Username must be 150 characters or less")
    .matches(
      /^[a-zA-Z 0-9@.+-_]*$/,
      "Usernames must contain letters, digits and @/./+/-/_ only"
    )
    .required("Username is required")
};

const UserSchema = Yup.object().shape({
  ...schemaFields,
  password: schemaFields.password.required("Password is required"),
  passwordConfirm: schemaFields.password.required("Password is required")
});

const CurrentPasswordUserSchema = Yup.object().shape({
  ...schemaFields,
  old_password: Yup.string().required("Your current password is required"),
  password: schemaFields.password.required("A new password is required"),
  passwordConfirm: schemaFields.password.required("Confirm your new password")
});

const NoPasswordUserSchema = Yup.object().shape(schemaFields);

export const UserForm = ({
  buttons,
  includeCurrentPassword,
  includeUserType,
  onSave,
  onUpdateFields,
  submitLabel,
  user
}) => {
  const editing = !!user;
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
  let initialValues = {
    isSuperuser: user ? user.is_superuser : false,
    email: user ? user.email : "",
    fullName: user ? `${user.first_name} ${user.last_name}` : "",
    password: "",
    passwordConfirm: "",
    username: user ? user.username : ""
  };
  if (includeCurrentPassword) {
    initialValues.old_password = "";
  }
  let fullSchema = includeCurrentPassword
    ? CurrentPasswordUserSchema
    : UserSchema;
  return (
    <FormikForm
      buttons={buttons}
      errors={errors}
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => {
        const [firstName, ...lastNameParts] = values.fullName.split(" ");
        const params = {
          email: values.email,
          first_name: firstName,
          is_superuser: values.isSuperuser,
          last_name: lastNameParts.join(" "),
          username: values.username
        };
        if (values.password) {
          params.password1 = values.password;
          params.password2 = values.passwordConfirm;
        }
        if (editing) {
          params.id = user.id;
        }
        onSave(params, values, editing);
        resetForm({ values });
      }}
      saving={saving}
      saved={saved}
      submitLabel={submitLabel}
      onValuesChanged={values => {
        onUpdateFields && onUpdateFields(values);
      }}
      validationSchema={
        editing && !passwordVisible ? NoPasswordUserSchema : fullSchema
      }
    >
      <FormikField
        name="username"
        help="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        label="Username"
        required={true}
        type="text"
      />
      <FormikField name="fullName" label="Full name (optional)" type="text" />
      <FormikField
        name="email"
        label="Email address"
        required={true}
        type="email"
      />
      {includeUserType && (
        <FormikField
          name="isSuperuser"
          label="MAAS administrator"
          type="checkbox"
        />
      )}
      {editing && !passwordVisible && (
        <Link
          onClick={event => {
            event.preventDefault();
            showPassword(!passwordVisible);
          }}
        >
          Change password&hellip;
        </Link>
      )}
      {passwordVisible && (
        <>
          {includeCurrentPassword && (
            <FormikField
              name="old_password"
              label="Current password"
              required={true}
              type="password"
            />
          )}
          <FormikField
            name="password"
            label={includeCurrentPassword ? "New password" : "Password"}
            required={true}
            type="password"
          />
          <FormikField
            name="passwordConfirm"
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
    </FormikForm>
  );
};

UserForm.propTypes = {
  buttons: PropTypes.func,
  includeCurrentPassword: PropTypes.bool,
  includeUserType: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onUpdateFields: PropTypes.func,
  submitLabel: PropTypes.string,
  user: UserShape
};

export default UserForm;
