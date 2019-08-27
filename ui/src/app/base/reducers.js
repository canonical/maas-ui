import produce from "immer";

const auth = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_AUTH_USER_START":
        draft.auth.loading = true;
        break;
      case "FETCH_AUTH_USER_SUCCESS":
        draft.auth.loading = false;
        draft.auth.user = action.payload;
        break;
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
        break;
      case "WEBSOCKET_CONNECTED":
        draft.connected = true;
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

const messages = produce(
  (draft, action) => {
    switch (action.type) {
      case "ADD_MESSAGE":
        draft.items.push(action.payload);
        break;
      case "REMOVE_MESSAGE":
        const index = draft.items.findIndex(item => item.id === action.payload);
        draft.items.splice(index, 1);
        break;
      default:
        return draft;
    }
  },
  {
    items: []
  }
);

export default { auth, messages, status };
