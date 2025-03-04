import { useEffect } from "react";

import {
  Button,
  Card,
  Code,
  Col,
  Row,
  Strip,
  Notification,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useWindowTitle } from "@/app/base/hooks";
import { statusActions } from "@/app/store/status";
import statusSelectors from "@/app/store/status/selectors";
import { formatErrors } from "@/app/utils";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export type LoginValues = {
  password: string;
  username: string;
};

export const Labels = {
  APILoginForm: "Login",
  ExternalLoginButton: "Go to login page",
  NoUsers: "No admin user has been created yet",
  Password: "Password",
  Submit: "Login",
  Username: "Username",
} as const;

export enum TestIds {
  NoUsers = "no-users-warning",
  SectionHeaderTitle = "section-header-title",
}

export const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const authenticated = useSelector(statusSelectors.authenticated);
  const authenticating = useSelector(statusSelectors.authenticating);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const externalLoginURL = useSelector(statusSelectors.externalLoginURL);
  const authenticationError = useSelector(statusSelectors.authenticationError);

  const noUsers = useSelector(statusSelectors.noUsers);

  useWindowTitle("Login");

  useEffect(() => {
    if (externalAuthURL) {
      dispatch(statusActions.externalLogin());
    }
  }, [dispatch, externalAuthURL]);

  return (
    <Strip>
      <Row>
        <Col emptyLarge={4} size={6}>
          {authenticationError ? (
            authenticationError === "Session expired" ? (
              <Notification role="alert" severity="information">
                Your session has expired. Plese log in again to continue using
                MAAS.
              </Notification>
            ) : (
              <Notification role="alert" severity="negative" title="Error:">
                {formatErrors(authenticationError, "__all__")}
              </Notification>
            )
          ) : null}
          {noUsers && !externalAuthURL ? (
            <Card title={Labels.NoUsers}>
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
                data-testid={TestIds.SectionHeaderTitle}
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
                >
                  {Labels.ExternalLoginButton}
                </Button>
              ) : (
                <FormikForm<LoginValues>
                  aria-label={Labels.APILoginForm}
                  initialValues={{
                    password: "",
                    username: "",
                  }}
                  onSubmit={(values) => {
                    dispatch(statusActions.login(values));
                  }}
                  saved={authenticated}
                  saving={authenticating}
                  submitLabel={Labels.Submit}
                  validationSchema={LoginSchema}
                >
                  <FormikField
                    label={Labels.Username}
                    name="username"
                    required={true}
                    takeFocus
                    type="text"
                  />
                  <FormikField
                    label={Labels.Password}
                    name="password"
                    required={true}
                    type="password"
                  />
                </FormikForm>
              )}
            </Card>
          )}
        </Col>
      </Row>
    </Strip>
  );
};

export default Login;
