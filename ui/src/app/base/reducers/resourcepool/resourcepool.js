import produce from "immer";

const resourcepool = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_RESOURCEPOOL_START":
        draft.loading = true;
        break;
      case "FETCH_RESOURCEPOOL_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "FETCH_RESOURCEPOOL_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    errors: {},
    items: [],
    loaded: false,
    loading: false
  }
);

export default resourcepool;
