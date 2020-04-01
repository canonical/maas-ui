import {
  Button,
  Card,
  Col,
  Notification,
  Row,
  Strip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React, { useEffect } from "react";

import { status as statusActions } from "app/base/actions";
import { status as statusSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export const Login = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(statusSelectors.authenticated);
  const authenticating = useSelector(statusSelectors.authenticating);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const externalLoginURL = useSelector(statusSelectors.externalLoginURL);
  const error = useSelector(statusSelectors.authenticationError);

  useWindowTitle("Login");

  useEffect(() => {
    if (externalAuthURL) {
      dispatch(statusActions.externalLogin());
    }
  }, [dispatch, externalAuthURL]);

  return (
    <Strip>
      <Row>
        <Col size="6" emptyLarge="4">
          {externalAuthURL && error && (
            <Notification type="negative" status="Error:">
              {error}
            </Notification>
          )}
          <Card title="Login">
            {externalAuthURL ? (
              <Button
                appearance="positive"
                className="login__external"
                element="a"
                href={externalLoginURL}
                rel="noopener noreferrer"
                target="_blank"
                title={`Login through ${externalAuthURL}`}
              >
                Go to login page
              </Button>
            ) : (
              <FormikForm
                errors={error}
                initialValues={{
                  password: "",
                  username: "",
                }}
                onSubmit={(values) => {
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
            )}
          </Card>
        </Col>
      </Row>
    </Strip>
  );
};

export default Login;
