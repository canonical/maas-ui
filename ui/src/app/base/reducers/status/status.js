import produce from "immer";

const status = produce(
  (draft, action) => {
    switch (action.type) {
      case "CHECK_AUTHENTICATED_START":
        draft.authenticating = true;
        break;
      case "CHECK_AUTHENTICATED_SUCCESS":
        draft.authenticating = false;
        draft.authenticated = action.payload.authenticated;
        draft.externalAuthURL = action.payload.external_auth_url;
        break;
      case "LOGIN_START":
        draft.authenticating = true;
        break;
      case "EXTERNAL_LOGIN_SUCCESS":
      case "LOGIN_SUCCESS":
        draft.authenticated = true;
        draft.authenticating = false;
        draft.error = null;
        break;
      case "LOGOUT_SUCCESS":
        draft.authenticated = false;
        break;
      case "CHECK_AUTHENTICATED_ERROR":
        // Don't set the errors object here, this action is to check if a user
        // is authenticated, an error means they are not.
        draft.authenticating = false;
        draft.authenticated = false;
        break;
      case "WEBSOCKET_DISCONNECTED":
        draft.connected = false;
        break;
      case "WEBSOCKET_CONNECT":
        draft.connected = false;
        draft.connecting = true;
        break;
      case "WEBSOCKET_CONNECTED":
        draft.connected = true;
        draft.connecting = false;
        draft.error = null;
        break;
      case "EXTERNAL_LOGIN_ERROR":
      case "LOGIN_ERROR":
        draft.error = action.error;
        draft.authenticating = false;
        break;
      case "WEBSOCKET_ERROR":
        draft.error = action.error;
        break;
      case "EXTERNAL_LOGIN_URL":
        draft.externalLoginURL = action.payload.url;
        break;
      default:
        return draft;
    }
  },
  {
    // Default to authenticating so that the login screen doesn't flash.
    authenticating: true,
    authenticated: false,
    externalAuthURL: null,
    externalLoginURL: null,
    connected: false,
    error: null
  }
);

export default status;
