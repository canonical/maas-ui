import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { user as userActions } from "app/base/actions";
import { user as userSelectors } from "app/base/selectors";
import { useAddMessage } from "app/base/hooks";
import { UserShape } from "app/base/proptypes";
import FormCard from "app/base/components/FormCard";
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
  password: schemaFields.password.required("Password is required")
});

const UserEditSchema = Yup.object().shape(schemaFields);

export const UserForm = ({ user }) => {
  const dispatch = useDispatch();
  const saved = useSelector(userSelectors.saved);
  const [savingUser, setSaving] = useState();
  const [name, setName] = useState();
  const editing = !!user;
  useAddMessage(
    saved,
    userActions.cleanup,
    `${savingUser} ${editing ? "updated" : "added"} successfully.`,
    setSaving
  );
  const title = editing ? <>Editing `{name}`</> : "Add user";

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(userActions.cleanup());
    };
  }, [dispatch]);

  if (saved) {
    // The user was successfully created/updated so redirect to the user list.
    return <Redirect to="/settings/users" />;
  }

  return (
    <FormCard title={title}>
      <Formik
        initialValues={{
          isSuperuser: user ? user.is_superuser : false,
          email: user ? user.email : "",
          fullName: user ? `${user.first_name} ${user.last_name}` : "",
          password: "",
          passwordConfirm: "",
          username: user ? user.username : ""
        }}
        validationSchema={editing ? UserEditSchema : UserSchema}
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
            dispatch(userActions.update(params));
          } else {
            dispatch(userActions.create(params));
          }
          setSaving(values.username);
        }}
        render={formikProps => {
          setName(formikProps.values.username);
          return <UserFormFields editing={editing} formikProps={formikProps} />;
        }}
      ></Formik>
    </FormCard>
  );
};

UserForm.propTypes = {
  user: UserShape
};

export default UserForm;
