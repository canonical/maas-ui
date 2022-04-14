import { useEffect } from "react";

import {
  Button,
  Card,
  Code,
  Col,
  Notification,
  Row,
  Strip,
} from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useWindowTitle } from "app/base/hooks";
import { actions as statusActions } from "app/store/status";
import statusSelectors from "app/store/status/selectors";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export type LoginValues = {
  password: string;
  username: string;
};

export const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const authenticated = useSelector(statusSelectors.authenticated);
  const authenticating = useSelector(statusSelectors.authenticating);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const externalLoginURL = useSelector(statusSelectors.externalLoginURL);
  const noUsers = useSelector(statusSelectors.noUsers);
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
        <Col size={6} emptyLarge={4}>
          {externalAuthURL && error && (
            <Notification severity="negative" title="Error:">
              {error}
            </Notification>
          )}
          {noUsers && !externalAuthURL ? (
            <Card
              data-testid="no-users-warning"
              title="No admin user has been created yet"
            >
              <p>Use the following command to create one:</p>
              <Code copyable>sudo maas createadmin</Code>
              <Button
                className="u-no-margin--bottom"
                onClick={() => dispatch(statusActions.checkAuthenticated())}
              >
                Retry
              </Button>
            </Card>
          ) : (
            <Card>
              <h1
                className="p-card__title p-heading--3"
                data-testid="section-header-title"
              >
                Login
              </h1>
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
                <Formik
                  initialValues={{
                    password: "",
                    username: "",
                  }}
                  onSubmit={(values) => {
                    dispatch(statusActions.login(values));
                  }}
                  validationSchema={LoginSchema}
                >
                  <FormikFormContent<LoginValues>
                    errors={error}
                    saving={authenticating}
                    saved={authenticated}
                    submitLabel="Login"
                  >
                    <FormikField
                      name="username"
                      label="Username"
                      required={true}
                      takeFocus
                      type="text"
                    />
                    <FormikField
                      name="password"
                      label="Password"
                      required={true}
                      type="password"
                    />
                  </FormikFormContent>
                </Formik>
              )}
            </Card>
          )}
        </Col>
      </Row>
    </Strip>
  );
};

export default Login;
