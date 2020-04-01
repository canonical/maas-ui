import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import {
  auth,
  controller,
  device,
  dhcpsnippet,
  domain,
  general,
  licensekeys,
  machine,
  messages,
  notification,
  packagerepository,
  resourcepool,
  scripts,
  service,
  status,
  subnet,
  tag,
  user,
  zone,
} from "./app/base/reducers";
import { config } from "./app/settings/reducers";
import { token, sshkey, sslkey } from "./app/preferences/reducers";

const createAppReducer = (history) =>
  combineReducers({
    config,
    controller,
    device,
    dhcpsnippet,
    domain,
    general,
    licensekeys,
    machine,
    messages,
    notification,
    packagerepository,
    resourcepool,
    router: connectRouter(history),
    scripts,
    service,
    sshkey,
    sslkey,
    status,
    subnet,
    tag,
    token,
    user: reduceReducers(user, auth),
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
  }
  return createAppReducer(history)(state, action);
};

export default createRootReducer;
