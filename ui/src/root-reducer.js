import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { genericInitialState as userInitialState } from "./app/store/utils/slice";
import auth from "app/store/auth";
import config from "app/store/config";
import controller from "app/store/controller";
import device from "app/store/device";
import dhcpsnippet from "app/store/dhcpsnippet";
import domain from "app/store/domain";
import event from "app/store/event";
import fabric from "app/store/fabric";
import general from "app/store/general";
import licensekeys from "app/store/licensekeys";
import machine from "app/store/machine";
import message from "app/store/message";
import nodedevice from "app/store/nodedevice";
import nodescriptresult from "app/store/nodescriptresult";
import notification from "app/store/notification";
import packagerepository from "app/store/packagerepository";
import pod from "app/store/pod";
import resourcepool from "app/store/resourcepool";
import scriptresult from "app/store/scriptresult";
import script from "app/store/script";
import service from "app/store/service";
import status from "app/store/status";
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
    event,
    fabric,
    general,
    licensekeys,
    machine,
    message,
    nodedevice,
    nodescriptresult,
    notification,
    packagerepository,
    pod,
    resourcepool,
    router: connectRouter(history),
    scriptresult,
    script,
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
  if (action.type === "status/logoutSuccess") {
    return createAppReducer(history)(
      // Status reducer defaults to authenticating = true to stop login screen
      // flashing. It's overwritten here otherwise app is stuck loading.
      { status: { authenticating: false } },
      action
    );
  } else if (
    [
      "status/websocketError",
      "status/websocketDisconnected",
      "status/checkAuthenticatedError",
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
