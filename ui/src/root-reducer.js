import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import settingsReducers from "./app/settings/reducers";
import baseReducers from "./app/base/reducers";

export default history =>
  combineReducers({
    config: settingsReducers.config,
    dhcpsnippet: settingsReducers.dhcpsnippet,
    general: settingsReducers.general,
    packagerepository: settingsReducers.packagerepository,
    router: connectRouter(history),
    status: baseReducers.status,
    subnet: settingsReducers.subnet,
    user: reduceReducers(settingsReducers.user, baseReducers.auth)
  });
