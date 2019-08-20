import produce from "immer";

const packagerepository = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_REPOSITORIES_START":
        draft.loading = true;
        return;
      case "FETCH_REPOSITORIES_SUCCESS":
        draft.items = action.payload;
        draft.loading = false;
        return;
      default:
        return;
    }
  },
  {
    loading: false,
    items: []
  }
);

export default packagerepository;
