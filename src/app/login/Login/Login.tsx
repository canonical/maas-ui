import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Card,
  Code,
  Col,
  Notification,
  Row,
  Strip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { statusActions } from "@/app/store/status";
import statusSelectors from "@/app/store/status/selectors";
import { formatErrors } from "@/app/utils";

const LoginSchema = Yup.object().shape({
  username: Yup.string(),
  password: Yup.string(),
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

export const Login = (): React.ReactElement => {
  const dispatch = useDispatch();
  const authenticated = useSelector(statusSelectors.authenticated);
  const authenticating = useSelector(statusSelectors.authenticating);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const externalLoginURL = useSelector(statusSelectors.externalLoginURL);
  const authenticationError = useSelector(statusSelectors.authenticationError);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirectTo");

  // TODO: replace this state with a mutation to check if user is local or OIDC https://warthogs.atlassian.net/browse/MAASENG-5637
  const [hasEnteredUsername, setHasEnteredUsername] = useState(false);

  const noUsers = useSelector(statusSelectors.noUsers);

  const navigate = useNavigate();

  const handleRedirect = useCallback(() => {
    // send user back to the page they tried to visit
    // { replace: true } avoids going back to login page once authenticated
    navigate(redirect ?? urls.machines.index, {
      replace: true,
    });
  }, [navigate, redirect]);

  useEffect(() => {
    if (authenticated) {
      handleRedirect();
    }
  }, [authenticated, handleRedirect]);

  useWindowTitle("Login");

  useEffect(() => {
    if (externalAuthURL) {
      dispatch(statusActions.externalLogin());
    }
  }, [dispatch, externalAuthURL]);

  return (
    <PageContent sidePanelContent={undefined} sidePanelTitle={null}>
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
                      if (!hasEnteredUsername) {
                        setHasEnteredUsername(true);
                      } else {
                        dispatch(statusActions.login(values));
                      }
                    }}
                    saved={authenticated}
                    saving={authenticating}
                    submitLabel={hasEnteredUsername ? Labels.Submit : "Next"}
                    validationSchema={LoginSchema}
                  >
                    <FormikField
                      aria-hidden={hasEnteredUsername}
                      hidden={hasEnteredUsername}
                      label={hasEnteredUsername ? "" : Labels.Username}
                      name="username"
                      required={true}
                      takeFocus
                      type="text"
                    />
                    <FormikField
                      aria-hidden={!hasEnteredUsername}
                      hidden={!hasEnteredUsername}
                      label={!hasEnteredUsername ? "" : Labels.Password}
                      name="password"
                      required={hasEnteredUsername}
                      type="password"
                    />
                  </FormikForm>
                )}
              </Card>
            )}
          </Col>
        </Row>
      </Strip>
    </PageContent>
  );
};

export default Login;
