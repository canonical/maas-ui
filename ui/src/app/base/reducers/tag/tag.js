import produce from "immer";

const tag = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_TAG_START":
        draft.loading = true;
        break;
      case "FETCH_TAG_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "FETCH_TAG_SUCCESS":
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

export default tag;
