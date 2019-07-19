import produce from "immer";

const auth = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_AUTH_USER_START":
        draft.loading = true;
        return;
      case "FETCH_AUTH_USER_SUCCESS":
        draft.loading = false;
        draft.user = action.payload;
        return;
      default:
        return draft;
    }
  },
  {
    loading: false,
    user: null
  }
);

const status = produce(
  (draft, action) => {
    switch (action.type) {
      case "WEBSOCKET_CONNECT":
        draft.connected = false;
        return;
      case "WEBSOCKET_CONNECTED":
        draft.connected = true;
        return;
      case "WEBSOCKET_ERROR":
        draft.error = action.error;
        return;
      default:
        return draft;
    }
  },
  {
    connected: false,
    error: null
  }
);

export default { auth, status };
