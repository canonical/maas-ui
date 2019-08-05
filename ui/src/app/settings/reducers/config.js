import produce from "immer";

const config = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_CONFIG_START":
        draft.loading = true;
        return;
      case "FETCH_CONFIG_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        return;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    items: []
  }
);

export default config;
