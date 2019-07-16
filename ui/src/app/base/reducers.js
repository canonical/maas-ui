import produce from "immer";

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

export default { status };
