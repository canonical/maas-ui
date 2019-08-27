import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import settingsReducers from "./app/settings/reducers";
import baseReducers from "./app/base/reducers";

export default history =>
  combineReducers({
    config: settingsReducers.config,
    general: settingsReducers.general,
    messages: baseReducers.messages,
    packagerepository: settingsReducers.packagerepository,
    user: reduceReducers(settingsReducers.user, baseReducers.auth),
    router: connectRouter(history),
    status: baseReducers.status
  });
