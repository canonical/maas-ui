import { Card, Col, Row, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React from "react";

import { status as statusActions } from "app/base/actions";
import { status as statusSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required")
});

export const Login = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(statusSelectors.authenticated);
  const authenticating = useSelector(statusSelectors.authenticating);
  const error = useSelector(statusSelectors.error);

  useWindowTitle("Login");

  return (
    <Strip>
      <Row>
        <Col size="6" emptyLarge="4">
          <Card title="Login">
            <FormikForm
              errors={error}
              initialValues={{
                password: "",
                username: ""
              }}
              onSubmit={values => {
                dispatch(statusActions.login(values));
              }}
              saving={authenticating}
              saved={authenticated}
              submitLabel="Login"
              validationSchema={LoginSchema}
            >
              <FormikField
                name="username"
                label="Username"
                required={true}
                type="text"
              />
              <FormikField
                name="password"
                label="Password"
                required={true}
                type="password"
              />
            </FormikForm>
          </Card>
        </Col>
      </Row>
    </Strip>
  );
};

export default Login;
