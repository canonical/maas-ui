import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import settingsReducers from "./app/settings/reducers";
import { auth, messages, status } from "./app/base/reducers";

export default history =>
  combineReducers({
    config: settingsReducers.config,
    dhcpsnippet: settingsReducers.dhcpsnippet,
    general: settingsReducers.general,
    messages,
    packagerepository: settingsReducers.packagerepository,
    router: connectRouter(history),
    scripts: settingsReducers.scripts,
    status,
    subnet: settingsReducers.subnet,
    user: reduceReducers(settingsReducers.user, auth)
  });
