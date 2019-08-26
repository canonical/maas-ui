import produce from "immer";

const knownArchitectures = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_GENERAL_KNOWN_ARCHITECTURES_START":
        draft.loading = true;
        break;
      case "FETCH_GENERAL_KNOWN_ARCHITECTURES_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "FETCH_GENERAL_KNOWN_ARCHITECTURES_SUCCESS":
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

export default knownArchitectures;
