import produce from "immer";

const sslkey = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_SSLKEY_START":
        draft.loading = true;
        break;
      case "FETCH_SSLKEY_SUCCESS":
        draft.errors = null;
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_SSLKEY_ERROR":
        draft.loading = false;
        draft.loaded = false;
        draft.errors = action.error;
        break;
      default:
        return draft;
    }
  },
  {
    errors: null,
    loading: false,
    loaded: false,
    items: []
  }
);

export default sslkey;
