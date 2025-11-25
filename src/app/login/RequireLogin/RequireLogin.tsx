import { useEffect } from "react";

import { useSelector } from "react-redux";
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";

import { useGetCurrentUser } from "@/app/api/query/auth";
import urls from "@/app/base/urls";
import status from "@/app/store/status/selectors";

const RequireLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const authenticating = useSelector(status.authenticating);
  const authenticated = useSelector(status.authenticated);
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const user = useGetCurrentUser();

  const isLoading =
    user.isPending || authenticating || (!connected && connecting);
  const hasAuthError = !authenticated && !connectionError;

  useEffect(() => {
    if (!isLoading && hasAuthError) {
      navigate({
        pathname: urls.login,
        search: `?${createSearchParams({ redirectTo: location.pathname })}`,
      });
    }
  }, [hasAuthError, isLoading, location, navigate]);

  return <Outlet />;
};

export default RequireLogin;
