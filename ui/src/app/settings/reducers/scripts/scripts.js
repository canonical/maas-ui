import produce from "immer";

const scripts = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_SCRIPTS_START":
        draft.loading = true;
        break;
      case "FETCH_SCRIPTS_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_SCRIPTS_ERROR":
        draft.loading = false;
        draft.loaded = false;
        draft.error = action.error;
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    items: [],
    error: {}
  }
);

export default scripts;
