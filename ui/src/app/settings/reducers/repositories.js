import produce from "immer";

const repositories = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_REPOSITORIES_START":
        draft.loading = true;
        return;
      case "FETCH_REPOSITORIES_SUCCESS":
        draft.items = action.payload;
        draft.loading = false;
        return;
      case "FETCH_REPOSITORIES_LOADED":
        draft.loading = false;
        draft.loaded = true;
        break;
      default:
        return;
    }
  },
  {
    loading: false,
    items: []
  }
);

export default repositories;
