import produce from "immer";

const configuration = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_CONFIGURATION_START":
        draft.loading = true;
        return;
      case "FETCH_CONFIGURATION_SUCCESS":
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

export default configuration;
