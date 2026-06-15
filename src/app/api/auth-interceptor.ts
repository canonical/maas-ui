import { COOKIE_NAMES } from "../utils/cookies";

import { client } from "@/app/apiclient/client.gen";
import { statusActions } from "@/app/store/status";
import { getCookie } from "@/app/utils";
import { store } from "@/redux-store";

const MACAROON_DISCHARGE_REQUIRED = "macaroon discharge required";

/**
 * Configures the API client to automatically include Authorization header
 * with Bearer token on all requests.
 */
export const configureAuthInterceptor = () => {
  client.interceptors.request.use((request) => {
    const token = getCookie(COOKIE_NAMES.LOCAL_JWT_TOKEN_NAME);

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    return request;
  });
};

/**
 * Checks if the response for an API call is a discharge required 401 and, if
 * the user is authenticated, dispatches an externalSessionExpired.
 * TODO [candid/rbac] Delete this when we remove support for candid/rbac
 */
export const checkExternalSessionExpired = () => {
  client.interceptors.response.use(async (response) => {
    const authenticated = store.getState().status.authenticated;
    const responseBody = await response
      .clone()
      .json()
      .catch(() => null);
    const dischargeRequired =
      responseBody?.Code === MACAROON_DISCHARGE_REQUIRED;

    if (response.status === 401 && dischargeRequired && authenticated) {
      store.dispatch(statusActions.externalSessionExpired());
    }

    return response;
  });
};
