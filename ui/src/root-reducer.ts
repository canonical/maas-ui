import { connectRouter } from "connected-react-router";
import type { History } from "history";
import reduceReducers from "reduce-reducers";
import type { Action, Reducer } from "redux";
import { combineReducers } from "redux";

import auth from "app/store/auth";
import bootresource from "app/store/bootresource";
import config from "app/store/config";
import controller from "app/store/controller";
import device from "app/store/device";
import dhcpsnippet from "app/store/dhcpsnippet";
import discovery from "app/store/discovery";
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
import type { RootState } from "app/store/root/types";
import script from "app/store/script";
import scriptresult from "app/store/scriptresult";
import service from "app/store/service";
import space from "app/store/space";
import sshkey from "app/store/sshkey";
import sslkey from "app/store/sslkey";
import status from "app/store/status";
import type { StatusState } from "app/store/status/types";
import subnet from "app/store/subnet";
import tag from "app/store/tag";
import token from "app/store/token";
import user from "app/store/user";
import { initialState as userInitialState } from "app/store/user/slice";
import type { UserState } from "app/store/user/types";
import vlan from "app/store/vlan";
import zone from "app/store/zone";

const createAppReducer = (history: History) =>
  combineReducers<RootState>({
    bootresource,
    config,
    controller,
    device,
    dhcpsnippet,
    discovery,
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
    // This needs to be cast to the correct type until the following issue is
    // resolved:
    // https://github.com/redux-utilities/reduce-reducers/issues/33
    user: reduceReducers(user, auth) as Reducer<UserState>,
    vlan,
    zone,
  });

const createRootReducer =
  (history: History): Reducer<RootState> =>
  (state: RootState | undefined, action: Action): RootState => {
    let setupState: Partial<RootState> | null = null;
    if (action.type === "status/logoutSuccess") {
      // Status reducer defaults to authenticating = true to stop login screen
      // flashing. It's overwritten here otherwise app is stuck loading.
      setupState = {
        status: {
          authenticating: false,
        } as StatusState,
      };
    } else if (
      [
        "status/websocketError",
        "status/websocketDisconnected",
        "status/checkAuthenticatedError",
      ].includes(action.type)
    ) {
      setupState = {
        status: state?.status,
        user: {
          ...userInitialState,
          ...(state?.user.auth ? { auth: state?.user.auth } : {}),
        },
      };
    }
    return createAppReducer(history)(
      (setupState as RootState) || state,
      action
    );
  };

export default createRootReducer;
