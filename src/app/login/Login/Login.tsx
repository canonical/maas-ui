import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Card,
  Code,
  Col,
  Notification as NotificationBanner,
  Row,
  Strip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import * as Yup from "yup";

import { useAuthenticate, useIsOIDCUser } from "@/app/api/query/auth";
import type { LoginError } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { statusActions } from "@/app/store/status";
import statusSelectors from "@/app/store/status/selectors";
import { formatErrors } from "@/app/utils";

const generateSchema = (requirePassword: boolean) =>
  Yup.object({
    username: Yup.string().required("Username is required"),
    password: requirePassword
      ? Yup.string().required("Password is required")
      : Yup.string(),
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

export const INCORRECT_CREDENTIALS_ERROR_MESSAGE =
  "Please enter a correct username and password. Note that both fields may be case-sensitive.";

export const NOT_FOUND_USER_ERROR_MESSAGE =
  "User not found. Please check the username and try again.";

type LoginStep = "OIDC" | "PASSWORD" | "USERNAME";

export const Login = (): React.ReactElement => {
  const dispatch = useDispatch();
  const authenticated = useSelector(statusSelectors.authenticated);
  const authenticating = useSelector(statusSelectors.authenticating);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const externalLoginURL = useSelector(statusSelectors.externalLoginURL);
  const authenticationError = useSelector(statusSelectors.authenticationError);
  const noUsers = useSelector(statusSelectors.noUsers);

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirectTo");
  const authenticate = useAuthenticate();
  const [oidcURL, setOidcURL] = useState("");
  const [providerName, setProviderName] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState<string | null>(
    null
  );
  const [step, setStep] = useState<LoginStep>("USERNAME");

  const hasEnteredUsername = step !== "USERNAME";
  const requirePassword = step === "PASSWORD";
  const isOIDCUser = step === "OIDC";

  const userInfoQuery = useIsOIDCUser(
    {
      query: {
        email: submittedUsername ?? "",
        redirect_target: redirect ?? "/machines",
      },
    },
    Boolean(submittedUsername)
  );

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

  useEffect(() => {
    if (userInfoQuery.error) {
      setSubmittedUsername(null);
      dispatch(statusActions.loginError(NOT_FOUND_USER_ERROR_MESSAGE));
      return;
    }

    if (!userInfoQuery.data) return;

    const { is_oidc, auth_url, provider_name } = userInfoQuery.data;

    if (is_oidc) {
      setOidcURL(auth_url ?? "");
      setProviderName(provider_name ?? "");
      setStep("OIDC");
    } else {
      setStep("PASSWORD");
    }
  }, [userInfoQuery.data, userInfoQuery.error, dispatch]);

  const handleSubmit = (values: LoginValues) => {
    authenticate.mutate({
      body: {
        username: values.username,
        password: values.password,
      },
    });
  };
  return (
    <PageContent>
      <Strip>
        <Row>
          <Col emptyLarge={4} size={6}>
            {authenticationError ? (
              authenticationError === "Session expired" ? (
                <NotificationBanner role="alert" severity="information">
                  Your session has expired. Plese log in again to continue using
                  MAAS.
                </NotificationBanner>
              ) : (
                <NotificationBanner
                  role="alert"
                  severity="negative"
                  title="Error:"
                >
                  {formatErrors(authenticationError, "__all__")}
                </NotificationBanner>
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
                  <FormikForm<LoginValues, LoginError>
                    aria-label={Labels.APILoginForm}
                    initialValues={{
                      password: "",
                      username: "",
                    }}
                    onSubmit={(values) => {
                      dispatch(statusActions.loginError(""));
                      if (!submittedUsername) {
                        setSubmittedUsername(values.username);
                      } else {
                        if (isOIDCUser) {
                          navigate(oidcURL);
                        } else {
                          handleSubmit(values);
                        }
                      }
                    }}
                    saved={authenticated}
                    saving={authenticating}
                    submitLabel={
                      !submittedUsername
                        ? "Next"
                        : isOIDCUser
                          ? `Login with ${providerName}`
                          : Labels.Submit
                    }
                    validationSchema={generateSchema(
                      hasEnteredUsername && !isOIDCUser
                    )}
                  >
                    {isOIDCUser ? (
                      <p>Please sign in with {providerName} to continue.</p>
                    ) : null}
                    <FormikField
                      aria-hidden={hasEnteredUsername}
                      hidden={hasEnteredUsername}
                      label={hasEnteredUsername ? "" : Labels.Username}
                      name="username"
                      required={true}
                      takeFocus
                      type="text"
                    />
                    {requirePassword && (
                      <FormikField
                        aria-hidden={!requirePassword}
                        hidden={!requirePassword}
                        label={Labels.Password}
                        name="password"
                        required={requirePassword}
                        type="password"
                      />
                    )}
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
