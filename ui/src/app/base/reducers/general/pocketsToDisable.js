import produce from "immer";

const general = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_GENERAL_POCKETS_TO_DISABLE_START":
        draft.loading = true;
        break;
      case "FETCH_GENERAL_POCKETS_TO_DISABLE_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "FETCH_GENERAL_POCKETS_TO_DISABLE_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.data = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    data: [],
    errors: {},
    loaded: false,
    loading: false
  }
);

export default general;
