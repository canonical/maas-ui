import produce from "immer";

const status = produce(
  (draft, action) => {
    switch (action.type) {
      case "WEBSOCKET_DISCONNECTED":
      case "WEBSOCKET_CONNECT":
        draft.connected = false;
        break;
      case "WEBSOCKET_CONNECTED":
        draft.connected = true;
        draft.error = null;
        break;
      case "WEBSOCKET_ERROR":
        draft.error = action.error;
        break;
      default:
        return draft;
    }
  },
  {
    connected: false,
    error: null
  }
);

export default status;
