import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import {
  auth,
  fabric,
  general,
  licensekeys,
  machine,
  messages,
  scriptresults,
  scripts,
  status,
} from "./app/base/reducers";
import { config } from "./app/settings/reducers";
import { genericInitialState as userInitialState } from "./app/store/utils/slice";
import controller from "app/store/controller";
import device from "app/store/device";
import dhcpsnippet from "app/store/dhcpsnippet";
import domain from "app/store/domain";
import packagerepository from "app/store/packagerepository";
import notification from "app/store/notification";
import pod from "app/store/pod";
import resourcepool from "app/store/resourcepool";
import service from "app/store/service";
import space from "app/store/space";
import sshkey from "app/store/sshkey";
import sslkey from "app/store/sslkey";
import subnet from "app/store/subnet";
import tag from "app/store/tag";
import token from "app/store/token";
import user from "app/store/user";
import vlan from "app/store/vlan";
import zone from "app/store/zone";

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
