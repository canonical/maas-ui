import { Formik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { UserShape } from "app/base/proptypes";
import UserFormFields from "../UserFormFields";

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
  user
}) => {
  const editing = !!user;
  const [passwordVisible, showPassword] = useState(!editing);
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
    <Formik
      initialValues={initialValues}
      validationSchema={
        editing && !passwordVisible ? NoPasswordUserSchema : fullSchema
      }
      onSubmit={values => {
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
      }}
      render={formikProps => {
        onUpdateFields && onUpdateFields(formikProps);
        return (
          <UserFormFields
            buttons={buttons}
            editing={editing}
            formikProps={formikProps}
            includeCurrentPassword={includeCurrentPassword}
            includeUserType={includeUserType}
            onShowPasswordFields={showPassword}
          />
        );
      }}
    ></Formik>
  );
};

UserForm.propTypes = {
  buttons: PropTypes.func,
  includeCurrentPassword: PropTypes.bool,
  includeUserType: PropTypes.bool,
  user: UserShape,
  onSave: PropTypes.func.isRequired,
  onUpdateFields: PropTypes.func
};

export default UserForm;
