import produce from "immer";

const zone = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_ZONE_START":
        draft.loading = true;
        break;
      case "FETCH_ZONE_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "FETCH_ZONE_SUCCESS":
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

export default zone;
