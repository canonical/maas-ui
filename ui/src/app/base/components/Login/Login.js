import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React from "react";

import { status as statusActions } from "app/base/actions";
import { status as statusSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import Card from "app/base/components/Card";
import Col from "app/base/components/Col";
import LoginFormFields from "../LoginFormFields";
import Notification from "app/base/components/Notification";
import Row from "app/base/components/Row";
import Strip from "app/base/components/Strip";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required")
});

export const Login = () => {
  const dispatch = useDispatch();
  const error = useSelector(statusSelectors.error);

  useWindowTitle("Login");

  return (
    <Strip>
      <Row>
        <Col size="6" emptyLarge="4">
          {error && error.__all__ && (
            <Notification type="negative" status="Error:">
              {error.__all__.join(" ")}
            </Notification>
          )}
          <Card title="Login">
            <Formik
              initialValues={{
                password: "",
                username: ""
              }}
              validationSchema={LoginSchema}
              onSubmit={values => {
                dispatch(statusActions.login(values));
              }}
              render={formikProps => (
                <LoginFormFields formikProps={formikProps} />
              )}
            ></Formik>
          </Card>
        </Col>
      </Row>
    </Strip>
  );
};

export default Login;
