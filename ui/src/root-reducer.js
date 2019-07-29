import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import settingsReducers from "./app/settings/reducers";
import baseReducers from "./app/base/reducers";

export default history =>
  combineReducers({
    auth: baseReducers.auth,
    repositories: settingsReducers.repositories,
    users: settingsReducers.users,
    router: connectRouter(history),
    status: baseReducers.status
  });
