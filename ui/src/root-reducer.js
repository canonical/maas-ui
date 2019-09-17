import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import {
  auth,
  controller,
  device,
  dhcpsnippet,
  general,
  machine,
  messages,
  packagerepository,
  scripts,
  status,
  subnet,
  user
} from "./app/base/reducers";
import { config } from "./app/settings/reducers";

export default history =>
  combineReducers({
    config,
    controller,
    device,
    dhcpsnippet,
    general,
    machine,
    messages,
    packagerepository,
    router: connectRouter(history),
    scripts,
    status,
    subnet,
    user: reduceReducers(user, auth)
  });
