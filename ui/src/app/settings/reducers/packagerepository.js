import produce from "immer";

const packagerepository = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_REPOSITORIES_START":
        draft.loading = true;
        break;
      case "FETCH_REPOSITORIES_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
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

export default packagerepository;
