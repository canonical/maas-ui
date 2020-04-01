import { createAction } from "@reduxjs/toolkit";

const status = {
  login: createAction("LOGIN"),
  logout: createAction("LOGOUT"),
  externalLogin: createAction("EXTERNAL_LOGIN"),
  externalLoginURL: createAction("EXTERNAL_LOGIN_URL"),
  checkAuthenticated: createAction("CHECK_AUTHENTICATED"),
  websocketConnect: createAction("WEBSOCKET_CONNECT"),
  websocketConnected: createAction("WEBSOCKET_CONNECTED"),
  websocketDisconnected: createAction("WEBSOCKET_DISCONNECTED"),
  websocketError: createAction("WEBSOCKET_ERROR"),
};

// TODO: This should be generalised and moved to app/utils/redux once all actions types
// have the same shape, unfortunately we currently have have some in the form
// VERB_MODEL/VERB_MODEL_START and others simply in the form VERB/VERB_START
// e.g. LOGIN should be STATUS_LOGIN
// https://github.com/canonical-web-and-design/maas-ui/issues/785
[
  status.login,
  status.logout,
  status.externalLogin,
  status.checkAuthenticated,
].forEach((method) => {
  ["start", "error", "success"].forEach((event) => {
    method[event] = createAction(
      `${method.type.toUpperCase()}_${event.toUpperCase()}`
    );
  });
});

export default status;
