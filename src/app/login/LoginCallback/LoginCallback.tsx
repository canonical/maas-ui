import { useEffect, useRef } from "react";

import {
  Col,
  Notification,
  Row,
  Spinner,
  Strip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import { useCreateSession, useGetCallback } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import { statusActions } from "@/app/store/status";
import statusSelectors from "@/app/store/status/selectors";

export const Labels = {
  MissingParams: "Missing code or state in the callback URL.",
  CallbackError:
    "An error occurred during authentication. Please try logging in again.",
  AlreadyAuthenticated: "You are already authenticated. Redirecting...",
};

export const LoginCallback = (): React.ReactElement => {
  const location = useLocation();
  const authenticated = useSelector(statusSelectors.authenticated);
  const dispatch = useDispatch();
  const createSession = useCreateSession();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const state = params.get("state");
  const hasParams = Boolean(code && state);

  const callback = useGetCallback(
    {
      query: {
        code: code ?? "",
        state: state ?? "",
      },
    },
    hasParams
  );

  const hasHandledSuccess = useRef(false);
  const shouldShowMissingParamsError =
    !authenticated && !hasParams && !callback.isError;

  useEffect(() => {
    if (authenticated) {
      navigate("/machines", { replace: true });
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (!callback.isSuccess || hasHandledSuccess.current) return;

    hasHandledSuccess.current = true;

    (async () => {
      await createSession.mutateAsync({});
      dispatch(statusActions.loginSuccess());
      navigate(callback.data.redirect_target, { replace: true });
    })();
  }, [callback.isSuccess, createSession, dispatch, navigate, callback.data]);

  return (
    <PageContent>
      <Strip>
        <Row>
          <Col emptyLarge={4} size={6}>
            {shouldShowMissingParamsError && (
              <Notification role="alert" severity="information">
                {Labels.MissingParams}
              </Notification>
            )}
            {code && state && callback.isPending && (
              <Spinner aria-label={"Loading..."} text="Loading..." />
            )}
            {callback.isError && (
              <Notification role="alert" severity="negative">
                {Labels.CallbackError}
              </Notification>
            )}
            {authenticated && (
              <Notification role="alert" severity="positive">
                {Labels.AlreadyAuthenticated}
              </Notification>
            )}
          </Col>
        </Row>
      </Strip>
    </PageContent>
  );
};

export default LoginCallback;
