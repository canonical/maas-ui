import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import {
  auth,
  controller,
  device,
  dhcpsnippet,
  domain,
  fabric,
  general,
  licensekeys,
  machine,
  messages,
  notification,
  packagerepository,
  pod,
  resourcepool,
  scriptresults,
  scripts,
  service,
  space,
  status,
  subnet,
  tag,
  user,
  vlan,
  zone,
} from "./app/base/reducers";
import { config } from "./app/settings/reducers";
import { initialState as userInitialState } from "./app/base/reducers/user/user";
import { token, sshkey, sslkey } from "./app/preferences/reducers";

const createAppReducer = (history) =>
  combineReducers({
    config,
    controller,
    device,
    dhcpsnippet,
    domain,
    fabric,
    general,
    licensekeys,
    machine,
    messages,
    notification,
    packagerepository,
    pod,
    resourcepool,
    router: connectRouter(history),
    scriptresults,
    scripts,
    service,
    space,
    sshkey,
    sslkey,
    status,
    subnet,
    tag,
    token,
    user: reduceReducers(user, auth),
    vlan,
    zone,
  });

const createRootReducer = (history) => (state, action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    return createAppReducer(history)(
      // Status reducer defaults to authenticating = true to stop login screen
      // flashing. It's overwritten here otherwise app is stuck loading.
      { status: { authenticating: false } },
      action
    );
  } else if (
    [
      "WEBSOCKET_ERROR",
      "WEBSOCKET_DISCONNECTED",
      "CHECK_AUTHENTICATED_ERROR",
    ].includes(action.type)
  ) {
    return createAppReducer(history)(
      {
        status: state.status,
        user: {
          ...userInitialState,
          auth: state.user.auth,
        },
      },
      action
    );
  }
  return createAppReducer(history)(state, action);
};

export default createRootReducer;
