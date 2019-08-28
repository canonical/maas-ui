import produce from "immer";

const controller = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_CONTROLLER_START":
        draft.loading = true;
        break;
      case "FETCH_CONTROLLER_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    items: [],
    loaded: false,
    loading: false
  }
);

export default controller;
