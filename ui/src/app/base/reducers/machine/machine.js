import produce from "immer";

const machine = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_MACHINE_START":
        draft.loading = true;
        break;
      case "FETCH_MACHINE_SUCCESS":
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

export default machine;
