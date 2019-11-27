import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import {
  auth,
  controller,
  device,
  dhcpsnippet,
  general,
  licensekeys,
  machine,
  messages,
  packagerepository,
  resourcepool,
  scripts,
  service,
  status,
  subnet,
  tag,
  user,
  zone
} from "./app/base/reducers";
import { config } from "./app/settings/reducers";
import { token, sshkey, sslkey } from "./app/preferences/reducers";

export default history =>
  combineReducers({
    config,
    controller,
    device,
    dhcpsnippet,
    general,
    licensekeys,
    machine,
    messages,
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
    zone
  });
