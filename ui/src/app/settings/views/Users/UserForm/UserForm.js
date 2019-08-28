import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import "./UserForm.scss";
import actions from "app/settings/actions";
import { messages } from "app/base/actions";
import { UserShape } from "app/base/proptypes";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Row from "app/base/components/Row";
import UserFormFields from "../UserFormFields";
import selectors from "app/settings/selectors";

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

export const UserForm = ({ title, user }) => {
  const dispatch = useDispatch();
  const saved = useSelector(selectors.users.saved);
  const [savingUser, setSaving] = useState();
  const editing = !!user;

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(actions.users.cleanup());
    };
  }, [dispatch]);

  useEffect(() => {
    if (saved) {
      const action = editing ? "updated" : "added";
      dispatch(actions.users.cleanup());
      dispatch(
        messages.add(`${savingUser} ${action} successfully.`, "information")
      );
      setSaving();
    }
  }, [dispatch, editing, saved, savingUser]);

  if (saved) {
    // The user was successfully created/updated so redirect to the user list.
    return <Redirect to="/users" />;
  }

  return (
    <Card highlighted={true} className="user-form">
      <Row>
        <Col size="3">
          <h4>{title}</h4>
        </Col>
        <Col size="7">
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
                dispatch(actions.users.update(params));
              } else {
                dispatch(actions.users.create(params));
              }
              setSaving(values.username);
            }}
            render={formikProps => (
              <UserFormFields editing={editing} formikProps={formikProps} />
            )}
          ></Formik>
        </Col>
      </Row>
    </Card>
  );
};

UserForm.propTypes = {
  title: PropTypes.string.isRequired,
  user: UserShape
};

export default UserForm;
