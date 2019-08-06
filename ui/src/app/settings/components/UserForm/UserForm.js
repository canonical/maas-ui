import { Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import * as Yup from "yup";

import "./UserForm.scss";
import { UserShape } from "app/base/proptypes";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Form from "app/base/components/Form";
import Input from "app/base/components/Input";
import Row from "app/base/components/Row";

const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email address")
    .required(),
  fullName: Yup.string(),
  is_superuser: Yup.boolean(),
  password: Yup.string().required("Password is required"),
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
});

export const UserForm = ({ title, user }) => {
  return (
    <Card highlighted={true} className="user-form">
      <Row>
        <Col size="3">
          <h4>{title}</h4>
        </Col>
        <Col size="9">
          <Formik
            initialValues={{
              isSuperuser: user ? user.is_superuser : false,
              email: user ? user.email : "",
              fullName: user ? `${user.first_name} ${user.last_name}` : "",
              password: "",
              passwordConfirm: "",
              username: user ? user.username : ""
            }}
            validationSchema={UserSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              errors,
              isSubmitting,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              values
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col size="8">
                    <Input
                      error={touched.username && errors.username}
                      help="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
                      id="username"
                      label="Username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required={true}
                      type="text"
                      value={values.username}
                    />
                    <Input
                      error={touched.fullName && errors.fullName}
                      id="fullName"
                      label="Full name (optional)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.fullName}
                    />
                    <Input
                      error={touched.email && errors.email}
                      id="email"
                      label="Email address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                    />
                    <Input
                      error={touched.isSuperuser && errors.isSuperuser}
                      id="isSuperuser"
                      label="MAAS administrator"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="checkbox"
                      value={values.isSuperuser}
                    />
                    <Input
                      error={touched.password && errors.password}
                      id="password"
                      label="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required={true}
                      type="password"
                      value={values.password}
                    />
                    <Input
                      error={touched.passwordConfirm && errors.passwordConfirm}
                      help="Enter the same password as before, for verification"
                      id="passwordConfirm"
                      label="Password (again)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required={true}
                      type="password"
                      value={values.passwordConfirm}
                    />
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
                    disabled={isSubmitting}
                  >
                    Save user
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
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
