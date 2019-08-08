import { Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import * as Yup from "yup";

import "./UserForm.scss";
import { UserShape } from "app/base/proptypes";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Row from "app/base/components/Row";
import UserFormFields from "app/settings/components/UserFormFields";

const schemaFields = {
  email: Yup.string()
    .email("Must be a valid email address")
    .required(),
  fullName: Yup.string(),
  is_superuser: Yup.boolean(),
  password: Yup.string().min(8),
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
  const editing = !!user;

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
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                const nameParts = values.fullName && values.fullName.split(" ");
                const user = {
                  email: values.email,
                  first_name: (nameParts && nameParts[0]) || null,
                  is_superuser: values.isSuperuser,
                  last_name:
                    (nameParts.length > 1 && nameParts.slice(1).join(" ")) ||
                    null,
                  password: values.password,
                  username: values.username
                };
                // TODO: Implement creating/updating a user once the API
                // supports it.
                console.log("user", user);
                setSubmitting(false);
              }, 400);
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
